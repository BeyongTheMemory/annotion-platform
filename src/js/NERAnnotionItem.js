import React, {Component} from 'react';
import {notification, List, Icon, Button, Modal, Typography, message, Row, Divider} from 'antd';
import NEREntityList from './NEREntityList';
import NEREntityItem from './NEREntityItem';
import LoginModel from './LoginModel';
import AddNewMentionModel from './AddNewMentionModel';

/**
 * 列表条目组件
 */
class NERAnnotionItem extends Component {
    state = {
        entitiesCategories: [],
        entityData: [],
        tokenData: [],
        error_drawer_visible: false,
        current_item: null,
        currentErrData: [],
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
        id: -1,
        newDataList: []
    };

    componentDidMount() {
        this.getNext()
    }


    refreshList = () => {
        this.setState({
            entitiesCategories: this.state.entitiesCategories
        });
    };


    deleteRecord = (item, index) => {
        const listData = this.state.newDataList;
        listData.splice(index, 1);
        this.setState({
            newDataList: this.state.newDataList
        });
    };


    onSubmit = () => {
        //set content
        let sure_content = "";
        for (let entityCategories of this.state.entitiesCategories) {
            if (entityCategories.action < 0) {
                notification.open({
                    message: 'Error',
                    description: 'Please annotation ' + entityCategories.entity + '!',
                    duration: 4,
                });
                return;
            }

            if (entityCategories.action == 1 && entityCategories.errData[0].submit !== true) {
                notification.open({
                    message: 'Error',
                    description: 'Please submit ' + entityCategories.entity + '!',
                    duration: 4,
                });
                return;
            }
            if (entityCategories.action == 2) {
                sure_content += "<p><font color=#409ef7 size='4'>" + entityCategories.entity + "</font><font color='#c16957' size='4'>&nbsp&nbsp is useless</font></p>";
            } else {
                if (entityCategories.action == 0) {
                    sure_content += "<p><font color=#409ef7 size='4'>" + entityCategories.entity + "</font></p>";
                }
                if (entityCategories.action == 1) {
                    sure_content += "<p><font color=#409ef7 size='4'>" + entityCategories.entity + "</font><font color='#c16957' size='4'>&nbsp&nbsp wrong,revised:</font><font color='#409ef7' size='4'>" + entityCategories.errData[0].entityName + "</font></p>";
                }
                for (let item of entityCategories.listData) {
                    if (item.action == null) {
                        notification.open({
                            message: 'Error',
                            description: 'mis instance',
                            duration: 2,
                        });
                        return
                    }
                    if (item.action != 0) {
                        for (let errorReason of item.errData) {
                            if (errorReason.submit !== true) {
                                notification.open({
                                    message: 'Error',
                                    description: 'Please submit' + item.category + '!',
                                    duration: 4,
                                });
                                return;
                            }
                            sure_content += "<p>&nbsp&nbsp&nbsp&nbsp<font color='#d9b26f' size='4'>" + item.category + "</font><font color='#c16957' size='4'>&nbsp&nbsp wrong,revised:</font><font color='#d9b26f' size='4'>" + errorReason.categoryName + "</font></p>";
                        }
                    } else {
                        sure_content += "<p>&nbsp&nbsp&nbsp&nbsp<font color='#d9b26f' size='4'>" + item.category + "</font></p>"
                    }

                }
            }

        }


        if (this.state.newDataList.length > 0) {
            sure_content += "<p><font color='#b16b9f' size='4'>New Mention:</font></p>";
        }
        for (let item of this.state.newDataList) {
            sure_content += "<p><font color='#b16b9f' size='4'>" + item.entity + "</font><font color='#d9b26f' size='4'>" + item.category + "</font></p>"
        }


        this.setState({
            modalVisible: true,
            sure_content: sure_content
        });
    };

    onAddNewEntity = () => {
        this.setState({
            chooseEntity: false,
            addNewTitle: "Add new entity",
            optionItems: this.state.tokenData,
            addNewMetationModel: true
        })
    };

    onAddNewCategory = () => {
        this.setState({
            chooseEntity: true,
            addNewTitle: "Add new category",
            optionItems: this.state.entityData,
            addNewMetationModel: true,
        })
    };

    updateEntityData = (oldToken, newToken) => {
        console.log(this.state.entityData)
        for (let i = 0; i < this.state.entityData.length; i++) {
            console.log(this.state.entityData[i].name);
            console.log(oldToken)
            if (this.state.entityData[i].name == oldToken) {
                if (newToken == "Useless"){
                    delete  this.state.entityData[i]
                }else {
                    this.state.entityData[i].name = newToken;
                }
                return
            }
        }
    };

    modalHandleOk = () => {
        let feedbackList = [];
        let addList = [];
        for (let entityCategories of this.state.entitiesCategories) {
            if (entityCategories.action == 2) {
                feedbackList.push({
                    "id": entityCategories.id,
                    "origEntity": entityCategories.entity,
                    "entityResult": entityCategories.action
                });
            } else {
                let categoryFeedBack = [];
                for (let item of entityCategories.listData) {
                    if (item.action != 0) {
                        categoryFeedBack.push({
                            "origCategory": item.category,
                            "isCorrect": false,
                            "correctCategory": item.errData[0].categoryName,
                        })
                    } else {
                        categoryFeedBack.push({
                            "origCategory": item.category,
                            "isCorrect": true,
                        })
                    }

                }
                feedbackList.push({
                    "id": entityCategories.id,
                    "origEntity": entityCategories.entity,
                    "correctEntity": entityCategories.errData[0].entityName,
                    "entityResult": entityCategories.action,
                    "typesResult": categoryFeedBack
                });
            }
        }
        for (let item of this.state.newDataList) {
            addList.push({
                "category": item.category,
                "entity": item.entity,
            });
        }


        this.setState({
            modalVisible: false,
        });

        this.postFeedback({feedback: feedbackList, add: addList})
    };

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
    };

    modalHandleCancel = () => {
        this.setState({
            modalVisible: false,
        });
    };

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
                        if (data.data == null) {
                            message.error("no data");
                            return
                        }
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


    };

    updateListData = (responseData) => {
        console.log(responseData);
        let mentionMap = new Map();
        let entityData = [];
        let entityCategories = [];
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
            let listData = [];
            for (let j = 0; j < types.length; j++) {
                listData.push({
                    id: newMention.mention_id,
                    entity: entityName,
                    category: types[j],
                    action: null, //0正确 1错误
                    errData: [{"id": 0, submit: false, type: "2"}]
                })
            }
            entityCategories.push({
                id: newMention.mention_id,
                entity: entityName,
                listData: listData,
                action: -1,
                errData: [{"id": 0, submit: false, type: "1"}]
            })
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
                text += "<font color=#409ef7><font color=#d9b26f>" + mention.mention_id + "</font>"
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
            entitiesCategories: entityCategories,
            entityData: entityData,
            tokenData: tokenData,
            text: text,
            id: responseData.sentence_id,
            textOrg: Array.from(textOrg),
            newDataList: []
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
    };

    AddMentionRequest = (entity, categorys, addNewEntity) => {

        const listData = this.state.newDataList;
        let entityNameSet = new Set();
        let entityDataList = [];
        entityNameSet.add(entity);
        for (let entityData of this.state.entityData) {
            entityNameSet.add(entityData.name)
        }
        for (let entityName of entityNameSet) {
            entityDataList.push({
                name: entityName
            });
        }
        let nameCategorySet = new Set();

        for (let entityCategory  of this.state.entitiesCategories) {
            for (let item of entityCategory.listData) {
                if (item.entity.trim() === entity.trim() && addNewEntity) {
                    notification.open({
                        message: 'Error',
                        description: 'Can not add an existing entity',
                        duration: 4,
                    });
                    return
                }
                nameCategorySet.add(item.entity.trim() + item.category.trim())
            }
        }

        for (let newDataItem of listData) {
            nameCategorySet.add(newDataItem.entity.trim() + newDataItem.category.trim())
        }

        for (let category of categorys) {
            category = category.trim();
            if (nameCategorySet.has(entity.trim() + category.trim())) {
                notification.open({
                    message: 'Error',
                    description: 'The category is already existed',
                    duration: 4,
                });
                return
            }
            listData.push({
                entity: entity,
                category: category,
                action: null, //0正确 1错误
                errData: [{"id": 0}],
                new_add: true
            });
        }

        this.setState({
            newDataList: listData,
            addNewMetationModel: false,
            entityData: entityDataList
        })

    };

    MentionCancel = () => {
        this.setState({
            addNewMetationModel: false,
        })
    };

    render() {
        const {entitiesCategories, modalVisible, loginVisible, sure_content, addNewMetationModel, newDataList} = this.state;

        const newDataListView = newDataList.length > 0 ?
            <List
                style={{marginTop: 10}}
                bordered
                size="large"
                dataSource={newDataList}
                itemLayout="horizontal"
                split="false"
                renderItem={(item, index) => (
                    <List.Item
                        actions={[<Icon type="delete" onClick={() => {
                            this.deleteRecord(item, index)
                        }}/>]}
                    >
                        <List.Item.Meta
                            description={<NEREntityItem data={item} index={index} showEntity={true}/>}/>
                    </List.Item>
                )}
            /> : "";

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
                    dataSource={entitiesCategories}
                    itemLayout="horizontal"
                    split="false"
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                description={<NEREntityList data={item} index={index} text={this.state.textOrg}
                                                            refreshList={this.refreshList.bind(this)}
                                                            updateEntityData={this.updateEntityData.bind(this)}/>}/>
                        </List.Item>
                    )}
                />

                {newDataListView}

                <div style={{
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

                <Modal
                    style={{
                        minHeight: 800,
                        minWidth: 800
                    }}
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