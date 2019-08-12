import React, {Component} from 'react';
import {
    Drawer, Form, Button, Col, Row, Input, Select, Icon, TreeSelect, notification, Modal, AutoComplete
} from 'antd';
import './config'

const {SHOW_ALL} = TreeSelect;
const {Option} = Select;


class NEREntityError extends Component {

    state = {
        searchData: []
    };

    valueMap = {};


    componentDidMount() {
        this.loops(global.constants.treeData);
    }

    loops = (list, parent) => {
        return (list || []).map(({children, value}) => {
            const node = (this.valueMap[value] = {
                parent,
                value
            });
            node.children = this.loops(children, node);
            return node;
        });
    };

    getPath = (value) => {
        const path = [];
        let current = this.valueMap[value];
        while (current) {
            path.unshift(current.value);
            current = current.parent;
        }
        return path;
    };

    componentWillReceiveProps(newProps) {
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        if (newProps.errData !== keys) {
            form.setFieldsValue({
                keys: newProps.errData,
            });
        }
    };

    handleReasonChange = (value, index) => {
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length > 1) {
            var otherIndex = index == 0 ? 1 : 0
            if (keys[otherIndex].type == value) {
                notification.open({
                    message: 'Error',
                    description: 'duplikey reason',
                    duration: 2,
                });
                return
            }
        }
        keys[index].type = value;
        form.setFieldsValue({
            keys: keys,
        });

    };

    handleInputChange = (value, index) => {
        console.log(value);
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        // console.log(index);
        keys[index].entityName = value;
        // console.log(keys);
        form.setFieldsValue({
            keys: keys,
        });
    };


    handleSearch = value => {
        let sourceValue = value.split(" ");
        let splitValue = [];
        for (let valueItem of sourceValue) {
            if (valueItem.trim().length > 0) {
                splitValue.push(valueItem)
            }
        }
        let org = splitValue[0];

        if (splitValue.length > 0) {
            org = splitValue.splice(0, splitValue.length - 1).join(" ");
        }

        let searchValue = "";
        if (splitValue.length > 0) {
            searchValue = splitValue[splitValue.length - 1].toLowerCase();
        }
        let searchData = [];
        for (let textItem of this.props.text) {
            if (textItem.toLowerCase().includes(searchValue)) {
                if (typeof (org) !== "undefined" && org.length > 0) {
                    searchData.push(org + " " + textItem);
                } else {
                    searchData.push(textItem);
                }
            }
        }
        this.setState({
            searchData: searchData,
        });
    };

    handleTreeSelectChange = (value, index) => {
        let treeValue = this.getPath(value);
        let data = "";
        for (let i = 0; i < treeValue.length; i++) {
            if (i !== 0) {
                data += "/" + treeValue[i]
            } else {
                data += treeValue[i]
            }
        }
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        // console.log(index);
        // console.log(keys);
        keys[index].categoryName = data;
        // console.log(keys);
        form.setFieldsValue({
            keys: keys,
        });
    };

    onSubmit = (data) => {
        //check valid
        for (let item of data) {
            if (item.type == 1) {
                if (typeof (item.entityName) == "undefined" || item.entityName.trim() === "") {
                    notification.open({
                        message: 'Error',
                        description: 'correct entity name can not be empty',
                        duration: 4,
                    });
                    return;
                } else if (this.props.item.entity.trim() === item.entityName.trim()) {
                    notification.open({
                        message: 'Error',
                        description: 'entity can not as same as old value',
                        duration: 4,
                    });
                    return;
                }
            } else if (item.type == 2) {
                if (typeof (item.categoryName) == "undefined" || item.categoryName.trim() === "") {
                    notification.open({
                        message: 'Error',
                        description: 'category name can not be empty',
                        duration: 4,
                    });
                    return;
                } else if (this.props.item.category.trim() === item.categoryName.trim()) {
                    notification.open({
                        message: 'Error',
                        description: 'category can not as same as old value',
                        duration: 4,
                    });
                    return;
                }
            }
            item.submit = true
        }
        this.props.onSubmit(data)
    };


    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const {errData} = this.props;

        getFieldDecorator('keys', {initialValue: errData});
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                required={true}
                key={index}
            >
                {getFieldDecorator(`names[${k}]`, {})(
                    <div>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Select placeholder="Please choose the reason type" value={k.type}  disabled
                                        onChange={(value) => {
                                            this.handleReasonChange(value, index)
                                        }}>
                                    <Option value="1">Entity is wrong</Option>
                                    <Option value="2">Category is wrong</Option>
                                </Select>
                            </Col>
                        </Row>

                        <br/>
                        {k.type == 1 ? (
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Modal visible={false}
                                           style="display:none;">{typeof (k.entityName) == "undefined" ? k.entityName = this.props.item.entity : null}</Modal>

                                    <AutoComplete
                                        dataSource={this.state.searchData}
                                        value={k.entityName}
                                        onChange={(value) => {
                                            this.handleInputChange(value, index)
                                        }}
                                        onSearch={this.handleSearch}
                                        placeholder="Please input the correct entity name"
                                    />
                                </Col>
                            </Row>
                        ) : null}


                        <br/>

                        {k.type == 2 ? (
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Modal visible={false}
                                           style="display:none;">{typeof (k.categoryName) == "undefined" ? k.categoryName = this.props.item.category : null}</Modal>
                                    <TreeSelect
                                        showSearch
                                        value={k.categoryName}
                                        style={{width: 300}}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        treeData={global.constants.treeData}
                                        placeholder="Please select the correct category"
                                        showCheckedStrategy={TreeSelect.SHOW_ALL}
                                        onSelect={(value) => {
                                            this.handleTreeSelectChange(value, index)
                                        }}
                                    />

                                </Col>
                            </Row>
                        ) : null}


                    </div>
                )}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.props.onErrRemove(keys, index)}
                    />
                ) : null}
            </Form.Item>
        ));


        return (
            <Drawer
                title="write the error reason"
                width={720}
                onClose={this.props.onClose}
                visible={this.props.visible}
            >
                <Form layout="vertical" hideRequiredMark>


                    {formItems}

                </Form>
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={this.props.onClose} style={{marginRight: 8}}>
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        this.onSubmit(keys)
                    }} type="primary">
                        Submit
                    </Button>
                </div>
            </Drawer>
        );
    }
}

NEREntityError = Form.create({})(NEREntityError);
export default NEREntityError;