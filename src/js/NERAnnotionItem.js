import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {notification, List, Icon, Button, Modal, Typography, message, Row, Divider} from 'antd';
import NEREntityItem from './NEREntityItem';
import NEREntityError from './NEREntityError';
import LoginModel from './LoginModel';
import AddNewMentionModel from './AddNewMentionModel';

const {Text, Title} = Typography;

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
        textOrg: [],
        id: -1
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
        data = data.concat({id: -1})
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
                sure_content += "<p>" + "<font color='pink' size='4'>" + item.entity + "</font>" + "&nbsp&nbsp is an instance of &nbsp&nbsp" + "<font color='pink' size='4'>" + item.category + "</font>" + ":" + "<font color='red' size='4'>" + (item.action == 0) + "</font>" + "</p>"
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
        console.log(this.state.listData);
        let valid = true;
        let feedback = [];
        let lineNumber = 1;
        for (let item of this.state.listData) {
            let errorReasons = [];
            if (item.err_data.length > 0) {
                for (let errorReason of item.err_data) {
                    if (errorReason.type === 1) {
                        if (errorReason.entity_name === item.entity) {
                            valid = false;
                            notification.open({
                                message: 'Error',
                                description: 'Please enter the right entity!',
                                duration: 4,
                            });
                            return;
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
                    }else {
                        valid = false;
                        notification.open({
                            message: 'Error',
                            description: 'The erro reason is empty in triple ' + lineNumber + '!',
                            duration: 4,
                        });
                        return;
                    }
                    lineNumber++;
                }
            }
            feedback.push({
                "entityCategoryId": item.id,
                "origCategory": item.category,
                "origEntity": item.entity,
                "isCorrect": item.action == 0,
                "errorReasons": errorReasons,
                "isNew": item.new_add
            })
        }


        this.setState({
            modalVisible: false,
        });

        if (valid) {
            this.postFeedback(feedback)
        }
    }

    postFeedback = (feedback) => {
        const url = "http://54.169.250.197:8888/ap/sentence/feedback";
        console.log(this.state)
        const param = {
            sentenceId: this.state.id,
            reason: JSON.stringify(feedback)
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
                        doc.getNext()
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

    getNext = () => {
        const url = "http://54.169.250.197:8888/ap/sentence/next";
        var doc = this;
        fetch(url, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        }).then((response) => {
            if (response.status === 200) {
                response.json().then(function (data) {
                    console.log(data);
                    if (data.code === 200) {
                        doc.updateListData(JSON.parse(data.data.content))
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

    updateListData = (responseData) => {
        console.log(responseData)
        let mentionMap = new Map();
        let listData = [];
        let entityData = [];
        for (let i = 0; i < responseData.mentions.length; i++) {
            let newMention = responseData.mentions[i];
            let oldMention = mentionMap.get(newMention.start);
            if (oldMention == null) {
                mentionMap.set(newMention.start, newMention);
            } else if (oldMention.end < newMention.end) {
                mentionMap.set(newMention.start, newMention);
            }
            let entity = responseData.tokens.slice(newMention.start, newMention.end);
            let entityName = "";
            for (let nameItem of entity) {
                entityName += nameItem + " "
            }
            if (entityName !== "," && entityName !== "." && entityName !== "(" && entityName !== ")") {
                entityData.push({
                    name: entityName
                });
            }

            let types = newMention.types;
            for (let j = 0; j < types.length; j++) {
                listData.push({
                    id: newMention.mention_id,
                    entity: entityName,
                    category: types[j],
                    action: null, //0正确 1错误
                    err_data: [{"id": 0}]
                })
            }
        }

        let entitySet = new Set(entityData);
        let tokenDataList = Array.from(new Set(responseData.tokens.concat(entityData).filter(v => !entitySet.has(v))));
        let tokenData = [];
        for (let tokenWord of tokenDataList) {
            if (tokenWord !== "," && tokenWord !== ".") {
                tokenData.push({
                    name: tokenWord
                });
            }
        }


        let mention = null;
        let text = "";
        let textOrg = new Set();
        for (let i = 0; i < responseData.tokens.length; i++) {
            if (mention == null && mentionMap.get(i) != null) {
                mention = mentionMap.get(i)
                text += "<font color=#4c9bc3>"
            }
            text += responseData.tokens[i] + " ";
            if (mention != null && mention.end === i + 1) {
                mention = null;
                text += "</font>"
            }
            if (responseData.tokens[i] !== "," && responseData.tokens[i] !== "." && responseData.tokens[i] !== "(" && responseData.tokens[i] !== ")") {
                textOrg.add(responseData.tokens[i])
            }
        }

        this.setState({
            listData: listData,
            entityData: entityData,
            tokenData: tokenData,
            text: text,
            id: responseData.sentence_id,
            textOrg: Array.from(textOrg)
        })
    }


    loginRequest = (name, password) => {
        const url = "http://54.169.250.197:8888/ap/user/login";
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

    AddMentionRequest = (entity, categorys,addNewEntity) => {

        const listData = this.state.listData;
        let entityDataSet = new Set(this.state.entityData);
        entityDataSet.add({
            name:entity
        });
        let nameCategorySet = new Set();
        for (let item of this.state.listData) {
            if (item.entity == entity && addNewEntity){
                notification.open({
                    message: 'Error',
                    description: 'Can not add an existing entity',
                    duration: 4,
                });
                return
            }
            nameCategorySet.add(item.entity + item.category)
        }

        for (let category of categorys) {
            if (nameCategorySet.has(entity + category)){
                notification.open({
                    message: 'Error',
                    description: 'Can not add an existing triple',
                    duration: 4,
                });
                return
            }
            listData.push({
                entity: entity,
                category: category,
                action: null, //0正确 1错误
                err_data: [{"id": 0}],
                new_add: true
            });
        }
        this.setState({
            listData: listData,
            addNewMetationModel: false,
            entityData:Array.from(entityDataSet)
        })

    };

    MentionCancel = () => {
        this.setState({
            addNewMetationModel: false,
        })
    };

    render() {
        const {listData, error_drawer_visible, current_err_data, modalVisible, loginVisible, current_item, sure_content, addNewMetationModel} = this.state;
        const addBtn = <div style={{
            marginTop: 12, lineHeight: '32px',
        }}
        >
            <Row gutter={16} style={{textAlign: 'center', padding: 20}}>
                <Button type="dashed" onClick={this.onAddNewEntity} style={{width: '30%'}}>
                    <Icon type="plus"/> <strong><font size="4">Add New Entity</font></strong>
                </Button>
                <Button type="dashed" onClick={this.onAddNewCategory} style={{width: '30%'}}>
                    <Icon type="plus"/> <strong><font size="4">Add New Category</font></strong>
                </Button>
            </Row>
            <br/>
        </div>

        return (
            <div style={{
                background: '#fff',
                padding: 24,
                minHeight: 280,
                textAlign: 'center',
                width: '100%',
                minWidth: 680
            }}>
                <Typography>
                    <strong><font size="4">
                        <div style={{display: "inline", float: 'left'}}
                             dangerouslySetInnerHTML={{__html: this.state.text}}></div>
                        <div style={{display: "inline", float: "right"}}>
                            <Button onClick={this.onSubmit} size='large'><strong><font size="4"> Submit</font></strong></Button>
                        </div>
                    </font></strong>
                </Typography>


                <List
                    style={{marginTop: 100}}
                    bordered
                    size="large"
                    dataSource={listData}
                    itemLayout="horizontal"
                    split="false"
                    loadMore={addBtn}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={item.new_add ? [<Icon type="delete" onClick={() => {
                                this.deleteRecord(item, index)
                            }}/>] : [
                                <Icon type="like" theme={item.action === 0 ? 'filled' : 'outlined'}
                                      onClick={() => {
                                          this.like(item)
                                      }}/>,
                                <Icon type="dislike" theme={item.action === 1 ? 'filled' : 'outlined'}
                                      onClick={() => {
                                          this.dislike(item)
                                      }}/>]}
                        >
                            <List.Item.Meta
                                description={<NEREntityItem data={item} index={index}/>}/>
                        </List.Item>
                    )}

                />

                <NEREntityError onClose={this.onClose} visible={error_drawer_visible}
                                errData={current_err_data} onSubmit={this.onErrSubmit} onErrAdd={this.onErrAdd}
                                onErrRemove={this.onErrRemove} item={current_item} text={this.state.textOrg}
                />

                <Modal
                    title="Sure?"
                    visible={modalVisible}
                    onOk={this.modalHandleOk}
                    onCancel={this.modalHandleCancel}
                >
                    <div onClick={this.handleChange} dangerouslySetInnerHTML={{__html: sure_content}}></div>
                </Modal>

                <LoginModel visible={loginVisible} onLogin={this.loginRequest.bind(this)}/>

                <AddNewMentionModel title={this.state.addNewTitle} choose={this.state.chooseEntity}
                                    visible={addNewMetationModel} options={this.state.optionItems}
                                    onAdd={this.AddMentionRequest.bind(this)} onCancel={this.MentionCancel.bind(this)}
                                    text={this.state.textOrg}/>
            </div>
        );
    }
}

export default NERAnnotionItem;