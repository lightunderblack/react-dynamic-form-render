import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin, Icon, Select, Tooltip } from 'antd';
import RelyAttrbuteListCollapse from '../../RelyAttrbuteListCollapse';
import debounce from 'lodash.debounce';
import { REPLACEMENT_CHARACTER } from '../../../constant/attrType';
import withUnitComponent from '../../../hoc/withUnitComponent';
import _ from 'lodash';

const { Option } = Select;

class SearchBox extends Component {
  state = {
    list: [],
    pending: false,
    value: undefined,
    displayValue: undefined
  }

  componentDidMount() {
    this.lastFetchId = 0;
    this.originData = [];
    this.fetchData = debounce(this.fetchData, 300);
    const { value, isMultiple } = this.props;
    this.transform(this.formatDefaultValue(value, isMultiple));
  }

  componentWillReceiveProps(nextProps) {
    const { value, isMultiple } = nextProps;
    if (this.isDifference(value, this.props.value)) {
      this.originData = [];
      this.transform(this.formatDefaultValue(value, isMultiple));
    }
  }

  componentWillUnmount() {
    this.fetchData.cancel();
    this.setState = () => { };
  }

  isCombobox() {
    return this.props.selectMode === 'combobox';
  }

  isDifference(newValue, oldValue) {
    let isDifference = false;

    if (newValue == null && oldValue != null) {
      isDifference = true;
    } else if ((newValue != null && oldValue == null)) {
      if (!_.isString(newValue) || newValue.trim()) {
        isDifference = true;
      }
    } else if (_.isPlainObject(newValue) && _.isPlainObject(oldValue)) {
      const diff = {};

      _.forEach(newValue, (value, key) => {
        if ((key in oldValue) && oldValue[key] !== newValue[key]) {
          diff[key] = newValue[key];
        }
      });

      if (_.keys(diff).length) {
        isDifference = true;
      }
    } else if (_.isArray(newValue) || _.isArray(oldValue)) {
      if (!_.isArray(newValue)) {
        newValue = [newValue];
      }
      if (!_.isArray(oldValue)) {
        oldValue = [oldValue];
      }
      if (!_.isEqual(_.keyBy(newValue, value => value), _.keyBy(oldValue, value => value))) {
        isDifference = true;
      }
    } else if (_.isString(newValue) || _.isString(oldValue)) {
      if (`${(newValue || '')}`.trim() !== `${(oldValue || '')}`.trim()) {
        isDifference = true;
      }
    } else {
      if (newValue !== oldValue) {
        isDifference = true;
      }
    }

    return isDifference;
  }

  object2Array (array) {
    let { availableList, disabledList } = this.props;

    disabledList = disabledList || [];
    availableList = availableList || [];
    array = availableList.length ? array.filter(item => !!~_.indexOf(availableList, item.code)) : array;
    array = array.map(item => {
      const isEnabled = item.isEnabled == null ? '1' : item.isEnabled;
      let isDisabled = isEnabled === '1' ? '0' : '1';

      if (!!~_.indexOf(disabledList, item.code)) { isDisabled = '1'; }
      const result = ({ ..._.pick(item, ['code', 'name', 'description']), isDisabled });

      //若返回值前后有空格需要去掉
      if (_.isString(result.code)) { result.code = result.code.trim(); }
      return { ...result };
    });

    return array;
  }

  //数据预处理
  pretreatment(array) {
    const { onLoaded } = this.props;
    return onLoaded ? onLoaded(array) : array;
  }

  //将可用选项排前，不可用选项排后
  sortedByIsDisabled (array) {
    const result = [];
    const groups = _.groupBy(array, 'isDisabled');

    _.forEach(groups, (group, key) => {
      if (key === '0') {
        result.unshift(...(group || []));
      } else {
        result.push(...(group || []));
      }
    });

    return result;
  }

  transform2String(value) {
    return _.isNumber(value) ? `${value}` : value;
  }

  //获取参数名
  getParamName() {
    return this.props.paramName || 'name';
  }

  getCodeName() {
    return this.props.codeName || 'code';
  }

  getExtraParams() {
    const { extraParams } = this.props;
    return extraParams ? (_.isFunction(extraParams) ? extraParams() : extraParams) : {};
  }

  getDropdownMatchSelectWidth() {
    const { dropdownMatchSelectWidth } = this.props;
    return dropdownMatchSelectWidth == null ? true : dropdownMatchSelectWidth;
  }

  //组装参数
  getParams(value, isEdit) {
    const params = {};
    const { field } = this.props;

    if (field && field.dictId) {
      params.apiName = field.dictId;
    }
    if (isEdit) {
      params[this.getParamName()] = value;
    } else {
      params[this.getCodeName()] = _.isArray(value) ? value.join(',') : value;
    }

    return { ...params, ...this.getExtraParams() };
  }

  getValue(value) {
    if (this.isCombobox()) {
      return value;
    } else {
      return value ? (_.isArray(value) ? value.map(({ key }) => key) : value.key) : undefined;
    }
  }

  transform(value, isBlur) {
    //const isViewMode = this.props.mode === 'view';
    const match = (content) => {
      let data;
      let displayValue;

      if (this.isCombobox()) {
        data = isBlur ? (content.find(({ code }) => this.transform2String(code) === this.transform2String(value)) || {}).code : value;
        displayValue = [(content.find(({ code }) => this.transform2String(code) === this.transform2String(value)) || {})].map(({ name, code }) => ({ key: code, label: name }));
      } else {
        value = _.isArray(value) ? value : [value];
        const temp = value.map(v => this.transform2String(v));
        data = content.filter(({ code }) => !!~_.indexOf(temp, this.transform2String(code))).map(({ name, code, description }) => ({ key: code, label: name, description }));
        const match = data.map(({ key }) => this.transform2String(key));
        let noMatch = [];
        if (this.props.isAllowViewModeCodeNotMatch/* && isViewMode*/) {
          noMatch = value.filter(v => !~_.indexOf(match, this.transform2String(v)));
        }
        data = [...data, ...noMatch.map(v => ({ key: v, label: v }))].map(item => _.omit(item, ['description']));
        displayValue = [...data];
      }

      this.setState({ value: data, displayValue });
    };
    const clear = () => {
      this.setState({ value: undefined, displayValue: undefined });
    };

    this.loadData(value, false).then(({ data: { content } }) => {
      match(this.object2Array(this.pretreatment(content)));
    }, () => {
      clear();
    });
  }

  loadData(value, isEdit) {
    if (_.isArray(value)) {
      if (!value.length) {
        return Promise.reject();
      }
    } else {
      if (!`${(value || '')}`.trim()) {
        return Promise.reject();
      }
    }
    return this.props.getData({ params: this.getParams(value, isEdit) });
  }

  //获取数据
  fetchData = (value) => {
    if (!value) { return; }

    this.lastFetchId += 1;
    this.setState({ pending: true });
    const fetchId = this.lastFetchId;

    this.loadData(value, true).then(ret => {
      if (fetchId !== this.lastFetchId) { return; }
      const { data: { content } } = ret;
      this.originData = [...(content || [])];
      this.setState({ 
        pending: false, 
        list: this.sortedByIsDisabled(this.object2Array(this.pretreatment([...(content || [])])))
      });
    }, () => {
      this.originData = [];
      this.setState({ pending: false, list: [] });
    }).catch((error) => {
      throw new Error(error);
    });
  }

  formatDefaultValue(defaultValue, isMultiple) {
    //若是多选，默认值有值并且为字符串
    if (isMultiple) {
      if (defaultValue) {
        if (_.isString(defaultValue)) {
          defaultValue = defaultValue.split(new RegExp(REPLACEMENT_CHARACTER)); //切割字符串生成数组
        }
      } else {
        defaultValue = undefined;
      }
    }
    return defaultValue;
  }

  //搜索
  handleSearch = (value) => {
    value = _.isString(value) ? value.trim() : value;
    if (this.isCombobox()) { this.setState({ value }); }
    this.fetchData(value);
  }

  handleSelect = (value) => {
    const { onChange, isMultiple, onSelfChange, isClearOptionsAfterSelect, isHideDropDownListAfterSelect } = this.props;

    if (isMultiple) {
      value = (value && value.length) ? value : undefined;
      if (isHideDropDownListAfterSelect && this.el && this.el.rcSelect && _.isFunction(this.el.rcSelect.onDropdownVisibleChange)) {
        //选择后隐藏下拉区域
        this.el.rcSelect.onDropdownVisibleChange(false);
      }
    } else {
      value = value ? value : undefined;
    }
    if (this.props.unitConfig) {
      const { key, label } = value;
      value = _.find(this.state.list, { [this.getCodeName()]: key });
      onChange && onChange({ name: label, id: key });
    } else {
      onSelfChange && onSelfChange(value, [...this.originData]);
      onChange && onChange(this.getValue(value));
    }

    if (isClearOptionsAfterSelect) {
      this.setState({ list: [], pending: false });
    } else {
      this.setState({ pending: false });
    }
  }

  generateOptions() {
    return (this.state.list || []).map(({ code, name, isDisabled, description }) => {
      let element = name;
      const props = { 
        key: code,
        value: code,
        title: name,
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

  generateViewArea() {
    let title;
    let element = null;
    const { viewRender, isOnlyShowText } = this.props;
    const { displayValue } = this.state;

    if (viewRender) {
      element = viewRender(displayValue);
    } else {
      title = (displayValue || []).map(({ label }) => label).join(';');
      element = (displayValue || []).map(({ key: code, label: name, description }, index) => {
        if (description) {
          return (
            <span key={code}>
              <span>
                {name}
                <Tooltip placement="top" title={description}>
                  <Icon type="question-circle-o" style={{ color: 'gray', paddingLeft: '2px' }} />
                </Tooltip>
              </span>
              {index !== (displayValue.length - 1) ? ';' : ''}
            </span>
          );
        } else {
          return (
            <span key={code}>{name}{index !== (displayValue.length - 1) ? ';' : ''}</span>
          );
        }
      });

      if (isOnlyShowText) {
        return title;
      }
    }

    return (
      <div className="form-field-render-view" title={title}><div className="form-field-render-view-value">{element}</div></div>
    );
  }

  generateSelect() {
    const { value, pending } = this.state;
    const { 
      size,
      mode,
      onBlur,
      disabled,
      isMultiple,
      style = {},
      placeholder,
      maxTagCount,
      maxTagPlaceholder,
      selectMode = 'default',
      isHideDropDownListAfterSelect,
      getPopupContainer = () => document.body
    } = this.props;
    const props = {
      size,
      onBlur,
      disabled,
      allowClear: true,
      showSearch: true,
      showArrow: false,
      mode: selectMode,
      getPopupContainer,
      labelInValue: true,
      filterOption: false,
      defaultActiveFirstOption: true,
      value: value ? value : undefined,
      style: { width: '100%', ...style },
      placeholder: placeholder || '关键字查询',
      optionLabelProp: this.isCombobox() ? 'value' : 'title',
      notFoundContent: pending ? (<Spin size="small" />) : null,
      dropdownMatchSelectWidth: this.getDropdownMatchSelectWidth(),
      dropdownStyle: { maxHeight: 400, maxWidth: 700, overflow: 'auto' }
    };

    if (isMultiple) {
      props.mode = 'multiple';
      if (isHideDropDownListAfterSelect) {
        props.ref = el => this.el = el;
      }
    }
    if (maxTagCount != null) {
      props.maxTagCount = maxTagCount;
    }
    if (maxTagPlaceholder != null) {
      props.maxTagPlaceholder = maxTagPlaceholder;
    }

    if (props.mode === 'combobox') {
      props.labelInValue = false;
      props.onBlur = (value) => this.transform(value, true);
      props.onChange = this.handleSearch;
      props.onSelect = this.handleSelect;
    } else {
      props.onChange = this.handleSelect;
      props.onSearch = this.handleSearch;
    }

    if (mode === 'edit') { 
      return (<Select {...props}>{this.generateOptions()}</Select>);
    } else {
      const { relyAttributeList } = this.props;
      const element = this.generateViewArea();
      if (_.isEmpty(relyAttributeList)) {
        return element;
      } else {
        return (
          <React.Fragment>
            {element}
            {this.generateRelyAttributeList(relyAttributeList)}
          </React.Fragment>
        );
      }
    }
  }

  generateRelyAttributeList (relyAttributeList) {
    const values = (this.state.value || []).map(({ key, label }) => ({ code: key, name: label }));
    const props = {
      values,
      form: this.props.form,
      columnCount: this.props.columnCount,
      relyAttributeList: relyAttributeList,
      formFiledRender: this.props.formFiledRender
    };

    return (
      <RelyAttrbuteListCollapse {...props} />
    );
  }

  render() {
    return this.generateSelect();
  }

  static propTypes = {
    value: PropTypes.any,
    mode: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    onBlur: PropTypes.func,
    onLoaded: PropTypes.func,
    codeName: PropTypes.string,
    paramName: PropTypes.string,
    onSelfChange: PropTypes.func,
    isMultiple: PropTypes.bool,
    extraParams: PropTypes.any,
    selectMode: PropTypes.string,
    maxTagCount: PropTypes.number,
    getData: PropTypes.func.isRequired,
    dropdownMatchSelectWidth: PropTypes.any,
    isClearOptionsAfterSelect: PropTypes.bool, //选中后清空options
    isHideDropDownListAfterSelect: PropTypes.bool, //选中值后是否隐藏下拉列表并清空值
    isAllowViewModeCodeNotMatch: PropTypes.bool //是否允许预览模式编码不匹配后台数据,直接显示值
  }

  static defaultProps = {
    field: {},
    mode: 'edit',
    disabled: false,
    isMultiple: false,
    isClearOptionsAfterSelect: false,
    isAllowViewModeCodeNotMatch: false,
    isHideDropDownListAfterSelect: false
  }
}

export default withUnitComponent(SearchBox);