import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Form, Tooltip, Collapse } from 'antd';
import FormFieldRender from '../FormFieldRender';
import {
  ATTR_TYPE_TEXT,
  ATTR_TYPE_INT,
  ATTR_TYPE_CLOB,
  ATTR_TYPE_FLOAT,
  ATTR_TYPE_SELECT,
  ATTR_TYPE_SEARCH,
  ATTR_TYPE_TREE_SELECT,
  ATTR_TYPE_CUSTOM_COMP,
  REPLACEMENT_CHARACTER,
  IS_MUTIPLE_VALUE_FIELDS,
  ATTR_TYPE_CUSTOM_COMP_MULTI,
  ATTR_TYPE_TREE_MULTI_SELECT,
  ATTR_TYPE_MULTI_SEARCH,
} from '../../constant/attrType';

import _ from 'lodash';
import Tools from '../../util/tool';

import './DynamicFormRender.less';

const { Panel } = Collapse;
const { Item: FormItem } = Form;
const horizontalFormItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 }
};
const verticalFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  style: { marginBottom: 8 }
};
const horizontalTailFormItemLayout = {
  wrapperCol: { offset: 2, span: 22 }
};
const verticalTailFormItemLayout = {
  wrapperCol: { offset: 6, span: 18 },
  style: { marginBottom: 8 }
};
const numberType = {
  [ATTR_TYPE_INT]: 1,
  [ATTR_TYPE_FLOAT]: 1,
};
const textType = {
  [ATTR_TYPE_TEXT]: 1,
  [ATTR_TYPE_CLOB]: 1
};
const unitType = {
  [ATTR_TYPE_TEXT]: 1,
  [ATTR_TYPE_INT]: 1,
  [ATTR_TYPE_FLOAT]: 1,
  [ATTR_TYPE_SELECT]: 1,
  [ATTR_TYPE_SEARCH]: 1
};
const EVENTS = ['onChange', 'onBlur', 'onLoaded', 'onSelfChange', 'getData'];

export default class DynamicFormRender extends Component {
  state = {
    activeKey: []
  }

  componentDidMount () {
    this.setState({
      activeKey: this.props.itemList.map(({ id }) => id)
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      activeKey: nextProps.itemList.map(({ id }) => id)
    });
  }

  //是否大文本
  isItemShowAlone (attrType, relyAttributeList, isShowAlone) {
    if (_.isEmpty(relyAttributeList)) {
      return attrType === ATTR_TYPE_CLOB || isShowAlone === '1' || isShowAlone === true;
    } else {
      return this.props.mode === 'view';
    }
  }

  //是否树形选择
  isTreeSelect (attrType) {
    return ({ [ATTR_TYPE_TREE_SELECT]: 1, [ATTR_TYPE_TREE_MULTI_SELECT]: 1 })[attrType];
  }

  //是否搜索
  isSearchBox (attrType) {
    return ({ [ATTR_TYPE_SEARCH]: 1, [ATTR_TYPE_MULTI_SEARCH]: 1 })[attrType];
  }

  //大文本是否单独行显示
  isTextAreaAlone () {
    return this.props.isTextAreaAlone;
  }

  formatItemList (itemList) {
    let items = [];
    const result = [];
    const columnCount = this.props.columnCount || 3;

    while (itemList && itemList.length) {
      if (this.isTextAreaAlone()) {
        const item = itemList.shift();
        if (this.isItemShowAlone(item.attrType, item.relyAttributeList, this.getIsShowAlone(item))) {
          //如果遇到TextArea则将之前存的非Textarea的放入行数组
          if (items.length) {
            result.push([...items]);
            items = [];
          }
          result.push([{ ...item }]);//TextArea单独成行
        } else {
          //如果非TextArea的个数已达到列数,则放入行数组
          if (items.length === columnCount) {
            result.push([...items]);
            items = [];
          }
          items.push({ ...item });
        }
      } else {
        result.push(itemList.splice(0, columnCount));
      }
    }

    if (items.length) {
      result.push([...items]);
    }

    return result;
  }

  //是否单行显示
  getIsShowAlone (field) {
    const { isShowAlone, verificationRule } = field;
    const value = isShowAlone != null ? isShowAlone : (verificationRule ? JSON.parse(verificationRule) : {}).isShowAlone;
    return value == null  ? false : (_.isString(value) ? value === '1' : value);
  }

  //是否只能选择子节点
  getIsOnlyChild (field) {
    const { isOnlyChild, verificationRule } = field;
    const value = isOnlyChild != null ? isOnlyChild : (verificationRule ? JSON.parse(verificationRule) : {}).isOnlyChild;
    return value == null  ? false : (_.isString(value) ? value === '1' : value);
  }

  //checkable 状态下节点选择完全受控（父子节点选中状态不再关联），会使得 labelInValue 强制为 true
  getTreeCheckStrictly (field) {
    const { treeCheckStrictly, verificationRule } = field;
    const value = treeCheckStrictly != null ? treeCheckStrictly : (verificationRule ? JSON.parse(verificationRule) : {}).treeCheckStrictly;
    return value == null  ? false : (_.isString(value) ? value === '1' : value);
  }

  getValue (value, defaultValue, attrType) {
    if (value == null && this.props.isSetDefaultValue) {
      if (defaultValue == null) {
        value = undefined;
      } else {
        if (IS_MUTIPLE_VALUE_FIELDS[attrType] && _.isString(defaultValue)) {
          value = defaultValue.split(new RegExp(REPLACEMENT_CHARACTER));
        } else {
          value = defaultValue;
        }
      }
    }
    return value;
  }

  getHasFeedback () {
    const { mode, hasFeedback } = this.props;
    return mode === 'edit' ? (hasFeedback == null ? false : hasFeedback) : false;
  }

  getVerticalLayout (name) {
    return name ? (this.props.formItemLayout || verticalFormItemLayout) : verticalTailFormItemLayout;
  }

  getHorizontalLayout (name, isItemShowAlone, factor) {
    if (name) {
      const formItemLayout = this.props.formItemLayout || horizontalFormItemLayout;
      if (this.isTextAreaAlone() && isItemShowAlone) {
        const labelColSpan = formItemLayout.labelCol ? Math.ceil(formItemLayout.labelCol.span / factor) : formItemLayout.labelCol.span;
        const wrapperColSpan = 24 - labelColSpan || 0;
        return ({ labelCol: { span: labelColSpan }, wrapperCol: { span: wrapperColSpan } });
      } else {
        return formItemLayout;
      }
    } else {
      return horizontalTailFormItemLayout;
    }
  }

  isDisabled (field) {
    const { mode } = this.props;
    return mode === 'view' || field.isEditable === '0';
  }

  mergeValuesIntoItemList (itemList, values) {
    return (values && !_.isEmpty(values)) ? itemList.map(item => {
      const { id } = item;
      if (id in values) {
        item.value = values[id];
      }
      return { ...item };
    }) : itemList;
  }

  //获取校验规则列表
  getRules (item) {
    let { 
      rules,
      attrType,
      isEditable,
      isRequired,
      verificationRule,
      moduleConfigInfo,
      unitConfig = false,
      unitDataSource = []
    } = item;

    rules = rules || [];

    const unitData = _.filter(unitDataSource, ({ enabled = true }) => enabled);//状态可用单位列表数据
    const hasContainUnit = unitConfig && unitData.length && unitType[attrType];//带单位

    //是否开启必填校验
    const shouldValidateRequried = !rules.find(({ required }) => required == null) 
      && isRequired === '1' 
        && this.props.isValidateRequired 
          && (isEditable == null || isEditable === '1');

    if (shouldValidateRequried) {
      rules.push({ message: '必填', required: isRequired === '1' });
      
      if (hasContainUnit) {
        rules.push({
          validator: (rule, value, callback) => {
            const { unitKeyName = 'unitInfo' } = unitConfig;
            const unitValue = value[unitKeyName] || '';
            const [id, unit] = unitValue.split(REPLACEMENT_CHARACTER);
            if (!id || !unit) { callback('必填') }
            callback();
          }
        });
      } else if (({ [ATTR_TYPE_CUSTOM_COMP]: 1, [ATTR_TYPE_CUSTOM_COMP_MULTI]: 1 })[attrType] && moduleConfigInfo) {
        //定制组件值校验，必须所有输入框都需有值
        moduleConfigInfo = JSON.parse(moduleConfigInfo);
        rules.push({
          validator: (rule, value, callback) => {
            const { unitInfo = '' } = value || {};
            const requireField = this.getCustomCompRequireField(moduleConfigInfo);
            if (attrType === ATTR_TYPE_CUSTOM_COMP) {
              const valueMap = this.parseCustomCompValue(unitInfo, moduleConfigInfo);
              if (requireField.filter(id => !_.isEmpty(valueMap[id])).length !== requireField.length) {
                callback(`请输入值`);
              }
              callback();
            } else {
              const values = unitInfo.split(/;/g).map(value => this.parseCustomCompValue(value, moduleConfigInfo));
              if (values.some(value => requireField.filter(id => !_.isEmpty(value[id])).length !== requireField.length)) {
                callback(`每行输入框都需填写`);
              }
              callback();
            }
          }
        });
      }
    }

    //定制校验规则
    if (verificationRule) {
      verificationRule = JSON.parse(verificationRule);//是否有定制校验规则
      if (numberType[attrType]) {
        //数字校验规则
        if (hasContainUnit) {
          //带单位数据校验规则
          this.getHasUnitMinAndMaxRules(rules, verificationRule, unitConfig);
        } else {
          this.getMinAndMaxRules(rules, verificationRule);
        }
      } else if (textType[attrType]) {
        //正则表达式校验规则
        const regExp = verificationRule.regExp ? JSON.parse(verificationRule.regExp) : undefined;
        if (hasContainUnit) {
          this.getHasUnitRegExpRules(rules, regExp, unitConfig);
        } else {
          this.getRegExpRules(rules, regExp);
        }

        //字节校验规则
        const { isValidChar, maxLength } = verificationRule;
        if (maxLength && isValidChar === '1') {
          if (hasContainUnit) {
            this.getHasUnitValidCharRules(rules, maxLength, unitConfig);
          } else {
            this.getValidCharRules(rules, maxLength);
          }
        }
      }
    }

    return [...rules];
  }

  getCustomCompRequireField (moduleConfigInfo) {
    const field = [];
    const compList = moduleConfigInfo;

    compList.forEach(item => {
      const { id, attrType, isRequired = '1' } = item;
      if (({ [ATTR_TYPE_INT]: 1, [ATTR_TYPE_TEXT]: 1, [ATTR_TYPE_SELECT]: 1 })[attrType] && isRequired === '1') {
        field.push(id);
      }
    });

    return [...field];
  }

  //不带单位的最小/最大值校验规则
  getMinAndMaxRules (rules, verificationRule) {
    if ('max' in verificationRule || 'min' in verificationRule || 'accuracy' in verificationRule) {
      rules.push({
        validator: (rule, value, callback) => {
          const { min, max, accuracy } = verificationRule;
          if (value != null) {
            if ('min' in verificationRule && min != null) {
              if (value < min) {
                callback(`最小值${min}`);
              }
            }
            if ('max' in verificationRule && max != null) {
              if (value > max) {
                callback(`最大值${max}`);
              }
            }
            if ('accuracy' in verificationRule && accuracy !== null) {
              if (Number(Number(value).toFixed(accuracy)) !== Number(value)) {
                callback(`保留小数${accuracy}位`);
              }
            }
          }
          callback();
        }
      });
    }
  }

  //有单位的最小/最大值校验规则
  getHasUnitMinAndMaxRules (rules, verificationRule, { unitKeyName = 'unitInfo' }) {
    if ('max' in verificationRule || 'min' in verificationRule || 'accuracy' in verificationRule) {
      rules.push({
        validator: (rule, value, callback) => {
          const { min, max, accuracy } = verificationRule;
          const unitValue = value[unitKeyName];
          if (unitValue) {
            const [id] = unitValue.split(REPLACEMENT_CHARACTER);
            if (id != null) {
              if ('min' in verificationRule && min != null) {
                if (id < min) {
                  callback(`最小值${min}`);
                }
              }
              if ('max' in verificationRule && max != null) {
                if (id > max) {
                  callback(`最大值${max}`);
                }
              }
              if ('accuracy' in verificationRule && accuracy !== null) {
                if (Number(Number(id).toFixed(accuracy)) !== Number(id)) {
                  callback(`保留小数${accuracy}位`);
                }
              }
            }
          }
          callback();
        }
      });
    }
  }

  //获取正则表达式
  getRegExp (regExpStr) {
    let regExp;
    if(/^\/(\^?.+\$?)\/([gim]*)$/.test(regExpStr)) {
      regExp = new RegExp(RegExp.$1, RegExp.$2);
      RegExp.lastIndex = 0;
    }
    return regExp;
  }

  //正则表达式校验规则
  getRegExpRules (rules, regExp) {
    if (regExp && regExp.length) {
      rules.push(...regExp.map(({ regExp, message }) => ({
        validator: (rule, value, callback) => {
          if (value) {
            regExp = this.getRegExp(regExp);
            if (regExp && !regExp.test(value)) { callback(message) }
          }
          callback();
        }
      })));
    }
  }

  getValidCharRules (rules, maxLength) {
    rules.push({
      validator: (rule, value, callback) => {
        if (value && Tools.byteSizeOfString(value) > Number(maxLength)) {
          callback(`字节长度不能超过${maxLength},一个中文字符等于三个字节`);
        }
        callback();
      }
    });
  }

  //带单位正则表达式校验规则
  getHasUnitRegExpRules (rules, regExp, { unitKeyName = 'unitInfo' }) {
    if (regExp && regExp.length) {
      rules.push(...regExp.map(({ regExp, message }) => ({
        validator: (rule, value, callback) => {
          const unitValue = value[unitKeyName];
          if (unitValue) {
            const [id] = unitValue.split(REPLACEMENT_CHARACTER);
            if (id) {
              regExp = this.getRegExp(regExp);
              if (regExp && !regExp.test(id)) { callback(message) }
            }
          }
          callback();
        }
      })));
    }
  }

  getHasUnitValidCharRules (rules, maxLength, { unitKeyName = 'unitInfo' }) {
    rules.push({
      validator: (rule, value, callback) => {
        const unitValue = value[unitKeyName];
        if (unitValue) {
          const [id] = unitValue.split(REPLACEMENT_CHARACTER);
          if (id && id.replace(/[\u4e00-\u9fa5]/g,"aa").length > Number(maxLength)) {
            callback(`字节长度不能超过${maxLength},一个中文=两个字节`);
          }
        }
        callback();
      }
    });
  }

  parseCustomCompValue (unitInfo, compList) {
    const valueMap = {};
    if (unitInfo) {
      const values = unitInfo.split(new RegExp(REPLACEMENT_CHARACTER, 'g'));
      compList.map((item, index) => { valueMap[item.id] = values[index] });
    } else {
      compList.map((item) => { valueMap[item.id] = undefined });
    }

    return { ...valueMap }
  }

  handleChange = (activeKey) => {
    this.setState({ activeKey });
  }

  generateCollapse(item) {
    const props = {
      onChange: this.handleChange,
      activeKey: this.state.activeKey
    };
    const { isCollapse } = this.props;
    return isCollapse ? (
      <Collapse {...props}>
        {
          item.filter(({ attributeDtoList }) => {
            return attributeDtoList && attributeDtoList.length;
          }).map(({ id, name, attributeDtoList }) => {
            const props = { key: id, header: (<div data-id={`dynamic_form_render_panel_${id}`}>{name}</div>) };
            return (<Panel {...props}>{this.generateFormFields(attributeDtoList)}</Panel>);
          })
        }
      </Collapse>
    ) : this.generateFormFields(item);
  }

  generateFormFields(itemList) {
    const { values, direction } = this.props;
    itemList = this.mergeValuesIntoItemList((itemList || []).filter(({ isEnabled }) => (isEnabled == null || isEnabled === '1')), values);
    return direction === 'vertical' ? this.generateVerticalFormFileds(itemList) : this.generateHorizontalFormFileds(itemList);
  }

  generateHorizontalFormFileds(itemList) {
    return (
      <div>
        { this.formatItemList(itemList).map((list, index) => this.generateHorizontalRow(list, index)) }
      </div>
    );
  }

  generateHorizontalRow(list, index) {
    return (
      <Row key={index}>
        {this.generateHorizontalRowItems(list)}
      </Row>
    );
  }

  generateRowItems(list, isVertical, factor) {
    const { mode, formFiledRender, size, form: { getFieldDecorator } } = this.props;
    const FromFiledRenderComponent = formFiledRender || FormFieldRender;

    return list.map(item => {
      const {
        id,
        key,
        name,
        value,
        attrType,
        helpNotes,
        inputWarn,
        defaultValue,
        availableList,
        isShowFullPath,
        relyAttributeList,
        isHelpNotesAlwaysNo
      } = item;
      const getLabel = () => {
        const { labelRender } = this.props;
        const label = labelRender ? labelRender(name) : name;
        return (isHelpNotesAlwaysNo === '0' && helpNotes) ? (
          <Tooltip placement="top" title={helpNotes}>
            <span>{label}<Icon type="question-circle-o" style={{ color: 'gray' }} /></span>
          </Tooltip>
        ) : label;
      };
      const isItemShowAlone = this.isItemShowAlone(attrType, relyAttributeList, this.getIsShowAlone(item));
      let formProps = {
        label: getLabel(),
        hasFeedback: this.getHasFeedback(),
        ...this.getHorizontalLayout(name, isItemShowAlone, factor)
      };
      if (mode === 'edit' && isHelpNotesAlwaysNo === '1' && helpNotes) {
        formProps.extra = helpNotes;
      }
      if (isVertical) {
        formProps = {
          ...formProps,
          ...this.getVerticalLayout(name)
        };
      } else {
        formProps.style = (formProps.style || {});
        formProps.style.marginBottom =  isItemShowAlone ? '4px' : '2px';
      }
      
      const filedProps = {
        mode,
        size,
        availableList,
        form: this.props.form,
        placeholder: inputWarn,
        disabled: this.isDisabled(item),
        columnCount: this.props.columnCount,
        formFiledRender: this.props.formFiledRender,
        field: { ..._.omit(item, EVENTS), attrType: (item.attrType === ATTR_TYPE_TEXT && this.getIsShowAlone(item)) ? ATTR_TYPE_CLOB : item.attrType },
        ..._.omit(item, ['value', 'defaultValue']),
      };

      if (key != null) {
        filedProps.key = `formFieldRender_${key}`;
      }
      if (this.isTreeSelect(attrType)) {
        filedProps.isShowFullPath = isShowFullPath == null ? true : isShowFullPath === '1';
        filedProps.isOnlyChild = this.getIsOnlyChild(item);
        filedProps.treeCheckStrictly = this.getTreeCheckStrictly(item);
      }
      if (this.isSearchBox(attrType)) {
        filedProps.isAllowViewModeCodeNotMatch = true;
      }

      return {
        field: { ...item },
        component: (
          <FormItem key={id} {...formProps}>
            {
              getFieldDecorator(id, {
                rules: this.getRules(item),
                initialValue: this.getValue(value, defaultValue, attrType)
              })(
                <FromFiledRenderComponent {...filedProps} />
              )
            }
          </FormItem>
        )
      };
    });
  }

  generateHorizontalRowItems(list) {
    const { columnCount } = this.props;
    const columnWidth = Math.floor(24 / (columnCount || 3));
    return this.generateRowItems(list, false, (24 / columnWidth)).map(({ field, component }, key) => {
      const { attrType, relyAttributeList } = field;
      const colProps = (this.isTextAreaAlone() && this.isItemShowAlone(attrType, relyAttributeList, this.getIsShowAlone(field))) ? {
        key,
        sm: 24,
        lg: 24,
        xl: 24
      } : {
        key,
        sm: columnWidth,
        lg: columnWidth,
        xl: columnWidth
      };
      return (
        <Col {...colProps}>{component}</Col>
      );
    });
  }

  generateVerticalFormFileds(list) {
    return this.generateRowItems(list, true).map(({ component }) => component);
  }

  render() {
    const props = {};
    if (this.props.key != null) {
      props.key = `dynamicFormRender_${this.props.key}`
    }

    return (
      <div {...props} className={`dynamic-form-render-wrapper ${this.props.mode === 'view' ? 'dynamic-form-render-view-mode' : ''}`}>
        {this.generateCollapse(this.props.itemList)}
      </div>
    );
  }

  static propTypes = {
    key: PropTypes.string,
    values: PropTypes.object,
    columnCount: PropTypes.number,
    formItemLayout: PropTypes.object,
    labelRender: PropTypes.func,
    isSetDefaultValue: PropTypes.bool,
    isValidateRequired: PropTypes.bool,
    mode: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    size: PropTypes.string.isRequired,
    itemList: PropTypes.array.isRequired,
    isCollapse: PropTypes.bool.isRequired,
    direction: PropTypes.string.isRequired,
    isTextAreaAlone: PropTypes.bool,
  }

  static defaultProps = {
    values: {},
    mode: 'view',
    itemList: [],
    columnCount: 3,
    size: 'default',
    isCollapse: true,
    isTextAreaAlone: false,
    isSetDefaultValue: true,
    direction: 'horizontal',
    isValidateRequired: true
  }
}