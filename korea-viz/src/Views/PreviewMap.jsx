import React, { Component } from 'react';

class Map extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className="preview-map">
              <button onClick={()=>this.props.setMode("map")}>Map</button>
            </div>
  }
}

export default Map;
