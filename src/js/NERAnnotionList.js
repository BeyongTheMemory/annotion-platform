import React, { Component } from 'react';
import {List } from 'antd';
import NERAnnotionItem from './NERAnnotionItem';
import '../css/AnnotionList.css'
/**
 * 完整列表组件
 */
const data = [
  '1'
];

class NERAnnotionList extends Component {
  render() {
    return (
      <div className="annotion-list">
        <List
          size="large"
          bordered
          dataSource={data}
          renderItem={item => (<List.Item><NERAnnotionItem /></List.Item>)}
        />
      </div>
    );
  }
}

export default NERAnnotionList;