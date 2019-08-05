import React, {Component} from 'react';
import {AutoComplete, Col, Modal, Row, Typography} from 'antd';
import '../css/EntityItem.css'

const {Title} = Typography;

/**
 * 实体item详情数据
 */
class NEREntityItem extends Component {

    render() {
        let trueEntity;
        let trueCategory;
        {
            if (this.props.data.action != 0 && this.props.data.err_data.length > 0){
                for (let errorReason of this.props.data.err_data ){
                    if(errorReason.submit !== true){
                        continue
                    }
                    if (errorReason.type == 1) {
                        trueEntity =  <font color="red" size="4">({errorReason.entity_name})</font>
                    }
                    if (errorReason.type == 2) {
                        trueCategory =  <font color="red" size="4">({errorReason.category_name})</font>
                    }
                }
            }
        }


        return (
            <div style={{textAlign: 'left'}}>
                <strong>
                    <font size="3">   {this.props.data.id}   </font>
                    <font color="pink" size="4">{this.props.data.entity}</font>
                    {trueEntity}
                    <font size="4"> is an instance of </font>
                    <font color="pink" size="4">{this.props.data.category}</font>
                    {trueCategory}
                </strong>
            </div>
        );
    }
}

export default NEREntityItem;