import React, {Component} from 'react';
import {AutoComplete, Col, Modal, Row, Typography} from 'antd';
import '../css/EntityItem.css'

const {Title} = Typography;

/**
 * 实体item详情数据
 */
class NEREntityItem extends Component {

    render() {
        let trueCategory;
        {
            if (this.props.data.action != 0 && this.props.data.errData.length > 0){
                for (let errorReason of this.props.data.errData ){
                    if(errorReason.submit !== true){
                        continue
                    }
                    if (errorReason.type == 2) {
                        trueCategory =  <font color="red" size="4">({errorReason.categoryName})</font>
                    }
                }
            }
        }

        const entityView = this.props.showEntity? <font color='#797d8e' size="4">{this.props.data.entity}</font> :"";

        return (
            <div style={{textAlign: 'left'}}>
                {entityView}
                <strong>
                    <font size="4"> is an instance of </font>
                    <font color="pink" size="4">{this.props.data.category}</font>
                    {trueCategory}
                </strong>
            </div>
        );
    }
}

export default NEREntityItem;