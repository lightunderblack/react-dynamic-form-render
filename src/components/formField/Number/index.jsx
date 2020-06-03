import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';
import withUnitComponent from '../../../hoc/withUnitComponent';

class FormFieldNumber extends Component {

  getNumberValue(props) {
    const value = props[('value' in props) ? 'value' : 'defaultValue'];
    return value == null ? '' : value;
  }

  handleBlurInput = (e) => {
    const { onBlur } = this.props;
    onBlur && onBlur(e);
  }

  handleChangeNumber = (value) => {
    const { onChange, onSelfChange } = this.props;
    if (this.props.unitConfig) {
      value = { id: value, name: value }
    }
    onChange && onChange(value);
    onSelfChange && onSelfChange(value);
  }

  //生成预览模式显示区
  generateViewArea(value) {
    let title;
    let element = null;
    const { viewRender, isOnlyShowText } = this.props;

    if (viewRender) {
      element = viewRender(value);
    } else {
      element = value;
      title = element;
      if (isOnlyShowText) {
        return title;
      }
    }

    return (
      <div className="form-field-render-view" title={title}><div className="form-field-render-view-value">{element}</div></div>
    );
  }

  render() {
    const { mode, size, value, style = {}, disabled, autoFocus, placeholder, defaultValue, verificationRule } = this.props;
    const props = {
      disabled,
      placeholder,
      defaultValue,
      size: size || 'default',
      onBlur: this.handleBlurInput,
      style: { width: '100%', ...style },
      autoFocus: autoFocus == null ? false : autoFocus === '1',
      onChange: (value) => this.handleChangeNumber(value)
    };
    if (verificationRule) {
      if (verificationRule.min != null) {
        props.min = +verificationRule.min;
      }
      if (verificationRule.max != null) {
        props.max = +verificationRule.max;
      }
    }
    if ('value' in this.props) {
      props.value = value;
    }
    return mode === 'edit' ? (<InputNumber {...props} />) : this.generateViewArea(this.getNumberValue(this.props));
  }

  static propTypes = {
    value: PropTypes.any,
    mode: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    mode: 'edit',
    disabled: false
  }
}

export default withUnitComponent(FormFieldNumber);