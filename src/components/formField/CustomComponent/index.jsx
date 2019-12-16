import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, InputNumber } from 'antd';
import Select from '../Select';
import { 
  ATTR_TYPE_INT,
  ATTR_TYPE_TEXT,
  ATTR_TYPE_LABEL,
  ATTR_TYPE_SELECT,
  REPLACEMENT_CHARACTER,
  CUSTOM_COMP_ITEM_TYPE_INPUT
} from '../../../constant/attrType';

import _ from 'lodash';
import './style.less';

const { Group: InputGroup } = Input;
const SPECIAL_CHARACTER_MAP = [
  ['~', '～'],
  ['.', '。'],
  ['!', '！'],
  ['(', '（'],
  [')', '）'],
  [',', '，'],
  ['?', '？'],
  [';', '；'],
  [':', '：'],
  ['[', '【'],
  [']', '】'],
  ['(', '（'],
  [')', '）']
];

export default class CustomComponent extends Component {
  state = {
    valueMap: {}
  }

  componentWillMount () {
    this.collection = {};
    this.parseValue(this.props.field);
  }

  componentWillReceiveProps (nextProps) {
    let { value: newValue } = nextProps;
    let { value: oldValue } = this.props;

    newValue = newValue || {};
    oldValue = oldValue || {};

    if (newValue.attrValue !== oldValue.attrValue || newValue.unitInfo !== oldValue.unitInfo) {
      this.parseValue(nextProps);
    }
  }

  componentWillUnMount () {
    this.collection = null;
  }

  filterDictId (compList, isHasCache = false) {
    return _.uniqBy(compList.filter(({ dictId, attrType }) => {
      return attrType === ATTR_TYPE_SELECT && dictId && (isHasCache ? this.getDataFromCache(dictId) : !this.getDataFromCache(dictId));
    }), 'dictId')
  }

  isEmpty (compList, valueMap) {
    const inputTypeCompValues = _.transform(compList.filter(({type}) => {
      return type === CUSTOM_COMP_ITEM_TYPE_INPUT;
    }), (result, item) => {
      const value = valueMap[item.id];
      if (value != null && `${value}`.trim()) { result[item.id] = value; }
    }, {});
    return _.isEmpty(inputTypeCompValues);
  }

  onChange (value) {
    value = value || this.getValue();
    this.props.onChange && this.props.onChange(value);
    this.props.onSelfChange && this.props.onSelfChange(value, this.getCompList());
  }

  getDataFromCache (dictId) {
    const key = `FORM_FILED_RENDER_SELECT_${dictId}`;
    const data = sessionStorage.getItem(key);
    if (data && JSON.parse(data).length) {
      return JSON.parse(data);
    }
  }
  
  replaceSpecialCharacter (string) {
    //return string.replace(/[~!@#$%^&*()/|,.<>?"'();:_+\-=[\]{}]/g, `\\$&`);
    return string.replace(/[~～!！@#$%^&*(（)）/|,，.。<>?？"'(（)）;；:：_+\-=[【\]】{}]/g, (target) => {
      const match = SPECIAL_CHARACTER_MAP.find(item => !!~_.indexOf(item, target));
      if (match) {
        return `[\\${match[0]}|${match[1]}]`;
      } else {
        return `\\${target}`;
      }
    });
  }

  generateRegExp (compList, collection) {
    const expressions = [];

    compList.forEach(({ dictId, attrType, defaultValue, availableList }) => {
      if (attrType === ATTR_TYPE_LABEL) {
        expressions.push(`(${this.replaceSpecialCharacter(defaultValue)})`);
      } else if (attrType === ATTR_TYPE_INT) {
        expressions.push('(\\d+\\.?\\d*)?');
      } else if (attrType === ATTR_TYPE_TEXT) {
        expressions.push('(.+)?');
      } else if (attrType === ATTR_TYPE_SELECT) {
        if (dictId) {
          const list = (availableList && availableList.length) ? collection[dictId].filter(({ code }) => !!~_.indexOf(availableList, code)) : collection[dictId];
          expressions.push(`(${list.map(({ name }) => { return this.replaceSpecialCharacter(name) }).join('|')})?`);
        } else {
          expressions.push(`(${availableList.map(name => { return this.replaceSpecialCharacter(name) }).join('|')})?`);
        }
      }
    });

    return expressions.length ? new RegExp(`^${expressions.join('')}$`, 'gim') : null;
  }

  parseValue (props) {
    const { attrValue, unitInfo } = props.value || {};
    const compList = this.getCompList();
    const isAttrValueHasValue = (attrValue != null && `${attrValue}`.trim());
    const isUnitInfoNotInit = unitInfo == null || !`${attrValue}`.trim();
    let collection = _.transform(this.filterDictId(compList, true), (result, value) => {
      const { dictId } = value;
      result[dictId] = this.getDataFromCache(dictId);
    }, {});
    const promises = this.filterDictId(compList).map(({ dictId }) => {
      return { dictId, promise: this.props.getData({ params: { apiName: dictId } }) };
    });
    const parse = () => {
      if (isAttrValueHasValue && isUnitInfoNotInit) {
        this.parseSpecialValue(compList, attrValue);
      } else {
        this.parseNormalValue(compList, unitInfo);
      }
    };

    if (promises.length) {
      Promise.all(promises.map(({ promise }) => promise)).then((res) => {
        this.collection = { ...collection, ..._.transform(res, (result, { data: { content } }, key) => { result[promises[key].dictId] = (content || []); }, {}) };
        parse();
      });
    } else {
      this.collection = { ...collection };
      parse();
    }
  }

  //前端从attrValue根据配置的定制组件生成正则解析值
  parseSpecialValue (compList, attrValue) {
    let valueMap = {};
    const regExp = this.generateRegExp(compList, this.collection);

    if (regExp) {
      if (regExp.test(`${attrValue}`.trim())) {
        compList.forEach(({ id, dictId, attrType }, index) => {
          if (dictId && attrType === ATTR_TYPE_SELECT) {
            if (this.collection && this.collection[dictId]) {
              const match = (this.collection[dictId] || []).find(({ name }) => name === RegExp[`$${index + 1}`]);
              valueMap[id] = match ? match.code : RegExp[`$${index + 1}`];
            } else {
              valueMap[id] = RegExp[`$${index + 1}`];
            }
          } else {
            valueMap[id] = RegExp[`$${index + 1}`];
          }
        });
      } else {
        compList.map(({ id, defaultValue }) => valueMap[id] = defaultValue);
      }
      regExp.lastIndex = 0;
    } else {
      compList.map(({ id, defaultValue }) => valueMap[id] = defaultValue);
    }

    this.setState({ valueMap });
    this.onChange(this.getValue(valueMap));
  }

  parseNormalValue (compList, unitInfo) {
    const valueMap = {};

    if (unitInfo) {
      const values = unitInfo.split(new RegExp(REPLACEMENT_CHARACTER, 'g'));
      compList.map((item, index) => { valueMap[item.id] = values[index] });
    } else {
      compList.map(({ id, defaultValue }) => valueMap[id] = defaultValue);
    }

    this.onChange(this.getValue(valueMap));
    this.setState({ valueMap });
  }

  getValue (valueMap) {
    valueMap = valueMap || this.state.valueMap;

    const compList = this.getCompList();
    if (this.isEmpty(compList, valueMap)) {
      return { attrValue: null, unitInfo: null };
    } else {
      const unitInfos = compList.map(item => valueMap[item.id] == null ? '' : valueMap[item.id]);
      const attrValues = compList.map(item => {
        const { attrType, dictId } = item;
        if (dictId && attrType === ATTR_TYPE_SELECT && valueMap[item.id]) {
          if (this.collection && this.collection[dictId]) {
            const match = (this.collection[dictId] || []).find(({ code }) => code === valueMap[item.id]);
            return match ? match.name : (valueMap[item.id] == null ? '' : valueMap[item.id]);
          } else {
            return valueMap[item.id] == null ? '' : valueMap[item.id];
          }
        } else {
          return valueMap[item.id] == null ? '' : valueMap[item.id];
        }
      });
      return { attrValue: attrValues.join(''), unitInfo: unitInfos.join(REPLACEMENT_CHARACTER) };
    }
  }

  getCompList () {
    return JSON.parse(this.props.moduleConfigInfo || null) || [];
  }

  handleChange = (id, value) => {
    const { valueMap } = this.state;
    this.setState({ 
      valueMap: { ...valueMap, [id]: value }
    }, () => {
      this.onChange();
    });
  }

  generateComponent () {
    const { mode } = this.props;
    return mode === 'edit' ? this.generateCompactInput() : this.generateViewArea();
  }

  generateViewArea () {
    let title;
    let element = null;
    const { valueMap } = this.state;
    const compList = this.getCompList();
    const { viewRender } = this.props;
    const value = ((this.props.field.value || {}).unitInfo || '').replace(new RegExp(REPLACEMENT_CHARACTER, 'g'), '');

    if (viewRender) {
      element = viewRender(value, valueMap, compList);
    } else {
      title = value;
      element = this.generateCompactInput(true);
    }

    return (
      <div className="form-field-render-view" title={title}><div className="form-field-render-view-value">{ element }</div></div>
    );
  }

  generateEditModeInput (valueMap, compList) {
    const { disabled, size = 'default' } = this.props;
    const props = { size, compact: true, className: 'form-filed-custom-component-wrapper' };

    return (
      <InputGroup {...props}>
        {
          compList.map(item => {
            let { id, dictId, attrType, defaultValue, availableList = [], verificationRule } = item;
            let props = { size, disabled, key: id };
            let element = null;

            if (attrType === ATTR_TYPE_LABEL) {
              props = { 
                ...props, 
                disabled: true,
                title: defaultValue,
                className: 'ellipsis',
                style: { padding: '0', minWidth: '20px', maxWidth: '50px' }
              };
              element = (<Button {...{...props}}>{defaultValue}</Button>);
            } else if (({ [ATTR_TYPE_INT]: 1, [ATTR_TYPE_TEXT]: 1 })[attrType]) {
              props = { 
                ...props, 
                defaultValue,
                value: valueMap[id],
                style: { minWidth: 40, maxWidth: 50 }
              };
              verificationRule = verificationRule ? JSON.parse(verificationRule) : null;
              if (verificationRule) {
                _.forEach(verificationRule, (value, key) => {
                  props[key] = value;
                });
              }
              if (attrType === ATTR_TYPE_INT) {
                props.onChange = (value) => this.handleChange(id, (`${(value == null || !`${value}`.trim()) ? '' : value}`).trim());
                element = (<InputNumber {...props}/>);
              } else {
                props.onChange = (e) => this.handleChange(id, (e.target.value || '').trim());
                element = (<Input {...props}/>);
              }
            } else if (attrType === ATTR_TYPE_SELECT) {
              props = { 
                ...props,
                mode: 'edit',
                isMultiple: false,
                dropdownMatchSelectWidth: false,
                style: { minWidth: 40, maxWidth: 110 },
                className: 'form-filed-custom-component-unit',
                onChange: (value) => this.handleChange(id, value),
                value: valueMap[id] ? valueMap[id] : valueMap[id] == null ? defaultValue : undefined
              };

              if (dictId) {
                props.field = { dictId };
                props.availableList = availableList;
                props.getData = this.props.getData;
              } else {
                props.dataSource = (availableList || []).map(code => ({ code, name: code }));
              }

              element = (
                <Select {...props} />
              );
            }
            
            return element;
          })
        }
      </InputGroup>
    );
  }

  generateViewModeInput (valueMap, compList) {
    return !this.isEmpty(compList, valueMap) && (
      <div>
        {
          compList.map(item => {
            let { id, dictId, attrType, defaultValue, availableList = [] } = item;
            const commonProps = { key: id, style: { display: 'inline-block' } };
            let element = null;

            if (attrType === ATTR_TYPE_LABEL) {
              element = (<div {...commonProps}>{defaultValue}</div>);
            } else if (({ [ATTR_TYPE_INT]: 1, [ATTR_TYPE_TEXT]: 1 })[attrType]) {
              element = (<div {...commonProps}>{valueMap[id]}</div>);
            } else if (attrType === ATTR_TYPE_SELECT) {
              const props = { 
                mode: 'view',
                isMultiple: false,
                dropdownMatchSelectWidth: false,
                value: valueMap[id] ? valueMap[id] : valueMap[id] == null ? defaultValue : undefined
              };

              if (dictId) {
                props.field = { dictId };
                props.availableList = availableList;
                props.getData = this.props.getData;
              } else {
                props.dataSource = (availableList || []).map(code => ({ code, name: code }));
              }

              element = (<div {...commonProps}><Select {...props} /></div>);
            }
            
            return element;
          })
        }
      </div>
    );
  }

  generateCompactInput (isViewMode = false) {
    const compList = this.getCompList();
    const { valueMap } = this.state;

    return isViewMode ? this.generateViewModeInput(valueMap, compList) : this.generateEditModeInput(valueMap, compList);
  }

  render () {
    return this.generateComponent();
  }
  
  static propTypes = {
    value: PropTypes.any,
    mode: PropTypes.string,
    style: PropTypes.object,
    getData: PropTypes.func,
    disabled: PropTypes.bool,
    moduleConfigInfo: PropTypes.string
  }
}