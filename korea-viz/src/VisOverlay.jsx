import React, { Component } from 'react';
import * as d3 from 'd3';
import autoBind from 'react-autobind';

import { legendColor } from 'd3-svg-legend';

import initMap from './Charts/map.js';
import initTimeSeries from './Charts/timeseries.js';
import initWordCloud from './Charts/wordcloud.js';

import './VisOverlay.css';

import data from './Data';

class VisOverlay extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.loadingEllipses = 0;
    this.state = {loading: true, mode: props.mode, mapMode: "heat",
      checked: [
        [true, false],
        [true, false, false],
        [true, true, true, true, true, true, true, true, true, true]//order of checked: All, 0s, 10s... 80s
      ]};
  }
  animateEllipses(){
    if(!this.loadingTxt){
      return;
    }
    this.loadingTxt.innerHTML = `Loading${'.'.repeat(this.loadingEllipses)}`;
    if(this.loadingEllipses === 3){
      this.loadingEllipses = 0;
    }else{
      this.loadingEllipses+=1;
    }
    if(this.state.loading){
      setTimeout(this.animateEllipses, 200);
    }
  }
  componentDidMount(){
    // this.toggleMap = init(data);
    // let interval = setInterval( this.animateEllipses, 150);
    this.animateEllipses();
    setTimeout( () => {
        this.toggleMap = initMap(data.map);
        let timeHandlers = initTimeSeries(data.timeseries);
        this.updateBins = timeHandlers;
        this.toggleWordCloud = initWordCloud(data.wordcloud);
        // clearInterval(interval);
        this.setState({loading: false});
    }, 500);
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
  toggleMapMode(mapMode){
    console.log(mapMode);
    this.setState({mapMode: mapMode});
  }
  onChange1(e) {
    console.log(e.target.value);
    console.log(e.target.valueAsNumber);
  }
  selectAllAge(e) {
    let tempChecked = [!this.state.checked[2][0]];
    let checker = arr => arr.every(Boolean);
    if(checker(this.state.checked[2])){
      for(let i = 0; i < 9; i++){
        tempChecked.push(false);
      }
    }else{
      for(let i = 0; i < 9; i++){
        tempChecked.push(true);
      }
    }
    this.updateBins([this.state.checked[0], this.state.checked[1], tempChecked]);
    this.setState({checked: [this.state.checked[0], this.state.checked[1],tempChecked]});
  }
  selectData(e){
    let tempArr = this.state.checked[0]
    if (tempArr[0]){
      tempArr = [false, true];
    } else {
      tempArr = [true, false];
    }
    this.updateBins([tempArr, this.state.checked[1], this.state.checked[2]]);
    this.setState({checked: [tempArr, this.state.checked[1],this.state.checked[2]]});
  }
  onSexChange(e){
    let tempArr = [false, false, false];
    if (e.target.value === "Male"){
      tempArr = [false, true, false];
    } else if (e.target.value === "Female"){
      tempArr = [false, false, true];
    } else {
      tempArr = [true, false, false];
    }
    this.updateBins([this.state.checked[0], tempArr, this.state.checked[2]]);
    this.setState({checked: [this.state.checked[0], tempArr, this.state.checked[2]]});
  }
  render() {
    // if(this.state.mode){
    //   this.draw(this.state.mode);
    // }
    return <div className={`vis-overlay ${this.state.mode || this.state.loading ? "active" : ""}`} onClick={this.handleClick} ref={overlay => this.overlay = overlay}>
        <div className={`loading-overlay ${this.state.loading ? "active" : ""}`} ref={loadingTxt => this.loadingTxt = loadingTxt}>
          Loading
        </div>
        <div className={`map-viz ${this.state.mode === "map" ? 'active' : ''}`}>


          <svg id="map" className="map"></svg>
          {/*<div class="radio-toolbar2">
                <input type="radio" className="radioBtn2" name="states2" value="total" id = "1"/>
                <label for = "1">
                   Total
                </label>
                <input type="radio" className="radioBtn2" name="states2" value="january" id = "2"/>
                <label for = "2">
                    Jan
                </label>
                <input type="radio" className="radioBtn2" name="states2" value="february" id = "3" />
                <label for = "3">
                   Feb
                </label>
                <input type="radio" className="radioBtn2" name="states2" value="march" id = "4"/>
                <label for = "4">
                    Mar
                </label>
                <input type="radio" className="radioBtn2" name="states2" value="april" id = "5" />
                <label for = "5">
                   Apr
                </label>
                <input type="radio" className="radioBtn2" name="states2" value="may" id = "6"/>
                <label for = "6">
                    May
                </label>
                <input type="radio" className="radioBtn2" name="states2" value="june" id = "7"/>
                <label for = "7">
                    Jun
                </label>
            </div>*/}
          <div class="ratio-toolbar">
                <input type="checkbox" className="mapBtn" name="states" value="heat" id = "1" checked={this.state.mapMode === "heat"} onChange={(e)=>{this.toggleMap(e, this.toggleMapMode)}}/>
                <label for = "1">
                  Heat Map
                </label>
                <input type="checkbox" className="mapBtn" name="states" value="link" id = "2" checked={this.state.mapMode === "link"} onChange={(e)=>{this.toggleMap(e, this.toggleMapMode)}}/>
                <label for = "2">
                  Contact Tracing
                </label>
            </div>
        </div>

        <div className={`time-viz ${this.state.mode === "timeseries" ? 'active' : ''}`} >
          <svg id="timeGraph"></svg>
          <div id="tsForm">
          <form action="">
            <p>Covid Trends by:</p>
            <input type="radio" id="confirmed" name="val" value="Confirmed" checked={this.state.checked[0][0]} onChange={this.selectData} />
            <label for="confirmed">Confirmed</label>
            <input type="radio" id="deceased" name="val" value="Deceased" checked={this.state.checked[0][1]} onChange={this.selectData} />
            <label for="deceased">Deceased</label>

            <br/>
            <br/>

            <p>Sex:</p>

              <input type="radio" id="all" name="sex" value="all" checked={this.state.checked[1][0]} onChange={this.onSexChange}/>
              <label for="all">All</label>
              <input type="radio" id="male" name="sex" value="Male" checked={this.state.checked[1][1]} onChange={this.onSexChange} />
              <label for="male">Male</label>
              <input type="radio" id="female" name="sex" value="Female" checked={this.state.checked[1][2]} onChange={this.onSexChange}/>
              <label for="female">Female</label>


            <br/>
            <br/>

            <p>Age Group:</p>
            <input type="checkbox" id="selectAll" name="selectAll" value="selectAll" checked={this.state.checked[2][0]} onChange={this.selectAllAge} />
            <label for="selectAll">All</label><br/>
            {
              this.state.checked[2].slice(0, this.state.checked[2].length-1).map((e, i) => {
                return (
                      <div className="age-checkbox">
                        <input type="checkbox" id={`${i}s`} name={`checkbox${i}`} value={`${i}s`} checked={this.state.checked[2][i+1]} onChange={()=>{

                          let tempChecked = this.state.checked[2];
                          tempChecked[i+1] = !tempChecked[i+1];
                          this.updateBins([this.state.checked[0], this.state.checked[1], tempChecked]);
                          this.setState({checked: [this.state.checked[0], this.state.checked[1],tempChecked]});
                        }} />
                        <label for={`${i}s`}>{`${i}0s`}</label><br/>
                      </div>
                    );
              })
            }
          </form>
          </div>
        </div>
          <div className={`wordcloud-viz ${this.state.mode === "wordcloud" ? 'active' : ''}`}>
            <svg width="1000" height="50" id="title"></svg>
            <div id= "template"><svg width="1000" height="600" id="cloud"></svg></div>
            <svg width="1000" height="80" id="slide"></svg>
            <div class="radio-toolbar">
                <input type="radio" className="radioBtn" name="states" value="set1" id = "1" checked="checked"/>
                <label for = "1">
                    Word Cloud
                </label>
                <input type="radio" className="radioBtn" name="states" value="set2" id = "2"/>
                <label for = "2">
                    Lollipop Chart
                </label>
                <button className="total">Show total</button>
            </div>
          </div>
        </div>



        }
      }
export default VisOverlay;
