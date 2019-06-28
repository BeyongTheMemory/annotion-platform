import React, { Component } from 'react';
import '../css/App.css';
import RelationExtractionItem from './RelationExtractionItem';
import { Layout} from 'antd';

const { Header, Content, Footer } = Layout;

class RelationExtraction extends Component{
    render() {
        return (
          <Layout className="layout">
          <Header>
                <h2>Annotion Platform</h2>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <div style={{ background: '#fff', padding: 24, minHeight: 280,textAlign: 'center', width: '100%'}}><RelationExtractionItem style={{textAlign: 'center' }}/></div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Annotion Platform ©2019 Created by Hong Ying
          </Footer>
        </Layout>
        );
      }
}

export default RelationExtraction;