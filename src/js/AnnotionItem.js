import React, { Component } from 'react';
import { notification, List, Icon, Button, Modal, Typography } from 'antd';
import EntityItem from './EntityItem';
import EntityError from './EntityError';
const { Paragraph, Text } = Typography;

/**
 * 列表条目组件
 */
const listData = [];
for (let i = 0; i < 10; i++) {
    listData.push({
        id: i,
        entity: 'apple',
        entity_url: 'http://www.google.com',
        relation: 'is a',
        category: 'fruit',
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
        modalVisible: false
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
                    <div dangerouslySetInnerHTML={{__html: "A <span style=\"color:blue;font-weight:bold\">apple</span> results from maturation of one or more flowers, and the gynoecium of the flower(s) forms all or part of the fruit.[10] Inside the ovary/ovaries are one or more ovules where the megagametophyte contains the egg cell.[11] After double fertilization, these ovules will become seeds.<br /> The ovules are fertilized in a process that starts with pollination, which involves the movement of pollen from the stamens to the stigma of flowers. After pollination, a tube grows from the pollen through the stigma into the ovary to the ovule and two sperm are transferred from the pollen to the megagametophyte. Within the megagametophyte one of the two sperm unites with the egg, forming a zygote, and the second sperm enters the central cell forming the endosperm mother cell, which completes the double fertilization process.[12][13] <br />Later the zygote will give rise to the embryo of the seed, and the endosperm mother cell will give rise to endosperm, a nutritive tissue used by the embryo.As the ovules develop into seeds, the ovary begins to ripen and the ovary wall, the pericarp, may become fleshy (as in berries or drupes), or form a hard outer covering (as in nuts). In some multiseeded fruits, the extent to which the flesh develops is proportional to the number of fertilized ovules.[14] The pericarp is often differentiated into two or three distinct layers called the exocarp (outer layer, also called epicarp), mesocarp (middle layer), and endocarp (inner layer). In some fruits, especially simple fruits derived from an inferior ovary, other parts of the flower (such as the floral tube, including the petals, sepals, and stamens), fuse with the ovary and ripen with it. In other cases, the sepals, petals and/or stamens and style of the flower fall off. When such other floral parts are a significant part of the fruit, it is called an accessory fruit. Since other parts of the flower may contribute to the structure of the fruit, it is important to study flower structure to understand how a particular fruit forms.[3]"}}/>
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