"use strict";

function getGroup(data) {
        //group by selection
        var allGroup = d3.map(data, function (d) { return (d.Programme) }).keys();

        d3.select("#selectButton")
                .selectAll('myOptions')
                .data(allGroup)
                .enter()
                .append('option')
                .text(function (d) { return d; }) // text showed in the menu
                .attr("value", function (d) { return d; }) // corresponding value returned by the button


        return allGroup;
}

function grouping(data) {
        //group by multi
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                .key(function (d) { return d.Grade; })
                .entries(data);
        return sumstat;

}

function domainX(diplomeData, svg, width, height) {
        // X = Years

        var x = d3.scaleLinear()
                .domain(d3.extent(diplomeData, function (d) { return d.ANNEE; }))
                .range([0, width]);

        svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickFormat(localization.getFormattedNumber));

        svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - 60)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Number of Graduated Students");


        return x;
}

function domainY(diplomeData, svg, width, height) {
        // Y = Graduate on a given year

        var y = d3.scaleLinear()
                .domain([0, d3.max(diplomeData, function (d) { return +d.count; })])
                .range([height, 0]);

        svg.append("g")
                .call(d3.axisLeft(y));

        svg.append("text")
                .attr("transform",
                        "translate(" + (width / 2) + " ," +
                        (height + 10 + 20) + ")")
                .style("text-anchor", "middle")
                .text("Year");


        return y;
}



function setColor(sumstat) {
        //Set the color of the chart
        var res = sumstat.map(function (d) { return d.key }) // list of group names
        var color = d3.scaleOrdinal()
                .domain(res)
                .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'])

        return color;
}

function drawLine(svg, sumstat, color, x, y, allGroup) {
        //draw the line and finish the chart

        var originalSumStat = [];
        originalSumStat = Object.assign(sumstat);

        var copySumStat = [];
        copySumStat = Object.assign(sumstat);


        copySumStat.forEach(element => {
                element.values = element.values.filter(function (d) { return d.Programme == allGroup[0] });
        });

        svg.selectAll(".line")
                .data(copySumStat)
                .enter()
                .append("path")
                .attr("fill", "none")
                //.attr("stroke", function (d) { return color(d.key) })
                .attr("stroke-width", 1.5)
                .attr("d", function (d) {
                        return d3.line()
                                .x(function (d) { return x(d.ANNEE); })
                                .y(function (d) { return y(+d.count); })
                                (d.values)
                })

        updateLinechart(allGroup[0], sumstat, svg, color, x, y)


}

var allLineDisplay = [];

var needUpdate = false;

allLineDisplay.push(true);
allLineDisplay.push(true);
allLineDisplay.push(true);
allLineDisplay.push(true);
allLineDisplay.push(true);

var dontDoFirst = true;


function updateLinechart(selectedGroup, sumstat, svg, color, x, y) {
        //update the line chart with new data
        needUpdate = true;

        if (!dontDoFirst) {
                var allDot = [];

                allDot = document.getElementsByClassName('dot0');

                allDot[0].style.strokeWidth = 2;
                allDot[1].style.strokeWidth = 2;
                allDot[2].style.strokeWidth = 2;
                allDot[3].style.strokeWidth = 2;
                allDot[4].style.strokeWidth = 2;

        }

        dontDoFirst = false;

        sumstat.forEach(element => {
                element.values = element.values.filter(function (d) { return d.Programme == selectedGroup });
        });


        d3.selectAll(".addedPath").remove();

        svg.selectAll(".line")
                .data(sumstat)
                .enter()
                .append("path")
                .attr("class", "addedPath")
                .attr("id", function (d) { return d.key })
                .attr("fill", "none")
                .attr("stroke", function (d) { return color(d.key) })
                .attr("stroke-width", 1.5)
                .attr("d", function (d) {
                        return d3.line()
                                .x(function (d) { return x(d.ANNEE); })
                                .y(function (d) { return y(+d.count); })
                                (d.values)
                })
}

function createLegend(color, sumstat) {
        //create the interactive legend
        var SVG = d3.select("#line-chart-svg");

        var keys = ["Certificate", "Bachelor", "Doctorate","Profession Master", "Research Master"]

        var dotCounter = 0;

        // Add one dot in the legend for each name.
        var size = 20
        SVG.selectAll("mydots")
                .data(keys)
                .enter()
                .append("rect")
                .attr("x", 100)
                .attr("y", function (d, i) { return 100 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .attr('class', 'dot' + (dotCounter++))
                .attr("transform", "translate(550,150)")
                .style("stroke", "black")
                .style("stroke-width", "2")
                .style("fill", function (d) { return color(d) })
                .on("click", function (d) {

                        if (needUpdate) {
                                allLineDisplay[0] = true;
                                allLineDisplay[1] = true;
                                allLineDisplay[2] = true;
                                allLineDisplay[3] = true;
                                allLineDisplay[4] = true;
                                needUpdate = false;

                        }

                        var currentGrade;
                        var currentId = 0;

                        switch (this.style.fill) {
                                case 'rgb(228, 26, 28)':
                                        currentId = 0;
                                        currentGrade = 'Certificat';
                                        break;
                                case 'rgb(55, 126, 184)':
                                        currentId = 1;
                                        currentGrade = 'Bac';
                                        break;
                                case 'rgb(77, 175, 74)':
                                        currentId = 2;
                                        currentGrade = 'Doctorat';
                                        break;
                                case 'rgb(152, 78, 163)':
                                        currentId = 3;
                                        currentGrade = 'Maitrise professionn';
                                        break;
                                case 'rgb(255, 127, 0)':
                                        currentId = 4;
                                        currentGrade = 'Maitrise recherche';
                                        break;
                        }

                        if (allLineDisplay[currentId] == true) {
                                document.getElementById(currentGrade).style.opacity = "0.0";
                                allLineDisplay[currentId] = false;
                                this.style.strokeWidth = 10;

                        }
                        else {
                                document.getElementById(currentGrade).style.opacity = "1.0";
                                allLineDisplay[currentId] = true;
                                this.style.strokeWidth = 2;
                        }
                })

        // Add one dot in the legend for each name.
        SVG.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr("x", 100 + size * 1.2)
                .attr("y", function (d, i) { return 100 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function (d) { return color(d) })
                .text(function (d) { return d })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .attr("transform", "translate(550,150)");

}

