import React, { Component } from 'react';
import * as d3 from 'd3';
import autoBind from 'react-autobind';

import { legendColor } from 'd3-svg-legend';

import initMap from './Charts/map.js';
import initTimeSeries from './Charts/timeseries.js';

import './VisOverlay.css';

import data from './Data';

class VisOverlay extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {mode: props.mode};
  }
  componentDidMount(){
    // this.toggleMap = init(data);
    setTimeout( () => {this.toggleMap = initMap(data.map)}, 50);
    setTimeout( () => {this.toggleTimeSeries = initTimeSeries(data.timeseries)}, 50);
  }
  static getDerivedStateFromProps(next_props, prev_state){
    if(next_props.mode !== prev_state.mode){
      return {mode: next_props.mode}
    }
    return null;
  }
  handleClick(event){
    if(event.target === this.overlay){ //capture click on background of vis-overlay
      // d3.select('.vis-overlay > *').remove();
      if(this.state.mode === "map"){
        this.toggleMap();
      }else if(this.state.mode === "timeseries"){

      }
      this.props.setMode(undefined);
    }
    // if(event.target)
  }
  render() {
    // if(this.state.mode){
    //   this.draw(this.state.mode);
    // }
    console.log(this.state.mode);
    return <div className="vis-overlay" onClick={this.handleClick} ref={overlay => this.overlay = overlay} style={{
      pointerEvents: this.state.mode ? "all" : "none",
      backdropFilter: this.state.mode ? "blur(2px)" : "blur(0px)",
      opacity: this.state.mode ? 1 : 0,
    }}>
        <div className="map-viz" style={{
            opacity: this.state.mode === "map" ? 1 : 0,
            pointerEvents: this.state.mode === "map" ? "all" : "none"
              }}>
            <svg id="map"></svg>
            <div className="map-nav">
              <button>On</button>
              <button>Off</button>
            </div>
        </div>
        <div style={{
            opacity: this.state.mode === "timeseries" ? 1 : 0,
            pointerEvents: this.state.mode === "timeseries" ? "all" : "none"
              }}>
          <svg id="time" ></svg> 
          {/*
          <form action="" >
            <p>Covid Trends by:</p>
            <input type="radio" id="confirmed" name="val" value="Confirmed" checked />
            <label for="confirmed">Confirmed</label><br/>
            <input type="radio" id="deceased" name="val" value="Deceased" />
            <label for="deceased">Deceased</label><br/>

            <br/>
            <p>Sex:</p>
            <input type="radio" id="all" name="sex" value="all" checked />
            <label for="all">All</label><br/>
            <input type="radio" id="male" name="sex" value="Male" />
            <label for="male">Male</label><br/>
            <input type="radio" id="female" name="sex" value="Female" />
            <label for="female">Female</label><br/>

            <br/>
            <p>Age Group:</p>
            <input type="checkbox" id="selectAll" name="selectAll" value="selectAll" checked />
            <label for="selectAll">All</label><br/>
            <input type="checkbox" id="0s" name="checkbox0" value="0s" checked />
            <label for="0s">0s</label><br/>
            <input type="checkbox" id="10s" name="checkbox1" value="10s" checked />
            <label for="10s">10s</label><br/>
            <input type="checkbox" id="20s" name="checkbox2" value="20s" checked />
            <label for="20s">20s</label><br/>
            <input type="checkbox" id="30s" name="checkbox3" value="30s" checked />
            <label for="30s">30s</label><br/>
            <input type="checkbox" id="40s" name="checkbox4" value="40s" checked />
            <label for="40s">40s</label><br/>
            <input type="checkbox" id="50s" name="checkbox5" value="50s" checked />
            <label for="50s">50s</label><br/>
            <input type="checkbox" id="60s" name="checkbox6" value="60s" checked />
            <label for="60s">60s</label><br/>
            <input type="checkbox" id="70s" name="checkbox7" value="70s" checked />
            <label for="70s">70s</label><br/>
            <input type="checkbox" id="80s" name="checkbox8" value="80s" checked />
            <label for="80s">80s</label><br/>
            
          </form> */}
        </div>
          <svg id="word" style={{
            opacity: this.state.mode === "word" ? 1 : 0,
            pointerEvents: this.state.mode === "word" ? "all" : "none"
          }}></svg>
        </div>
  }
}

export default VisOverlay;
