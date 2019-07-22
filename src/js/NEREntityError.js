import React, { Component } from 'react';
import {
  Drawer, Form, Button, Col, Row, Input, Select, Icon, TreeSelect, notification, Modal
} from 'antd';
import './config'
const { Option } = Select;

class NEREntityError extends Component {

  state = {

  };

  componentWillReceiveProps(newProps) {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (newProps.errData !== keys) {
      form.setFieldsValue({
        keys: newProps.errData,
      });
    }
  };

  handleReasonChange = (value, index) => {
    const { form } = this.props;
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
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    // console.log(index);
    // console.log(keys);
    keys[index].entity_name = value.target.value;
    // console.log(keys);
    form.setFieldsValue({
      keys: keys,
    });
  };

  handleTreeSelectChange = (value, index) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    // console.log(index);
    // console.log(keys);
    keys[index].category_name = value;
    // console.log(keys);
    form.setFieldsValue({
      keys: keys,
    });
  };

  onSubmit = (data) => {
    //check valid
    for (let item of data) {
      if (item.type == 1 && (typeof (item.entity_name) == "undefined" || item.entity_name.trim() == "")) {
        notification.open({
          message: 'Error',
          description: 'correct entity name can not be empty',
          duration: 4,
        });
        return;
      } else if (item.type == 2 && (typeof (item.category_name) == "undefined" || item.category_name.trim() == "")) {
        notification.open({
          message: 'Error',
          description: 'category name can not be empty',
          duration: 4,
        });
        return;
      }
    }
    this.props.onSubmit(data)
  }



  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { errData } = this.props;

    getFieldDecorator('keys', { initialValue: errData });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        required={true}
        key={index}
      >
        {getFieldDecorator(`names[${k}]`, {
        })(
          <div>

            <Row gutter={16}>
              <Col span={12}>
                <Select placeholder="Please choose the reason type" value={k.type} onChange={(value) => { this.handleReasonChange(value, index) }}>
                  <Option value="1">Entity is wrong</Option>
                  <Option value="2">Category is wrong</Option>
                </Select>
              </Col>
            </Row>

            <br />
            {k.type == 1 ? (
              <Row gutter={16}>
                <Col span={12}>
                  <Modal visible={false} style="display:none;">{typeof (k.entity_name) == "undefined" ? k.entity_name = this.props.item.entity : null}</Modal>
                  <Input placeholder="Please input the correct entity name" allowClear value={k.entity_name} onChange={(value) => { this.handleInputChange(value, index) }} />
                </Col>
              </Row>
            ) : null}


            <br />

            {k.type == 2 ? (
              <Row gutter={16}>
                <Col span={12}>
                  <Modal visible={false} style="display:none;">{typeof (k.category_name) == "undefined" ? k.category_name = this.props.item.category : null}</Modal>
                  <TreeSelect
                    showSearch
                    value={k.category_name}
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={global.constants.treeData}
                    placeholder="Please select the correct category"
                    onChange={(value) => { this.handleTreeSelectChange(value, index) }}
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

          <Row gutter={16} style={{ textAlign: 'center' }}>
            <Button type="dashed" onClick={() => { this.props.onErrAdd(keys) }} style={{ width: '60%' }}>
              <Icon type="plus" /> Add Reason
          </Button>
          </Row>

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
          <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
            Cancel
            </Button>
          <Button onClick={() => { this.onSubmit(keys) }} type="primary">
            Submit
            </Button>
        </div>
      </Drawer>
    );
  }
}
NEREntityError = Form.create({})(NEREntityError);
export default NEREntityError;