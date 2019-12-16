import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon, Select, Tooltip } from 'antd';
import withDictListComponent from '../../../hoc/withDictListComponent';
import withUnitComponent from '../../../hoc/withUnitComponent';

import _ from 'lodash';

const { Option } = Select;

class FormFieldSelect extends Component {
  getDropdownMatchSelectWidth () {
    const { dropdownMatchSelectWidth } = this.props;
    return dropdownMatchSelectWidth == null ? true : dropdownMatchSelectWidth;
  }

  getStyle (style) {
    style = { ...style };

    if (style.minWidth || style.maxWidth) {
      delete style.width;
    }

    return style;
  }
  
  handleChange = (value) => {
    const option = _.find(this.props.options, { id: value });
    if (this.props.unitConfig) {
      value = option;
    }
    let origin;
    if (value) {
      const ids = _.isArray(value) ? value : [value];
      origin = this.props.options.filter(option => !!~_.indexOf(ids, option.id));
    }
    this.props.onChange && this.props.onChange(value, option, origin);
    this.props.onSelfChange && this.props.onSelfChange(value, option, origin);
  }

  handleFilterOption = (input, option) => {
    const { props: { title, description } } = option;
    const inputText = (input || '').toLowerCase();
    return ((title || '').toLowerCase()).includes(inputText) || ((description || '')).toLowerCase().includes(inputText);
  }

  generateOptions () {
    return this.props.options.map(({ id, name, isDisabled, description }) => {
      let element = name;
      const props = {
        key: id, 
        value: id,
        title: name,
        description,
        disabled: isDisabled === '1'
      };

      if (description) {
        element = (
          <span>
            {name}
            <Tooltip placement="top" title={description}>
              <Icon type="question-circle-o" style={{ color: 'gray', paddingLeft: '2px' }} />
            </Tooltip>
          </span>
        );
      }
      
      return (<Option {...props}>{element}</Option>);
    });
  }

  render () {
    let { mode, value, disabled, placeholder, isMultiple, maxTagCount, maxTagPlaceholder, style = {}, getPopupContainer = () => document.body } = this.props;
    const props = {
      disabled,
      placeholder,
      allowClear: true,
      showSearch: true,
      getPopupContainer,
      optionLabelProp: 'title',
      optionFilterProp: 'title',
      onChange: this.handleChange,
      size: this.props.size || 'default',
      filterOption: this.handleFilterOption,
      style: this.getStyle({ width: '100%', ...style }),
      value: this.props.formatDefaultValue(value, isMultiple),
      dropdownMatchSelectWidth: this.getDropdownMatchSelectWidth()
    };

    if (maxTagCount != null) {
      props.maxTagCount = maxTagCount;
    }
    if (maxTagPlaceholder != null) {
      props.maxTagPlaceholder = maxTagPlaceholder;
    }
    if (isMultiple) {
      props.mode = 'multiple';
      value = [...(value || [])];
    } else {
      value = value ? [value] : [];
    }

    return mode === 'edit' ? (<Select {...props}>{this.generateOptions()}</Select>): this.props.generateViewArea(value);
  }

  static propTypes = {
    value: PropTypes.any,
    mode: PropTypes.string,
    getData: PropTypes.func,
    style: PropTypes.object,
    onLoaded: PropTypes.func,
    disabled: PropTypes.bool,
    keyName: PropTypes.string,
    isMultiple: PropTypes.bool,
    textName: PropTypes.string,
    dataSource: PropTypes.array,
    availableList: PropTypes.any,
    maxTagCount: PropTypes.number,
    dropdownMatchSelectWidth: PropTypes.any
  }

  static defaultProps = {
    mode: 'eidt',
    dataSource: [],
    disabled: false,
    availableList: [],
    isMultiple: false
  }
}

export default withUnitComponent(withDictListComponent(FormFieldSelect, 'FORM_FILED_RENDER_SELECT'));