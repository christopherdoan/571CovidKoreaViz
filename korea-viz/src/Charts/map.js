import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';

let initMap = (data) => {
  let visible = false;
  let width = 500;
  let height = 800;

  let projection = d3.geoMercator()
    .scale(6000)
    .center([127.5845, 36])
    .translate([width / 2, height / 2]);

  let path = d3.geoPath()
    .projection(projection);

  let svg = d3.select('#map').attr('width', width).attr('height', height);

  svg.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height);


  let g = svg.append('g');

  let mapLayer = g.append('g')
    .classed('map-layer', true);

  let windowLayer = g.append('g')
    .classed('window-layer', true);

  //color scale
  let color = d3.scaleLinear()
    .domain([1, 25])
    .clamp(true)
    .range(['#FDA50F50', '#EF7215CC', '#883000']);


  //Tooltip class definition
  let Tooltip = d3.select(".vis-overlay")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");


    //helper method for getting full province name
    let provinceNameMapping = (provinceName) => {
      if(provinceName === "Sejongsi"){
        return "Sejong";
      }
      return provinceName;
    }
    
    //heat fill normalized between 0, 1
    let scaledHeatFill = (d) => {
      let rawConfirmCount;
      rawConfirmCount = parseInt(data.confirmCountByProvince[provinceNameMapping(d.properties.name_eng)].confirmed);
      return rawConfirmCount;
    }

    // Get province color
    let heat_fill = (d) => {
      let rawConfirmCount;
      rawConfirmCount = parseInt(data.confirmCountByProvince[provinceNameMapping(d.properties.name_eng)].confirmed);

      let scaledConfirmCount = 25 * rawConfirmCount/data.maxConfirmCount;

      var name = d.properties.name_eng;
      var length = name.length;
      return color(scaledConfirmCount);
    }

    //event listeners
    let mouseover = (d) => {
      // Highlight hovered province
      // d3.select(this).style('transition', 'opacity 0.2s stroke-width 0s');
      d3.select(d.target).style('opacity', 0.5);
      d3.select(d.target).style("stroke-width", 3);
      Tooltip
        .style("opacity", 1);
    }
    let mouseout = (d) => {
      // Reset province color
      d3.select(d.target).style('opacity', 1);
      d3.select(d.target).style("stroke-width", 1);
      Tooltip
        .style("opacity", 0);
    }

    let mousemove = (d, e) => {
      Tooltip
        .html(`<b>${e.properties.name_eng}:</b><br>Confirmed cases: ${scaledHeatFill(e)}`)
        .style("left", (d.pageX+5) + "px")
        .style("top", (d.pageY+5) + "px")

      // this.Tooltip.
      //   style("left", (d.pageX-parseFloat(this.Tooltip.style("width").split(".")[0])/2)+"px");
    }

  let features = data.geoJson.default.features;


  //bind event listeners
  mapLayer.selectAll('path')
      .data(features)
      .enter().append('path')
      .attr('d', path)
      .attr('vector-effect', 'non-scaling-stroke')
      .attr("fill", heat_fill)
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('mousemove', mousemove);

  // Attach name to province
  mapLayer.selectAll("text")
      .data(features)
      .enter()
      .append("svg:text")
      .text(function(d){
          return d.properties.name_eng;
      })
      .style('fill', 'black')
      .style('stroke', 'transparent')
      .attr("x", function(d){
          return path.centroid(d)[0];
      })
      .attr("y", function(d){
          return  path.centroid(d)[1];
      })
      .attr("text-anchor", function(d){
        return d.properties.name_eng === "Gyeonggi-do" ? "initial" : "middle"
      })
      .attr('font-size','14px')
      .attr('font-family', 'Open Sans');
    let colorLegend = legendColor()
            .labelFormat(d3.format(".0f"))
            .scale(color)
            .shapePadding(0)
            .shapeWidth(10)
            .shapeHeight(20)
            .labelOffset(12);

    svg.append("g")
            .attr("transform", "translate(10, 10)")
            .call(colorLegend);

  //PUT ALL CODE THAT SHOULD BE RUN ON DRAW, UNDRAW IN HERE
  let toggle = () => {
    if(visible){
          mapLayer.selectAll('path').on('mouseover', null)
                  .on('mouseout', null)
                  .on('mouseover', null);
      }else{
        mapLayer.selectAll('path')
                  .on('mouseover', mouseover)
                  .on('mouseout', mouseout)
                  .on('mousemove', mousemove);
      }
  }
  return toggle;
}

export default initMap;
