import React, { Component } from 'react';
import { Button } from 'antd';
import '../css/EntityItem.css'
/**
 * 实体item详情数据
 */
class EntityItem extends Component {
    onEntityBtnClick = () => {
        window.open(this.props.data.entity_url);
    }

    onCategoryBtnClick = () => {
        window.open(this.props.data.category_url);
    }

    render() {
        return (
            <div >
                <Button type="primary" size="large" onClick={this.onEntityBtnClick}>{this.props.data.entity}</Button>
                <Button type="danger" className="argin-left-10" size="large" disabled>{this.props.data.relation === 0 ? 'is instance of' : 'unknown'}</Button>
                <Button type="primary" className="argin-left-10" size="large" onClick={this.onCategoryBtnClick}>{this.props.data.category}</Button>
            </div>
        );
    }
}

export default EntityItem;