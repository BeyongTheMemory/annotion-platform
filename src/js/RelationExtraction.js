import React, {Component} from 'react';
import '../css/App.css';
import RelationExtractionItem from './RelationExtractionItem';
import { Layout,List} from 'antd';
import imgURL from '../img/bg.jpeg';

const { Header, Content, Footer } = Layout;

const data = [
    '1'
];


class RelationExtraction extends Component{
    render() {
        return (
          <Layout className="layout">
          <img src={imgURL} />
          <Content style={{ padding: '0 50px' }}>
            <div style={{ background: '#fff', padding: 24, minHeight: 280,textAlign: 'center', width: '100%'}}>
                <List
                    style={{textAlign: 'center' }}
                    size="large"
                    bordered
                    dataSource={data}
                    renderItem={item => (<List.Item>
                        <RelationExtractionItem />
                    </List.Item>)}
                />
                </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Annotation Platform ©2019 Created by NExT++
          </Footer>
        </Layout>
        );
      }
}

export default RelationExtraction;