import React, { Component } from 'react';
import { Form, Icon, Input, Button, Select, Modal, TreeSelect } from 'antd';
const { Option } = Select;
/**
 * 新增屬性
 */
class AddNewMentionModel extends Component {
    state = {
        closable: true,
        entity: "",
        category: ""
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onAdd(values.entity, values.category)
                this.props.form.resetFields();
            }
        });
    };

    handleEntityChange = (value, index) => {
        this.state.entity = value
    }

    handleCategoryChange = (value, index) => {
        this.state.category = value
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const optionItems = this.props.options.map((item, index) => (
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
                        {getFieldDecorator('entity', {
                            rules: [{ required: true, message: 'Please choose entity!' }],
                        })(
                            <Select placeholder="Please choose a entity" value={this.state.type}>
                                {optionItems}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('category', {
                            rules: [{ required: true, message: 'Please choose category!' }],
                        })(
                            <TreeSelect
                                showSearch
                                style={{ width: 300 }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={global.constants.treeData}
                                placeholder="Please select the correct category"
                            />
                        )}
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