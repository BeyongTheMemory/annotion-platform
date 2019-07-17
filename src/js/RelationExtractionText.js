import React, {Component} from 'react';
import '../css/App.css';
import {Typography, Checkbox} from 'antd';

const {Paragraph, Text} = Typography;

class RelationExtractionText extends Component {

    state = {
        text: "",
        bgColor:"rgba(255,255,225,1)"
    }


    componentDidMount() {
        this.initText()
    }

    onChange = e => {
        if (e.target.checked) {
            this.setState({
                bgColor: "rgba(168,210,225,.25)"
            });
        }else {
            this.setState({
                bgColor:"rgba(255,255,225,1)"

            });
        }

    };
    initText = () => {
        var data = this.props.data;
        console.log(data.sentence)
        var sentenceChar = data.sentence.split(" ");
        var result = "";
        for (var i = 0; i < sentenceChar.length; i++) {
            if (data.pos1[0] == i || data.pos2[0] == i) {
                result += "<font color=orange>"
            }
            result += sentenceChar[i] + " "
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

            <div style={{marginBottom: 10}}>
                <Checkbox onChange={this.onChange}/>
                <strong><font size="4">
                    <div style={{backgroundColor:{this.state.bgColor}}} dangerouslySetInnerHTML={{__html: this.state.text}}>
                    </div>
                </font></strong>
            </div>

        );
    }
}

export default RelationExtractionText;