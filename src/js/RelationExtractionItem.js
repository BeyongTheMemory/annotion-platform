import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { notification, List, Select, Button, Modal, Typography, message, Divider } from 'antd';
import RelationExtractionText from './RelationExtractionText';
import LoginModel from './LoginModel'
const { Paragraph, Text } = Typography;
const { Option } = Select;

/**
 * RE条目组件
 */


class RelationExtractionItem extends Component {
    state = {
        listData: [],
        modalVisible: false,
        loginVisible: false,
        sure_content: "",
        user_name: ""
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

    onSubmit = () => {
        //set content
        var sure_content = ""
        for (let item of this.state.listData) {
            if (item.action == null) {
                notification.open({
                    message: 'Error',
                    description: 'mis instance',
                    duration: 2,
                });
                return
            }
            sure_content += "<p>" + 'Result: ' + (item.action == 0) + "</p>"

            if (item.action != 0 && item.err_data.length > 0) {
                sure_content += "<p>"
                for (let errorReason of item.err_data) {
                    if (errorReason.type == 1) {
                        sure_content += "Entity is wrong,correct entity name:" + "<font color=‘red’>" + errorReason.entity_name + "</font>"
                    } else if (errorReason.type == 2) {
                        sure_content += "Category is wrong,correct category name:" + "<font color=‘red’>" + errorReason.category_name + "</font>"
                    }
                }
                sure_content += "</p>"
            }

        }
        this.setState({
            modalVisible: true,
            sure_content: sure_content
        });
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
        const url = "http://127.0.0.1:8888/ap/annotation/feedback";
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
        if (this.state.name != "") {
            //获取数据
            this.updateListData()
        } else {
            message.error("login first")
            this.setState({
                loginVisible: true,
            })
        }
    }


    updateListData = (responseData) => {
        const listData = [];
        for (var i = 0; i < 10; i++) {
            listData.push({
                pos1: [1, 2],
                pos2: [3, 4],
                sentence: "xxxx"
            });
        }
        this.setState({
            listData: listData,
            ent1: "xxx",
            ent2: "xxx"
        })
    }

    showLogin = () => {
        this.setState({
            loginVisible: true,
        });
    }

    loginRequest = (name, password) => {
        const url = "http://127.0.0.1:8888/ap/user/login";
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
                            user_name: name
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

    render() {
        const { listData, modalVisible, loginVisible, sure_content, ent1, ent2 } = this.state;
        const submitBtn = <div style={{
            textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
        }}
        >
            <Button onClick={this.onSubmit}>Submit</Button>
        </div>


        return (
            <div style={{ background: '#fff', padding: 24, minHeight: 280, textAlign: 'center', width: '100%', minWidth: 680 }}>

                <div>
                    <Button type="primary">{ent1}</Button>
                    <Select defaultValue="lucy" style={{ width: 120 }}>
                        <Option value="lucy">1</Option>
                        <Option value="lucy2">2</Option>
                        <Option value="lucy3">3</Option>
                    </Select>
                    <Button type="primary">{ent2}</Button>
                </div>

                <List
                    size="large"
                    dataSource={listData}
                    itemLayout="horizontal"
                    split="false"
                    loadMore={submitBtn}
                    renderItem={item => (
                        <List.Item
                        >
                            <List.Item.Meta
                                description={<RelationExtractionText data={item} />} />
                        </List.Item>
                    )}

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


            </div>
        );
    }
}

export default RelationExtractionItem;