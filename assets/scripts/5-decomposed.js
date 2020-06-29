"use strict";

function manageDecomposedChart(data, percent, classifyBy, includedSemester) {
        //feed the right data into the createBarChartDe function

        if (classifyBy == 'All') {
                var formatedData = filterDataDe(data, percent, classifyBy, 'none', includedSemester);
                createBarChartDe(formatedData, 0, 1, classifyBy, percent);
        }
        else if (classifyBy == 'Cycle') {
                var formatedData = filterDataDe(data, percent, classifyBy, '3', includedSemester);
                createBarChartDe(formatedData, 800, 1, '3',percent);

                var formatedData = filterDataDe(data, percent, classifyBy, '2', includedSemester);
                createBarChartDe(formatedData, 400, 2, '2',percent);

                var formatedData = filterDataDe(data, percent, classifyBy, '1', includedSemester);
                createBarChartDe(formatedData, 0, 3, '1',percent);


        }
        else if (classifyBy == 'Gender') {
                var formatedData = filterDataDe(data, percent, classifyBy, 'F', includedSemester);
                createBarChartDe(formatedData, 400, 1, 'F',percent);

                var formatedData = filterDataDe(data, percent, classifyBy, 'M', includedSemester);
                createBarChartDe(formatedData, 0, 2, 'M',percent);

        }
        else if (classifyBy == 'Legal Status') {

                var formatedData = filterDataDe(data, percent, classifyBy, 'Resident', includedSemester);
                createBarChartDe(formatedData, 400, 1, 'Resident',percent);

                var formatedData = filterDataDe(data, percent, classifyBy, 'Etranger', includedSemester);
                createBarChartDe(formatedData, 800, 2, 'Etranger',percent);

                var formatedData = filterDataDe(data, percent, classifyBy, 'Canadien', includedSemester);
                createBarChartDe(formatedData, 0, 3, 'Canadien',percent);

        }
        else if (classifyBy == 'Study Regime') {
                
                var formatedData = filterDataDe(data, percent, classifyBy, 'PL', includedSemester);
                createBarChartDe(formatedData, 400, 1, 'PL',percent);

                var formatedData = filterDataDe(data, percent, classifyBy, 'PA', includedSemester);
                createBarChartDe(formatedData, 0, 2, 'PA',percent);


        }

}


function filterDataDe(data, percent, classifyBy, classifyValue, includedSemester) {
        //filtered out the data and keep the necessary date in the good format
        data = orderResult(data);
        var formatedData = [];

        if(percent == false){

        // filter date
        data.forEach(element => {
                if (includedSemester.includes(element.date)) {

                        var value = 0;
                        //ClassifyBy
                        if (classifyBy == 'All') {
                                value = element.students.length;
                        }
                        else if (classifyBy == 'Cycle') {
                                element.students.forEach(subElement => {
                                        if (subElement.Cycle == classifyValue) {
                                                value++;
                                        }
                                });
                        }
                        else if (classifyBy == 'Gender') {
                                element.students.forEach(subElement => {
                                        if (subElement.Sexe == classifyValue) {
                                                value++;
                                        }
                                });

                        }
                        else if (classifyBy == 'Legal Status') {
                                element.students.forEach(subElement => {
                                        if (subElement.Statut_legal == classifyValue) {
                                                value++;
                                        }
                                });

                        }
                        else if (classifyBy == 'Study Regime') {
                                element.students.forEach(subElement => {
                                        if (subElement.Regime_Etude == classifyValue) {
                                                value++;
                                        }
                                });

                        }

                        var newElement = { date: element.date, students: value };
                        formatedData.push(newElement);
                }
        })
        }
        else{
                 // filter date
        data.forEach(element => {
                if (includedSemester.includes(element.date)) {

                        var value = 0;
                        var total = 0;
                        var temp = 0;

                        //ClassifyBy
                        if (classifyBy == 'All') {
                                value = 100;
                        }
                        else if (classifyBy == 'Cycle') {
                                element.students.forEach(subElement => {
                                        if (subElement.Cycle == classifyValue) {
                                                temp++;
                                        }
                                        else {
                                                total++;
                                        }
                                });
                        }
                        else if (classifyBy == 'Gender') {
                                element.students.forEach(subElement => {
                                        if (subElement.Sexe == classifyValue) {
                                                temp++;
                                        }
                                        else {
                                                total++;
                                        }
                                });

                        }
                        else if (classifyBy == 'Legal Status') {
                                element.students.forEach(subElement => {
                                        if (subElement.Statut_legal == classifyValue) {
                                                temp++;
                                        }
                                        else {
                                                total++;
                                        }
                                });

                        }
                        else if (classifyBy == 'Study Regime') {
                                element.students.forEach(subElement => {
                                        if (subElement.Regime_Etude == classifyValue) {
                                                temp++;
                                        }
                                        else {
                                                total++;
                                        }
                                });

                        }
                        value = (temp)*100/(temp+total)
                        var newElement = { date: element.date, students: value};
                        formatedData.push(newElement);
                }
        })
        }

        return formatedData;
}


function createBarChartDe(data, offset, slot, classifyBy, percent) {
        //create and finalized the decomposed chart
        var margin = { top: 30, right: 30, bottom: 70, left: 60 },
                width = 900 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

        var totalOffset = margin.left + offset;


        var slotType = 1;
        if (slot == 1) {
                slotType = '#decomposed-svg';
        }
        else if (slot == 2) {
                slotType = '#decomposed-svg2';
        }
        else if (slot == 3) {
                slotType = '#decomposed-svg3';
        }

        // append the svg object to the body of the page
        var svg = d3.select(slotType)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

        if (classifyBy == 'All') {
                classifyBy = '';
        }
        else if (classifyBy == '1' || classifyBy == '2' || classifyBy == '3') {
                classifyBy = 'Cycle ' +classifyBy 
        }
        else if (classifyBy == 'M') {
                classifyBy = 'Male';
        }
        else if (classifyBy == 'F') {
                classifyBy = 'Female';
        }
        else if (classifyBy == 'Etranger'){
                classifyBy = 'Foreign';  
        }
        else if (classifyBy == 'Canadien'){
                classifyBy = 'Canadian';  
        }
        else if (classifyBy == 'PA'){
                classifyBy = 'Part-time';  
        }
        else if (classifyBy == 'PL'){
                classifyBy = 'Full-time';  
        }

        
        svg.append('text').text(classifyBy).attr("transform",
                "translate(" + (width / 2) + "," + 0 + ")");;

        // X axis
        var x = d3.scaleBand()
                .range([0, width])
                .domain(data.map(function (d) { return d.date; }))
                .padding(0.2);
        svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

        // Add Y axis
        if(percent){
        var y = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
        }
        else{
        var y = d3.scaleLinear()
                .domain([0, 9000])
                .range([height, 0]);
        }
        svg.append("g")
                .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", function (d) { return x(d.date); })
                .attr("y", function (d) { return y(d.students); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(d.students); })
                .attr("fill", function(){
                        if (classifyBy =='Cycle 1'  ||   classifyBy =='Canadian'   || classifyBy =='Male' ||   classifyBy =='Part-time' )   return "#ff4c00";
                        if (classifyBy =='Cycle 2'  ||   classifyBy == 'Female'    ||  classifyBy == 'Foreign' || classifyBy == 'Full-time') return "#008080";
                        if (classifyBy =='Cycle 3'  ||   classifyBy == 'Resident')   return "#800080";
                        else return "Orange";     
                })
                .attr("opacity", .5)


}

function updateDecomposedChart(data, percent, classifyBy, includedSemester) {
        //update decomposed chart with the new data
        d3.select("#decomposed-svg").selectAll('svg').remove();
        d3.select("#decomposed-svg2").selectAll('svg').remove();
        d3.select("#decomposed-svg3").selectAll('svg').remove();
        var optionsTitle = ["All", "Cycle", "Gender", "Legal Status", "Study Regime"]
        manageDecomposedChart(data, percent, optionsTitle[classifyBy], includedSemester);
}