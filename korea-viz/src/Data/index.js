import * as d3 from 'd3';

import tpData from './time_province.csv';
import tsDataConfirmed from './ConfirmedData.csv';
import tsDataDeceased from './DeceasedData.csv';
import * as geoJson from './skorea-provinces-2018-geo.json';
import link from './link.csv';
import wcTotal from './wordcounts_total.csv';
import wcNovember from './wordcounts_November.csv';
import wcDecember from './wordcounts_December.csv';
import wcJanuary from './wordcounts_January.csv';
import wcFebruary from './wordcounts_February.csv';
import wcMarch from './wordcounts_March.csv';
import wcApril from './wordcounts_April.csv';
import wcMay from './wordcounts_May.csv';
import wcJune from './wordcounts_June.csv';
import wcJuly from './wordcounts_July.csv';

const data = {
  map: {
    confirmCountByProvince: {

    },
    link: [],
    geoJson: geoJson,
    maxConfirmCount: -1
  },
  timeseries: {
    confirmedData:{

    },
    deceasedData:{

    }
  },
  wordcloud: {

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

//wordcloud code
data.wordcloud.total = [];
d3.csv(wcTotal, function(d){
  data.wordcloud.total.push(d);
});

data.wordcloud.november = [];
d3.csv(wcNovember, function(d){
  data.wordcloud.november.push(d);
});

data.wordcloud.december = [];
d3.csv(wcDecember, function(d){
  data.wordcloud.december.push(d);
});

data.wordcloud.january = [];
d3.csv(wcJanuary, function(d){
  data.wordcloud.january.push(d);
});

data.wordcloud.february = [];
d3.csv(wcFebruary, function(d){
  data.wordcloud.february.push(d);
});

data.wordcloud.march = [];
d3.csv(wcMarch, function(d){
  data.wordcloud.march.push(d);
});

data.wordcloud.april = [];
d3.csv(wcApril, function(d){
  data.wordcloud.april.push(d);
});

data.wordcloud.may = [];
d3.csv(wcMay, function(d){
  data.wordcloud.may.push(d);
});

data.wordcloud.june = [];
d3.csv(wcJune, function(d){
  data.wordcloud.june.push(d);
});

data.wordcloud.july = [];
d3.csv(wcJuly, function(d){
  data.wordcloud.july.push(d);
});


export default data;
