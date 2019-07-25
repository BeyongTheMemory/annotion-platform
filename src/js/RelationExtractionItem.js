import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {notification, List, Select, Button, Modal, Typography, message, Row, Input} from 'antd';
import RelationExtractionText from './RelationExtractionText';
import LoginModel from './LoginModel'
import '../css/REItem.css'

const {Paragraph, Text} = Typography;
const {Option} = Select;

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
        swap: false,
        comment: ""
    }

    componentDidMount() {
        this.getNext()
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

    onClueChange = (index, status) => {
        this.state.listData[index].clueStatus = status
    }

    modalHandleOk = () => {

        this.setState({
            modalVisible: false,
        });

        this.postFeedback()

    }

    postFeedback = () => {
        const url = "http://172.26.187.188:15000/annotation/send-result";
        let relationResult = this.state.relation;
        if (this.state.swap) {
            relationResult += "|r";
        } else {
            relationResult += "|o";
        }
        let clue = []
        for (let i = 0; i < this.state.listData.length; i++) {
            if (this.state.listData[i].clueStatus) {
                clue.push(i)
            }
        }
        const result = {
            label: relationResult,
            user: this.state.user_name,
            comment: this.state.comment,
            clue: clue
        };
        const param = {
            result: result,
            ep_num: this.state.ep_num
        }
        let doc = this;
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
        let listData = [];
        this.setState({
            listData: listData
        });
        for (var i = 0; i < responseData.context.length; i++) {
            listData.push({
                pos1: responseData.context[i].pos1,
                pos2: responseData.context[i].pos2,
                sentence: responseData.context[i].sentence,
                clueStatus: false
            });
        }
        console.log(listData)
        this.setState({
            ent1: responseData.ent1,
            ent2: responseData.ent2,
            relation: responseData.relation,
            ep_num: responseData.ep_num,
            swap: false,
            comment: "",
            listData: listData
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


    handleCommentChange = (value) => {
        this.setState({
            comment: value.target.value
        })
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
        const {modalVisible, loginVisible, sure_content, ent1, ent2} = this.state;
        // const submitBtn = <div style={{
        //     textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
        // }}
        // >
        //     <Button onClick={this.onSubmit}>Submit</Button>
        // </div>


        return (
            <div style={{
                background: '#fff',
                padding: 35,
                minHeight: 500,
                textAlign: 'center',
                width: '100%',
                minWidth: 500,
                lineHeight: '32px',
            }}>
                <div style={{width: '100%'}}>
                    <div style={{display:'inline-block'}}><font size="6"> ID: {this.state.ep_num} </font></div>
                        <Button size='large' style={{backgroundColor: '#faf5d5', fontSize: 30}}>
                            <font color='#4c9bc3'> {ent1}</font>
                        </Button>
                        <Select size='large' value={this.state.relation} onChange={(value) => {
                            this.handleRelationChange(value)
                        }} style={{width: 400,position:'relative',top: '-20px'}}>
                            <Option value="cause"> <font size="6">cause </font></Option>
                            <Option value="lack-cause"><font size="6">lack-cause</font></Option>
                            <Option value="prevent"><font size="6">prevent</font></Option>
                            <Option value="other"><font size="6">other</font></Option>
                        </Select>
                        <Button size='large' style={{backgroundColor: '#faf5d5', fontSize: 30}}>
                            <font color='#ecac41'> {ent2}</font>
                        </Button>
                        <Button style={{marginLeft: 50, backgroundColor: '#faf5d5', fontSize: 30}}
                                onClick={this.onSubmit}
                                size='large'> Submit</Button>
                        {/*<Icon  style={{marginLeft: 20,fontSize: '20px'}}  type="swap" onClick={this.swapClick}/>*/}

                </div>


                <div style={{textAlign: 'left', width: '100%'}}>
                    <List
                        size="large"
                        dataSource={this.state.listData}
                        itemLayout="horizontal"
                        split="false"
                        renderItem={(item, index) => (
                            <List.Item
                            >
                                <List.Item.Meta
                                    description={<RelationExtractionText data={item} index={index}
                                                                         onClueChange={this.onClueChange}/>}/>
                            </List.Item>
                        )}

                    />
                </div>
                <div style={{
                    textAlign: 'left', marginTop: 12, height: 50, lineHeight: '32px', width: '100%'
                }}>
                    <Input
                        className="comment-input"
                        size='large'
                        style={{width: '100%', height: 50, fontSize: 30}}
                        placeholder="Input your comment here..."
                        onChange={(value) => {
                            this.handleCommentChange(value)
                        }}
                        value={this.state.comment}
                    />

                </div>

                <Modal
                    title="Sure?"
                    visible={modalVisible}
                    onOk={this.modalHandleOk}
                    onCancel={this.modalHandleCancel}
                >
                    <div onClick={this.handleChange} dangerouslySetInnerHTML={{__html: sure_content}}></div>
                </Modal>

                <LoginModel visible={loginVisible} onLogin={this.loginRequest.bind(this)}/>


            </div>
        );
    }
}

export default RelationExtractionItem;