"use strict";
/**
 * File allowing  creating and updating the bar chart 
 */
function domainXBar(x,inscriptionData){
    var semesters = [];
    inscriptionData.forEach(element => {
        semesters.push(element.date);
        });
    x.domain(reformDate(semesters));
}

function domainYBar(y,inscriptionData){
    var numbers = [];
    inscriptionData.forEach(element =>{
        numbers.push(element.students.length);  
    }); 
    var max = d3.max(numbers);
    y.domain([0, max]);
}

function createAxes(g, xAxis, yAxis, height) {

  g.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")  
    .style("text-anchor", "start")
    .attr("transform", "rotate(30)");

  g.append("g")
    .attr("class","y axis")
    .call(yAxis);

  g.append("text")
    .attr("text-anchor", "start")
    .attr("x", -50)
    .attr("y", -10)
    .style("font","12px sans-serif");
}

/**
 * Bar chart.
 *
 * @param g             The SVG group in which the bar chart has to be drawn.
 * @param mydata        Data to use.
 * @param x             Scale to use for the X axis.
 * @param y             Scale to use for the Y axis.
 * @param tip           Tooltip to show when a bar has been hovered.
 * @param height        Height of the graphic.
 * @param width         width of the graphic.
 * @param option        Item selected for classifying stacked bar charts
 * @param percentButton percent(/Number) button state
 * @param yAxis         y axis
 * @param guid          guid svg group
 * @param semesters     List of semesters selected that their data will  be displayed on the chart
 */
function createBarChart(g, mydata, x, y, tip, height, width, option, percentButton,yAxis, guid,semesters) {
  var data = loadSelectedData(mydata, option, percentButton); 

 if(option == 0){
        var columns = ["count"]   
 }  

 if(option == 1){
        var columns = ["cycle1", "cycle2", "cycle3"]       
 }

 if(option == 2){
        var columns = ["Male", "Female"] 
 }
 if(option == 3){
        var columns = ["Canadien", "Foreign" , "Resident"] 
 }
 if(option == 4){
        var columns = ["PartTime", "FullTime"] 
 }

var stack = d3.stack().keys(columns)(data)
stack.map((d,i) => {
        d.map(d => {
          d.key = columns[i]
          return d
        })
        return d
      })

var yMax = d3.max(data, d => {
        var val = 0
        for(var k of columns){
          val += d[k]
        }
        return val
      })
var x = d3.scaleLinear().domain([-0.2,data.length]).range([0,width])
if (percentButton == true){
    y.domain([0,100]).range([height,0])
    g.selectAll(".y.axis").call(yAxis);
}
else{      
    y.domain([0, yMax]).range([height,0])
    g.selectAll(".y.axis").call(yAxis);
}

g.selectAll("rect")
.data(stack).enter()
.append('g')
.selectAll('rect')
  .data(d => d).enter()
.append('rect')
  .attr('x', (d,i) => x(i))
  .attr('width',  (width/data.length))
  .attr('height',function(d){
    if (semesters.includes(d.data.date)){
      return y(d[0])-y(d[1])
    }
    else{
      return 0
    }
   })
  .attr('y', d => y(d[1]))
  .attr('fill', function(d){
          if (option == 0){return 'Orange'}
          if (option == 1){
                 if (d.key == 'cycle1') return "#ff4c00";
                 if (d.key == 'cycle2') return "#008080";
                 if (d.key == 'cycle3') return "#800080";     
          }
          if (option == 2){
                if (d.key == 'Male') return "#ff4c00";
                if (d.key == 'Female') return "#008080";                 
          }
          if (option == 3){
                if (d.key == 'Canadien') return "#ff4c00";
                if (d.key == 'Foreign') return "#008080";
                if (d.key == 'Resident') return "#800080";
          }
          if (option == 4){
                if (d.key == 'PartTime') return "#ff4c00";
                if (d.key == 'FullTime') return "#008080";        
          }
  })
  .attr('opacity', .5)
  .attr('stroke', 'white')
  .attr('stroke-width', 1)
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);
  /*****show guid legend in the bottom of the chart to show the subgroup associated to each color, on stacked barchart*****/
  showlegend(guid, columns,option);
}

function updateStackedBar(barChartGroup, inscriptionData, x, y, tip,barChartHeight, barChartWidth,selected, percentButton,yAxis, guid, semesters){
  barChartGroup.selectAll("rect").remove();
  createBarChart(barChartGroup, inscriptionData, x, y, tip,barChartHeight, barChartWidth,selected, percentButton,yAxis, guid, semesters);

}

/**
 * Returns the appropriate text for the tooltip.
 *
 * @param d               Data associated to the currently hovered bar.
 * @param selected        Item selected for classifying stacked bar charts
 * @param percent         Percent(/Number) button state to show the right value 
 * @param formatPercent   Function allowing to correctly format a percentage.
 * @return {string}       Tooltip's text to be shown.
 * 
 */
function getToolTipText(d, selected, percent, formatPercent) {
 
  if (selected == 0){return d.data.count}

  if (selected == 1){
    var total = d.data.cycle1 + d.data.cycle2 + d.data.cycle3
    if(d.key == "cycle1"){
      if (percent == 0)   return "cycle1:"+ d.data.cycle1
       else return "cycle1:"+ formatPercent(d.data.cycle1/total)
    }
    if (d.key == "cycle2"){
      if (percent == 0)   return "cycle2:" + d.data.cycle2
      else return "cycle2:"+ formatPercent(d.data.cycle2/total)
    }
    if (d.key== "cycle3"){
      if (percent == 0)   return "cycle3:" + d.data.cycle3
      else return "cycle3:"+ formatPercent(d.data.cycle3/total)
    }
            
  }
  if (selected == 2){
    var total = d.data.Male + d.data.Female
    if(d.key == "Male"){
      if (percent == 0)   return "Male:"+ d.data.Male
       else return "Male:"+ formatPercent(d.data.Male/total)
    }
    if (d.key == "Female"){
      if (percent == 0)   return "Female:" + d.data.Female
      else return "Female:"+ formatPercent(d.data.Female/total)
    }

  }
  if (selected == 3){
    var total = d.data.Canadien + d.data.Foreign + d.data.Resident
    if(d.key == "Canadien"){
      if (percent == 0)   return "Canadien:"+ d.data.Canadien
       else return "Canadien:"+ formatPercent(d.data.Canadien/total)
    }
    if (d.key == "Foreign"){
      if (percent == 0)   return "Foreign:" + d.data.Foreign
      else return "Foreign:"+ formatPercent(d.data.Foreign/total)
    }
    if (d.key== "Resident"){
      if (percent == 0)   return "Resident:" + d.data.Resident
      else return "Resident:"+ formatPercent(d.data.Resident/total)
    }
            
  }
  if (selected == 4){
    var total = d.data.PartTime + d.data.FullTime
    if(d.key == "PartTime"){
      if (percent == 0)   return "Part-time:"+ d.data.PartTime
       else return "Part-time:"+ formatPercent(d.data.PartTime/total)
    }
    if (d.key == "FullTime"){
      if (percent == 0)   return "Full-time:" + d.data.FullTime
      else return "Full-time:"+ formatPercent(d.data.FullTime/total)
    }

  }
  
}

/***** function to change the format of semester*****/// for example: 20123=>2012 Fall
function reformDate(dateArray){
  var reformed = []
  dateArray.forEach(function (item, index) {
    var semester = ""
    var semesterNumber = item[4]
    if(semesterNumber ==1){
      semester = " Winter"
    }
    if(semesterNumber ==2){
      semester = " Summer"
    }
    if(semesterNumber ==3){
      semester = " Fall"
    }
    var year = item.substring(0, 4);
    reformed.push(year+semester)
  });
  return reformed;
}

/*****show the guid legend on the bottem of the chart*****/
function showlegend(guid, columns,option) {

  guid.selectAll("square").remove();
  guid.selectAll("text").remove();

  guid.selectAll("myrects")
      .data(columns)
      .enter()
      .append("rect")
      .attr("class","square")
      .attr("x", function(d,i){ return 280 + i*130; })   // 280 is where the first rect appears. 130 is the distance between rects
      .attr("y", 420) 
      .attr("height", 17)
      .attr("width", 17)
      .style("stroke","white")
      .style("fill", function(d){ 
        if (option == 0){return 'Orange'}
        if (option == 1){
               if (d == 'cycle1') return "#ff4c00";
               if (d == 'cycle2') return "#008080";
               if (d == 'cycle3') return "#800080";     
        }
        if (option == 2){
              if (d== 'Male') return "#ff4c00";
              if (d == 'Female') return "#008080";                 
        }
        if (option == 3){
              if (d == 'Canadien') return "#ff4c00";
              if (d == 'Foreign') return "#008080";
              if (d == 'Resident') return "#800080";
        }
        if (option == 4){
              if (d == 'PartTime') return "#ff4c00";
              if (d == 'FullTime') return "#008080";        
        }
      }).attr('opacity', .5);
    

    guid.selectAll("mylabels")
      .data(columns)
      .enter()
      .append('text')
      .attr('class','label')
      .attr("x", function(d,i){ return 305 + i*130; }) // 305 is where the first rect appears. 130 is the distance between rects
      .attr("y", 430 ) 
      .style("fill", "black")
      .text(function(d) { return d; })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
}

