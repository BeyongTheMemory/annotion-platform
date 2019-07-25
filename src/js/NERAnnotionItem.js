import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {notification, List, Icon, Button, Modal, Typography, message, Row, Divider} from 'antd';
import NEREntityItem from './NEREntityItem';
import NEREntityError from './NEREntityError';
import LoginModel from './LoginModel';
import AddNewMentionModel from './AddNewMentionModel';
const { Text, Title } = Typography;

/**
 * 列表条目组件
 */
class NERAnnotionItem extends Component {
    state = {
        listData: [],
        entityData: [],
        tokenData: [],
        error_drawer_visible: false,
        current_item: null,
        current_err_data: [],
        modalVisible: false,
        addNewMetationModel: false,
        iFrameHeight: '0px',
        loginVisible: false,
        sure_content: "",
        text: "",
        chooseEntity: true,
        addNewTitle: "",
        optionItems: [],
    }

    componentDidMount() {
        this.getNext(0)
    }


    like = (item) => {
        item.action = 0
        this.setState({
            listData: this.state.listData
        });
    }

    dislike = (item) => {
        item.action = 1
        this.setState({
            error_drawer_visible: true,
            current_item: item,
            current_err_data: item.err_data
        });
    }

    deleteRecord = (item, index) => {
        const listData = this.state.listData
        listData.splice(index, 1)
        this.setState({
            listData: this.state.listData
        });
    }

    onClose = () => {
        this.setState({
            error_drawer_visible: false,
        });
    };

    onErrSubmit = (data) => {
        this.state.current_item.err_data = data;
        this.setState({
            error_drawer_visible: false,
        });
    }

    onErrAdd = (data) => {
        if (data.length > 1) {
            notification.open({
                message: 'Error',
                description: 'The reason maximum size is 2',
                duration: 2,
            });
            return;
        }
        data = data.concat({ id: -1 })
        //this.state.current_item.err_data = data
        this.setState({
            current_err_data: data,
        });
    }

    onErrRemove = (data, index) => {
        if (data.length === 1) {
            notification.open({
                message: 'Error',
                description: 'The reason minimum size is 1',
                duration: 2,
            });
            return;
        }
        data.splice(index, 1)
        this.setState({
            current_err_data: data,
        });
    }

    onSubmit = () => {
        //set content
        var sure_content = ""
        for (let item of this.state.listData) {
            if (item.action == null && !item.new_add) {
                notification.open({
                    message: 'Error',
                    description: 'mis instance',
                    duration: 2,
                });
                return
            }

            if (item.new_add) {
                sure_content += "<p>" + 'New Mention: ' + item.entity + "&nbsp&nbsp is an instance of &nbsp&nbsp" + item.category + "</p>"
            } else {
                sure_content += "<p>" + 'Result: ' + (item.action == 0) + "</p>"
                if (item.action != 0 && item.err_data.length > 0) {
                    for (let errorReason of item.err_data) {
                        sure_content += "<p>"
                        if (errorReason.type == 1) {
                            sure_content += "&nbsp&nbsp&nbsp&nbsp Entity is wrong,correct entity name:" + "<font color=orange>" + errorReason.entity_name + "</font>"
                        } else if (errorReason.type == 2) {
                            sure_content += "&nbsp&nbsp&nbsp&nbsp Category is wrong,correct category name:" + "<font color=orange>" + errorReason.category_name + "</font>"
                        }
                        sure_content += "</p>"
                    }
                }
            }
        }
        this.setState({
            modalVisible: true,
            sure_content: sure_content
        });
    }

    onAddNewEntity = () => {
        this.setState({
            chooseEntity: false,
            addNewTitle: "Add new entity",
            optionItems: this.state.tokenData,
            addNewMetationModel: true
        })
    }

    onAddNewCategory = () => {
        this.setState({
            chooseEntity: true,
            addNewTitle: "Add new category",
            optionItems: this.state.entityData,
            addNewMetationModel: true,
        })
    }

    modalHandleOk = () => {
        console.log(this.state.listData)
        var valid = true
        var feedback = []
        var valid = true
        for (let item of this.state.listData) {
            var errorReasons = []
            if (item.err_data.length > 0) {
                for (let errorReason of item.err_data) {
                    if (errorReason.type == 1) {
                        if (errorReason.entity_name == item.entity) {
                            valid = false
                            notification.open({
                                message: 'Error',
                                description: 'Please enter the right entity!',
                                duration: 4,
                            });
                            break
                        }
                        errorReasons.push({
                            "code": errorReason.type,
                            "msg": errorReason.entity_name
                        })
                    } else if (errorReason.type == 2) {
                        errorReasons.push({
                            "code": errorReason.type,
                            "msg": errorReason.category_name
                        })
                    }

                }
            }
            feedback.push({
                "entityCategoryId": item.id,
                "entityCategoryType": 0,
                "isCorrect": item.action == 0,
                "errorReasons": errorReasons
            })
        }

        this.setState({
            modalVisible: false,
        });

        if (valid) {
            console.log(feedback)
            this.postFeedback(feedback)
        }
    }

    postFeedback = (feedback) => {
        const url = "http://172.26.187.188:8888/ap/annotation/feedback";
        const param = {
            userFeedbacks: feedback,
        };
        var doc = this;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(param),
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            },
            credentials: 'include',
        }).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (data) {
                    if (data.code === 200) {
                        message.success("submit success")
                        doc.getNext(0)
                    } else if (data.code === 10001) {
                        message.error("login first")
                        doc.setState({
                            loginVisible: true,
                        })
                    } else {
                        message.error(data.msg);
                    }
                })
            } else {
                message.error("network error");
            }
        })
    }

    modalHandleCancel = () => {
        this.setState({
            modalVisible: false,
        });
    }

    getNext = (type) => {
        // const url = "http://172.26.187.188:8888/ap/annotation/next?type=" + type;
        // var doc = this;
        // fetch(url, {
        //     method: 'GET',
        //     credentials: 'include',
        //     mode: 'cors',
        // }).then((response) => {
        //     if (response.status === 200) {
        //         response.json().then(function (data) {
        //             console.log(data);
        //             if (data.code === 200) {
        //                 doc.updateListData(data.data)
        //             } else if (data.code === 10001) {
        //                 message.error("login first")
        //                 doc.setState({
        //                     loginVisible: true,
        //                 })
        //             } else {
        //                 message.error(data.msg);
        //             }

        //         })
        //     } else {
        //         message.error("network error");
        //     }
        // })

        const listData = [];
        listData.push({
            entity: "cocktail",
            category: "foods/Beverages/Alcoholic_drinks",
            action: null, //0正确 1错误
            err_data: [{ "id": 0 }]
        })
        listData.push({
            entity: "contain",
            category: "foods/Beverages/Alcoholic_drinks",
            action: null, //0正确 1错误
            err_data: [{ "id": 0 }]
        })
        listData.push({
            entity: "sugar",
            category: "foods/Sweets/others",
            action: null, //0正确 1错误
            err_data: [{ "id": 0 }]
        })
        listData.push({
            entity: "citrus",
            category: "foods/Fruits/Citrus_fruits",
            action: null, //0正确 1错误
            err_data: [{ "id": 0 }]
        })
        const entityData = [];
        entityData.push({
            name: "cocktail"
        })
        entityData.push({
            name: "alcohol"
        })
        entityData.push({
            name: "sugar"
        })
        entityData.push({
            name: "citrus"
        })
        const tokenData = [];
        tokenData.push({
            name: "A"
        })
        tokenData.push({
            name: "can"
        })
        tokenData.push({
            name: "contain"
        })
        tokenData.push({
            name: "and"
        })
        const text = "A <font color=orange>cocktail</font> can contain <font color=orange>alcohol</font>  , a <font color=orange>sugar</font> , and a <font color=orange>citrus</font> .";
        this.setState({
            listData: listData,
            entityData: entityData,
            tokenData: tokenData,
            text: text
        })
    }

    updateListData = (responseData) => {
        const listData = [];
        listData.push({
            id: responseData.id,
            entity: responseData.entity,
            entity_url: responseData.wikiUrl,
            relation: responseData.relation,
            category: responseData.category,
            category_url: responseData.wikiUrl,
            action: null, //0正确 1错误
            err_data: [{ "id": 0 }],
        });
        this.setState({
            listData: listData,
        })
    }

    showLogin = () => {
        this.setState({
            loginVisible: true,
        });
    }

    loginRequest = (name, password) => {
        const url = "http://172.26.187.188:8888/ap/user/login";
        const param = {
            name: name,
            password: password
        };
        var doc = this;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(param),
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            },
            credentials: 'include',
        }).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (data) {
                    if (data.code === 200) {
                        doc.setState({
                            loginVisible: false,
                        })
                        doc.getNext(0)
                    } else {
                        message.error(data.msg);
                    }
                })
            } else {
                message.error("network error");
            }
        })
    }

    AddMentionRequest = (entity, category) => {

        const listData = this.state.listData
        listData.push({
            entity: entity,
            category: category,
            action: null, //0正确 1错误
            err_data: [{ "id": 0 }],
            new_add: true
        })
        this.setState({
            listData: listData,
            addNewMetationModel: false,
        })

    }

    MentionCancel = () => {
        this.setState({
            addNewMetationModel: false,
        })
    }

    render() {
        const { listData, error_drawer_visible, current_err_data, modalVisible, loginVisible, current_item, sure_content, addNewMetationModel } = this.state;
        const addBtn = <div style={{
            marginTop: 12, lineHeight: '32px',
        }}
        >
            <Row gutter={16} style={{ textAlign: 'center', padding: 20 }}>
                <Button type="dashed" onClick={this.onAddNewEntity} style={{ width: '30%' }}>
                    <Icon type="plus" /> <strong><font size="4" >Add New Entity</font></strong>
                </Button>
                <Button type="dashed" onClick={this.onAddNewCategory} style={{ width: '30%' }}>
                    <Icon type="plus" /> <strong><font size="4" >Add New Category</font></strong>
                </Button>
            </Row>
            <br />
        </div>

        return (
            <div style={{ background: '#fff', padding: 24, minHeight: 280, textAlign: 'center', width: '100%', minWidth: 680 }}>
                <Typography>
                    <strong><font size="6" >
                        <div style={{ display: "inline" ,float: 'left'}} dangerouslySetInnerHTML={{ __html: this.state.text }}></div>
                        <div style={{ display: "inline" ,float:"right"}}>
                            <Button onClick={this.onSubmit} size='large'> Submit</Button>
                        </div>
                    </font></strong>
                </Typography>

                <Divider style={{ marginTop:10}}/>

                <List
                style={{marginTop:100}}
                    size="large"
                    dataSource={listData}
                    itemLayout="horizontal"
                    split="false"
                    loadMore={addBtn}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={item.new_add ? [<Icon type="delete" onClick={() => { this.deleteRecord(item, index) }} />] : [
                                <Icon type="like" theme={item.action === 0 ? 'filled' : 'outlined'}
                                    onClick={() => { this.like(item) }} />,
                                <Icon type="dislike" theme={item.action === 1 ? 'filled' : 'outlined'}
                                    onClick={() => { this.dislike(item) }} />]}
                        >
                            <List.Item.Meta
                                description={<NEREntityItem data={item} index={index} />} />
                        </List.Item>
                    )}

                />

                <NEREntityError onClose={this.onClose} visible={error_drawer_visible}
                    errData={current_err_data} onSubmit={this.onErrSubmit} onErrAdd={this.onErrAdd} onErrRemove={this.onErrRemove} item={current_item}
                />

                <Modal
                    title="Sure?"
                    visible={modalVisible}
                    onOk={this.modalHandleOk}
                    onCancel={this.modalHandleCancel}
                >
                    <div onClick={this.handleChange} dangerouslySetInnerHTML={{ __html: sure_content }}></div>
                </Modal>

                <LoginModel visible={loginVisible} onLogin={this.loginRequest.bind(this)} />

                <AddNewMentionModel title={this.state.addNewTitle} choose={this.state.chooseEntity} visible={addNewMetationModel} options={this.state.optionItems} onAdd={this.AddMentionRequest.bind(this)} onCancel={this.MentionCancel.bind(this)} />
            </div>
        );
    }
}

export default NERAnnotionItem;