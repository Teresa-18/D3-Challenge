// @TODO: YOUR CODE HERE!


var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("/assets/data/data.csv").then(function(SmokerData) {

  // parse data
  SmokerData.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
  });

  // scales
  var xScale = d3.scaleLinear()
    .domain(d3.extent(SmokerData, d => d.age))
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(SmokerData, d => d.smokes)])
    .range([height, 0]);

  // create axes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // append axes
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

  // line generator
  var line = d3.line()
  .x(d => xScale(d.age))
  .y(d => yScale(d.smokes));

  // append line
  chartGroup.append("path")
  .data([SmokerData])
  .attr("d", line)
  .attr("fill", "none")
  .attr("stroke", "red");

  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(SmokerData)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.age))
  .attr("cy", d => yScale(d.smokes))
  .attr("r", "10")
  .attr("fill", "gold")
  .attr("stroke-width", "1")
  .attr("stroke", "black");

  // Step 1: Initialize Tooltip
  var toolTip = d3.tip() // method from the d3.tip library not native to d3 
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`<strong>${d.age}<strong><hr>${d.smokes}
    smokers`);
  });

  // Step 2: Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

  // Step 3: Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
  // Step 4: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });
}).catch(function(error) {
console.log(error);
});
}