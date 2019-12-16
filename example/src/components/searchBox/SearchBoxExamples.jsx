import React, { Component } from 'react';
import SearchBoxWithDictData from './SearchBoxWithDictData';
import SearchBoxWithCustomerApi from './SearchBoxWithCustomerApi';

export default class SearchBoxExamples extends Component {
  render () {
    return (
      <div>
        <h2>FormFieldSearchBox示例</h2>
        <ul className="examples">
          <li><SearchBoxWithDictData /></li>
          <li><SearchBoxWithCustomerApi /></li>
        </ul>
      </div>
    );
  }
}
