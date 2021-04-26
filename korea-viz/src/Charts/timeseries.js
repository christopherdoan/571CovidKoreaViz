import * as d3 from 'd3';

let initTimeSeries = (data) => {
  let visible = false;
  let width = 1000;
	let height = 600;
  let padding = 40;

  let svg = d3.select('#time').attr('width', width).attr('height', height);
  svg.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height);

  // initialize x axis
  let xScale = d3.scaleTime()
    .range([padding, width - padding * 2]);
  let xAxis = d3.axisBottom()
    .scale(xScale);
  svg.append("g")
      .attr("class", "axisX")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);

  // initialize y axis
  let yScale = d3.scaleLinear()
      .range([ padding, height - padding]);
  let yAxis = d3.axisLeft()
      .scale(yScale);
  svg.append("g")
      .attr("class", "axisY")
      .attr("transform", "translate(" + (padding) + ",0)")
      .call(yAxis);

  function update(data){

    // create x axis
    xScale.domain([d3.min(data, function(d){
        return d.date;
      }),
      d3.max(data, function(d){
        return d.date;
      })
      ]);
    svg.selectAll(".axisX").transition()
      .duration(300)
      .call(xAxis);

    // create y axis
    yScale.domain([d3.max(data, function(d){
      return d.total;
    }), d3.min(data, function(d){
      return d.total;
    })]);
    svg.selectAll(".axisY")
      .transition()
      .duration(300)
      .call(yAxis);

    var line = svg.selectAll(".line")
      .data([data], function(d){ return d.ser1 });
    
    line.enter()
      .append("path")
      .attr("class", "line")
      .merge(line)
      .transition()
      .duration(300)
      .attr("d", d3.line()
        .x(function(d){
          console.log(typeof(d.date));
          return xScale(d.date);
        })
        .y(function(d) {
          return yScale(d.total);
        }))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5);
  }

  let dataArr = Object.values(data);

  // draw whole graph
  update(Object.values(data.deceasedData));


  let toggle = () => {

  }
  return toggle;
}

export default initTimeSeries;
