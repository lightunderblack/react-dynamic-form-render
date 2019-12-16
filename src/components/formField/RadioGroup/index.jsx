import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip, Radio } from 'antd';
import withDictListComponent from '../../../hoc/withDictListComponent';

class RadioGroup extends Component {
  handleChange = (e) => {
    const value = e.target.value;
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
    const { mode, value, disabled, style = {}, defaultValue } = this.props;
    const props = {
      value,
      style,
      disabled,
      onChange: this.handleChange,
      options: this.generateOptions(),
      defaultValue: this.props.formatDefaultValue(defaultValue, false)
    };
    return mode === 'edit' ? (<Radio.Group {...props} />) : this.props.generateViewArea(value ? [value] : []);
  }

  static propTypes = {
    mode: PropTypes.string,
    getData: PropTypes.func,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    onLoaded: PropTypes.func,
    dataSource: PropTypes.array
  }

  static defaultProps = {
    mode: 'edit',
    dataSource: [],
    disabled: false
  }
}

export default withDictListComponent(RadioGroup, 'FORM_FILED_RENDER_RADIO');