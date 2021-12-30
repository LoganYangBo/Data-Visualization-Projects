const width = 800;
const height = 400;
const radius = Math.min(width, height) / 2;

const svg = d3.select("#chart-area")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", `translate(${width / 2 - 100}, ${height / 2})`);

const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb", "#e78ac3","#a6d854","#ffd92f"]);

const pie = d3.pie()
    .value(d => d.count)
    .sort(null);

const arc = d3.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius);

const type = d => {
    d.C = d['Critical Bed'];
    d.M = d['Med/Surg Bed'];
    return d;
}

function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(1);
    return (t) => arc(i(t));
}

d3.json("data.json", type).then(data => {
    d3.selectAll("input")
        .on("change", update);

    function update(val = this.value) {
      	svg.selectAll('circle').remove();
      	svg.selectAll('text').remove();
      	
      	const region = data[val].map(val => val.region);
      	// Add one dot in the legend for each name.
        svg.selectAll("dots")
          .data(region)
          .enter()
          .append("circle")
            .attr("cx", 310)
            .attr("cy", (d,i) => -90 + i*45) // -90 is where the first dot appears. 45 is the distance between dots
            .attr("r", 18)
            .style("fill", (d, i) => color(i));

        // Add one dot in the legend for each name.
        svg.selectAll("labels")
          .data(region)
          .enter()
          .append("text")
            .attr("x", 330)
            .attr("y", (d,i) => -88 + i*45) // -88 is where the first dot appears. 45 is the distance between dots
            .style("fill", (d, i) => color(i))
            .text((d) => d)
            .attr("text-anchor", "left")
      			.style("font-size", "18px")
            .style("alignment-baseline", "middle");
      
      
        // Join new data
        const path = svg.selectAll("path")
            .data(pie(data[val]));

        // Update existing arcs
        path.transition().duration(200).attrTween("d", arcTween);
      
      	setTimeout(() => path.transition().attrTween("d", arcTween(4)), 2000)

        // Enter new arcs
        path.enter().append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc)
            .attr("stroke", "white")
            .attr("stroke-width", "10px")
            .each(function(d) { this._current = d; });
    }

    update("Critical Bed");
});