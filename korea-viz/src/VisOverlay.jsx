import React, { Component } from 'react';
import * as d3 from 'd3';
import autoBind from 'react-autobind';

import { legendColor } from 'd3-svg-legend';

import init from './Charts/map.js';

import './VisOverlay.css';

import data from './Data';

class VisOverlay extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {mode: props.mode};
  }
  componentDidMount(){
    setTimeout( () => {this.toggleMap = init(data)}, 50);
  }
  static getDerivedStateFromProps(next_props, prev_state){
    if(next_props.mode !== prev_state.mode){
      return {mode: next_props.mode}
    }
    return null;
  }
  handleClick(event){
    console.log(event.target === this.overlay);
    if(event.target === this.overlay){
      // d3.select('.vis-overlay > *').remove();
      this.props.setMode(undefined);
    }
    // if(event.target)
  }
  render() {
    // if(this.state.mode){
    //   this.draw(this.state.mode);
    // }
    return <div className="vis-overlay" onClick={this.handleClick} ref={overlay => this.overlay = overlay} style={{
      pointerEvents: this.state.mode ? "all" : "none",
      backdropFilter: this.state.mode ? "blur(2px)" : "blur(0px)",
      opacity: this.state.mode ? 1 : 0,
    }}>
          <svg id="map"></svg>
          <svg id="time"></svg>
          <svg id="word"></svg>
        </div>
  }
}

export default VisOverlay;
