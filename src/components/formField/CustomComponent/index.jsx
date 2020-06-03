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
import uuid from 'uuid';
import Tools from '../../../util/tool';

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

const getWidth = (width, attrType) => {
  if (ATTR_TYPE_LABEL === attrType) {
    return width || 30;
  } else if (({ [ATTR_TYPE_INT]: 1, [ATTR_TYPE_TEXT]: 1 })[attrType]) {
    return width || 40;
  } else if (attrType === ATTR_TYPE_SELECT) {
    return width || 60;
  } else {
    return width || 50;
  }
};

export default class CustomComponent extends Component {
  state = {
    valueMap: null
  }

  componentWillMount () {
    this.collection = {};
    this.isTriggerChange = false;
    this.parseValue(this.props.field);
  }

  componentWillReceiveProps (nextProps) {
    if (this.isTriggerChange) { this.isTriggerChange = false; return; }

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

  validateEmpty (compList, valueMap) {
    const inputTypeCompValues = _.transform(compList.filter(({type}) => {
      return type === CUSTOM_COMP_ITEM_TYPE_INPUT;
    }), (result, item) => {
      const value = valueMap[item.id];
      if (value != null && `${value}`.trim()) { result[item.id] = value; }
    }, {});
    return _.isEmpty(inputTypeCompValues);
  }

  isEmpty (compList, valueMap) {
    if (this.isMultiple()) {
      return false/*valueMap.map(value => this.validateEmpty(compList, value)).every(value => !value)*/;
    } else {
      return this.validateEmpty(compList, valueMap);
    }
  }

  /**
   * 默认单值
   * @param {*} props 
   */
  isMultiple (props = this.props) {
    const { isMultiple = false } = props;
    return isMultiple;
  }

  getIdx () {
    return uuid.v4().replace(/-/g, '');
  }

  filterDictId (compList, isHasCache = false) {
    return _.uniqBy(compList.filter(({ dictId, attrType }) => {
      return attrType === ATTR_TYPE_SELECT && dictId && (isHasCache ? this.getDataFromCache(dictId) : !this.getDataFromCache(dictId));
    }), 'dictId')
  }

  onChange (value) {
    value = value || this.getValue();
    
    this.isTriggerChange = true;
    this.props.onChange && this.props.onChange(value);
    this.props.onSelfChange && this.props.onSelfChange(value, this.getCompList());
  }

  getDataFromCache (dictId) {
    const data = Tools.sessionStorage.get(`FORM_FILED_RENDER_SELECT_${dictId}`);
    if (data && data.length) {
      return data;
    }
  }
  
  replaceSpecialCharacter (string) {
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
    let valueMap = null;
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
        if (this.isMultiple()) {
          if (attrValue) {
            valueMap = attrValue.split(/\;/g).map(value => {
              return { idx: this.getIdx(), ...this.parseSpecialValue(compList, value) };
            });
          } else {
            valueMap = [{ idx: this.getIdx(), ...this.parseSpecialValue(compList, '') }];
          }
        } else {
          valueMap = this.parseSpecialValue(compList, attrValue);
        }
      } else {
        if (this.isMultiple()) {
          if (unitInfo) {
            valueMap = unitInfo.split(/\;/g).map(value => {
              return { idx: this.getIdx(), ...this.parseNormalValue(compList, value) }
            });
          } else {
            valueMap = [{ idx: this.getIdx(), ...this.parseNormalValue(compList, '') }];
          }
        } else {
          valueMap = this.parseNormalValue(compList, unitInfo);
        }
      }
      this.setState({ valueMap });
      this.onChange(this.getValue(valueMap));
    };

    if (promises.length) {
      Promise.all(promises.map(({ promise }) => promise)).then((res) => {
        this.collection = { 
          ...collection,
          ..._.transform(res, (result, { data: { content } }, key) => { result[promises[key].dictId] = (content || []); }, {})
        };
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
    
    return valueMap;
  }

  parseNormalValue (compList, unitInfo) {
    const valueMap = {};

    if (unitInfo) {
      const values = unitInfo.split(new RegExp(REPLACEMENT_CHARACTER, 'g'));
      compList.map((item, index) => { valueMap[item.id] = values[index] });
    } else {
      compList.map(({ id, defaultValue }) => valueMap[id] = defaultValue);
    }

    return valueMap;
  }

  getValue (valueMap) {
    valueMap = valueMap || this.state.valueMap;

    const compList = this.getCompList();
    if (this.isEmpty(compList, valueMap)) {
      return { attrValue: null, unitInfo: null };
    } else {
      const formatValue = (value) => {
        const unitInfos = compList.map(item => value[item.id] == null ? '' : value[item.id]);
        const attrValues = compList.map(item => {
          const { attrType, dictId } = item;
          if (dictId && attrType === ATTR_TYPE_SELECT && value[item.id]) {
            if (this.collection && this.collection[dictId]) {
              const match = (this.collection[dictId] || []).find(({ code }) => code === value[item.id]);
              return match ? match.name : (value[item.id] == null ? '' : value[item.id]);
            } else {
              return value[item.id] == null ? '' : value[item.id];
            }
          } else {
            return value[item.id] == null ? '' : value[item.id];
          }
        });
        return { unitInfos, attrValues };
      };
      if (this.isMultiple()) {
        const values = (valueMap || []).map(value => { return formatValue(value); });
        const attrValue = values.map(({ attrValues }) => attrValues.join('')).join(';');
        const unitInfo = values.map(({ unitInfos }) => unitInfos.join(REPLACEMENT_CHARACTER)).join(';');
        return { unitInfo, attrValue };
      } else {
        const values = formatValue(valueMap);
        const attrValue = values.attrValues.join('');
        const unitInfo = values.unitInfos.join(REPLACEMENT_CHARACTER);
        return { unitInfo, attrValue };
      }
    }
  }

  getCompList () {
    return JSON.parse(this.props.moduleConfigInfo || null) || [];
  }

  handleChange = (id, value, idx) => {
    let { valueMap } = this.state;

    if (this.isMultiple()) {
      valueMap = valueMap.map(item => item.idx === idx ? { ...item, [id]:value } : { ...item });
    } else {
      valueMap = { ...this.state.valueMap, [id]: value };
    }

    this.setState({ valueMap }, () => this.onChange());
  }

  handleAdd = (e) => {
    e.preventDefault();
    this.setState({ valueMap: [...this.state.valueMap, { idx: this.getIdx(), ...this.parseNormalValue(this.getCompList(), '') }] });
  }

  handleRemove = (e, idx) => {
    e.preventDefault();
    this.setState({ valueMap: this.state.valueMap.filter(value => value.idx !== idx) }, () => this.onChange());
  }

  generateComponent () {
    const { mode } = this.props;
    return mode === 'edit' ? this.genetateEditArea() : this.generateViewArea();
  }

  genetateEditArea () {
    return this.isMultiple() ? this.generateMutipleInput() : this.generateSingleInput();
  }

  generateViewArea () {
    let title;
    let element = null;
    const { valueMap } = this.state;
    const compList = this.getCompList();
    const { viewRender, isOnlyShowText } = this.props;
    const value = ((this.props.field.value || {}).attrValue || '').replace(new RegExp(REPLACEMENT_CHARACTER, 'g'), '');


    if (viewRender) {
      element = viewRender(value, valueMap, compList);
    } else {
      title = value;
      element = value;
      if (isOnlyShowText) { return title; }
    }

    return (
      <div className="form-field-render-view" title={title}><div className="form-field-render-view-value">{ element }</div></div>
    );
  }

  generateEditModeInput (valueMap = this.state.valueMap, idx, toolbar) {
    const compList = this.getCompList();
    const { disabled, size = 'default' } = this.props;
    const props = { size, compact: true, className: 'form-filed-custom-component-wrapper' };

    return valueMap && (
      <InputGroup {...props}>
        {
          compList.map(item => {
            let { id, width, dictId, attrType, defaultValue, availableList = [], verificationRule } = item;
            let props = { size, disabled, key: id };
            let element = null;
            const styleWidth = getWidth(width, attrType);

            if (attrType === ATTR_TYPE_LABEL) {
              props = { 
                ...props, 
                disabled: true,
                title: defaultValue,
                className: 'ellipsis',
                style: { padding: '0', width: styleWidth }
              };
              element = (<Button {...{...props}}>{defaultValue}</Button>);
            } else if (({ [ATTR_TYPE_INT]: 1, [ATTR_TYPE_TEXT]: 1 })[attrType]) {
              props = { 
                ...props, 
                defaultValue,
                value: valueMap[id],
                style: { width: styleWidth }
              };
              verificationRule = verificationRule ? JSON.parse(verificationRule) : null;
              if (verificationRule) {
                _.forEach(verificationRule, (value, key) => { props[key] = value; });
              }
              if (attrType === ATTR_TYPE_INT) {
                props.onChange = (value) => this.handleChange(id, (`${(value == null || !`${value}`.trim()) ? '' : value}`).trim(), idx);
                element = (<InputNumber {...props}/>);
              } else {
                props.onChange = (e) => this.handleChange(id, (e.target.value || '').trim(), idx);
                element = (<Input {...props}/>);
              }
            } else if (attrType === ATTR_TYPE_SELECT) {
              props = { 
                ...props,
                mode: 'edit',
                isMultiple: false,
                style: { width: styleWidth },
                dropdownMatchSelectWidth: false,
                className: 'form-filed-custom-component-unit',
                onChange: (value) => this.handleChange(id, value, idx),
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
        {toolbar}
      </InputGroup>
    );
  }

  generateMutipleInput () {
    const { valueMap } = this.state;
    const length = (valueMap || []).length;
    const { disabled, size = 'default' } = this.props;
    return valueMap && (
      <ul className="form-filed-custom-component-list-wrapper">
        {
          valueMap.map(value => {
            const idx = value.idx;
            const style = { padding: '0 2px', width: 25 };
            const propValues = _.omit(value, ['idx']);
            const toolbar = disabled ? null : (
              <React.Fragment>
                {length === 1 ? (<Button icon="minus-circle" size={size} disabled style={style} />) : (<Button type="danger" icon="minus-circle" size={size} onClick={e => this.handleRemove(e, idx)} style={style} />)}
                <Button size={size} icon="plus-circle" type="primary" onClick={this.handleAdd} style={style} />
              </React.Fragment>
            );
            
            return (
              <li key={idx}>{this.generateEditModeInput(propValues, idx, toolbar, true)}</li>
            );
          })
        }
      </ul>
    );
  }

  generateSingleInput () {
    return this.generateEditModeInput();
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
    isMultiple: PropTypes.bool,
    moduleConfigInfo: PropTypes.string
  }
}