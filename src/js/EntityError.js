import React, { Component } from 'react';
import {
  Drawer, Form, Button, Col, Row, Input, Select, Icon, TreeSelect
} from 'antd';
const { Option } = Select;

const treeData = [{
  title: 'Fruit',
  value: 'Fruit',
  key: '0-0',
  children: [{
    title: 'Child fruit1',
    value: 'Child fruit1',
    key: '0-0-1',
  }, {
    title: 'Child fruit2',
    value: 'Child fruit2',
    key: '0-0-2',
  }],
}, {
  title: 'Milk',
  value: 'Milk',
  key: '0-1',
}];
let id = 0;
class EntityError extends Component {

  state = {
    
  }

  componentWillReceiveProps(newProps) {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if(newProps.errData !== keys){
      form.setFieldsValue({
        keys: newProps.errData,
      });
    }
}

  onChange = (value) => {
    this.setState({ value });
  }

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat({ id: ++id });
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleReasonChange = (value, index) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    keys[index].type = value
    form.setFieldsValue({
      keys: keys,
    });
   
  }

  handleInputChange = (value, index) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    keys[index].entity_name = value.target.value
  }

  handleTreeSelectChange = (value, index) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    keys[index].category_name = value
  }

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');

    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { errData} = this.props;

    getFieldDecorator('keys', { initialValue: errData});
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
                  <Option value="0">Entity is not a entity</Option>
                  <Option value="1">Entity range error</Option>
                  <Option value="2">Entity is not belong to this category</Option>
                </Select>
              </Col>
            </Row>

            <br />

            {k.type == 1 ? (
              <Row gutter={16}>
                <Col span={12}>
                  <Input placeholder="Please input the correct entity name" allowClear defaultValue={k.entity_name} onChange={(value) => {this.handleInputChange(value, index)}}/>
                </Col>
              </Row>
            ) : null}


            <br />

            {k.type == 2 ? (
              <Row gutter={16}>
                <Col span={12}>
                  <TreeSelect
                    showSearch
                    defaultValue={k.category_name}
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData}
                    placeholder="Please select the correct category"
                    onChange={(value) => {this.handleTreeSelectChange(value,index)}}
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
            onClick={() => this.props.onErrRemove(keys,index)}
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
            <Button type="dashed" onClick={() => {this.props.onErrAdd(keys)}} style={{ width: '60%' }}>
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
          <Button onClick={() => {this.props.onSubmit(keys)}} type="primary">
            Submit
            </Button>
        </div>
      </Drawer>
    );
  }
}
EntityError = Form.create({})(EntityError);
export default EntityError;