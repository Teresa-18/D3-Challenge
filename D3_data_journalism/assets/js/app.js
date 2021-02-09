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

//append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "smokes";

// function used for updating x-scale var upon click on axis label
function xScale(SmokerData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(SmokerData, d => d.[chosenXAxis]), 
      d3.max(SmokerData, d => d[chosenXAxis])])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating x-scale var upon click on axis label
function yScale(SmokerData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(SmokerData, d => d.[chosenYAxis]), 
      d3.max(SmokerData, d => d[chosenYAxis])])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisBottom(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   var label;

//   if (chosenXAxis === "age") {
//     label = "Age:";
//   }
//   else {
//     label = "Household Income:";
//   }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${d[chosenYAxis]}<br>${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

d3.csv("/assets/data/data.csv").then(function (SmokerData, err) {
  if (err) throw err;

  // parse data
  SmokerData.forEach(function (data) {
    data.income = +data.income
    data.obese = +data.obese
    data.age = +data.age;
    data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(SmokerData, chosenXAxis);

  // xLinearScale function above csv import
  var yLinearScale = yScale(SmokerData, chosenYAxis);

  // create axes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // append axes
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);



  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(SmokerData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.smokes))
    .attr("cy", d => yScale(d.age))
    .attr("r", "10")
    .attr("fill", "pink")
    .attr("stroke-width", "1")
    .attr("stroke", "black")
    .attr("opacity", ".5");

 

}).catch(function (error) {
  console.log(error);
});