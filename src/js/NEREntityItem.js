import React, { Component } from 'react';
import { Typography } from 'antd';
import '../css/EntityItem.css'
const { Title } = Typography;

/**
 * 实体item详情数据
 */
class NEREntityItem extends Component {

    render() {
        return (
            <div style={{textAlign: 'left'}}>
                <strong>
                    <font size="3" >   {this.props.index}   </font>
                    <font color="pink" size="4" >{this.props.data.entity}</font>
                    <font size="4" >   is an instance of   </font>
                    <font color="pink" size="4">{this.props.data.category}</font>
                </strong>
            </div>
        );
    }
}

export default NEREntityItem;