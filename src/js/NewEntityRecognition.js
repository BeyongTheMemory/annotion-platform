import React, { Component } from 'react';
import NERAnnotionList from './NERAnnotionList';
import {Layout, List} from 'antd';
import imgURL from '../img/bg.jpeg';
import NERAnnotionItem from "./NERAnnotionItem";

const { Header, Content, Footer } = Layout;

const data = [
  '1'
];
class NewEntityRecognition extends Component {
  render() {
    return (
      <Layout className="layout">
      <img src={imgURL} />
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280,textAlign: 'center', width: '100%'}}>
          <List
              size="large"
              bordered
              dataSource={data}
              renderItem={item => (<List.Item><NERAnnotionList style={{textAlign: 'center' }}/></List.Item>)}
          />
          </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Annotation Platform ©2019 Created by Hong Ying
      </Footer>
    </Layout>
    );
  }
}

export default NewEntityRecognition;