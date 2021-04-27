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
    this.state = {mode: props.mode, checked: [true, true, true, true, true, true, true, true, true, true]}; //order of checked: All, 0s, 10s... 80s
  }
  componentDidMount(){
    // this.toggleMap = init(data);
    setTimeout( () => {this.toggleMap = initMap(data.map)}, 50);
    setTimeout( () => {
      let timeHandlers = initTimeSeries(data.timeseries);
      // this.toggleTimeSeries = timeHandlers[0];
      this.updateBins = timeHandlers;
    }, 50);
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
  
  onChange1(e) {
    console.log(e.target.value);
    console.log(e.target.valueAsNumber);
  }
  selectAll(e) {
    let tempChecked = [!this.state.checked[0]];
    if(this.state.checked[0]){
      for(let i = 0; i < 9; i++){
        tempChecked.push(false);
      }
    }else{
      for(let i = 0; i < 9; i++){
        tempChecked.push(true);
      }
    }
    this.updateBins(tempChecked.slice(1, tempChecked.length));
    this.setState({checked: tempChecked});
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
     
        <div className={`time-viz ${this.state.mode === "timeseries" ? 'active' : ''}`} >
          <svg id="time" ></svg>

          <form action="" >
            <p>Covid Trends by:</p>
            <input type="radio" id="confirmed" name="val" value="Confirmed" checked />
            <label for="confirmed">Confirmed</label><br/>
            <input type="radio" id="deceased" name="val" value="Deceased" />
            <label for="deceased">Deceased</label><br/>

            <br/>
            <p>Sex:</p>
            <input type="radio" id="all" name="sex" value="all" />
            <label for="all">All</label><br/>
            <input type="radio" id="male" name="sex" value="Male" />
            <label for="male">Male</label><br/>
            <input type="radio" id="female" name="sex" value="Female" />
            <label for="female">Female</label><br/>

            <br/>
            <p>Age Group:</p>
            <input id="typeinp" type="range" min="0" max="5" defaultValue="3" step="0" onChange={this.onChange1}/>
            <input type="checkbox" id="selectAll" name="selectAll" value="selectAll" checked={this.state.checked[0]} onChange={this.selectAll} />
            <label for="selectAll">All</label><br/>
            {
              this.state.checked.slice(1, this.state.checked.length).map((e, i) => {
                return (
                      <div className="age-checkbox">
                        <input type="checkbox" id={`${i}s`} name={`checkbox${i}`} value={`${i}s`} checked={e} onChange={()=>{
                          let tempChecked = this.state.checked;
                          tempChecked[i+1] = !tempChecked[i+1];
                          this.updateBins(tempChecked.slice(1, tempChecked.length));
                          this.setState({checked: tempChecked});
                        }} />
                        <label for={`${i}s`}>{`${i}s`}</label><br/>
                      </div>
                    );
              })
            }
            {/*<input type="checkbox" id="0s" name="checkbox0" value="0s" checked />
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
            <label for="80s">80s</label><br/>*/}

          </form>
        </div>
          <svg id="word" style={{
            opacity: this.state.mode === "word" ? 1 : 0,
            pointerEvents: this.state.mode === "word" ? "all" : "none"
          }}></svg>
        </div>
  
  

        }
      }
export default VisOverlay;
        
      
