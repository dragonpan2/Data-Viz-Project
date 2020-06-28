
(function (d3, localization) {

  "use strict";

  /***** Tabs and subtabs *****/
  var tabs = d3.selectAll(".tabs .col");
  var subtabs = d3.selectAll(".subtabs .subcol"); 

  tabs.on("click", function (d, i) {
    var self = this;
    var index = i;
    tabs.classed("active", function () {
      return self === this;
    });
    d3.selectAll(".tabs .tab")
      .classed("visible", function (d, i) {
        return index === i;
      });
    });

  subtabs.on("click", function (d, i) {
    var self = this;
    var index = i;
    subtabs.classed("active", function () {
      return self === this;
    });
    d3.selectAll(".subtabs .subtab")
      .classed("visible", function (d, i) {
        return index === i;
      });
    });

  /***** Configuration *****/
  // Heatmap C1
  var heatmapMarginC1 = {top: 60, right: 25, bottom: 40, left: 80, 
                                              middle: 200},
      heatmapWidthC1 = 552 - heatmapMarginC1.left - heatmapMarginC1.right,
      heatmapHeightC1 = 381 - heatmapMarginC1.top - heatmapMarginC1.bottom;
  // Heatmap C2
  var heatmapMarginC2 = {top: 60, right: 30, bottom: 40, left: 80, 
                                              middle: 200},
      heatmapWidthC2 = 320 - heatmapMarginC2.left - heatmapMarginC2.right,
      heatmapHeightC2 = 400 - heatmapMarginC2.top - heatmapMarginC2.bottom;

  // Heatmap C3
  var heatmapMarginC3 = {top: 60, right: 30, bottom: 40, left: 80},
      heatmapWidthC3 = 320 - heatmapMarginC3.left - heatmapMarginC3.right,
      heatmapHeightC3 = 610 - heatmapMarginC3.top - heatmapMarginC3.bottom;
  
      

  /***** Création des éléments heatmap *****/
  // Cycle 1
  var heatmapSvgC1 = d3.select("#heatmapC1-svg")
    .attr("width", heatmapWidthC1*2 + heatmapMarginC1.left*2 + heatmapMarginC1.right*2 + heatmapMarginC1.middle)
    .attr("height", heatmapHeightC1 + heatmapMarginC1.top + heatmapMarginC1.bottom);
  var heatmapGroupC1_0 = heatmapSvgC1.append("g")
    .attr("transform","translate(" + heatmapMarginC1.left + "," + heatmapMarginC1.top + ")");
  var heatmapGroupC1_1 = heatmapSvgC1.append("g")
    .attr("transform","translate(" + (heatmapMarginC1.left*2+heatmapWidthC1+heatmapMarginC1.right+heatmapMarginC1.middle) 
                                    + "," + heatmapMarginC1.top + ")");
  // Cycle 2
  var heatmapSvgC2 = d3.select("#heatmapC2-svg")
    .attr("width", heatmapWidthC2*2 + heatmapMarginC2.left*2 + heatmapMarginC2.right*2 + heatmapMarginC2.middle)
    .attr("height", heatmapHeightC2 + heatmapMarginC2.top + heatmapMarginC2.bottom);
  var heatmapGroupC2_0 = heatmapSvgC2.append("g")
    .attr("transform","translate(" + heatmapMarginC2.left + "," + heatmapMarginC2.top + ")");
  var heatmapGroupC2_1 = heatmapSvgC2.append("g")
    .attr("transform","translate(" + (heatmapMarginC2.left*2+heatmapWidthC2+heatmapMarginC2.right+heatmapMarginC2.middle) 
                                    + "," + heatmapMarginC2.top + ")");
  // Cycle 3
  var heatmapSvgC3 = d3.select("#heatmapC3-svg")
    .attr("width", heatmapWidthC3 + heatmapMarginC3.left + heatmapMarginC3.right)
    .attr("height", heatmapHeightC3 + heatmapMarginC3.top + heatmapMarginC3.bottom);
  var heatmapGroupC3_0 = heatmapSvgC3.append("g")
    .attr("transform","translate(" + heatmapMarginC3.left + "," + heatmapMarginC3.top + ")");

  /***** Chargement des données *****/
  d3.csv("data/DIPLOME.csv").then(function (data) {

  
    var diplomeDataCycles = loadDiplomeData(data);

    /***** Heatmap tooltip *****/
    var heatmapTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

    /***** Heatmap creation *****/
    // Cycle 1 - Bac
    var heatmapDataC1_0 = createHeatmapData(diplomeDataCycles[0].grades[0]);
    var heatmapScalesC1_0 = createHeatmapScales(heatmapDataC1_0.matrix, heatmapWidthC1, heatmapHeightC1);
    createHeatmapAxes(heatmapDataC1_0, heatmapGroupC1_0, heatmapScalesC1_0, heatmapWidthC1, heatmapHeightC1);
    createHeatmap(heatmapDataC1_0.matrix, heatmapGroupC1_0, heatmapScalesC1_0, heatmapTip);
    // Cycle 1 - Certificat
    var heatmapDataC1_1 = createHeatmapData(diplomeDataCycles[0].grades[1]);
    var heatmapScalesC1_1 = createHeatmapScales(heatmapDataC1_1.matrix, heatmapWidthC1, heatmapHeightC1);
    createHeatmapAxes(heatmapDataC1_1, heatmapGroupC1_1, heatmapScalesC1_1, heatmapWidthC1, heatmapHeightC1);
    createHeatmap(heatmapDataC1_1.matrix, heatmapGroupC1_1, heatmapScalesC1_1, heatmapTip);

    // Cycle 2 - Maitrise prof
    var heatmapDataC2_0 = createHeatmapData(diplomeDataCycles[1].grades[0]);
    var heatmapScalesC2_0 = createHeatmapScales(heatmapDataC2_0.matrix, heatmapWidthC2, heatmapHeightC2);
    createHeatmapAxes(heatmapDataC2_0, heatmapGroupC2_0, heatmapScalesC2_0, heatmapWidthC2, heatmapHeightC2);
    createHeatmap(heatmapDataC2_0.matrix, heatmapGroupC2_0, heatmapScalesC2_0, heatmapTip);
    // Cycle 2 - Maitrise rech
    var heatmapDataC2_1 = createHeatmapData(diplomeDataCycles[1].grades[1]);
    var heatmapScalesC2_1 = createHeatmapScales(heatmapDataC2_1.matrix, heatmapWidthC2, heatmapHeightC2);
    createHeatmapAxes(heatmapDataC2_1, heatmapGroupC2_1, heatmapScalesC2_1, heatmapWidthC2, heatmapHeightC2);
    createHeatmap(heatmapDataC2_1.matrix, heatmapGroupC2_1, heatmapScalesC2_1, heatmapTip);

    // Cycle 3 - Doctorat
    var heatmapDataC3_0 = createHeatmapData(diplomeDataCycles[2].grades[0]);
    var heatmapScalesC3_0 = createHeatmapScales(heatmapDataC3_0.matrix, heatmapWidthC3, heatmapHeightC3);
    createHeatmapAxes(heatmapDataC3_0, heatmapGroupC3_0, heatmapScalesC3_0, heatmapWidthC3, heatmapHeightC3);
    createHeatmap(heatmapDataC3_0.matrix, heatmapGroupC3_0, heatmapScalesC3_0, heatmapTip);

    heatmapTip.html( d => {
      return getHeatmapTipText.call(this, d, 
        localization.getFormattedNumber, localization.getFormattedPercent);
    });
    heatmapSvgC1.call(heatmapTip);

  });

  //***** Line Chart *****/
  d3.csv("data/DIPLOME.csv").then(function (data) {

        var data = prepareLinechartData(data);

        var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 650 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

       
        var lineChartSVG = d3.select("#line-chart-svg");
        var lineChartGroup = d3.select("#line-chart-svg")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var allGroup = getGroup(data);

        var sumstat = grouping(data);

        var lineChartX =  domainX(data, lineChartGroup, width, height);
        var lineChartY =  domainY(data, lineChartGroup, width, height);

        var color = setColor(sumstat);

        drawLine(lineChartGroup, sumstat, color, lineChartX, lineChartY,allGroup);

        d3.select("#selectButton").on("change", function (d) {
                // recover the option that has been chosen
                var selectedOption = d3.select(this).property("value")
                // run the updateChart function with this selected option
                
                var selectInputData = [];
                data.forEach(element => {

                        if (parseInt(element.ANNEE) >= parseInt(document.getElementById("startYear").value) && parseInt(element.ANNEE) <= parseInt(document.getElementById("endYear").value)) {
                                selectInputData.push(element);
                        } 
                        else {
                                //
                        }
                });
                updateLinechart(selectedOption, grouping(selectInputData), lineChartGroup,setColor(grouping(data)), lineChartX, lineChartY)
        })

        $('#startYear').on('input', function () {
                var selectedOption = d3.select('#selectButton').property("value");
                var inputData = [];
                data.forEach(element => {

                        if (parseInt(element.ANNEE) >= parseInt(document.getElementById("startYear").value) && parseInt(element.ANNEE) <= parseInt(document.getElementById("endYear").value)) {
                                inputData.push(element);
                        } 
                        else {
                                //
                        }
                });
                updateLinechart(selectedOption, grouping(inputData), lineChartGroup,setColor(grouping(data)), lineChartX, lineChartY)
        });
        $('#endYear').on('input', function () {
                var selectedOption = d3.select('#selectButton').property("value");
                var inputData = [];
                data.forEach(element => {

                        if (parseInt(element.ANNEE) >= parseInt(document.getElementById("startYear").value) && parseInt(element.ANNEE) <= parseInt(document.getElementById("endYear").value)) {
                                inputData.push(element);
                        } 
                        else {
                                //
                        }
                });
                updateLinechart(selectedOption, grouping(inputData), lineChartGroup,setColor(grouping(data)), lineChartX, lineChartY)
        });

        createLegend(color, grouping(data));

   });


  //***** Barchart*****//

  /*****global variables*****/
   var selected = 0;
   var percentButton  = false;
   var semesters = ['20103','20111','20112','20113','20121','20122','20123','20131','20132','20133'
   ,'20141','20142','20143','20151','20152','20153','20161','20162','20163','20171','20172','20173','20181','20182','20183','20191','20192','20193'
   ,'20201','20202','20203'];
   var CurrentSemesters = semesters;
  
  /***** Configuration *****/
   var barChartMargin = {
    top: 55,
    right: 50,
    bottom: 150,
    left: 230
  };
  var barChartWidth = 980 - barChartMargin.left - barChartMargin.right;
  var barChartHeight = 550 - barChartMargin.top - barChartMargin.bottom;

  /***** Scale *****/
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var x = d3.scaleBand().range([0, barChartWidth]).round(0.05);
  var y = d3.scaleLinear().range([barChartHeight, 0]);
  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y).tickFormat(localization.getFormattedNumber);

  /*****Creating the elements of the barchart*****/
  var barChartSvg = d3.select("#bar-chart-svg")
    .attr("width", barChartWidth + barChartMargin.left + barChartMargin.right)
    .attr("height", barChartHeight + barChartMargin.top + barChartMargin.bottom);

  var barChartGroup = barChartSvg.append("g")
    .attr("transform", "translate(" + barChartMargin.left+ "," + barChartMargin.top + ")");
  var guidGroup =barChartGroup.append("g");
  //var semeseterSvg = barChartSvg.append("g");
  var semeseterGroup =  d3.select("#semester-svg").append("g");


    /***** loading data *****/
    d3.csv("data/INSCRIPTION.csv").then(function (data) {

   
      var inscriptionData = loadInscriptionData(data)

      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]);

      domainXBar(x,inscriptionData);
      domainYBar(y,inscriptionData);
  
    /***** Creating bar graphs *****/
    createAxes(barChartGroup, xAxis, yAxis, barChartHeight);
    createBarChart(barChartGroup, inscriptionData, x, y,tip, barChartHeight, barChartWidth, selected, percentButton, yAxis, guidGroup,CurrentSemesters); 
    
    /***** creating legend for semester selection *****/
    semesterlegend(semeseterGroup, barChartGroup, inscriptionData, x, y, tip, barChartHeight, barChartWidth, yAxis, guidGroup);
    
    /***** creating tooltip *****/
    tip.html(function(d) {
      return getToolTipText.call(this, d, selected,percentButton, localization.getFormattedPercent);
    });
    barChartSvg.call(tip);
    
    /*****creating classification factor selection for stacked bar chart*****/
    var optionsTitle = ["All", "Cycle", "Gender", "Legal Status", "Study Regime"]
    d3.select("select")
      .on("change", function () {
        selected = d3.select(this).property("value");
       updateStackedBar(barChartGroup, inscriptionData, x, y,tip, barChartHeight, barChartWidth,selected,percentButton,yAxis, guidGroup,CurrentSemesters)
       updateDecomposedChart(inscriptionData, false, selected, semesters);
      })
      .selectAll("option")
      .data(optionsTitle)
      .enter()
      .append("option")
      .attr("value", function(d, i) {
        return i;
      })
      .text(function (d) {
        return d;
      })
      

      /***** Decomposed Bar Chart *****/
      manageDecomposedChart(inscriptionData, true, 'All', semesters);
      document.getElementById('de-div').style.display = 'none';
      /***** End of Decomposed Bar Chart Section *****/

      
      /***** percent or number option*****///for choosing wether displaying Normalized stacked bar chart or not
	    d3.selectAll("input").on("change", handleFormClick);
      function handleFormClick() {
        if (this.value === "bypercent") { // Percent is selected
          percentButton = true;
          if(selected !=0) // All 
          updateStackedBar(barChartGroup, inscriptionData, x, y,tip, barChartHeight, barChartWidth,selected,percentButton,yAxis, guidGroup,CurrentSemesters)
        } else { // Number is selected
          percentButton = false;
          updateStackedBar(barChartGroup, inscriptionData, x, y,tip, barChartHeight, barChartWidth,selected,percentButton,yAxis, guidGroup,CurrentSemesters)
        }
      }
    });

    /*****semester selection legend*****/
    function semesterlegend(svg, g, inscriptionData, x, y, tip, height, width,yAxis, guidGroup) {
      var semesterList = [];
      inscriptionData.forEach(element => {
            semesterList.push(element.date);
      });
      var reformDateList = reformDate(semesterList);
      svg.selectAll("myrects")
          .data(semesterList)
          .enter()
          .append("rect")
          .attr("class","square")
          .attr("x", 70)                                   //70 is where the first rect appears. 
          .attr("y", function(d,i){ return 30 + i* 16; }) // 16 is the distance between rects
          .attr("height", 12)
          .attr("width", 12)
          .style("stroke","black")
          .style("fill", "#32CD32")
          .on("click", function(d) {
            update(d3.select(this), d, g, inscriptionData, x, y, tip, height, width,yAxis, guidGroup);
    });
      svg.selectAll("mylabels")
          .data(reformDateList)
          .enter()
          .append("text")
          .attr("class","label")
          .attr("x", 90)                                   //90 is where the first lable appears
          .attr("y", function(d,i) { return 40 + i*16; }) // 16 is the distance between them
          .style("fill", "black")
          .text(function(d) { return d; })
          .style("font-size", "11px")
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle");
    }
    
    /**
     * Update function allows for show/hide the data that corresponding to the clicked square.
     *
     * By clicking on a square, we display/hide the corresponding semester data and the square's interior becomes white/goes back to green.
     *
     * @param element   The square that was clicked. other arguments are required for updating barchart. 
     * 
     * Only the data exist in CurrentSemesters will be displayed
     */
    function update(element,d, g, inscriptionData, x, y, tip, height, width,yAxis, guidGroup){
      if (element.style("fill") == "white"){ // select a semester
        element.style("fill","#32CD32");
        CurrentSemesters.push(d);
        g.selectAll("rect").remove();
        createBarChart(g, inscriptionData, x, y, tip, height, width, selected, percentButton,yAxis, guidGroup, CurrentSemesters)
        updateDecomposedChart(inscriptionData, false, selected, CurrentSemesters);

      } else { // deselect a semester
        element.style("fill","white");
        for( var i = 0; i < CurrentSemesters.length; i++){ if ( CurrentSemesters[i] === d) { CurrentSemesters.splice(i, 1); }}
        g.selectAll("rect").remove();
        createBarChart(g, inscriptionData, x, y, tip, height, width, selected, percentButton,yAxis, guidGroup, CurrentSemesters)
        updateDecomposedChart(inscriptionData, false, selected, CurrentSemesters);
      }
    }

})(d3, localization);

var isDe = false;

function ToggleDe() {
        isDe = !isDe;
        if (isDe) {
                document.getElementById('bar-chart-svg').style.display = 'none';
                document.getElementById('de-div').style.display = 'inline';
        }
        else {
                document.getElementById('bar-chart-svg').style.display = 'inline';
                document.getElementById('de-div').style.display = 'none';
        }
        
}

