import React, {Component} from 'react';
import '../css/App.css';
import {Typography} from 'antd';

const {Paragraph, Text, Checkbox} = Typography;

class RelationExtractionText extends Component {

    state = {
        text: ""
    }


    componentDidMount() {
        this.initText()
    }

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
            <div>
                <Checkbox/>

                <Text mark>
                    <strong><font size="4">
                        <div dangerouslySetInnerHTML={{__html: this.state.text}}></div>
                    </font></strong>
                </Text>
            </div>

        );
    }
}

export default RelationExtractionText;