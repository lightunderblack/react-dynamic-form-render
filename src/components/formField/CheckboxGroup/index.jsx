import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon, Tooltip, Checkbox } from 'antd';
import withDictListComponent from '../../../hoc/withDictListComponent';

import _ from 'lodash';

class CheckboxGroup extends Component {
  handleChange = (value) => {
    const { onChange, onSelfChange } = this.props;
    onChange && onChange(value);
    onSelfChange && onSelfChange(value);
  }

  generateOptions () {
    return this.props.options.map(({ id, name, isDisabled, description }) => {
      let label = name;
      
      if (description) {
        label = (
          <span>
            {name}
            <Tooltip placement="top" title={description}>
              <Icon type="question-circle-o" style={{ color: 'gray', paddingLeft: '2px' }} />
            </Tooltip>
          </span>
        );
      }

      return ({
        label,
        value: id, 
        disabled: isDisabled === '1'
      });
    });
  }

  render () {
    let { value, mode, disabled, style = {} } = this.props;
    const props = {
      value,
      style,
      disabled,
      onChange: this.handleChange,
      options: this.generateOptions(),
      value: this.props.formatDefaultValue(value, true)
    };
    return mode === 'edit' ? (<Checkbox.Group {...props} />) : this.props.generateViewArea(value ? value : []);
  }

  static propTypes = {
    value: PropTypes.any,
    mode: PropTypes.string,
    getData: PropTypes.func,
    onLoaded: PropTypes.func,
    disabled: PropTypes.bool,
    keyName: PropTypes.string,
    textName: PropTypes.string,
    dataSource: PropTypes.array,
  }

  static defaultProps = {
    mode: 'edit',
    dataSource: [],
    disabled: false,
    keyName: 'code',
    textName: 'name'
  }
}

export default withDictListComponent(CheckboxGroup, 'FORM_FILED_RENDER_CHECKBOX');