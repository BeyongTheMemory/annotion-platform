import React, { Component } from 'react';
import {List } from 'antd';
import AnnotionItem from './AnnotionItem';
import '../css/AnnotionList.css'
/**
 * 完整列表组件
 */
const data = [
  '1'
];

class AnnotionList extends Component {
  render() {
    return (
      <div className="annotion-list">
        <List
          size="large"
          bordered
          dataSource={data}
          renderItem={item => (<List.Item><AnnotionItem /></List.Item>)}
        />
      </div>
    );
  }
}

export default AnnotionList;