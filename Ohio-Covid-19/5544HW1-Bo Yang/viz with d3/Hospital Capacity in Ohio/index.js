import {
  select,
  csv,
  scaleLinear,
  max,
  scaleBand,
  scaleOrdinal,
  axisLeft,
  axisBottom,
  rgb,
} from 'd3';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = (data) => {
  const title = 'Hospital Capacity in Ohio';
  
  // Common dimensions
  const yValue = (d) => d.Number;
  const xValue = (d) => d.Area;
  const xDiv = (d) => d['Type'];

  // Margin Data
  const margin = {
    top: 100,
    right: 50,
    bottom: 60,
    left: 150,
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scale delcarations
  const yScale = scaleLinear()
    .domain([0, Math.max(max(data, yValue))])
    .range([innerHeight, 0]);

  const xScale = scaleBand()
    .domain(data.map(xValue))
    .range([0, innerWidth])
    .padding(0.2);

  const subScale = scaleBand()
    .domain(data.map(xDiv))
    .range([0, xScale.bandwidth()])
    .padding(0.05);

  const colorScale = scaleOrdinal()
    .domain(data.map(xDiv))
    .range([
      rgb('steelblue'),
      rgb('limegreen'),
      rgb('goldenrod'),
      rgb('crimson'),
    ]);

  
  
  const g = svg
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`
    );

  // Draw axes
  g.append('g').call(axisLeft(yScale));
  g.append('g')
    .call(axisBottom(xScale))
    .attr('transform', `translate(0,${innerHeight})`);

  
  
  // Draw bars
  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(xValue(d)) + subScale(xDiv(d)))
    .attr('y', (d) => yScale(yValue(d)))
    .attr('height', (d) => innerHeight - yScale(yValue(d)))
    .attr('width', subScale.bandwidth())
    .attr('fill', (d) => colorScale(xDiv(d)));
  

    g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
  		.attr('x', 10)
  		.attr('fill', 'gray')
  		.style('font-size', '2em')
      .text(title);
  

	// Draw Legend
	var legend = svg.selectAll('legend')
		.data(subScale.domain()).enter()
  	.append('g')
  	.attr('transform', 'translate(0, 100)')
  	.attr('opacity', 1);

  //console.log(subScale.domain()[0] - 2009);
  
  legend.append('rect')
    .attr('x', 860)
  	.attr('y', 25)
  	.attr("width", 20)
  	.attr('height', 20)
  	.attr('fill', 'steelblue');
  
  legend.append('text')
  	.attr('x', 800)
  	.attr('y',10)
  	.attr('dy', '.35em')
  	.style('font-size', '.9em')
  	.text('Critical Number in Use');
  
  legend.append('rect')
    .attr('x', 860)
  	.attr('y', 75)
  	.attr("width", 20)
  	.attr('height', 20)
  	.attr('fill', 'limegreen');
  
  legend.append('text')
  	.attr('x', 800)
  	.attr('y',60)
  	.attr('dy', '.35em')
  	.style('font-size', '.9em')
  	.text('Critical Total Number');
  
  legend.append('rect')
    .attr('x', 860)
  	.attr('y', 125)
  	.attr("width", 20)
  	.attr('height', 20)
  	.attr('fill', 'goldenrod');
  
  legend.append('text')
  	.attr('x', 800)
  	.attr('y',110)
  	.attr('dy', '.35em')
  	.style('font-size', '.9em')
  	.text('Med/Surg Number in Use');
  
  legend.append('rect')
    .attr('x', 860)
  	.attr('y', 175)
  	.attr("width", 20)
  	.attr('height', 20)
  	.attr('fill', 'crimson');
  
  legend.append('text')
  	.attr('x', 800)
  	.attr('y',160)
  	.attr('dy', '.35em')
  	.style('font-size', '.9em')
  	.text('Med/Surg Total Number');
  
  svg.append('text')
  	.attr('transform', 'translate(480, 480)')
  	.attr('text-anchor', 'middle')
  	.style('font-size', '1.7em')
  	.text('County Name');
  
  svg.append('text')
  	.attr('x', 300)
  	.attr('y', -80)
  	.attr('transform', `rotate(90)`)
  	.attr('text-anchor', 'middle')
  	.style('font-size', '1.7em')
  	.text('Number of Bed');
};
	

csv('data2.csv').then((data) => {
  data.forEach((d) => {
    d.Number = +d.Number;
    d.Type = d['Type'];
  });
  render(data);
});
