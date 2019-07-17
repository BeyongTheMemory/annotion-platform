import React, { Component } from 'react';
import '../css/App.css';
import AnnotionList from './AnnotionList';
import { Layout} from 'antd';
import imgURL from '../img/bg.jpeg';

const { Header, Content, Footer } = Layout;


class EntityRecognition extends Component {
  render() {
    return (
      <Layout className="layout">
      <img src={imgURL} />
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280,textAlign: 'center', width: '100%'}}><AnnotionList style={{textAlign: 'center' }}/></div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Annotion Platform ©2019 Created by Hong Ying
      </Footer>
    </Layout>
    );
  }
}

export default EntityRecognition;