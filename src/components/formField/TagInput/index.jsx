import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import _ from 'lodash';

import withDictListComponent from '../../../hoc/withDictListComponent';

import './TagInput.less';

const { Option } = Select;

class TagInput extends Component {
  getDropdownMatchSelectWidth () {
    const { dropdownMatchSelectWidth } = this.props;
    return dropdownMatchSelectWidth == null ? true : dropdownMatchSelectWidth;
  }

  handleChange = (value) => {
    const { onChange, onSelfChange, isMultiple = true } = this.props;
    if(!isMultiple) {
      value = value == null ? undefined : (value.length ? [_.last(value)] : undefined);
    }
    onChange && onChange(value);
    onSelfChange && onSelfChange(value);
  }

  generateOptions () {
    return this.props.options.map(({ id, name, isDisabled }) => (<Option key={id} value={id} title={name} disabled={isDisabled === '1'}>{name}</Option>));
  }

  generateViewArea (value) {
    let title;
    let element = null;
    const { viewRender } = this.props;
    const match = value;

    if (viewRender) {
      element = viewRender(match, value);
    } else {
      element = match.join(';');
      title = element;
    }

    return (
      <div className="form-field-render-view" title={title}><div className="form-field-render-view-value">{ element }</div></div>
    );
  }

  render () {
    const { mode, value, disabled, className = '', placeholder, maxTagCount, maxTagPlaceholder, style = {}, isMultiple = true } = this.props;
    const props = {
      disabled,
      placeholder,
      mode: 'tags',
      tokenSeparators: [',', ';'],
      onChange: this.handleChange,
      size: this.props.size || 'default',
      style: { width: '100%', ...style },
      value: this.props.formatDefaultValue(value, isMultiple),
      dropdownMatchSelectWidth: this.getDropdownMatchSelectWidth(),
      className: isMultiple ? className : `${className} single-tag-input-wrapper`,
    };

    if (maxTagCount != null) {
      props.maxTagCount = maxTagCount;
    }
    if (maxTagPlaceholder != null) {
      props.maxTagPlaceholder = maxTagPlaceholder;
    }
    return mode === 'edit' ? (<Select {...props}>{this.generateOptions()}</Select>) : this.generateViewArea(value ? (_.isArray(value) ? value : [value]) : []);
  }

  static propTypes = {
    value: PropTypes.any,
    mode: PropTypes.string,
    onLoaded: PropTypes.func,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    dropdownMatchSelectWidth: PropTypes.any
  }

  static defaultProps = {
    mode: 'edit',
    disabled: false
  }
}

export default withDictListComponent(TagInput, 'FORM_FILED_RENDER_TAG_INPUT');