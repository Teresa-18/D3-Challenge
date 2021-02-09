// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = 500;
  var svgHeight = 500;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select("scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
// Append group element
var chartGroup = svg.append("g")
 .attr("transform", `translate(${margin.left}, ${margin.top})`);

 d3.csv("data.csv").then(function(SmokerData) {

    // parse data
    SmokerData.forEach(function(data) {
      data.smokes = +data.smokes;
      data.age = +data.age;
    });

    // create scales
    var xLinearScale = d3.Scalelinear()
      .domain(d3.extent(SmokerData, d => d.age))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(SmokerData, d => d.smokes)])
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // line generator
    var line = d3.line()
      .x(d => xLinearScale(d.age))
      .y(d => yLinearScale(d.smokes));

    // append line
    chartGroup.append("path")
      .data([Data])
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "red");

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(SmokerData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.age))
      .attr("cy", d => yLinearScale(d.smokes))
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
        medal(s) won`);
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

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
