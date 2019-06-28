import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EntityRecognition from './js/EntityRecognition'
import RelationExtraction from './js/RelationExtraction'


class App extends Component {
  render() {
      return (
        <Router>
        <div>
          <Route path="/" exact component={EntityRecognition} />
          <Route path="/er" exact component={EntityRecognition} />
          <Route path="/re" exact component={RelationExtraction} />
        </div>
      </Router>
      );
    }
}

export default App;