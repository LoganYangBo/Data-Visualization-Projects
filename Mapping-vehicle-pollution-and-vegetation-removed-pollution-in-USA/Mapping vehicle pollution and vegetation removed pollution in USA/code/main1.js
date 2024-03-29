const svg1 = d3.select("#map2")
    .append("svg")
    .attr("width", 900)
    .attr("height", 600)
    .append("g")
    //.attr("transform", `translate(${margin.left},${margin.top})`);
var width = 900,
    height = 600,
    margin = {
        top: 0,
        bottom: width > 767 ? 20 : 100,
        right: 0,
        left: 0
    },
    centered,
    fmt = d3.format(" >5.2%"),
    errorCount = 0;

svg1.attr("width", width)
    .attr("height", height);

function ready(error, us, data) {
    if (error) throw error;


   var dictCities = {};
    data.forEach(function(d) {
        //Parse the percentages
        d["Cover"] = -(d["Cover"].slice(0, -1).replace(",", "."));
        d["Uncover"] = -(d["Uncover"].slice(0, -1).replace(",", "."));
        d.result = d["Uncover"] - d["Cover"];
        d.combined_fips = +d.combined_fips;
        dictCities[d.combined_fips] = d;
    });

    var color = d3.scaleSequential(d3.interpolateRdYlBu)
        .domain([-1,0.8]);

    // Add background
    svg1.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        // .on("click", clicked);
        // To allow the zoom back
        // svg.on("click", clicked);
    var zoom = d3.zoom()
        .scaleExtent([1, 15])
        .on("zoom", zoomed);

    svg1.style("pointer-events", "all")
        .call(zoom);
    var g = svg1.append("g");

    function zoomed() {
        console.log(d3.event.transform);
        g.attr("transform", d3.event.transform);
    };

    var projection = d3.geoAlbersUsa()
        .scale(width)
        .translate([width /2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    g.selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("class", "tract")
 
        .on("mouseover", updateDetails)
        .style("fill", function(d) {
            var city = dictCities[d.id];
            if (city)
                return color(city.result);
            else {
                errorCount++;
                console.log(d.id + " Not found" + " errors = " + errorCount);
                return color(0);
            }
        })
        .attr("d", path)
        .append("title")
        .text(function(d) {
            var city = dictCities[d.id],
                county,
                state;

            // var msg = d.id;
            if (city) {
                county = city.county_name;
                state = city.state_abbr;
                var msg;
            }
            return msg;
        });


    // g.append("g")
    //     .attr("class", "counties")
    //   .selectAll("path")
    //     .data(topojson.feature(us, us.objects.counties).features)
    //   .enter().append("path")
    //     .attr("class", "tract-border")
    //     .attr("d", path);

    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) {
            return a !== b;
        }))
        .attr("class", "tract-border-state")
        .attr("d", path);


    // g.append("path")
    //     .datum(topojson.mesh(mapData, mapData.objects.depts, function(a, b) { return a !== b; }))
    //     .attr("class", "tract-border-state")
    //     .attr("d", pathState);

    // The details
    var wScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([-width / 3, width / 3]);
    var details_layer = svg1.append("g")
        .attr("id", "details")
        .attr("transform", "translate(" + (width / 2 - 100) + ", 30)");
    details_layer.append("rect")
        .attr("class", "background")
        .attr("transform", "translate(" + (-wScale.range()[1] + 100) + ", -20)")
        .attr("width", wScale.range()[1] * 2 + 70)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("height", 60);
    details_layer.append("text")
        .attr("id", "cityLegend")
        .attr("transform", "translate(100, 0)");

    var detailsBars = details_layer.selectAll("bar")
        .data([0.50, -0.50])
        .enter()
        .append("g")
        .attr("class", "bar");
    detailsBars
        .append("rect")
        .attr("width", 0)
        .attr("height", width > 767 ? 20 : 10)
        .attr("x", 100)
        .attr("y", 10)
        .style("fill", color)
        .transition()
        .duration(500)
        .attr("x", function(d) {
            return d > 0 ? 100 : 100 - wScale(-d);
        })
        .attr("width", function(d) {
            return d > 0 ? wScale(d) : wScale(-d);
        });
    detailsBars.append("text")
        .text(function(d) {
            return (d > 0 ? "" : "Urbanlized ") +
                fmt(d > 0 ? d : -d) +
                (d > 0 ? " Canopy" : "");
            
        })
        .attr("dx", function(d) {
            return d > 0 ? -100 : 2;
        })
        .attr("dy", 24)
        .attr("x", 100)
        .style("text-anchor", function(d) {
            return d > 0 ? 100 : 2;
        })
        .transition()
        .duration(300)
        .attr("x", function(d) {
            return d > 0 ? 200 + wScale(d) : -2 - wScale(-d);
        });



    // The legend
    svg1.append("g")
        .attr("class", "legend")
        .attr("transform",
            width > 767 ?
            "translate(" + (width - margin.right - 100) + ",100)" :
            "translate(" + (width / 2 - 100) + "," + (height - 120) + ")"
        );

    var legendLinear = d3.legendColor()
        // .shapeWidth(30)
        .cells(7)
        .orient(width > 767 ? "vertical" : "horizontal")
        .title("Canopy Coverage%")
        .labels([
            " 84.00%",
            "  70.00%",
            "  56.00%",
            "  42.00%",
            "  28.00%",
            "  14.00%",
            " 00.00%",
        ].reverse())
        .labelFormat(fmt)
        .ascending(true)
        .labelAlign("end")
        .scale(color);

    svg1.select(".legend")
        .call(legendLinear);

    // When clicked, zoom in
    function clicked(d) {
        updateDetails(d);
        var x, y, k;

        // Compute centroid of the selected path
        if (d && centered !== d) {
            // if (d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            // k = zoom.scaleExtent()[1];
            k = 10;
            centered = d;
        }
        else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;
        }



        // Manually Zoom
        svg1.transition()
            .duration(1000)
            .call(zoom.transform, d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(k)
                .translate(-x, -y));
    }

    function updateDetails(d) {

        var data = [0.50, -0.50],
            name = fmt(data[0] + data[1]),
            state,
            county,
            city;

        if (d) {
            city = dictCities[d.id];
            if (city) {
                county = city['county_name'];
                state = city['state_abbr'];
                data = [city["Uncover"], -city["Cover"]];
                name = county + ', ' + state;
            }
        }
        // console.log(data);
        // console.log(name);
        var detailsBars = details_layer
            .selectAll(".bar")
            .data(data);

        detailsBars.select("rect")
            .transition()
            .duration(500)
            .attr("x", function(d) {
                return d > 0 ? 100 : 100 - wScale(-d);
            })
            .attr("width", function(d) {
                return d > 0 ? wScale(d) : wScale(-d);
            })
            .style("fill", color);

        detailsBars.select("text")
            .text(function(d) {
                return (d > 0 ? "" : " Urbanized ") +
                    fmt(d > 0 ? d : -d) +
                    (d > 0 ? "  Canopy" : "")
            })
            .transition()
            .duration(500)
            .attr("x", function(d) {
                return d > 0 ? 100 - wScale(-d) : 100 + wScale(d);
            })


        details_layer.select("#cityLegend").text(name);

    }
}



d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "c.csv")
    .await(ready);