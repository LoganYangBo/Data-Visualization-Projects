//render the columbus map
async function renderMap() {

    //step 1: load the dataset
    //data source: https://github.com/codeforgermany/click_that_hood/blob/master/public/data/columbus.geojson
    var data = await d3.json("static/datasets/ohio.geojson");
    var caseData = await d3.csv("static/datasets/OSU Covid-19 - Cases.updated.csv");

    //preprocessing the case data
    //console.log(caseData);
    var caseDataObj = {};
    var dates = Array.from(caseData.map(d => d['Day of Onset Dt']));
    caseData.columns.forEach(county => {
        let countyUpperCase = county.toUpperCase();
        if (county != 'Day of Onset Dt') {
            caseDataObj[countyUpperCase] = Array.from(caseData.map(d => parseInt(d[county].replace(',',''))));
            let sum = 0;
            caseDataObj[countyUpperCase].forEach(d => {
                if (d != -1) {
                    sum += d;
                }
            })
            caseDataObj[countyUpperCase].unshift(sum);
        }
    });
    // console.log(caseDataObj);
    // console.log(dates);

    //step 2: create the SVG 
    var width = 400,
        height = 375;

    var svg = d3.select("#chart-1")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    //step 3: create the geoPath() and specify the projection configurations
    var projection = d3.geoMercator()
        .scale(4000)
        .center([-82.58, 40.2]) //[lon, lat]
        .translate([width / 2, height / 2]); //center of projection is located on the screen (with a [x, y] array)

    var geoGenerator = d3.geoPath()
        .projection(projection);

    //console.log(geoGenerator(data));

    //psuedo color mapping
    const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain(d3.extent(Object.values(caseDataObj).map(d => d[0])));

    // Draw the map
    var map = svg.append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")
        // draw each county
        .attr("d", function (d) {
            return geoGenerator(d);
        })
        .attr('id', function(d){
            //remove space
            let id = d.properties.name.replace(/\s/g, '');
            return 'C-' + id;
        })
        .style("stroke", "#aaa")
        .attr("opacity", 0.7)
        .attr("fill", function (d) {
            let countyName = d.properties.name.toUpperCase();
            //console.log(caseDataObj[countyName]);
            return colorScale(caseDataObj[countyName][0]);
        })
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
            // console.log(d.properties.name);
            d3.select(this).attr("fill", '#d94948');
        })
        .on("mouseleave", function (event, d) {
            let countyName = d.properties.name.toUpperCase();
            d3.select(this).attr("fill", colorScale(caseDataObj[countyName][0]));
        })
        .on("click", async function (event, d) {
            let countyName = d.properties.name.toUpperCase();
            d3.select('#county-name').text('('+d.properties.name+')');
            let caseData = caseDataObj[countyName].splice(1,caseDataObj[countyName].length);
            let preditionRes = await getPredition({ 'dates': dates, 'cases': caseData });
            renderLineChart(preditionRes);
        })

}


function renderLineChart(lineData) {

    //clear the chart-3 to regenerate the visualization
    $("#chart-3").html("");

    const parseTime = d3.timeParse("%Y/%m/%d");
    lineData.map(function (row) {
        row.date = parseTime(row.date);
    })

    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 997 - margin.left - margin.right,
        height = 265 - margin.top - margin.bottom;

    const svg = d3.select("#chart-3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
        .domain(d3.extent(lineData, function (d) { return d.date; }))
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(lineData, function (d) { return +d.cases; })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    const lineGenerator = d3.line()
        .defined(d => d.cases != -1)
        .x(function (d, index) {
            return x(d.date)
        })
        .y(function (d) { return y(d.cases) });

    //draw the original data
    svg.append("path")
        .attr("fill", 'none')
        .attr('stroke', 'steelblue')
        .attr('d', lineGenerator(lineData.slice(0, lineData.length - 30)));

    //predictions
    svg.append("path")
        .attr("fill", 'none')
        .attr('stroke', 'red')
        .attr('d', lineGenerator(lineData.slice(lineData.length - 31, lineData.length)));

}

document.addEventListener("DOMContentLoaded", function () {
    renderMap();
});
