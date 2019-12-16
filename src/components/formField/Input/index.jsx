import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import withUnitComponent from '../../../hoc/withUnitComponent';

const { TextArea } = Input;

class FormFieldInput extends Component {

  getTextValue(props) {
    return props[('value' in props) ? 'value' : 'defaultValue'] || '';
  }

  handleBlurInput = (e) => {
    const { onBlur } = this.props;
    onBlur && onBlur(e);
  }

  handlePressEnter = (e) => {
    const { onPressEnter } = this.props;
    onPressEnter && onPressEnter(e);
  }

  handleChangeInput = (e) => {
    const { onChange, onSelfChange } = this.props;
    let value = e.currentTarget.value;
    if (this.props.unitConfig) {
      value = { id: value, name: value }
    }
    onChange && onChange(value);
    onSelfChange && onSelfChange(value);
  }

    //生成预览模式显示区
    generateViewArea (value) {
      let title;
      let element = null;
      const { viewRender } = this.props;
      if (viewRender) {
        element = viewRender(value);
      } else {
        element = value;
        title = element;
      }
      return (
        <div className="form-field-render-view" title={title}><div className="form-field-render-view-value">{ element }</div></div>
      );
    }

  render() {
    let Element = Input;
    const { mode, size, value, disabled, style, autoFocus, placeholder, defaultValue, isMutiple = false, verificationRule = {} } = this.props;
    const props = {
      disabled,
      placeholder,
      defaultValue,
      size: size || 'default',
      onBlur: this.handleBlurInput,
      onPressEnter: this.handlePressEnter,
      onChange: this.handleChangeInput,
      style: style || { width: '100%' },
      autoFocus: autoFocus == null ? false : autoFocus === '1'
    };
    if (verificationRule && verificationRule.maxLength) {
      props.maxLength = `${parseInt(verificationRule.maxLength, 10)}`;
    }

    if (isMutiple) {
      Element = TextArea;
      props.autosize = { minRows: 2, maxRows: 6 };
    }
    if ('value' in this.props) {
      props.value = value;
    }

    return mode === 'edit' ? (<Element {...props} />) : this.generateViewArea(this.getTextValue(this.props));
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

export default withUnitComponent(FormFieldInput);