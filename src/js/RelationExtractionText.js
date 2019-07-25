import React, {Component} from 'react';
import '../css/App.css';
import {Typography, Checkbox, Row, Icon} from 'antd';

const {Paragraph, Text} = Typography;

class RelationExtractionText extends Component {

    state = {
        text: "",
        bgColor: "white",
        choose: false,
        heartColor:"black",
        heartFillColor:"white",
        theme:"outlined"
    }


    componentDidMount() {
        this.initText()
    }

    onChange = () => {
        var status;
        if (!this.state.choose) {
            status = true
            this.setState({
                choose: status,
                bgColor: "rgba(168,210,225,.25)",
                heartColor: "rgb(192,52,96)",
                heartFillColor:"rgb(128,25,64)",
                theme:"twoTone"
            });
        } else {
            status = false
            this.setState({
                choose: status,
                bgColor: "white",
                heartColor:"black",
                heartFillColor:"white",
                theme:"outlined"
            });
        }
        this.props.onClueChange(this.props.index,status)

    };
    initText = () => {
        var data = this.props.data;
        console.log(data.sentence)
        var sentence = data.sentence;
        var result = "";
        for (var i = 0; i < sentence.length; i++) {
            if (data.pos1[0] == i) {
                result += "<font color=#4c9bc3>"
            }
            if (data.pos2[0] == i){
                result += "<font color=#ecac41>"
            }
            result += sentence[i] + " "
            if (data.pos1[1] == i || data.pos2[1] == i) {
                result += "</font>"
            }
        }
        this.setState({
            text: result
        })
    }


    render() {
        return (

            <div style={{marginBottom: 10,lineHeight:'50px'}} onClick={this.onChange}>
                <Row>
                    <font size="6">
                        <Icon size="large" type="heart" theme={this.state.theme} twoToneColor={ this.state.heartColor}  />
                        <div style={{backgroundColor: this.state.bgColor}}
                             dangerouslySetInnerHTML={{__html: this.state.text}}>
                        </div>
                    </font>
                </Row>
            </div>

        );
    }
}

export default RelationExtractionText;