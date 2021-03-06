import React, {Component} from 'react';
import {Icon, List, Typography} from 'antd';
import '../css/EntityItem.css'
import NEREntityItem from './NEREntityItem';
import NEREntityError from "./NEREntityError";

/**
 * 实体item详情数据
 */
class NEREntityList extends Component {

    state = {
        errorDrawerVisible: false,
        currentErrData: [],
        currentItem: null
    };

    like = (item, isEntity) => {
        if (isEntity) {
            this.resetEntity(item)
        } else {
            this.resetCategory(item)
        }
        item.action = 0;
        this.props.refreshList();
    };

    dislike = (item, isEntity) => {
        if (isEntity) {
            this.resetEntity(item)
        } else {
            this.resetCategory(item)
        }
        item.action = 1;
        this.setState({
            errorDrawerVisible: true,
            currentErrData: item.errData,
            currentItem: item,
        });
    };


    delete = (item) => {
        item.action = 2;
        item.errData = [{"id": 0, submit: true, type: "2", categoryName: "Useless"}];
        this.props.refreshList();
    };

    resetEntity = (item) => {
        if (item.action == 2) {
            item.errData = [{"id": 0, submit: true, type: "1", entityName: item.entity}];
            for (let dataItem of item.listData) {
                dataItem.action = -1;
                dataItem.errData = [{"id": 0, submit: false, type: "2"}];
            }
        }
    };

    resetCategory = (item) => {
        if (item.action == 2) {
            item.errData = [{"id": 0, submit: false, type: "2", categoryName: item.categoryName}];
        }
    };

    errEntity = (item) => {
        item.errData = [{"id": 0, submit: true, type: "1", entityName: "Useless"}];
        item.action = 2;
        for (let dataItem of item.listData) {
            dataItem.action = 1;
            dataItem.errData = [{"id": 0, submit: true, type: "1", entityName: "Useless"}];
        }
        this.props.refreshList();
    };

    onErrSubmit = (data) => {
        this.state.currentItem.errData = data;
        this.props.updateEntityData(this.state.currentItem.entity,this.state.currentItem.errData[0].entityName);
        this.setState({
            errorDrawerVisible: false,
        });
    };

    onClose = () => {
        this.setState({
            errorDrawerVisible: false,
        });
    };

    render() {
        const {errorDrawerVisible, currentErrData, currentItem} = this.state;

        let trueEntity;
        {
            if (this.props.data.action != 0 && this.props.data.errData[0].submit) {
                trueEntity = <font color='#c16957' size="4">({this.props.data.errData[0].entityName})</font>
            }
        }
        let urlEntity;
        {
            let url = "https://en.wikipedia.org/wiki/" + this.props.data.entity;
            urlEntity = <a href={url} size="4" target="_blank">{this.props.data.entity}</a>
        }
        return (

            <div style={{textAlign: 'left'}}>


                <strong>
                    <font size="3">   {this.props.data.id}   </font>
                    <font size="4"> {urlEntity}  </font>
                    {trueEntity}
                    <Icon style={{marginLeft: 10, fontSize: '20px'}}
                          type="like" theme={this.props.data.action === 0 ? 'filled' : 'outlined'}
                          onClick={() => {
                              this.like(this.props.data, true)
                          }}/>
                    <Icon style={{marginLeft: 10, fontSize: '20px'}}
                          type="dislike" theme={this.props.data.action === 1 ? 'filled' : 'outlined'}
                          onClick={() => {
                              this.dislike(this.props.data, true)
                          }}/>
                    <Icon style={{marginLeft: 10, fontSize: '20px'}}
                          type="delete" theme={this.props.data.action === 2 ? 'filled' : 'outlined'}
                          onClick={() => {
                              this.errEntity(this.props.data)
                          }}/>
                </strong>

                <List
                    style={{marginTop: 20}}
                    bordered
                    size="large"
                    dataSource={this.props.data.listData}
                    itemLayout="horizontal"
                    split="false"
                    renderItem={(item, index) => (
                        <List.Item
                            actions={this.props.data.action == 2 ? [
                                <Icon style={{fontSize: '20px'}} type="delete" theme={'filled'}/>
                            ] : (item.category.indexOf("Foods") != -1 && item.category.split("/").length < 4) || (item.category.indexOf("Nutrients") != -1 && item.category.split("/").length < 3)? [
                                <Icon style={{fontSize: '20px'}} type="dislike"
                                      theme={item.action === 1 ? 'filled' : 'outlined'}
                                      onClick={() => {
                                          this.dislike(item, false)
                                      }}/>,
                                <Icon style={{fontSize: '20px'}} type="delete"
                                      theme={item.action === 2 ? 'filled' : 'outlined'} onClick={() => {
                                    this.delete(item, false)
                                }}/>

                            ] : [
                                <Icon style={{fontSize: '20px'}} type="like"
                                      theme={item.action === 0 ? 'filled' : 'outlined'}
                                      onClick={() => {
                                          this.like(item)
                                      }}/>,
                                <Icon style={{fontSize: '20px'}} type="dislike"
                                      theme={item.action === 1 ? 'filled' : 'outlined'}
                                      onClick={() => {
                                          this.dislike(item)
                                      }}/>,
                                <Icon style={{fontSize: '20px'}} type="delete"
                                      theme={item.action === 2 ? 'filled' : 'outlined'} onClick={() => {
                                    this.delete(item)
                                }}/>
                            ]}
                        >
                            <List.Item.Meta
                                description={<NEREntityItem data={item} index={index}/>}/>
                        </List.Item>
                    )}

                />

                <NEREntityError onClose={this.onClose} visible={errorDrawerVisible}
                                errData={currentErrData} onSubmit={this.onErrSubmit} onErrAdd={this.onErrAdd}
                                onErrRemove={this.onErrRemove} item={currentItem} text={this.props.text}
                />

            </div>
        );
    }
}

export default NEREntityList;