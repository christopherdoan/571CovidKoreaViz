import * as d3 from 'd3';

let initTimeSeries = (data) => {
  let visible = false;
  let width = 1000;
	let height = 600;
  let padding = 40;
  let bins = [
    [true, false], //confirmed or deceased
    [true, false, false], //sex: all, male(used in html), female(used in html), male(Actual), female(actual)
    [true, true, true, true, true, true, true, true, true, true]//order of checked: All, 0s, 10s... 80s
  ];
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

  let updateBins = (newBins) => {
    bins = newBins;
    console.log(bins[1]);

    // set dataset
    let curr_data = Object.values(data.confirmedData)
    if (bins[0][1] == true){
      curr_data = Object.values(data.deceasedData);
    }
   
    // create x axis
    xScale.domain([d3.min(curr_data, function(d){
      return d.date;
    }),
    d3.max(curr_data, function(d){
      return d.date;
    })
    ]);
    svg.selectAll(".axisX").transition()
      .duration(300)
      .call(xAxis);

    // create ratio variable for future calcuations in relation to age groups
    var sexRatio = 1;

    // create y axis
    yScale.domain([d3.max(curr_data, function(d){
          // check sex distributions and modify working data
        if (bins[1][1] && !bins[1][2]){
          d.curr_value = d.male;
        } else if (!bins[1][1] && bins[1][2]){
          d.curr_value = d.female;
        } else {
          d.curr_value = d.total;
        }

        // create/update sexRatio value used to caluculate per age group
        if (d.total != 0){
            sexRatio = d.curr_value/d.total;
        }
        // arr of counts for each age group, used in tandem with ageArr to select the correct age groups
        var ageArr = bins[2].slice(1);
        var ageArrValues = [d.age_0, d.age_10, d.age_20, d.age_30, d.age_40, d.age_50, d.age_60, d.age_70, d.age_80];
        
        // calcuate subtotal based on age groups
        var subtotal = 0;
        if (ageArr.every( e  => e == true)){
            return d.curr_value;
        } else {
            for (var i = 0; i < 9; i++){
                if (ageArr[i]){
                    subtotal = subtotal + ageArrValues[i];
                }
            }
        }
        // apply ratio to subtotal
        d.curr_value = Math.round(subtotal * sexRatio);
        return d.curr_value; 

    }), d3.min(curr_data, function(d){
      return d.curr_value;
    })]);
    svg.selectAll(".axisY")
      .transition()
      .duration(300)
      .call(yAxis);

      var line = svg.selectAll(".line")
      .data([curr_data], function(d){ return d.ser1 });

    line.enter()
      .append("path")
      .attr("class", "line")
      .merge(line)
      .transition()
      .duration(300)
      .attr("d", d3.line()
        .x(function(d){
          return xScale(d.date);
        })
        .y(function(d) {
          return yScale(d.curr_value);
        }))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5);
  }
  updateBins(bins);

  // let toggle = () => {
  //
  // }
  return updateBins;
}

export default initTimeSeries;
