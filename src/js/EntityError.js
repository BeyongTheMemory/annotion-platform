import React, { Component } from 'react';
import {
  Drawer, Form, Button, Col, Row, Input, Select, Icon, TreeSelect, notification,Modal
} from 'antd';
const { Option } = Select;

const treeData = [{
  title: 'wellness',
  value: 'wellness',
  key: '0',
  disabled: true,
  children: [{
    title: 'Foods',
    value: 'Foods',
    key: '0-1',
    disabled: true,
    children: [
      {
        title: 'Cereals',
        value: 'Cereals',
        key: '0-1-1'
      },
      {
        title: 'Staple Foods',
        value: 'Staple Foods',
        key: '0-1-2'
      },
      {
        title: 'Legumes and Legume Products',
        value: 'Legumes and Legume Products',
        key: '0-1-3'
      },
      {
        title: 'Vegetables',
        value: 'Vegetables',
        key: '0-1-4'
      },
      {
        title: 'Fungus and Algae',
        value: 'Fungus and Algae',
        key: '0-1-5'
      },
      {
        title: 'Fruits',
        value: 'Fruits',
        key: '0-1-6'
      },
      {
        title: 'Nuts and Seeds',
        value: 'Nuts and Seeds',
        key: '0-1-7'
      },
      {
        title: 'Meat',
        value: 'Meat',
        key: '0-1-8'
      },
      {
        title: 'Poultry',
        value: 'Poultry',
        key: '0-1-9'
      },
      {
        title: 'Dairy Products',
        value: 'Dairy Products',
        key: '0-1-10'
      },
      {
        title: 'Egg Products',
        value: 'Egg Products',
        key: '0-1-11'
      },
      {
        title: 'Seafood',
        value: 'Seafood',
        key: '0-1-12'
      },
      {
        title: 'Baby Foods',
        value: 'Baby Foods',
        key: '0-1-13'
      },
      {
        title: 'Snacks',
        value: 'Snacks',
        key: '0-1-14'
      },
      {
        title: 'Instant Foods',
        value: 'Instant Foods',
        key: '0-1-15'
      },
      {
        title: 'Beverages',
        value: 'Beverages',
        key: '0-1-16'
      },
      {
        title: 'Wine',
        value: 'Wine',
        key: '0-1-17'
      },
      {
        title: 'Sweets',
        value: 'Sweets',
        key: '0-1-18'
      },
      {
        title: 'Fats and Oils',
        value: 'Fats and Oils',
        key: '0-1-19'
      },
      {
        title: 'Condiments',
        value: 'Condiments',
        key: '0-1-20'
      },
      {
        title: 'Other Foods',
        value: 'Other Foods',
        key: '0-1-21'
      },
      {
        title: 'Food Ingredients',
        value: 'Food Ingredients',
        key: '0-1-22'
      },
      {
        title: 'Dishes',
        value: 'Dishes',
        key: '0-1-23'
      }
    ]
  }, {
    title: 'Nutrients',
    value: 'Nutrients',
    key: '0-2',
    disabled: true,
    children: [
      {
        title: 'Energy',
        value: 'Energy',
        key: '0-2-1'
      },
      {
        title: 'Carbohydrate',
        value: 'Carbohydrate',
        key: '0-2-2'
      },
      {
        title: 'Lipid',
        value: 'Lipid',
        key: '0-2-3'
      },
      {
        title: 'Protein',
        value: 'Protein',
        key: '0-2-4'
      },
      {
        title: 'Water',
        value: 'Water',
        key: '0-2-5'
      },
      {
        title: 'Ash',
        value: 'Ash',
        key: '0-2-6'
      },
      {
        title: 'Vitamin',
        value: 'Vitamin',
        key: '0-2-7'
      },
      {
        title: 'Dietary Fiber',
        value: 'Dietary Fiber',
        key: '0-2-8'
      },
      {
        title: 'Chemical Substances',
        value: 'Chemical Substances',
        key: '0-2-9'
      }
    ]
  }, {
    title: 'Diseases',
    value: 'Diseases',
    key: '0-3',
    disabled: true,
    children: [
      {
        title: 'Genetic disorders by system',
        value: 'Genetic disorders by system',
        key: '0-3-1'
      },
      {
        title: 'Syndromes by affected organ',
        value: 'Syndromes by affected organ',
        key: '0-3-2'
      },
      {
        title: 'Blood disorders',
        value: 'Blood disorders',
        key: '0-3-3'
      },
      {
        title: 'Breast diseases',
        value: 'Breast diseases',
        key: '0-3-4'
      },
      {
        title: 'Cardiovascular diseases',
        value: 'Cardiovascular diseases',
        key: '0-3-5'
      },
      {
        title: 'Cutaneous conditions',
        value: 'Cutaneous conditions',
        key: '0-3-6'
      },
      {
        title: 'Digestive diseases',
        value: 'Digestive diseases',
        key: '0-3-7'
      },
      {
        title: 'Diseases of the ear and mastoid process',
        value: 'Diseases of the ear and mastoid process',
        key: '0-3-8'
      },
      {
        title: 'Endocrine, nutritional and metabolic diseases',
        value: 'Endocrine, nutritional and metabolic diseases',
        key: '0-3-9'
      },
      {
        title: 'Diseases of the eye and adnexa',
        value: 'Diseases of the eye and adnexa',
        key: '0-3-10'
      },
      {
        title: 'Foot diseases',
        value: 'Foot diseases',
        key: '0-3-11'
      },
      {
        title: 'Genitourinary system diseases',
        value: 'Genitourinary system diseases',
        key: '0-3-12'
      },
      {
        title: 'Hair diseases',
        value: 'Hair diseases',
        key: '0-3-13'
      },
      {
        title: 'Immune system disorders',
        value: 'Immune system disorders',
        key: '0-3-14'
      },
      {
        title: 'Musculoskeletal disorders',
        value: 'Musculoskeletal disorders',
        key: '0-3-15'
      },
      {
        title: 'Neurological disorders',
        value: 'Neurological disorders',
        key: '0-3-16'
      },
      {
        title: 'Orthopedic problems',
        value: 'Orthopedic problems',
        key: '0-3-17'
      },
      {
        title: 'Respiratory diseases',
        value: 'Respiratory diseases',
        key: '0-3-18'
      },
      {
        title: 'Sexual disorders',
        value: 'Sexual disorders',
        key: '0-3-19'
      },
      {
        title: 'Voice disorders',
        value: 'Voice disorders',
        key: '0-3-20'
      }
    ]
  }, {
    title: 'Life style',
    value: 'Life style',
    key: '0-4',
    disabled: true,
    children: [
      {
        title: 'Diets',
        value: 'Diets',
        key: '0-4-1'
      },
      {
        title: 'Physical exercise',
        value: 'Physical exercise',
        key: '0-4-2'
      }
    ]
  }],
},
{
  title: 'Person',
  value: 'Person',
  key: '1',
},{
  title: 'Others',
  value: 'Others',
  key: '2',
}];
class EntityError extends Component {

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
                  <TreeSelect
                    showSearch
                    value={k.category_name}
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData}
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
EntityError = Form.create({})(EntityError);
export default EntityError;