import React, { Component } from 'react';
import { Layout } from 'antd';

import 'antd/dist/antd.css';

import './Root.css';

const { Sider, Content, Footer, Header } = Layout;

class Root extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <Layout>
              <Header>Overview: The COVID-19 Crisis in South Korea</Header>
              <Layout>
                <Sider>left sidebar</Sider>
                <Content>main content</Content>
                <Sider>right sidebar</Sider>
              </Layout>
              <Footer>footer</Footer>
            </Layout>;
  }
}

export default Root;
