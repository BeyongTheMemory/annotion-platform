import React, { Component } from 'react';
import '../css/AnnotionList.css'
import RelationExtractionItem from './RelationExtractionItem';


class RelationExtractionList extends Component {
  render() {
    return (
      <div className="annotion-list">
        <RelationExtractionItem />
      </div>
    );
  }
}

export default RelationExtractionList;