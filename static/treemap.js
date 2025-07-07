document.addEventListener('DOMContentLoaded', () => {
    fetch("/static/new_dataset.json")
        .then(res => res.json())
        .then(res => {
            console.log("Loaded dataset:", res);
            drawTreeMap(res);
            addColorLegend(); 
        });
});

const drawTreeMap = (dataset) => {
    const hierarchy = d3.hierarchy(dataset)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const treemap = d3.treemap()
        .size([900, 300])
        .padding(1);

    const root = treemap(hierarchy);

    const colorScale = d3.scaleLinear()
        .domain([0, d3.max(root.leaves(), d => d.data.value)])
        .range(["#bc769c","#52283f"]);

    console.log("colorscale",colorScale(1000))
    const svg = d3.select("#treemap").append("svg")
        .attr("width", 900)
        .attr("height", 300);

        const rectangles = svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorScale(d.data.value))
        .attr("stroke", "black")
        .on("click", function (event, d) {
            const originalWidth = d.x1 - d.x0;
            const originalHeight = d.y1 - d.y0;

            const newX0 = d.x0 - (originalWidth * 0.04);
            const newX1 = d.x1 + (originalWidth * 0.04);
            const newY0 = d.y0 - (originalHeight * 0.04);
            const newY1 = d.y1 + (originalHeight * 0.04);

            d3.select(this)
                .transition()
                .attr("x", newX0)
                .attr("y", newY0)
                .attr("width", newX1 - newX0)
                .attr("height", newY1 - newY0);

            setTimeout(() => {
                d3.select(this)
                    .transition()
                    .attr("x", d.x0)
                    .attr("y", d.y0)
                    .attr("width", originalWidth)
                    .attr("height", originalHeight);
            }, 1000);

            console.log(d.data.name);
            updateScatterPlot(d.data.name, "All");
            updateBubbleChart(d.data.name, "All");
        })
        .on("mouseover", function (event, d) {
            tooltip.html(`<strong>${d.data.name}</strong>: ${d.data.value} wines`)
                .style("visibility", "visible");
        })
        .on("mousemove", function (event) {
            tooltip.style("top", event.pageY - 10 + "px")
                .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        });

    //rectangles.append("title")
    //   .text(d => `${d.data.name}: ${d.data.value}`);

    svg.selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", d => (d.x0 + d.x1) / 2)
        .attr("y", d => (d.y0 + d.y1) / 2)
        .attr("dy", "0.35em")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .each(function (d) {
            const textWidth = this.getComputedTextLength();
            const textHeight = parseInt(window.getComputedStyle(this).fontSize);

            if (textWidth < (d.x1 - d.x0) && textHeight < (d.y1 - d.y0)) {
                d3.select(this).style("visibility", "visible");
            } else {
                d3.select(this).style("visibility", "hidden");
            }
        });
};


const addColorLegend = () => {
    const legendContainer = d3.select("#legend").append("svg") 
        .attr("width", 200)
        .attr("height", 50);

    const colorScale = d3.scaleOrdinal()
        .domain(["3600", "2500", "1500", "1000", "100"])
        .range(["#52283f","#6d3654", "#894369", "#a4517f","#bc769c"]);

    legendContainer.selectAll("rect")
        .data(colorScale.domain())
        .enter().append("rect")
        .attr("x", (d, i) => i * 40)
        .attr("y", 10)
        .attr("width", 40)
        .attr("height", 20)
        .attr("fill", d => colorScale(d));

    legendContainer.selectAll("text")
        .data(colorScale.domain())
        .enter().append("text")
        .attr("x", (d, i) => i * 40 )
        .attr("y", 45)
        .text(d => d);
};

