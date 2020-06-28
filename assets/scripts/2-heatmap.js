"use strict";

/**
 * File allowing the create the heatmap section
 */

 /**
 * Creates the formatted data structure for the heatmap.
 * @param data          Formatted data for a grade.
 * @return {object}     Object with grade type, total number of students, 
 *                      and formatted data matrix with 2D GPA v.s. number 
 *                      of trimesters distribution in student groups. Each 
 *                      group is further divided into the programs.
 */
function createHeatmapData(data) {

    var minGpa = d3.min(data.etudiant, element => {
        if (parseFloat(element.Moyenne) != 0){ return parseFloat(element.Moyenne);}
        else { return 4;}
    });
    var minGpaCeil = Math.ceil(minGpa*10)/10;
    
    var maxTrim = d3.max(data.etudiant, element => {
        return parseFloat(element.Nb_trim_complete);
    });

    if (maxTrim > 14) {
        var lineNumber = maxTrim;
    } else {
        var lineNumber = Math.max(14,maxTrim);
    }

    if(minGpaCeil == minGpa) {  var colNumber = (4 - minGpa)*10; 
                                minGpaCeil = minGpa + 0.1; }
    else { var colNumber = (4 - minGpaCeil)*10 + 1; }   // defines GPA increments of 0.1 for the group division 
                                
    // console.log(data.grade,minGpa,minGpaCeil,maxTrim,colNumber,lineNumber);
    var programList = getProgramList(data.etudiant);
    var programSums = new Map();
    programSums.set("all", 0);

    programList.forEach(program => {
        programSums.set(program, 0);
    });

                                // fill(null) avoid referencing same object at each line!
    var matrix = Array(lineNumber).fill(null).map(()=>Array(colNumber).fill(null).map(()=>{ 
        return {students: Object.fromEntries(programSums), 
                percentage: Object.fromEntries(programSums),
                gpaRange:null, trimesters:null};
    }));
    var lineIndex, colIndex, gpaRange, trimesters;
    var matrixColumn = d3.scaleLinear().rangeRound([0, colNumber-1]).domain([minGpaCeil, 4]); // map GPA to column index

    data.etudiant.forEach(student => {
        gpaRange = Math.ceil(Math.max(parseFloat(student.Moyenne),minGpaCeil)*10)/10;
        lineIndex = parseInt(student.Nb_trim_complete) - 1;                               // map trimester number to line index
        colIndex = Math.max(matrixColumn(gpaRange),0);
        matrix[lineIndex][colIndex].students.all = matrix[lineIndex][colIndex].students.all+1;
        matrix[lineIndex][colIndex].students[student.Programme] = matrix[lineIndex][colIndex].students[student.Programme]+1;
        matrix[lineIndex][colIndex].gpaRange = gpaRange;
        matrix[lineIndex][colIndex].trimesters = parseInt(student.Nb_trim_complete);
    });

    var sumAllStudents = d3.sum(matrix, array => d3.sum(array, d => d.students.all));
    programSums.set("all", sumAllStudents);
    programList.forEach(program => {
        programSums.set(program, d3.sum(matrix, array => d3.sum(array, d => d.students[program])));
    });

    matrix.forEach((array,i) => {
        array.forEach((group,j) => {
            gpaRange = Math.round((minGpaCeil + j * 0.1)*10)/10;
            trimesters = i + 1;
            if (group.gpaRange == null && group.trimesters == null){ // GPA and trimesters of 0 groups for the tooltip
                group.gpaRange = gpaRange;
                group.trimesters = trimesters;
            } else if (group.gpaRange != gpaRange || group.trimesters != trimesters) { // Calculation CHECK
                console.log("ERROR: something wrong with gpaRange/trimNumber calculation!");
            }
            group.percentage.all = group.students.all / sumAllStudents;        // Percentage of students per group
            programList.forEach(program => {
                group.percentage[program] = group.students[program] / programSums.get(program);
            });
        });
    });

    if(sumAllStudents == data.etudiant.length){ // Calculation CHECK
        return {grade: data.grade, programList: programList, programSumStudents: programSums, matrix: matrix};  
    } else {
        console.log("ERROR: sum of the matrix not equal to the number of students!");
        return null;
    }     
}

 /**
 * Creates the program list out of a list of student.
 * @param data          List of students for a grade.
 * @return {array}      Array with one string entry for each program.
 */
function getProgramList(studentList) {
    var programList = [];

    studentList.forEach(student => {
        if (programList.includes(student.Programme) == false) {
            programList.push(student.Programme);
        }
    });
    return programList;
}

/**
 * Creates the axis of the heatmap.
 * @param dataMatrix    Formatted data matrix.
 * @param width         Width of the graphic.
 * @param height        Height of the graphic.
 * @return {object}     Object with X, Y and color scales.
 */
function createHeatmapScales(dataMatrix, width, height){

    var padding = 0.1,
        xOffset = 0.0007,
        yOffset = 0.0012,
        xGroups = [],
        yGroups = [];

    for (var i = 0; i < dataMatrix[0].length; i++) {
        xGroups.push(i);        
    }

    for (var i = 0; i < dataMatrix.length; i++) {
        yGroups.push(i);        
    }

    // Build X scales and axis:
    var x = d3.scaleBand()
      .range([ width*xOffset, width*(1+xOffset) ])
      .domain(xGroups)
      .padding(padding);
    
    // Build Y scales and axis:
    var y = d3.scaleBand()
      .range([height*(1+yOffset), height*yOffset])
      .domain(yGroups)
      .padding(padding);
  
    // Build color scale
    var maxPercentage = d3.max(dataMatrix, array => d3.max(array, d => d.percentage.all));
    var color = d3.scaleLinear()
      //.range(["white", "#69b3a2"]) 
      //.range(["#e5f5f9", "#2ca25f"])
      //.range(["#fee8c8", "#e34a33"])
      //.range(["#fee0d2", "#de2d26"])
      .range(["#fee8c8", "#de2d26"])
      .domain([0,maxPercentage]);

    return {x: x, y: y, color: color};
  }

/**
 * Creates the axis of the heatmap.
 * @param dataMatrix    Formatted data matrix.
 * @param g             The SVG group in which the bar chart has to be drawn.
 * @param scales        Object with X, Y and color scales.
 * @param width         Width of the graphic.
 * @param height        Height of the graphic.
 */
function createHeatmapAxes(data, g, scales, width, height) {

    // Labels of row and columns
    var xTicks = [],
        yTicks = [],
        xTickValues = [];

    if (data.grade == "Bac" || data.grade == "Certificat"){
        xTickValues = [1.7,2,2.5,3,3.5,4];
    } else {
        xTickValues = [3,3.5,4];
    }

    for (var i = 0; i <= data.matrix[0].length; i++) {
        var gpa = Math.round((4 - i * 0.1)*10)/10; 
        xTicks.unshift(gpa.toString());
    }

    for (var i = 1; i <= data.matrix.length; i++) {
        yTicks.push(i.toString());
    }

    var xAxisScale = d3.scalePoint()
        .range([0, width])
        .domain(xTicks)
        .padding(scales.x.padding()/2);

    var yAxisScale = d3.scaleBand()
        .range([height, 0])
        .domain(yTicks)
        .padding(scales.y.padding());

    //x-axis and labels
    g.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xAxisScale)
            .tickValues(xTickValues)
            .tickSize(0)
            .tickPadding(9));

    //x ticks
    xTicks.pop();
    xTicks.shift();
    g.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xAxisScale)
            .tickValues(xTicks)
            .tickFormat(""));

    //x-axis title
    g.append("text")
    .attr("class","x axis")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", height + 35)
    .text("Moyenne cumulative")
    .style("font","13px sans-serif");

    //y-axis
    g.append("g")
    .attr("class","y axis")
    .call(d3.axisLeft(yAxisScale).tickSizeOuter([0]));

    //y-axis title
    g.append("text")
    .attr("class","y axis")
    .attr("text-anchor", "end")
    .attr("x", -width*0.02)
    .attr("y", -height*0.02-15)
    .text("Trimestres")
    .style("font","13px sans-serif");
    g.append("text")
    .attr("class","y axis")
    .attr("text-anchor", "end")
    .attr("x", -width*0.02)
    .attr("y", -height*0.02)
    .text("complétés")
    .style("font","13px sans-serif");

    // top and right frame
    g.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisTop(xAxisScale).tickSize([0]).tickFormat(""));

    g.append("g")
    .attr("class","y axis")
    .attr("transform", "translate(" + width + ",0)")
    .call(d3.axisRight(yAxisScale).tickSize([0]).tickFormat(""));

    // graph title
    g.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", -40)
    .text(data.grade)
    .style("font","18px Arial");

}

/**
 * Draw the squares of the heatmap.
 * @param dataMatrix    Formatted data matrix.
 * @param g             The SVG group in which the bar chart has to be drawn.
 * @param scales        Object with X, Y and color scales.
 * @param tip           Tooltip to show when a square is hovered.
 */
function createHeatmap(dataMatrix, g, scales, tip) {

    dataMatrix.forEach( (array,i) => {
        g.selectAll()
        .data(array)
        .enter()
        .append("rect")
        .attr("class", (d,j) => { 
            return "square " + i + " " + j; 
          })
        .attr("x", (d,j) => scales.x(j) )
        .attr("y", d => scales.y(i) )
        .attr("width", scales.x.bandwidth() )
        .attr("height", scales.y.bandwidth() )
        .style("fill", d => {
            if (d.students.all == 0){ return "white";} 
            else { return scales.color(d.percentage.all); }
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide); 
    });
}

/**
 * Returns the appropriate text for the tooltip of the heatmap.
 *
 * @param d               Data associated to the currently hovered square.
 * @param data            Data currently used.
 * @param formatPercent   Function allowing to correctly format a percentage.
 * @return {string}       Tooltip's text to be shown.
 */
function getHeatmapTipText(d, formatNumber, formatPercent) {
  
    var text =  "Nombre d'étudiants: <strong>" + formatNumber(d.students.all) + "</strong><br>" +
                "Pourcentage d'étudiants: <strong>" + formatPercent(d.percentage.all) + "</strong><br>" +
                "Trimestres complétés: <strong>" + formatNumber(d.trimesters) + "</strong><br>" +
                "Moyenne cumulative: <strong>" + formatNumber(d.gpaRange-0.09) + " - " + formatNumber(d.gpaRange) + "</strong><br>";
    return text;
  
    // var total = d3.sum(currentData.destinations, d => d.count);
    // return d.count + " (" + formatPercent(d.count/total) + ")";
}