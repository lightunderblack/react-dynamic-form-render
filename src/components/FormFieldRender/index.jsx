import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'moment/locale/zh-cn';
import { DatePicker } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN'; //默认中文
import FormFieldSelect from '../formField/Select';
import FormFieldTagInput from '../formField/TagInput';
import FormFieldSearchBox from '../formField/SearchBox';
import FormFieldTreeSelect from '../formField/TreeSelect';
import FormFieldRadioGroup from '../formField/RadioGroup';
import EmptyComponent from '../formField/EmptyComponent';
import FormFieldSwitch from '../formField/Swtich';
import FormFieldCheckboxGroup from '../formField/CheckboxGroup';
import FormFieldUserSearchBox from '../formField/UserSearchBox';
import FormFieldCustomComponent from '../formField/CustomComponent';
import FormFieldInput  from '../formField/Input';
import FormFieldNumber from '../formField/Number';

import {
  ATTR_TYPE_INT,
  ATTR_TYPE_TEXT,
  ATTR_TYPE_CLOB,
  ATTR_TYPE_DATE,
  ATTR_TYPE_FLOAT,
  ATTR_TYPE_RADIO,
  ATTR_TYPE_SEARCH,
  ATTR_TYPE_SELECT,
  ATTR_TYPE_PERSON,
  ATTR_TYPE_SWTICH,
  ATTR_TYPE_CHECKBOX,
  ATTR_TYPE_TAG_INPUT,
  ATTR_TYPE_COMPONENT,
  ATTR_TYPE_CUSTOM_COMP,
  ATTR_TYPE_DATE_RANGE,
  ATTR_TYPE_TREE_SELECT,
  ATTR_TYPE_MULTI_SELECT,
  ATTR_TYPE_MULTI_SEARCH,
  ATTR_TYPE_MULTI_PERSON,
  ATTR_TYPE_SINGLE_TAG_INPUT,
  ATTR_TYPE_TREE_MULTI_SELECT,
  ATTR_TYPE_CUSTOM_COMP_MULTI
} from '../../constant/attrType';

import moment from 'moment';
import _ from 'lodash';

const DATE_FORMAT_MAP = {
  '1': 'YYYY-MM-DD',
  '2': 'YYYY-MM-DD HH:mm:ss'
};
const { RangePicker } = DatePicker;
const DATE_PICKER_COMMON_PROPS = [
  'locale',
  'open',
  'size',
  'style',
  'showTime',
  'disabled',
  'allowClear',
  'autoFocus',
  'className',
  'dateRender',
  'suffixIcon',
  'placeholder',
  'popupStyle',
  'disabledDate',
  'dropdownClassName',
  'getCalendarContainer',
  'onOpenChange',
  'onPanelChange',

];

moment.locale('zh-cn');//指定中文

export default class FormFieldRender extends Component {
  parseRule (rule) {
    try {
      return rule ? JSON.parse(rule) : {};
    } catch (e) {
      return {};
    }
  }

  pickProps () {
    const props = { ...this.props };

    if (props.key != null) {
      props.key = `formFieldRenderItem_${props.key}`;
    }
    
    return props;
  }

  formatDateValue (value, formatter) {
    if (value) {
      if (formatter === '2') {
        const time = new Date(moment(+value).format('YYYY-MM-DD')).getTime() + (new Date().getTime() - new Date(moment(new Date()).format('YYYY-MM-DD')).getTime());
        return moment(time).valueOf();
      } else {
        return moment(+value).valueOf();
      }
    } else {
      return null;
    }
  }

  getDateValue (value) {
    return value ? moment(+value) : null;
  }

  getRangeDateValue (value, formatter) {
    if (_.isArray(value) && value.length) {
      return value.map(v => this.getDateValue(v, formatter));
    } else {
      return undefined;
    }
  }

  handleChangeDate = (moment, format) => {
    const { onChange, onSelfChange } = this.props;
    const value = moment ? this.formatDateValue(moment.valueOf(), format) : null;
    onChange && onChange(value);
    onSelfChange && onSelfChange(value);
  }

  handleChangeRangeDate = (value, format) => {
    const { onChange, onSelfChange } = this.props;
    value = (_.isArray(value) && value.length) ? value.map(v => v ? this.formatDateValue(v.valueOf(), format) : null) : undefined;
    onChange && onChange(value);
    onSelfChange && onSelfChange(value);
  }

  //生成预览模式显示区
  generateViewArea (value) {
    let element = null;
    const { viewRender, isOnlyShowText } = this.props;
    if (viewRender) {
      element = viewRender(value);
    } else {
      element = value;
      if (isOnlyShowText) {
        return element;
      }
    }
    return (
      <div className="form-field-render-view"><div className="form-field-render-view-value">{ element }</div></div>
    );
  }

  //文本
  generateTextInput(verificationRule, isMutiple) {
    const props = {
      ...this.pickProps(),
      verificationRule,
      isMutiple,
    };
    return (
      <FormFieldInput {...props} />
    );
  }

  //数字
  generateNumber (verificationRule) {
    const props = {
      ...this.pickProps(),
      verificationRule,
    };
    return (
      <FormFieldNumber {...props} />
    );
  }

  //多标签输入
  generateTagInput () {
    const props = {
      ...this.pickProps(),
      isMultiple: true,
    };
    return (
      <FormFieldTagInput {...props} />
    );
  }

  //单标签输入
  generateSingleTagInput () {
    const props = {
      ...this.pickProps(),
      isMultiple: false,
    };
    return (
      <FormFieldTagInput {...props} />
    );
  }

  //日期
  generateDate (verificationRule) {
    const { mode, size, value, disabled, placeholder, style = {} } = this.props;
    const commonProps = _.pick(this.props, DATE_PICKER_COMMON_PROPS.filter(value => this.props[value] != null));
    const format = DATE_FORMAT_MAP[verificationRule.dateFormatter] || 'YYYY-MM-DD';
    const props = {
      ...commonProps,
      locale,
      format,
      disabled,
      placeholder,
      size: size || 'default',
      style: { width: '100%', ...style },
      value: this.getDateValue(value),
      onChange: (value) => this.handleChangeDate(value, verificationRule.dateFormatter),
    };
    return mode === 'edit' ? (<DatePicker {...props} />) : this.generateViewArea(value ? moment(+value).format(format) : null);
  }

  //日期期间
  generateDateRange (verificationRule) {
    let { mode, size, value, disabled, placeholder, style = {} } = this.props;
    const commonProps = _.pick(this.props, DATE_PICKER_COMMON_PROPS.filter(value => this.props[value] != null));
    const format = DATE_FORMAT_MAP[verificationRule.dateFormatter] || 'YYYY-MM-DD';
    const props = {
      ...commonProps,
      locale,
      format,
      disabled,
      size: size || 'default',
      style: { width: '100%', ...style },
      value: this.getRangeDateValue(value),
      onChange: (value) => this.handleChangeRangeDate(value, verificationRule.dateFormatter)
    };

    if (placeholder) {
      props.placeholder = placeholder;
    }

    return mode === 'edit' ? (<RangePicker {...props} />) : this.generateViewArea((_.isArray(value) && value.length) ? value.map(v => moment(+v).format(format)).join('~') : null);
  }

  //单选组
  generateRadioGroup () {
    const props = {
      ...this.pickProps()
    };
    return (
      <FormFieldRadioGroup {...props} />
    );
  }

  //多选组
  generateCheckboxGroup () {
    const props = {
      ...this.pickProps()
    };
    return (
      <FormFieldCheckboxGroup {...props} />
    );
  }

  //下拉单选
  generateSingleSelect () {
    const props = {
      isMultiple: false,
      ...this.pickProps()
    };
    return (
      <FormFieldSelect {...props}/>
    );
  }

  //下拉多选
  generateMultipleSelect () {
    const props = {
      isMultiple: true,
      ...this.pickProps()
    };
    return (
      <FormFieldSelect {...props}/>
    );
  }

  //树形选择器
  generateTreeSelect (verificationRule, isMultiple) {
    const props = {
      isMultiple,
      ...this.pickProps()
    };
    if (verificationRule && verificationRule.isShowFullPath != null) {
      props.isShowFullPath = verificationRule.isShowFullPath === '1';
    }
    props.params = props.params || { apiName: props.field.dictId || 'CLASS_TREE' };
    return (
      <FormFieldTreeSelect {...props} />
    );
  }

  //搜索框
  generateSearchBox (isMultiple) {
    const props = {
      isMultiple,
      ...this.pickProps()
    };
    return (
      <FormFieldSearchBox {...props} />
    );
  }

  //人员搜索
  generateUserSearch (isMultiple) {
    const props = {
      isMultiple,
      ...this.pickProps()
    };
    return (
      <FormFieldUserSearchBox {...props} />
    );
  }

  //开关选择器
  generateSwitch () {
    const props = {
      ...this.pickProps()
    };
    return (
      <FormFieldSwitch {...props} />
    );
  }

  //生成自定义组件
  generateComponent () {
    const Component = this.props.component || EmptyComponent;
    return (
      <Component {...this.pickProps()} />
    );
  }

  generateCustomComponent (isMultiple) {
    const props = { isMultiple, ...this.pickProps() };
    return (
      <FormFieldCustomComponent {...props} />
    );
  }

  generateField () {
    const { field } = this.props;
    let { attrType, verificationRule } = field;

    verificationRule = this.parseRule(verificationRule);
    switch (attrType) {
      case ATTR_TYPE_INT:
      case ATTR_TYPE_FLOAT:
        return this.generateNumber(verificationRule);
      case ATTR_TYPE_CLOB:
        return this.generateTextInput(verificationRule, true);
      case ATTR_TYPE_DATE: 
        return this.generateDate(verificationRule);
      case ATTR_TYPE_DATE_RANGE:
        return this.generateDateRange(verificationRule);
      case ATTR_TYPE_RADIO:
        return this.generateRadioGroup();
      case ATTR_TYPE_CHECKBOX:
        return this.generateCheckboxGroup();
      case ATTR_TYPE_SWTICH:
      return this.generateSwitch();
      case ATTR_TYPE_SELECT:
        return this.generateSingleSelect();
      case ATTR_TYPE_MULTI_SELECT:
        return this.generateMultipleSelect();
      case ATTR_TYPE_TREE_SELECT:
      case ATTR_TYPE_TREE_MULTI_SELECT:
        return this.generateTreeSelect(verificationRule, attrType === ATTR_TYPE_TREE_MULTI_SELECT);
      case ATTR_TYPE_SEARCH:
      case ATTR_TYPE_MULTI_SEARCH:
        return this.generateSearchBox(attrType === ATTR_TYPE_MULTI_SEARCH);
      case ATTR_TYPE_PERSON:
      case ATTR_TYPE_MULTI_PERSON:
        return this.generateUserSearch(attrType === ATTR_TYPE_MULTI_PERSON);
      case ATTR_TYPE_TAG_INPUT:
        return this.generateTagInput();
      case ATTR_TYPE_SINGLE_TAG_INPUT:
        return this.generateSingleTagInput();
      case ATTR_TYPE_COMPONENT:
        return this.generateComponent();
      case ATTR_TYPE_CUSTOM_COMP:
      case ATTR_TYPE_CUSTOM_COMP_MULTI:
        return this.generateCustomComponent(attrType === ATTR_TYPE_CUSTOM_COMP_MULTI);
      case ATTR_TYPE_TEXT:
      default:
        return this.generateTextInput(verificationRule, false);
    }
  }

  render () {
    const { mode, viewWrapper } = this.props;
    const element = this.generateField();
    
    if (viewWrapper && mode === 'view') {
      const ViewWrapper = viewWrapper;
      return (<ViewWrapper>{element}</ViewWrapper>);
    } else {
      return element;
    }
  }

  static propsTypes = {
    viewWrapper: PropTypes.any,
    mode: PropTypes.string.isRequired,
    field: PropTypes.object.isRequred,
    disabled: PropTypes.bool.isRequred
  }

  static defaultProps = {
    field: {},
    mode: 'view',
    viewWrapper: null
  }
}