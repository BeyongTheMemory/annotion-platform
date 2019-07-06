import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { notification, List, Select, Button, Modal, Typography, message, Icon } from 'antd';
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
        user_name: "",
        swap: false
    }

    componentDidMount() {
        this.getNext()
    }


    like = (item) => {
        item.action = 0
        this.setState({
            listData: this.state.listData
        });
    }

    onSubmit = () => {
        //set content
        if (typeof (this.state.relation) === "undefined" || this.state.relation == "") {
            notification.open({
                message: 'Error',
                description: 'Please choose the right relation!',
                duration: 4,
            });
            return
        }
        var sure_content = this.state.ent1 + " " + this.state.relation + " " + this.state.ent2

        this.setState({
            modalVisible: true,
            sure_content: sure_content
        });
    }

    modalHandleOk = () => {

        this.setState({
            modalVisible: false,
        });

        this.postFeedback()

    }

    postFeedback = () => {
        const url = "http://172.26.187.188:15000/annotation/send-result";
        let ent1Result = this.state.ent1;
        let ent2Result = this.state.ent2;
        let relationResult = this.state.relation;
        if (this.state.swap) {
            ent1Result = this.state.ent2;
            ent2Result = this.state.ent1;
            relationResult += "|r";
        }else {
            relationResult += "|o";
        }
        const param = {
            ent1: ent1Result,
            ent2: ent2Result,
            label: relationResult,
            user: this.state.user_name
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
                    if (data.status === 0) {
                        message.success("submit success")
                        doc.getNext()
                    } else {
                        message.error(data.status);
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

    getNext = () => {
        if (typeof (this.state.user_name) != "undefined" && this.state.user_name != "") {
            const url = "http://172.26.187.188:15000/annotation/get-example";
            const param = {
                user: this.state.user_name
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
                        if (data.status === 0 || data.status === 1 || data.status === 2) {
                            doc.updateListData(data.data)
                        } else {
                            message.error(data.status);
                        }
                    })
                } else {
                    message.error("network error");
                }
            })
        } else {
            message.error("login first")
            this.setState({
                loginVisible: true,
            })
        }
    }


    updateListData = (responseData) => {
        const listData = [];
        for (var i = 0; i < responseData.contex.length; i++) {
            listData.push({
                pos1: responseData.contex[i].pos1,
                pos2: responseData.contex[i].pos2,
                sentence: responseData.contex[i].sentence
            });
        }
        this.setState({
            listData: listData,
            ent1: responseData.ent1,
            ent2: responseData.ent2,
            relation: responseData.relation,
            swap:false
        })
    }

    handleRelationChange = (value) => {
        this.setState({
            relation: value
        })
    };

    swapClick = () => {
        const ent1 = this.state.ent1
        const ent2 = this.state.ent2
        this.setState({
            ent1: ent2,
            ent2: ent1,
            swap: !this.state.swap
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
                            user_name: name
                        })
                        doc.getNext()
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
                    <Select value={this.state.relation} onChange={(value) => { this.handleRelationChange(value) }} style={{ width: 400 }}>
                        <Option value="nutrition/disease/cause">nutrition/disease/cause</Option>
                        <Option value="nutrition/disease/lack-cause">nutrition/disease/lack-cause</Option>
                        <Option value="nutrition/disease/prevent">nutrition/disease/prevent</Option>
                        <Option value="nutrition/nutrition/promote">nutrition/nutrition/promote</Option>
                        <Option value="nutrition/nutrition/inhibit">nutrition/nutrition/inhibit</Option>
                        <Option value="food/nutrition/contain">food/nutrition/contain</Option>
                        <Option value="food/food/ingredient">food/food/ingredient</Option>
                        <Option value="food/disease/positive-effect">food/disease/positive-effect</Option>
                        <Option value="food/disease/negative-effect">food/disease/negative-effect</Option>
                        <Option value="diet/disease/positive-effect">diet/disease/positive-effect</Option>
                        <Option value="diet/disease/negative-effect">diet/disease/negative-effect</Option>
                    </Select>
                    <Button type="primary">{ent2}</Button><Icon type="swap" onClick={this.swapClick} />
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