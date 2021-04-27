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
    setTimeout( () => {this.toggleMap = initMap(data.map)}, 500);
    setTimeout( () => {this.toggleTimeSeries = initTimeSeries(data.timeseries)}, 500);
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
  select(target){
    if (target === "linkmap") {
      this.toggleLinkMap()
    }
    else if (target ==="heatmap"){
      this.toggleMap()
    }
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
        
            
            <svg id="map" className="map"></svg>
            
        </div>

          <svg id="time" style={{
            opacity: this.state.mode === "timeseries" ? 1 : 0,
            pointerEvents: this.state.mode === "timeseries" ? "all" : "none"
          }}></svg>
          <svg id="word" style={{
            opacity: this.state.mode === "word" ? 1 : 0,
            pointerEvents: this.state.mode === "word" ? "all" : "none"
          }}></svg>
        </div>
  }
}

export default VisOverlay;
