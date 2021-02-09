// @TODO: YOUR CODE HERE!
// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 1200;
var svgHeight = 660;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

 // Append SVG element
 var svg = d3
 .select(".chart")
 .append("svg")
 .attr("height", svgHeight)
 .attr("width", svgWidth);

// Append group element
var chartGroup = svg.append("g")
 .attr("transform", `translate(${margin.left}, ${margin.top})`);

 d3.csv("data.csv").then(function(Data) {

    // parse data
    Data.forEach(function(data) {
      data.smokes = +data.smokes;
      data.age = +data.age;
    });

    // create scales
    var xLinearScale = d3.Scalelinear()
      .domain(d3.extent(Data, d => d.age))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(Data, d => d.smokes)])
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale).ticks(6);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // line generator
    var line = d3.line()
      .x(d => xTimeScale(d.date))
      .y(d => yLinearScale(d.medals));

    // append line
    chartGroup.append("path")
      .data([Data])
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "red");

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(medalData)
      .enter()
      .append("circle")
      .attr("cx", d => xTimeScale(d.date))
      .attr("cy", d => yLinearScale(d.medals))
      .attr("r", "10")
      .attr("fill", "gold")
      .attr("stroke-width", "1")
      .attr("stroke", "black");

    // Date formatter to display dates nicely
    var dateFormatter = d3.timeFormat("%d-%b");

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip() // method from the d3.tip library not native to d3 
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`<strong>${dateFormatter(d.date)}<strong><hr>${d.medals}
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
