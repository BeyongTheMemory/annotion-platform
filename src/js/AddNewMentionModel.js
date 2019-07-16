import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';
/**
 * 新增屬性
 */
class AddNewMentionModel extends Component {
    state = {
        closable: false,
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onAdd(values.entity,values.category)
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="Add New Mention"
                visible={this.props.visible}
                closable={this.state.closable}
                footer={null}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('entity', {
                            rules: [{ required: true, message: 'Please input entity!' }],
                        })(
                            <Input
                                prefix={<Icon type="fire" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="entity"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('category', {
                            rules: [{ required: true, message: 'Please input category!' }],
                        })(
                            <Input
                                prefix={<Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="category"
                            />,
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