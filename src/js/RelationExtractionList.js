import React, { Component,List } from 'react';
import '../css/AnnotionList.css'
import RelationExtractionItem from './RelationExtractionItem';


const data = [
  '1'
];

class RelationExtractionList extends Component {
  render() {
    return (
      <div className="annotion-list">
        <List
          size="large"
          bordered
          dataSource={data}
          renderItem={item => (<List.Item>
            <RelationExtractionItem />
          </List.Item>)}
        />
      </div>
    );
  }
}

export default RelationExtractionList;