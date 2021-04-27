import React, { Component } from 'react';

class PreviewWordCloud extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className="preview-wordcloud" onClick={()=>this.props.setMode("wordcloud")} >
                <svg width="1000" height="600">
                  <g transform="translate(480,280)">
                    <text text-anchor="middle" transform="translate(117,39)rotate(30)" style={{
                      fontSize: "114px",
                      fontFamily: "serif",
                      fill: "rgb(31, 119, 180)"
                    }}>quarantine</text>
                    <text text-anchor="middle" transform="translate(-38,-123)rotate(0)" style={{
                      fontSize: '97px',
                      fontFamily: 'serif',
                      fill: 'rgb(255, 127, 14)'
                    }}>coronavirus</text>
                    <text text-anchor="middle" transform="translate(-173,15)rotate(0)" style={{
                      fontSize: '93px',
                      fontFamily: 'serif',
                      fill: 'rgb(44, 160, 44)'
                    }}>pandemic</text>
                    <text text-anchor="middle" transform="translate(-279,-123)rotate(-90)" style={{
                      fontSize: '83px',
                      fontFamily: 'serif',
                      fill: 'rgb(214, 39, 40)'
                      }}>mask</text>
                    <text text-anchor="middle" transform="translate(61,99)rotate(60)" style={{
                      fontSize: '45px',
                      fontFamily: 'serif',
                      fill: 'rgb(148, 103, 189)'
                      }}>pneumonia</text>
                    <text text-anchor="middle" transform="translate(-181,-63)rotate(60)" style={{
                      fontSize: '45px',
                      fontFamily: 'serif',
                      fill: 'rgb(140, 86, 75)'
                      }}>cold</text>
                    <text text-anchor="middle" transform="translate(-134,78)rotate(-30)" style={{
                      fontSize: '28px',
                      fontFamily: 'serif',
                      fill: 'rgb(227, 119, 194)'
                      }}>flu</text>
                    <text text-anchor="middle" transform="translate(114,86)rotate(30)" style={{
                      fontSize: '15px',
                      fontFamily: 'serif',
                      fill: "rgb(127, 127, 127)"
                    }}>wuhan</text>
                  </g>
                </svg>

            </div>
  }
}

export default PreviewWordCloud;
