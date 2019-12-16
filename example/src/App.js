import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Form } from 'antd';
import SelectExamples from './components/select/SelectExamples';
import SearchBoxExamples from './components/searchBox/SearchBoxExamples';

class App extends Component {
  render () {
    return (
      <ul className="examples">
        <li><SelectExamples /></li>
        <li><SearchBoxExamples /></li>
      </ul>
    );
  }
}

export default Form.create()(App);
