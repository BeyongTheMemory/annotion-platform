import React, {Component} from 'react';
import '../css/App.css';
import {Typography, Checkbox,Row} from 'antd';

const {Paragraph, Text} = Typography;

class RelationExtractionText extends Component {

    state = {
        text: "",
        bgColor: "white",
        choose: false
    }


    componentDidMount() {
        this.initText()
    }

    onChange = () => {
        if (!this.state.choose) {
            this.setState({
                choose: true,
                bgColor: "rgba(168,210,225,.25)"
            });
        } else {
            this.setState({
                choose: false,
                bgColor: "white"
            });
        }

    };
    initText = () => {
        var data = this.props.data;
        console.log(data.sentence)
        var sentence = data.sentence;
        var result = "";
        for (var i = 0; i < sentence.length; i++) {
            if (data.pos1[0] == i || data.pos2[0] == i) {
                result += "<font color=orange>"
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

            <div style={{marginBottom: 10}} onClick={this.onChange}>
                <Row>
                    <strong><font size="4">
                        <div style={{display: "inline",float: 'left'}}>
                            <Checkbox checked={this.state.choose}/>
                        </div>
                        <div style={{display: "inline",float: 'right',marginLeft:20}} style={{backgroundColor: this.state.bgColor}}
                             dangerouslySetInnerHTML={{__html: this.state.text}}>
                        </div>
                    </font></strong>
                </Row>
            </div>

        );
    }
}

export default RelationExtractionText;