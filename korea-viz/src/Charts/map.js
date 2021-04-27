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
  let mode = "heatmap"

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

    let names = [0,1,2,3,4,5,6,7,8,9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43]
    let linkScale = d3.scaleOrdinal()
          .domain(names)
          .range(["#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", 
          "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", 
          "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", 
          "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", 
          "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", 
          "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", 
          "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", 
          "#989e5d", "#fe9169"]);


    let draw_link = (d) =>{
      
        mapLayer.selectAll("lines")
          .data(data.link)
          .enter()
          .append("line")
          .attr("x1", function(d){
            let p1 = projection([d.origin_lon, d.origin_lat]);
            let p2 = projection([d.dest_lon, d.dest_lat]);
            return p1[0];
          })
          .attr("x2", function(d){
            let p1 = projection([d.origin_lon, d.origin_lat]);
            let p2 = projection([d.dest_lon, d.dest_lat]);
            return p2[0];
          })
          .attr("y1", function(d){
            let p1 = projection([d.origin_lon, d.origin_lat]);
            let p2 = projection([d.dest_lon, d.dest_lat]);
            return p1[1];
          })
          .attr("y2", function(d){
            let p1 = projection([d.origin_lon, d.origin_lat]);
            let p2 = projection([d.dest_lon, d.dest_lat]);
            return p2[1];
          })
          .style("stroke", function(d,i){
            return linkScale(i);
          })
          .attr("stroke-width", function(d){
            return Math.log(Math.round(d.count)*6);
          })
          .on("mouseover", function(d){
            console.log("here")
            d3.select(this)
              .transition()
              .style("stroke", "red")
              .attr("stroke-width", function(d){
                return Math.log(Math.round(d.count)*35);
              });    
          })
          .on("mouseout", function(d,i){
            d3.select(this)
              .interrupt()
              .transition(2500)
              .style("stroke", function(d,i){
            return linkScale(d.index);
          })
              .attr("stroke-width", function(d){
                return Math.log(Math.round(d.count)*6);
              });
            windowLayer.selectAll('text').remove("text");
            windowLayer.selectAll("rect").remove("rect");   
          })
        
          .on("click",function(d){

            var tempData = d3.select(this).data()[0];

            // console.log(d3.select(this).data()[0].origin_name);

            windowLayer
              .append("rect")
              .attr("fill", "white")
              .attr('stroke', 'black')
              .attr('stroke-width', '2px')
              .attr('x',projection([tempData.origin_lon, tempData.origin_lat])[0]-150)
              .attr('y', projection([tempData.origin_lon, tempData.origin_lat])[1]-300)
              .attr('width', 250)
              .attr('height', 150)
              .attr("fill-opacity", "80%");
              

            windowLayer.append("text")
              .text("Origin: " + tempData.origin_name)
              .attr('fill', 'black')
              .style('stroke', 'transparent')
              .attr('x',projection([tempData.origin_lon, tempData.origin_lat])[0]-140)
              .attr('y', projection([tempData.origin_lon, tempData.origin_lat])[1]-250)
              // .attr("text-anchor","middle")
              .attr('font-size','14px');


            windowLayer.append("text")
              .text("Destination: " + tempData.dest_name)
              .attr('fill', 'black')
              .style('stroke', 'transparent')
              .attr('x',projection([tempData.origin_lon, tempData.origin_lat])[0]-140)
              .attr('y', projection([tempData.origin_lon, tempData.origin_lat])[1]-230)
              // .attr("text-anchor","middle")
              .attr('font-size','14px');
            windowLayer.append("text")
              .text("Count: " + Math.round(tempData.count) + " infections")
              .attr('fill', 'black')
              .style('stroke', 'transparent')
              .attr('x',projection([tempData.origin_lon, tempData.origin_lat])[0]-140)
              .attr('y', projection([tempData.origin_lon, tempData.origin_lat])[1]-210)
              // .attr("text-anchor","middle")
              .attr('font-size','14px');
            windowLayer.append("text")
              .text("DETAILS")
              .attr('fill', 'black')
              .attr('x',projection([tempData.origin_lon, tempData.origin_lat])[0]-70)
              .attr('y', projection([tempData.origin_lon, tempData.origin_lat])[1]-270)
              // .attr("text-anchor","middle")
              .attr('font-size','14px');

          });
    };
      
     //event listeners
     let mouseover_line = (d, e) => {
       console.log("kkkk")
      d3.select(d.target).style("stroke", "red")
      .attr("stroke-width", function(e){
        return Math.log(Math.round(e.count)*35);
      });  
      Tooltip
        .style("opacity", 1);
    }
    let mouseout_line = (d, e) => {
      // Reset province color
      d3.select(d.target).style("stroke", function(e){
        return linkScale(e.index);
      }).attr("stroke-width", function(e){
            return Math.log(Math.round(e.count)*6);
          });
      Tooltip
        .style("opacity", 0);
    }
    let mousemove_line = (d, e) => {
      Tooltip
        .html(`<b>$Count:</b><br>Confirmed cases: ${Math.round(e.count)}`)
        .style("left", (d.pageX+5) + "px")
        .style("top", (d.pageY+5) + "px")
    }


  
   
    //event listeners
    let mouseover_path = (d) => {
      console.log('kkaa')
      // Highlight hovered province
      // d3.select(this).style('transition', 'opacity 0.2s stroke-width 0s');
      d3.select(d.target).style('opacity', 0.5);
      d3.select(d.target).style("stroke-width", 3);
      Tooltip
        .style("opacity", 1);
    }
    let mouseout_path = (d) => {
      // Reset province color
      d3.select(d.target).style('opacity', 1);
      d3.select(d.target).style("stroke-width", 1);
      Tooltip
        .style("opacity", 0);
    }

    let mousemove_path = (d, e) => {
      Tooltip
        .html(`<b>${e.properties.name_eng}:</b><br>Confirmed cases: ${scaledHeatFill(e)}`)
        .style("left", (d.pageX+5) + "px")
        .style("top", (d.pageY+5) + "px")
    }

  let features = data.geoJson.default.features;


  

  //bind event listeners
  mapLayer.selectAll('path')
      .data(features)
      .enter().append('path')
      .attr('d', path)
      .attr('vector-effect', 'non-scaling-stroke')
      .attr("fill", heat_fill)
      .on('mouseover', mouseover_path)
      .on('mouseout', mouseout_path)
      .on('mousemove', mousemove_path);
  
  mapLayer.selectAll('lines')
      .data(data.link)
      .enter().append('line')
      // .attr('d', line)
      .attr('vector-effect', 'non-scaling-stroke')
      .on('mouseover', mouseover_line)
      .on('mouseout', mouseout_line)
      .on('mousemove', mousemove_line);
  


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
  draw_link()

  //PUT ALL CODE THAT SHOULD BE RUN ON DRAW, UNDRAW IN HERE
  let toggle = () => {
    if(visible){
          mapLayer.selectAll('path').on('mouseover', null)
                  .on('mouseout', null)
                  .on('mousemove', null);
          mapLayer.selectAll('lines').on('mouseover', null)
                  .on('mouseout', null)
                  .on('mousemove', null);
      }else{
        mapLayer.selectAll('path')
                  .on('mouseover_path', mouseover_path)
                  .on('mouseout_path', mouseout_path)
                  .on('mousemove_path', mousemove_path);
        mapLayer.selectAll('lines')
                  .on('mouseover', mouseover_line)
                  .on('mouseout', mouseout_line)
                  .on('mousemove', mousemove_line);
      }
  }
  return toggle;
}

export default initMap;
