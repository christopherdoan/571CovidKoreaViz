import React, { Component } from 'react';

class PreviewTimeSeries extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className="preview-time-series">
              <button onClick={()=>this.props.setMode("timeseries")}>Time Series</button>
          </div>
  }
}

export default PreviewTimeSeries;
