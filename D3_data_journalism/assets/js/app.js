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