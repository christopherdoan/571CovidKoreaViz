import * as d3 from 'd3';

import tpData from './time_province.csv';
import * as geoJson from './skorea-provinces-2018-geo.json';
import link from './link.csv'

const data = {
  map: {
    confirmCountByProvince: {

    },
    link: [],
    geoJson: geoJson,
    maxConfirmCount: -1
  },
  timeseries: {
    
  }
};

d3.csv(tpData, function(d) {
  data.map.confirmCountByProvince[d.province] = Object.fromEntries(Object.entries(d).map(i => [i[0], isNaN(i[1]) ? i[1] : parseFloat(i[1])]));
  data.map.maxConfirmCount = Math.max(d.confirmed, data.map.maxConfirmCount)
});

d3.csv(link, function(d){
  console.log(d);
  data.map.link.push(d)
  console.log(data.map.link);

})


export default data;
