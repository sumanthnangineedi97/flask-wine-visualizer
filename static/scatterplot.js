var scatterplotMargin = { top: 10, right: 10, bottom: 30, left: 50 },
    scatterplotWidth = 1450 - scatterplotMargin.left - scatterplotMargin.right,
    scatterplotHeight = 350 - scatterplotMargin.top - scatterplotMargin.bottom;

var scatterplotXScale = d3.scaleLinear().range([0, scatterplotWidth]);
var scatterplotYScale = d3.scaleLinear().range([scatterplotHeight, 0]);

var scatterplotXAxis = d3.axisBottom(scatterplotXScale);
var scatterplotYAxis = d3.axisLeft(scatterplotYScale);


var scatterplotSvg = d3.select("#scatterplot")
    .attr("width", scatterplotWidth + scatterplotMargin.left + scatterplotMargin.right)
    .attr("height", scatterplotHeight + scatterplotMargin.top + scatterplotMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + scatterplotMargin.left + "," + scatterplotMargin.top + ")");

scatterplotSvg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -scatterplotHeight / 2)
    .attr("y", -30)
    .attr("transform", "rotate(-90)")
    .text("Points");

scatterplotSvg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", scatterplotWidth / 2)
    .attr("y", scatterplotHeight + scatterplotMargin.bottom)
    .text("Price of Wines");

var oldsv='All'
function updateScatterPlot(selectedVariety, selectedWinery) {
    d3.csv("/static/Tableau_dataset.csv").then(function (data) {
        var filteredData1 = selectedVariety === "All" ? data : data.filter(function (d) {
            return d.variety === selectedVariety;
        });

        scatterplotXScale.domain([0, d3.max(filteredData1, function (d) { return +d.price; })]);
        scatterplotYScale.domain([d3.min(filteredData1, function (d) { return +d.points; }) - 3, d3.max(filteredData1, function (d) { return +d.points; })]);

        var dots = scatterplotSvg.selectAll("circle")
            .data(filteredData1);
        
        dots.enter()
        .append("circle")
        .attr("r", 2)
        .attr("cx", function (d) { return scatterplotXScale(d.price); })
        .attr("cy", function (d) { return scatterplotYScale(d.points); })
        .on("click", function(event, d) {
            console.log("CLICKED ",selectedVariety,d.winery)
            updateBubbleChart(oldsv,d.winery);
            
        })
        .on("mouseover", function (event, d) {
            console.log("scatter mouseover")
            tooltip.html(`<strong>Title: </strong>${d.title}<br><strong>Winery: </strong>${d.winery}`)
                .style("visibility", "visible");

                
        })
        .on("mousemove", function (event) {
            tooltip.style("top", event.pageY - 10 + "px");
            if (event.pageX > 1400) {
                tooltip.style("left", event.pageX - 150 + "px");
            } else {
                tooltip.style("left", event.pageX + 10 + "px");
            }
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        });

        

        dots.transition()
            .duration(1500)
            .attr("r", function (d) {
                return d.winery === selectedWinery ? 5 : 2;
            })
            .style("fill", function (d) {
                return d.winery === selectedWinery ? "#fb8500" : "#073B4C";
            })
            .attr("cx", function (d) { return scatterplotXScale(d.price); })
            .attr("cy", function (d) { return scatterplotYScale(d.points); })
            ;
        oldsv=selectedVariety
            dots.exit().remove();       
        scatterplotSvg.selectAll(".axis").remove();

        scatterplotSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + scatterplotHeight + ")")
            .transition()
            .duration(1000)
            .call(scatterplotXAxis);

        scatterplotSvg.append("g")
            .attr("class", "y axis")
            .transition()
            .duration(1000)
            .call(scatterplotYAxis);

        scatterplotSvg.select(".x.label")
            .transition()
            .duration(1000)
            .attr("x", scatterplotWidth / 3)
            .attr("y", scatterplotHeight + scatterplotMargin.bottom);

        scatterplotSvg.select(".y.label")
            .transition()
            .duration(1000)
            .attr("x", -scatterplotHeight / 2)
            .attr("y", -30);
    });
}

updateScatterPlot("All", "All");
