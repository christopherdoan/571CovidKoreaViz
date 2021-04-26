import * as d3 from 'd3';

import tpData from './time_province.csv';
import tsDataConfirmed from './ConfirmedData.csv';
import tsDataDeceased from './DeceasedData.csv';
import * as geoJson from './skorea-provinces-2018-geo.json';

const data = {
  map: {
    confirmCountByProvince: {

    },
    geoJson: geoJson,
    maxConfirmCount: -1
  },
  timeseries: {
    confirmedData:{

    },
    deceasedData:{

    }
  }
};

d3.csv(tpData, function(d) {
  data.map.confirmCountByProvince[d.province] = Object.fromEntries(Object.entries(d).map(i => [i[0], isNaN(i[1]) ? i[1] : parseFloat(i[1])]));
  data.map.maxConfirmCount = Math.max(d.confirmed, data.map.maxConfirmCount)
});

// TS code
var rowConverter = function(d) {
  return {
    date : d3.timeParse("%Y-%m-%d")(d.date),
    total: parseInt(d.total),
    male: parseInt(d.male),
    female: parseInt(d.female),
    age_0: parseInt(d.age_0),
    age_10: parseInt(d.age_10),
    age_20: parseInt(d.age_20),
    age_30: parseInt(d.age_30),
    age_40: parseInt(d.age_40),
    age_50: parseInt(d.age_50),
    age_60: parseInt(d.age_60),
    age_70: parseInt(d.age_70),
    age_80: parseInt(d.age_80),
    curr_value: 0
  };
};
let count = 0;
d3.csv(tsDataConfirmed, rowConverter, function(d) {
  data.timeseries.confirmedData[count] = rowConverter(d);
  count += 1;
});
count = 0;
d3.csv(tsDataDeceased, rowConverter, function(d) {
  data.timeseries.deceasedData[count] = rowConverter(d);
  count += 1;
});


export default data;
