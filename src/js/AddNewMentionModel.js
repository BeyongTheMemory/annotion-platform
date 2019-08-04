import React, {Component} from 'react';
import {Form, Icon, Input, Button, Select, Modal, TreeSelect, AutoComplete, Col} from 'antd';

const {Option} = Select;

/**
 * 新增屬性
 */
class AddNewMentionModel extends Component {
    state = {
        closable: true,
        entity: "",
        category: [],
        categoryResult: [],
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

    handleTreeSelectChange = (value) => {
        let treeValue = this.getPath(value);
        let data = "";
        for (let i = 0; i < treeValue.length; i++) {
            if (i !== 0) {
                data += "/" + treeValue[i]
            } else {
                data += treeValue[i]
            }
        }
        this.state.categoryResult.push(data)
        let categorySet = new Set(this.state.category);
        categorySet.add(value);
        this.setState({
            category: Array.from(categorySet)
        });

    };

    handleEntityChange = (value) => {
        this.setState({
            entity: value
        })
    };

    handleSearch = value => {
        let sourceValue = value.split(" ");
        let splitValue = [];
        for (let valueItem of sourceValue) {
            if (valueItem.trim().length > 0) {
                splitValue.push(valueItem)
            }
        }
        console.log(splitValue);
        let org = splitValue[0];

        if (splitValue.length > 0) {
            org = splitValue.splice(0, splitValue.length - 1).join(" ");
        }

        let searchValue = "";
        if (splitValue.length > 0) {
            searchValue = splitValue[splitValue.length - 1].toLowerCase();
        }
        let searchData = [];
        console.log(org);
        for (let textItem of this.props.text) {
            if (textItem.toLowerCase().includes(searchValue)) {
                if (typeof (org) !== "undefined" && org.length > 0) {
                    searchData.push(org + " " + textItem);
                } else {
                    searchData.push(textItem);
                }
            }
        }
        console.log(searchData);
        this.setState({
            searchData: searchData,
        });
    };


    handleOnSearch = (value) => {
        if (value.length <= this.state.categoryResult.length) {
            for (let i = 0; i < this.state.category.length; i++) {
                if (i > value.length || value[i] !== this.state.category[i]) {
                    console.log(i);
                    this.state.categoryResult.splice(i, 1);
                }
            }
            this.setState({
                category: value
            });
        }
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onAdd(this.state.entity, this.state.categoryResult, !this.props.choose);
                this.props.form.resetFields();
                this.setState({
                    entity: "",
                    category: [],
                    categoryResult: []
                })
            }
        });
    };


    render() {
        const optionItems = this.props.options.map((item) => (
            <Option value={item.name}>{item.name}</Option>
        ));
        return (
            <Modal
                title={this.props.title}
                visible={this.props.visible}
                closable={this.state.closable}
                onCancel={this.props.onCancel}
                footer={null}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {this.props.choose ? (
                            <Select placeholder="Please choose a entity" value={this.state.entity}
                                    onChange={(value) => {
                                        this.handleEntityChange(value)
                                    }}>
                                {optionItems}
                            </Select>
                        ) : (<AutoComplete
                            dataSource={this.state.searchData}
                            value={this.state.entity}
                            onChange={(value) => {
                                this.handleEntityChange(value)
                            }}
                            onSearch={this.handleSearch}
                            placeholder="Please input the correct entity name"
                        />)
                        }

                    </Form.Item>
                    < Form.Item>
                        < TreeSelect
                            showSearch
                            treeCheckable="true"
                            style={{width: 300}}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            treeData={global.constants.treeData}
                            placeholder="Please select the correct category"
                            value={this.state.category}
                            onSelect={(value) => {
                                this.handleTreeSelectChange(value)
                            }}
                            onChange={(value) => {
                                this.handleOnSearch(value)
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Add
                        </Button>

                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

AddNewMentionModel = Form.create({})(AddNewMentionModel);
export default AddNewMentionModel;