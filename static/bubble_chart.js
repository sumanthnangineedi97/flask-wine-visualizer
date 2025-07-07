var sc_margin = { top: 10, right: 50, bottom: 0, left: 50 },
    sc_width = 500 - sc_margin.left - sc_margin.right,
    sc_height = 350 - sc_margin.top - sc_margin.bottom;

var pack = d3.pack()
    .size([sc_width, sc_height])
    .padding(1.5);

var svg = d3.select("#bubblechart")
    .append("svg")
    .attr("width", sc_width + sc_margin.left + sc_margin.right)
    .attr("height", sc_height + sc_margin.top + sc_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + sc_margin.left + "," + sc_margin.top + ")");

var tooltip = d3.select("#bubblechart")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("max-width", "15ch");
var demosv="All"

function updateBubbleChart(selectedVariety, selectedwinery) {
    d3.csv("/static/Tableau_dataset.csv").then(function (data) {
        var filteredData = selectedVariety === "All" ? data : data.filter(function (d) {
            return d.variety === selectedVariety;
        });
        
        var wineryCounts = d3.rollup(filteredData, v => v.length, d => d.winery);
        console.log("BC",filteredData.length)
        var topWineries = Array.from(wineryCounts, ([key, value]) => ({ winery: key, count: value }))
            .sort((a, b) => b.count - a.count);

        var root = d3.hierarchy({ children: topWineries })
            .sum(d => d.count);

        var bubbleData = pack(root).leaves();

        var bubbles = svg.selectAll(".bubble")
            .data(bubbleData);

        var enterBubbles = bubbles.enter()
            .append("circle")
            .attr("class", "bubble")
            .on("click",function(event,d){
                console.log("demosv",demosv)
                updateScatterPlot(demosv,d.data.winery);
            })
            .on("mouseover", function (event, d) {
                console.log("bubble_chart mouse over",d)
                tooltip.html(`<strong>${d.data.winery}</strong>: ${d.data.count} wines`)
                
                    .style("visibility", "visible");
            })
            .on("mousemove", function (event) {
                tooltip.style("top", event.pageY - 10 + "px")
                    .style("left", event.pageX + 10 + "px");
            })
            .on("mouseout", function () {
                tooltip.style("visibility", "hidden");
            });
            demosv=selectedVariety
        enterBubbles.merge(bubbles)
            .transition()
            .duration(1000)
            .delay(function (d, i) { return i; })
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.r)
            .attr("fill", function (d) {
                return d.data.winery === selectedwinery ? "#ef233c" : "#073B4C";
            })
            ;

        bubbles.exit().remove();

        svg.selectAll(".axis").remove();
    });
}
updateBubbleChart("All", "All");

