socket = io.connect('ws://localhost:3001');

var t = -1,
  n = 40,
  duration = 750,
  data = [];

var margin = {
  top: 6,
  right: 0,
  bottom: 20,
  left: 40
},
  width = 560 - margin.right,
  height = 120 - margin.top - margin.bottom;



var x = d3.scaleLinear()
  .domain([t - n + 1, t])
  .range([0, width]);

var y = d3.scaleTime()
  .range([height, 0])
  .domain([0, 400]);;

var line = d3.line()  
  .x(function (d, i) {
    return x(d.time);
  })
  .y(function (d, i) {
    return y(d.value);
  }).curve(d3.curveCatmullRom.alpha(0.5));

var svg = d3.select("body").append("p").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("margin-left", -margin.left + "px")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);


//var xAxis = d3.svg.axis().scale(x).orient("bottom");
var xAxis= d3.axisBottom().scale(x)
var axis = svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(x.axis = xAxis);

var path = svg.append("g")
  .attr("clip-path", "url(#clip)")
  .append("path")
  .data([data])
  .attr("class", "line");

function tick() {

  // update the domains
  x.domain([t - n + 2, t]);

  // redraw the line
  svg.select(".line")
    .attr("d", line)
    .attr("transform", null);

  // slide the x-axis left
  axis.transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .call(x.axis);

  // slide the line left
  path.transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .attr("transform", "translate(" + x(t - n) + ")");

  // pop the old data point off the front
  if (data.length > 40) data.shift();

}

function displayGraphExample(id, width, height, interpolation, animate, updateDelay, transitionDelay) {
  // create an SVG element inside the #graph div that fills 100% of the div
  var graph = d3.select(id).append("svg:svg").attr("width", "100%").attr("height", "100%");

  // create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
  //var data = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 9];

  // X scale will fit values from 0-10 within pixels 0-100
  var x = d3.scaleLinear().domain([0, 48]).range([-5, width]); // starting point is -5 so the first value doesn't show and slides off the edge as part of the transition
  // Y scale will fit values from 0-10 within pixels 0-100
  var y = d3.scaleLinear().domain([0, 30]).range([0, height]);

  // create a line object that represents the SVN line we're creating
  var line = d3.line()
    // assign the X function to plot our line as we wish
    .x(function (d, i) {
      // verbose logging to show what's actually being done
      //console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
      // return the X coordinate where we want to plot this datapoint
      return x(i);
    })
    .y(function (d) {
      // verbose logging to show what's actually being done
      //console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
      // return the Y coordinate where we want to plot this datapoint
      return y(d);
    })
    .curve(d3.curveBasis)

  // display the line by appending an svg:path element with the data line we created above
  graph.append("svg:path").attr("d", line(data));
  // or it can be done like this
  //graph.selectAll("path").data([data]).enter().append("svg:path").attr("d", line);


  function redrawWithAnimation() {
    // update with animation
    graph.selectAll("path")
      .data([data]) // set the new data
      .attr("transform", "translate(" + x(1) + ")") // set the transform to the right by x(1) pixels (6 for the scale we've set) to hide the new value
      .attr("d", line) // apply the new data values ... but the new value is hidden at this point off the right of the canvas
      .transition() // start a transition to bring the new value into view
      .ease(d3.easeLinear)
      .duration(transitionDelay*0.95) // for this demo we want a continual slide so set this to the same as the setInterval amount below
      .attr("transform", "translate(" + x(0) + ")"); // animate a slide to the left back to x(0) pixels to reveal the new value

    /* thanks to 'barrym' for examples of transform: https://gist.github.com/1137131 */
  }

  function redrawWithoutAnimation() {
    // static update without animation
    graph.selectAll("path")
      .data([data]) // set the new data
      .attr("d", line); // apply the new data values
  }
  /*
    setInterval(function () {
      //var v = data.shift(); // remove the first element of the array
      //data.push(v); // add a new element to the array (we're just taking the number we just shifted off the front and appending to the end)
      if (animate) {
        redrawWithAnimation();
      } else {
        redrawWithoutAnimation();
      }
    }, updateDelay);*/
  socket.on('data', (obj) => {
    console.log(obj);//每秒更新
    data.shift();
    data.push(obj)
    redrawWithAnimation();
    //console.log(new Date())
  });
}

socket.on('history', (obj) => {
  console.log(obj);//由此開始
  data = obj
});

