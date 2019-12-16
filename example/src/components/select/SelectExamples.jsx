import React, { Component } from 'react';
import SelectWithDictData from './SelectWithDictData';
import SelectWithDataSource from './SelectWithDataSource';
import SelectWithDictDataMutiple from './SelectWithDictDataMutiple';

export default class SelectExamples extends Component {
  render () {
    return (
      <div>
        <h2>FormFieldSelect示例</h2>
        <ul className="examples">
          <li><SelectWithDictData /></li>
          <li><SelectWithDictDataMutiple /></li>
          <li><SelectWithDataSource /></li>
        </ul>
      </div>
    );
  }
}
