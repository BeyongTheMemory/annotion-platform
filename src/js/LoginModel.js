import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';
/**
 * 登录框
 */
class LoginModel extends Component {
    state = {
        closable: false,
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onLogin(values.username,values.password)
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="Log in"
                visible={this.props.visible}
                closable={this.state.closable}
                footer={null}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>

                        <Button htmlType="submit" className="login-form-button"   size='large'><strong><font size="4" >   Log in</font></strong></Button>

                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
LoginModel = Form.create({})(LoginModel);
export default LoginModel;