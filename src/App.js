import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EntityRecognition from './js/EntityRecognition'
import RelationExtraction from './js/RelationExtraction'
import NewEntityRecognition from './js/NewEntityRecognition'

class App extends Component {
  render() {
      return (
        <Router>
        <div>
          <Route path="/ner" exact component={NewEntityRecognition} />
          <Route path="/typing" exact component={EntityRecognition} />
          <Route path="/re" exact component={RelationExtraction} />
          <Route path="/" exact component={EntityRecognition} />
        </div>
      </Router>
      );
    }
}

export default App;