import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { notification, List, Icon, Button, Modal, Typography } from 'antd';
import EntityItem from './EntityItem';
import EntityError from './EntityError';
const { Paragraph, Text } = Typography;

/**
 * 列表条目组件
 */
const listData = [];
for (let i = 0; i < 1; i++) {
    listData.push({
        id: i,
        entity: 'Karpas',
        entity_url: 'http://www.google.com',
        relation: 'is instance of',
        category: 'Diets',
        category_url: 'http://www.google.com',
        action: null, //0正确 1错误
        err_data: [{ "id": 0 }]
    });
}

class AnnotionItem extends Component {
    state = {
        listData: listData,
        error_drawer_visible: false,
        current_item: null,
        current_err_data: [],
        modalVisible: false,
        iFrameHeight: '0px'
    }


    like = (item) => {
        item.action = 0
        this.setState({
            listData: listData
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

    onClose = () => {
        this.setState({
            error_drawer_visible: false,
        });
    };

    onErrSubmit = (data) => {
        // //todo:value check
        // console.log(this.state.current_item.err_data)
        this.state.current_item.err_data = data;
        // console.log(this.state.current_item.err_data)
        //console.log(this.state.current_item);
        this.setState({
            error_drawer_visible: false,
        });
    }

    onErrAdd = (data) => {
        if (data.length > 2) {
            notification.open({
                message: 'Error',
                description: 'The reason maximum size is 3',
                duration: 2,
            });
            return;
        }
        data = data.concat({ id: -1 })
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
        this.setState({
            modalVisible: true,
        });
    }

    modalHandleOk = () => {
        //todo:提交
        this.setState({
            modalVisible: false,
        });
    }

    modalHandleCancel = () => {
        //todo:提交
        this.setState({
            modalVisible: false,
        });
    }

    render() {
        const { listData, error_drawer_visible, current_err_data, modalVisible } = this.state;
        const submitBtn = <div style={{
            textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
        }}
        >
            <Button onClick={this.onSubmit}>Submit</Button>
        </div>

        return (
            <div style={{ background: '#fff', padding: 24, minHeight: 280, textAlign: 'center', width: '100%', minWidth: 680 }}>
                <Typography> <Paragraph>
                    <iframe src="https://en.wikipedia.org/wiki/Karpas"   width="100%"  height="800px"
                        frameBorder="0"/>
                    
                    {/* <iframe
                        crossorigin=”1“
                        style={{ width: '100%', height: this.state.iFrameHeight, overflow: 'visible' }}
                        onLoad={() => {
                            const obj = ReactDOM.findDOMNode(this.refs.iframe);
                            this.setState({
                                "iFrameHeight": obj.contentWindow.document.body.scrollHeight + 'px'
                            });
                        }}
                        ref="iframe"
                        src="https://en.wikipedia.org/wiki/Karpas"
                        width="100%"
                        height={this.state.iFrameHeight}
                        scrolling="no"
                        frameBorder="0"
                    /> */}

                </Paragraph> </Typography>

                <List
                    style={{ background: '#fff', padding: 24, minHeight: 280, textAlign: 'center', width: '100%', minWidth: 680 }}
                    size="large"
                    dataSource={listData}
                    itemLayout="horizontal"
                    split="false"
                    loadMore={submitBtn}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Icon type="like" theme={item.action === 0 ? 'filled' : 'outlined'}
                                    onClick={() => { this.like(item) }} />,
                                <Icon type="dislike" theme={item.action === 1 ? 'filled' : 'outlined'}
                                    onClick={() => { this.dislike(item) }} />]}
                        >
                            <List.Item.Meta
                                description={<EntityItem data={item} />} />
                        </List.Item>
                    )}

                />

                <EntityError onClose={this.onClose} visible={error_drawer_visible}
                    errData={current_err_data} onSubmit={this.onErrSubmit} onErrAdd={this.onErrAdd} onErrRemove={this.onErrRemove}
                />

                <Modal
                    title="Sure?"
                    visible={modalVisible}
                    onOk={this.modalHandleOk}
                    onCancel={this.modalHandleCancel}
                >
                    <p>Can't modify after submit</p>
                </Modal>
            </div>
        );
    }
}

export default AnnotionItem;