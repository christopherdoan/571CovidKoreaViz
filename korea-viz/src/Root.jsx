import React, { Component } from 'react';
import { Layout } from 'antd';

import PreviewMap from './Views/PreviewMap.jsx';
import PreviewTimeSeries from './Views/PreviewTimeSeries.jsx';
import PreviewWordCloud from './Views/PreviewWordCloud.jsx';
import VisOverlay from './VisOverlay.jsx';
import ScrollingText from './ScrollingText.jsx';

import 'antd/dist/antd.css';
import './Root.css';

const { Sider, Content, Footer, Header } = Layout;

class Root extends Component {
  constructor(props) {
    super(props);
    this.setMode = this.setMode.bind(this);
    this.state = {
      mode: undefined
    }
  }
  setMode(mode){
    this.setState({mode: mode});
  }
  render() {
    return <Layout>
              <Header>
                <div className="header">
                  <h1>Overview: The COVID-19 Crisis in South Korea</h1>
                  <h3><em>Doan, C., Liu, Y., Kozlovski, C., Uppal, A.</em></h3>
                </div>
              </Header>
              <Layout className="visualizations">
                <Sider>
                  <PreviewMap setMode={this.setMode}/>
                </Sider>
                <Content>
                  <div className="time-series">
                    <PreviewTimeSeries setMode={this.setMode}/>
                  </div>
                  <div className="word-cloud">
                    <PreviewWordCloud setMode={this.setMode} />
                  </div>
                </Content>
              </Layout>
              <Footer>
                <ScrollingText />
              </Footer>
              <VisOverlay mode={this.state.mode} setMode={this.setMode}/>
            </Layout>;
  }
}

export default Root;
