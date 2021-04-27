import * as d3 from 'd3';
import * as d3Cloud from "d3-cloud";
import { sliderHorizontal } from 'd3-simple-slider';
import { legendColor } from 'd3-svg-legend';

let initWordCloud = (data) => {
  // debugger;
  let width = 1000;
  let height = 600;
  let padding = 40;
  // Flag to show the word cloud totals or filter per month
  let flag = 1;

  //Create SVG elements
  let svg = d3.select("svg#cloud");
  svg.append('g');

  //svg for slider
  let svg2 = d3.select("svg#slide");

  //svg for title
  let svg3 = d3.select("svg#title");

  // Code to initially create title
  svg3.append('text')
      .text("Search Keyword Trends Word Cloud (total)")
      .attr("x", (width / 2))
      .attr("y", 35 )
      .attr("text-anchor", "middle")
      .style("font-size", "36px")
      .style("text-decoration", "underline");


  // Code for tooltips: taken from AJ's code
  let Tooltip = d3.select("#template")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

  // Data structs to fill in logic for slider
  let months = ["November", "December", "January", "February", "March", "April", "May", "June", "July"]
  let monthsObj = {"November" : 1, "December": 2, "January": 3, "February": 4, "March": 5,
                  "April": 6, "May": 7, "June": 8, "July": 9}

  // Function that creates dates based on index 0 to 9
  let dataTime = d3.range(0, 9).map(function(d) {
      return new Date(2019,10 + d,3);
  });

  // More letiables and datastructures for slider logic
  let november = new Date(2019,10,3);
  let december = new Date(2019,11,3,23);
  let january = new Date(2020,0,3,23);
  let february = new Date(2020,1,3,23);
  let march = new Date(2020,2,5,23);
  let april = new Date(2020,3,6);
  let may = new Date(2020,4,7);
  let june = new Date(2020,5,7);
  let july = new Date(2020,6,8);
  let monthList = [november, december, january, february, march, april, may, june, july];

  // promises that hold file names for each data file
  // let promises = [d3.csv("data/wordcounts_total.csv"),
  //     d3.csv("data/wordcounts_November.csv"),
  //     d3.csv("data/wordcounts_December.csv"),
  //     d3.csv("data/wordcounts_January.csv"),
  //     d3.csv("data/wordcounts_February.csv"),
  //     d3.csv("data/wordcounts_March.csv"),
  //     d3.csv("data/wordcounts_April.csv"),
  //     d3.csv("data/wordcounts_May.csv"),
  //     d3.csv("data/wordcounts_June.csv"),
  //     d3.csv("data/wordcounts_July.csv"),];
  // let myDataPromises = Promise.all(promises);
  //
  // // Load all data
  // myDataPromises.then((allData) =>{
      // Code to add slider for months filter
      let slider = sliderHorizontal()
          .min(d3.min(dataTime))
          .max(d3.max(dataTime))
          .step(1000 * 60 * 60 * 24 * 31)
          .width(width-(padding*2))
          .tickFormat(d3.timeFormat('%m-%Y'))
          .tickValues(dataTime)
          .default(new Date(2019,10,3))
          .on('onchange', (val) => {
              flag = 0;
              svg.select('g').interrupt();
              svg.select('g').remove();
              svg.append('g');
              let index = 0;
              for(const month of monthList){
                  if (val.getTime() === month.getTime()){
                      drawCloud(months[index]);
                  }
                  index = index + 1;
              }
              });

      // Code to toggle viewing by filter or viewing total numbers
      let totalButton = d3.selectAll("button.total");

      // Logic for changing
      totalButton.on("click", function(d){
          flag = 1;
          svg.select('g').interrupt();
          svg.select('g').remove();
          svg.append('g');
          drawCloud("total");

      });

      // Code for radio buttons to switch between cloud and lollipop view
      const buttons = d3.selectAll('.radioBtn');

      // type will be used as a global letiable to be checked to draw a word cloud or lollipop
      let type = "set1";
      buttons.on('change', function(d) {
          type = this.value;
          svg.selectAll("line").remove();
          svg.selectAll("circle").remove();
          svg.select('g').remove();
          svg.append('g');

          // draw total if the flag is 1, draw filtered on month if flag is 0
          if (flag === 1){
              drawCloud("total")
          }
          else{
              let val = slider.value()
              let index = 0;
              for(const month of monthList){
                      if (val.getTime() === month.getTime()){
                          drawCloud(months[index]);
                      }
                      index = index + 1;
                  }
          }
      });

      // Just adds slider to svg2
      let cloudSlider = svg2.append('g')
          .attr('transform', 'translate(30,30)');

      cloudSlider.call(slider)

      // Inital graph is total word cloud
      drawCloud("total");

      // Draw cloud actually draws both word cloud and lollipop
      function drawCloud(month){
          // Colors for the word cloud
          let fill = d3.scaleOrdinal(d3.schemeCategory10);

          //Fills in the title using conditionals, counts is the data structure
          let typeTitle = "";
          let filterTitle = month;
          let counts;

          // Set the datastructure based on month or total
          if (month === "total"){
              counts = data.total
          }
          else{
              counts = data[month.toLowerCase()];
              // counts = allData[monthsObj[month]];
          }

          //If the radio is on word cloud, we draw the word cloud here
          if (type === "set1"){

              // Set the title
              typeTitle = "Word Cloud";

              // Height and width declaration
              let width = 1000;
              let height = 600;

              //Remove whatever chart is there. Add a new group
              svg.select('g').interrupt();
              svg.select('g').remove();
              svg.append('g');

              // Code to get the min and max counts
              let countMax = Math.sqrt(Math.max.apply(Math, counts.map(function(o) { return o.counts; })));
              let countMin = Math.sqrt(Math.min.apply(Math, counts.map(function(o) { return o.counts; })));

              // Scales
              let wordScale = d3.scaleLinear()
                  .domain([countMin, countMax])
                  .range([15,115]);

              // Word cloud specific layout code
              let layout = d3Cloud()
                  .size([width, height])
                  .words(counts)
                  .text((d) => d.word)
                  .fontSize(function(d){
                      return wordScale(Math.sqrt(d.counts));
                  })
                  .on("end", draw);


              layout.start();

              // This function gets the word's count
              function getCount(word,struct){
                  let i;
                  let returnCount = 0;
                  for (i = 0; i < struct.length; i++){
                      if (word === struct[i].word){
                          returnCount = struct[i].counts
                      }
                  }
                  return returnCount;
              }

              // Function to draw the actual word cloud
              function draw(words) {
                  svg.select("g")
                      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2  + ")")
                      .selectAll("text")
                      .data(words)
                      .enter()
                      .append("text")
                      .on("mousemove", mousemove)
                      .on('mouseover', function(d){
                          d3.select(this).transition().style("font-size", (d) => (1.2*d.size) + "px");
                          mouseover(this);
                      })
                      .on('mouseout', function(d){
                          d3.select(this).transition().style("font-size", (d) => d.size + "px");
                          mouseout(this);
                      })
                      .on('click', function(d){
                          getCount(d3.select(this).data()[0].word,counts);
                      })
                      .transition()
                      .text((d) => d.text)
                      .style("font-size", (d) => d.size + "px")
                      .style("font-family", (d) => d.font)
                      .style("fill", (d, i) => fill(i))
                      .attr("text-anchor", "middle")
                      .attr("transform", (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")");
              }
              // Set the title here
              svg3.select("text").transition().text("Search Keyword Trends " + typeTitle);
          }
          // when the radio button is on lollipop chart
          else if (type === "set2"){
              typeTitle = "Lollipop Chart";

              // Set indepdent margin, width and height
              let margin = {top: 10, right: 30, bottom: 40, left: 90};
              let width = 1000- margin.left - margin.right;
              let height = 600- margin.top - margin.bottom;

              //Remove anything that is currently on the chart
              svg.selectAll('g').remove();
              svg.selectAll("line").remove();
              svg.selectAll("circle").remove();

              // scale that goes from 0 to the max count of the dataset we are on
              let x = d3.scaleLinear()
              .domain([0,
                      Math.max.apply(Math, counts.map(function(o) { return o.counts; }))])
              .range([ margin.left, width]);

              // add the bottom axis
              svg.append("g")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x))
                  .selectAll("text")
                  .style("font-size", '16px')
                  .attr("transform", "translate(-10,0)rotate(-45)")
                  .style("text-anchor", "end");

              // add y axis
              let y = d3.scaleBand()
                  .domain(counts.map(function(d) { console.log(d.word); return d.word; }))
                  .range([ 0, height ])
                  .padding(1);

              svg.append("g")
              .attr("transform", "translate(" + margin.left + ",0)")
              .call(d3.axisLeft(y))
              .style("font-size", '14px');

              // Draw lines
              svg.selectAll("myline")
              .data(counts)
              .enter()
              .append("line")
                  .attr("x1",x(0))
                  .attr("x2", x(0))
                  .attr("y1", function(d) { return y(d.word); })
                  .attr("y2", function(d) { return y(d.word); })
                  .attr("stroke-width", 1)
                  .transition()
                  .duration(1000)
                  .attr("x1", function(d) { return x(d.counts); })
                  .attr("x2", x(0))
                  .attr("y1", function(d) { return y(d.word); })
                  .attr("y2", function(d) { return y(d.word); })
                  .attr("stroke", "grey")

              // Draw circles
              svg.selectAll("mycircle")
              .data(counts)
              .enter()
              .append("circle")
                  .attr("cx", x(0))
                  .attr("cy", function(d) { return y(d.word); })
                  .on("mouseout", function(d){
                      d3.select(this).transition().attr("r", 4);
                      mouseout(this);
                  })
                  .on("mousemove", mousemove)
                  .on("mouseover", function(d){
                      d3.select(this).transition().attr("r", 6);
                      mouseover(this);
                  })
                  .transition()
                  .duration(1000)
                  .attr("cx", function(d) { return x(d.counts); })
                  .attr("cy", function(d) { return y(d.word); })
                  .attr("r", "4")
                  .style("fill", "#69b3a2")
                  .attr("stroke", "black");

          }
          // Set title here
          svg3.select("text").transition().text("Search Keyword Trends " + typeTitle + " (" +month+")");

      }

      // Shows tooltip
      function mouseover(d){
        Tooltip
            .style("opacity", 1);
      }
      // Hides tooltip
      function mouseout(d){
        Tooltip
            .style("opacity", 0);
      }
      // Creates tooltip
      function mousemove(d, e){
        console.log(d);
        console.log(e);
        Tooltip
            .html(`Volume (converted): ${e.counts}`)
            .style("left", (d.pageX+5) + "px")
            .style("top", (d.pageY+5) + "px");
      }
}

export default initWordCloud;
