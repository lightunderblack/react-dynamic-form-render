import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PasteModal from '../PasteModal';
import { Icon, Tooltip, TreeSelect } from 'antd';

import _ from 'lodash';
import Tools from '../../../util/tool';

import './style.less';

const { TreeNode } = TreeSelect;
const MAX_EXPAND_TREE_NODE_COUNT = 100;

export default class FormFieldTreeSelect extends Component {
  state = {
    nodes: []
  }

  componentDidMount () {
    this.rows = [];
    const { params, dataSource, isAutoFocus } = this.props;
    if (_.isArray(dataSource)) {
      this.loadData(null, dataSource);
    } else {
      this.loadData(params);
    }
    if (isAutoFocus && this.el.rcTreeSelect && this.el.rcTreeSelect.setOpenState) {
      setTimeout(() => this.el.rcTreeSelect.setOpenState(true), 250);
    }
  }

  componentWillReceiveProps (nextProps) {
    const { params, dataSource } = nextProps;
    if(_.isArray(dataSource) && (dataSource !== this.props.dataSource)) {
      this.loadData(null, dataSource);
      return;
    }
    const left = _.differenceWith([{ ...params }], [{ ...this.props.params }], _.isEqual);
    const right = _.differenceWith([{ ...this.props.params }], [{ ...params }], _.isEqual);
    if (left.length || right.length) {
      this.rows = [];
      if (_.isArray(dataSource)) {
        this.loadData(null, dataSource);
      } else {
        this.loadData(params);
      }
    }
  }

  componentWillUnmount () {
    this.el = null;
    this.rows = null;
    this.setState = () => {};
  }

  //将可用选项排前，不可用选项排后
  sortedByIsIsEnabled (array) {
    const result = [];
    const { isDisabledItemSelectable } = this.props;
    const groups = _.groupBy((array || []).map(item => ({ ...item, isEnabled: item.isEnabled == null ? '1' : item.isEnabled })), 'isEnabled');

    if (isDisabledItemSelectable) {
      result.push(...(array || []));
    } else {
      _.forEach(groups, (group, key) => {
        if (key === '1') {
          result.unshift(...(group || []));
        } else {
          result.push(...(group || []));
        }
      });
    }

    return [...result];
  }

  //单选是否强制显示多选模式
  isForceMutipleMode (props = this.props) {
    const { isOnlyChild, isForceMutipleMode } = props;
    return  isOnlyChild && isForceMutipleMode;
  }

  getValue () {
    const { value, isMultiple, isOnlyChild, isForceMutipleMode, treeCheckStrictly } = this.props;
    if (isMultiple) {
      if (treeCheckStrictly) {
        if (value == null) {
          return value;
        } else {
          const rows = this.getFlattenRows();
          return rows.filter(item => !!~_.indexOf(value, item[this.getKey(item)])).map(item => ({ label: item[this.getName()], value: item[this.getKey(item)] }));
        }
      } else {
        return value;
      }
    } else {
      return this.isForceMutipleMode({ isOnlyChild, isForceMutipleMode }) ? (value ? [value] : undefined) : value;
    }
  }

  getKey (item) {
    const keyName = this.props.keyName || 'code';
    return (item && keyName in item) ? keyName : 'id';
  }

  getName () {
    return this.props.textName || 'name';
  }

  getKeyName (params) {
    const param = _.transform(params, (result, v, k) => { if (v) { result.push(`${k}_${v}`) } }, []);
    return `FORM_FILED_RENDER_TREE_${param.join('_')}`;
  }

  getClassName () {
    return this.isForceMutipleMode() ? 'force-mutiple-mode-tree-select-wrapper' : '';
  }

  getFullPathName (item) {
    return [...item._path_, item[this.getName()]].filter(v => v).join(this.props.fullPathSeparator);
  }

  getTreeDefaultExpandAll () {
    const { treeDefaultExpandAll, isAutoExpandTreeNode } = this.props;
    if (treeDefaultExpandAll == null) {
      return isAutoExpandTreeNode ? this.getFlattenRows().length <= MAX_EXPAND_TREE_NODE_COUNT : false;
    } else {
      return treeDefaultExpandAll === true;
    }
  }

  getDropdownMatchSelectWidth () {
    const { dropdownMatchSelectWidth } = this.props;
    return dropdownMatchSelectWidth == null ? true : dropdownMatchSelectWidth;
  }

  formatParams (params) {
    return _.transform(params, (result, v, k) => { if (v) { result[k] = v } }, {});
  }

  pretreatment (array) {
    const { onLoaded, isAutoRemoveOnlyOneChildNode } = this.props;
    let data = onLoaded ? onLoaded(array) : array;

    //若根节点只有一个子节点则移除该节点，将该节点子节点上移
    if (isAutoRemoveOnlyOneChildNode && data && data.length === 1) {
      const children = data[0].children;
      if ((children || []).length) { data = children; }
    }

    const root = { children: this.sortedByIsIsEnabled(data || []) };
    this.formatNode(root, []);
    return JSON.parse(JSON.stringify(root.children));
  }

  formatNode (parent, path) {
    const children = this.sortedByIsIsEnabled(parent.children || []);
    children.forEach(item => { 
      const { children } = item;
      if (children && children.length) {
        item.isLeaf = false;
        this.formatNode(item, [...path, item[this.getName()]]);
      } else {
        item.isLeaf = true;
      }
      item._path_ = [...path];
    });
    parent.children = children;
  }

  loadData (params, dataSource) {
    if (params) {
      this.loadDict(params);
    } else {
      this.setState({ nodes: this.pretreatment([...(dataSource || [])]) });
    }
  }

  loadDict (params) {
    const { noCache } = this.props;
    const key = this.getKeyName(params);
    const fetch = () => {
      this.props.getData({ params }).then(({ data: { content } }) => {
        const nodes = this.pretreatment([...(content || [])]);

        this.setState({ nodes });
        Tools.sessionStorage.add(key, [...(content || [])]);
      }, () => {
        this.setState({ nodes: [] });
      }).catch((error) => {
        throw new Error(error);
      });
    };
    
    if (noCache) {
      fetch();
    } else {
      const data = Tools.sessionStorage.get(key);
      if (data && data.length) {
        const nodes = this.pretreatment(data);
        this.setState({ nodes });
      } else {
        fetch();
      }
    }
  }

  collectLeafNodes (nodes = this.state.nodes) {
    const leafs = [];
    this.collectLeafNode(nodes, leafs);
    return this.deepClone(leafs);
  }

  collectLeafNode (nodes, data) {
    (nodes || []).forEach(node => {
      const { children } = node;
      if (children && children.length) {
        this.collectLeafNode(children, data);
      } else {
        data.push(_.omit(node, ['children']));
      }
    });
  }

  getFlattenRows () {
    if (_.isArray(this.props.dataSource)) {
      //若是dataSource传入则每次都需碾平
      this.rows = this.flattenRows();
      return this.rows;
    } else {
      if (this.rows && this.rows.length) {
        return this.rows;
      } else {
        this.rows = this.flattenRows();
        return this.rows;
      }
    }
  }

  flattenRows (nodes = this.state.nodes) {
    const data = [];
    this.flattenRow(nodes, data);
    return _.uniqBy(this.deepClone(data), this.getKey(_.first(data)));
  }

  flattenRow (rows, data) {
    rows.forEach(item => {
      data.push(_.omit(item, ['children']));
      if (item.children) {
        this.flattenRow(item.children, data);
      }
    });
  }

  deepClone (data) {
    return data ? JSON.parse(JSON.stringify(data)) : data;
  }

  validatePasteContent = (content) => {
    const match = [];//匹配
    const noFound = [];//未匹配
    const mutiple = [];//匹配多个
    const { isOnlyChild } = this.props;//是否只允许选中叶子节点
    const flattenRows = this.getFlattenRows();

    content.forEach(item => {
      const path = item.split(/\//gi);
      const isPath = path.length > 1;//是否路径
      const rows = flattenRows.filter(row => {
        if (isPath) {
          const isMatch = this.getFullPathName(row).toLowerCase().endsWith(item.toLowerCase());
          return isOnlyChild ? (row.isLeaf && isMatch) : isMatch;
        } else {
          const isMatch = row[this.getName()].toLowerCase() === item.toLowerCase();
          return isOnlyChild ? (row.isLeaf && isMatch) : isMatch;
        }
      });

      if (rows.length === 0) {
        noFound.push(item);
      } else if (rows.length === 1) {
        const row = rows[0];
        match.push({ code: row[this.getKey(row)], name: this.getFullPathName(row) });
      } else {
        mutiple.push({ 
          name: item,
          match: rows.map(item => ({ code: item[this.getKey(item)], name: this.getFullPathName(item) }))
        });
      }
    });

    return { match, mutiple, noFound };
  }

  handlePaste = (value) => {
    let result;
    const flattenRows = this.getFlattenRows();
    const { isMultiple, isOnlyChild, isForceMutipleMode } = this.props;

    if (isMultiple) {
      value = _.uniq([...(this.props.value || []), ...(value || [])]);//多选时需将之前的值合并
      result = flattenRows.filter(item => !!~_.indexOf((value || []), item[this.getKey(item)]));
      this.handleChange(value, '粘贴导入', {});
    } else {
      if (this.isForceMutipleMode({ isOnlyChild, isForceMutipleMode })) {
        const match = flattenRows.find(item => item[this.getKey(item)] === value[0]) || {};
        const extra = { 
          clear: false,
          triggerValue: value[0],
          triggerNode: { props: { isLeaf: !!match.isLeaf } }
        };
        const label = '粘贴导入';
        result = match ? [match] : [];
        this.handleSingleChange([value[0]], label, extra);
      } else {
        const match = flattenRows.find(item => item[this.getKey(item)] === value[0]) || {};
        result = match ? [match] : [];
        this.handleSelect(value[0], { props: { isLeaf: !!match.isLeaf } });
      }
    }

    return Promise.resolve({ 
      result: result.map(item => this.getFullPathName(item))
    });
  }

  handleValidatePaste = (content) => {
    return this.validatePasteContent(content);
  }

  handleChange = (value, label, extra) => {
    const { isMultiple, treeCheckStrictly } = this.props;
    
    if (isMultiple && treeCheckStrictly) {
      const val = value == null ? value : value.map(({ value }) => value);
      this.props.onChange && this.props.onChange(val);
      this.props.onSelfChange && this.props.onSelfChange(val, { label, extra });
    } else {
      this.props.onChange && this.props.onChange(value);
      this.props.onSelfChange && this.props.onSelfChange(value, { label, extra });
    }
  }

  handleSingleChange = (value, label, extra) => {
    const { isOnlyChild } = this.props;
    const { clear, triggerNode, triggerValue } = extra;
    const onChange = (value, node) => {
      this.props.onChange && this.props.onChange(value);
      this.props.onSelfChange && this.props.onSelfChange(value, node);
    };

    if (!value.length || clear) {
      onChange(undefined, {});
    } else {
      const { props: { isLeaf, children } } = triggerNode;
      if (isOnlyChild) {
        if ((!children || !children.length) && isLeaf) {
          onChange(triggerValue, triggerNode);
          this.handleHideDropdown();//隐藏下拉框
        }
      } else {
        onChange(triggerValue, triggerNode);
      }
    }
  }

  handleSelect = (value, node) => {
    const { isOnlyChild, isRootNodeSelectable } = this.props;
    const { props: { isLeaf, children, parentId } } = node;
    const onChange = () => {
      this.props.onChange && this.props.onChange(value);
      this.props.onSelfChange && this.props.onSelfChange(value, node);
    };

    if (isOnlyChild) {
      if ((!children || !children.length) && isLeaf) {
        onChange();
        this.handleHideDropdown();//隐藏下拉框
      }
    } else {
      if (isRootNodeSelectable || parentId !== '-1') {
        onChange();
      }
    }
  }

  handleHideDropdown = () => {
    if (this.el.rcTreeSelect) {
      setTimeout(() => { this.el.rcTreeSelect.inputInstance && this.el.rcTreeSelect.inputInstance.blur() });
      if (_.isFunction(this.el.rcTreeSelect.onDropdownVisibleChange)) {
        this.el.rcTreeSelect.onDropdownVisibleChange(false);
      }
    }
  }

  generateTreeNodes () {
    const nodes = this.props.isOnlyShowLeafNode ? this.collectLeafNodes() : this.state.nodes;
    return this.generateTreeNode(nodes);
  }

  generateTreeNode (nodes, isParentEnabled) {
    const { isDisabledItemSelectable } = this.props;

    return (nodes || []).map(item => {
      const { apiName, children, isEnabled, description } = item;
      let title = item[this.getName()];

      if (description) {
        title = (
          <span>
            {title}
            <Tooltip placement="top" title={description}>
              <Icon type="question-circle-o" style={{ color: 'gray', paddingLeft: '2px' }} />
            </Tooltip>
          </span>
        );
      }

      let disabled; //节点是否禁用
      if (isDisabledItemSelectable) {
        //允许禁用选项可选
        disabled = false;
      } else {
        if (isParentEnabled == null) {
          disabled = isEnabled == null ? false : (isEnabled === '1' ? false : true);//若isEnabled没有初始值则默认为可用
        } else {
          disabled = isParentEnabled === '1' ? (isEnabled === '1' ? false : true) : true;//若父级禁用则所有子元素都禁用
        }
      }

      const props = {
        ...item,
        title,
        apiName,
        disabled,
        disableCheckbox: disabled,
        name: item[this.getName()],
        key: item[this.getKey(item)],
        value: item[this.getKey(item)],
        path: [_.last(item._path_), item[this.getName()]].filter(v => v).join(this.props.fullPathSeparator)
      };

      if (children && children.length) {
        return (
          <TreeNode {...props}>
            {this.generateTreeNode(children, isEnabled)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode {...props}></TreeNode>
        );
      }
    });
  }

  generateViewArea (value) {
    let title;
    let element = null;
    const { viewRender, isShowFullPath, isOnlyShowText, maxTagCount } = this.props;
    const match = this.getFlattenRows().filter(item => !!~_.indexOf(value, item[this.getKey(item)]));

    if (viewRender) {
      element = viewRender(match, this.state.nodes);
    } else {
      if (isShowFullPath) {
        //显示全路径
        title = match.map(item => this.getFullPathName(item)).join(';');
      } else {
        title = match.map(item => item[this.getName()]).join(';');
      }
      
      if (isOnlyShowText) {
        if (maxTagCount == null) {
          return title;
        } else {
          const titles = title.split(/;/);
          return titles.length <= maxTagCount ? titles.join(';') : `${titles.slice(0, maxTagCount).join(';')}...`;
        }
      }

      element = match.map((item, index) => {
        let name;
        const { description } = item;
        const id = item[this.getKey(item)];

        if (isShowFullPath) {
          name = this.getFullPathName(item);
        } else {
          name = item[this.getName()];
        }
        if (description) {
          return (
            <span key={id}>
              <span>
                {name}
                <Tooltip placement="top" title={description}>
                  <Icon type="question-circle-o" style={{ color: 'gray', paddingLeft: '2px' }} />
                </Tooltip>
              </span>
              {index !== (match.length - 1) ? ';' : ''}
            </span>
          );
        } else {
          return (
            <span key={id}>{name}{index !== (match.length - 1) ? ';' : ''}</span>
          );
        }
      });
    }

    return (
      <div className="form-field-render-view" title={title}><div className="form-field-render-view-value">{ element }</div></div>
    );
  }

  render () {
    let {
      mode,
      value,
      onBlur,
      style = {},
      isMultiple,
      maxTagCount,
      placeholder,
      isOnlyChild,
      dropdownStyle,
      isEnabledPaste,
      treeCheckStrictly,
      maxTagPlaceholder,
      isForceMutipleMode,
      showCheckedStrategy,
      autoClearSearchValue,
      getPopupContainer = () => document.body
    } = this.props;

    let props = {
      mode,
      onBlur,
      placeholder,
      showSearch: true,
      allowClear: false,
      getPopupContainer,
      treeCheckStrictly,
      showCheckedStrategy,
      autoClearSearchValue,
      value: this.getValue(),
      ref: el => this.el = el,
      treeCheckable: isMultiple,
      treeNodeLabelProp: 'name',
      treeNodeFilterProp: 'path',
      disabled: this.props.disabled,
      className: this.getClassName(),
      style: { width: '100%', ...style },
      size: this.props.size || 'default',
      treeDefaultExpandAll: this.getTreeDefaultExpandAll(),
      dropdownMatchSelectWidth: this.getDropdownMatchSelectWidth(),
      dropdownStyle: { maxHeight: 400, overflow: 'auto', ...(dropdownStyle || {}) },
      multiple: isMultiple || this.isForceMutipleMode({ isOnlyChild, isForceMutipleMode })
    };

    if (isMultiple) {
      value = value ? [...value] : [];
      props.onChange = this.handleChange;
    } else {
      value = value ? [value] : [];
      if (this.isForceMutipleMode({ isOnlyChild, isForceMutipleMode })) {
        props.onChange = this.handleSingleChange;
      } else {
        props.onSelect = this.handleSelect;
      }
    }
    if (maxTagCount != null) {
      props.maxTagCount = maxTagCount;
    }
    if (maxTagPlaceholder != null) {
      props.maxTagPlaceholder = maxTagPlaceholder;
    }

    if (mode === 'edit') {
      if (isEnabledPaste && !this.props.disabled) {
        const style = _.omit({ ...props.style, display: 'block', overflow: 'hidden', marginRight: 48 }, ['width']);
        props = { ...props, style, dropdownMatchSelectWidth: false };
        const element = (
          <TreeSelect {...props}>
            {this.generateTreeNodes()}
          </TreeSelect>
        );
        const pasteModalProps = { 
          size: 'small',
          style: { float: 'right' },
          onSubmit: this.handlePaste,
          onValidate: this.handleValidatePaste
        };
        const pasteModal = (<PasteModal {...pasteModalProps} />);
        return (<div className="clearfix">{pasteModal}{element}</div>);
      } else {
        return (<TreeSelect {...props}>{this.generateTreeNodes()}</TreeSelect>);
      }
    } else {
      return this.generateViewArea(value);
    }
  }

  static propTypes = {
    value: PropTypes.any,
    onBlur: PropTypes.func,
    mode: PropTypes.string, //编辑/预览模式
    noCache: PropTypes.bool, //是否不缓存
    onLoaded: PropTypes.func, //数据加载完成后回调,可对数据进行加工
    params: PropTypes.object, //异步获取数据传入参数
    disabled: PropTypes.bool, //是否不可用
    keyName: PropTypes.string,
    textName: PropTypes.string,
    isMultiple: PropTypes.bool, //是否多选
    viewRender: PropTypes.func, //自定义渲染
    isOnlyShowText: PropTypes.bool, //是否只显示文本
    isEnabledPaste: PropTypes.bool, //是否开启粘贴功能
    treeCheckStrictly: PropTypes.bool, //checkable 状态下节点选择完全受控（父子节点选中状态不再关联），会使得 labelInValue 强制为 true
    isOnlyChild: PropTypes.bool, //是否只可选中叶子节点
    onSelfChange: PropTypes.func, //选中节点事件回调
    isShowFullPath: PropTypes.bool, //是否显示全路径
    fullPathSeparator: PropTypes.string, //全路径分隔符
    treeDefaultExpandAll: PropTypes.bool, //是否默认展开全部
    getData: PropTypes.func.isRequired, //异步获取获取树节点数据
    isOnlyShowLeafNode: PropTypes.bool, //是否仅展示叶子节点
    dropdownMatchSelectWidth: PropTypes.any, //下拉列表是否与输入框同宽
    isDisabledItemSelectable: PropTypes.bool, //禁用节点是否可选
    isRootNodeSelectable: PropTypes.bool,//根节点是否可选
    isAutoFocus: PropTypes.bool, //是否默认获取焦点
    autoClearSearchValue: PropTypes.bool, //多选模式下选择取消选择时自动清除关键字
    isAutoExpandTreeNode: PropTypes.bool, //是否开启智能展开树节点功能
    isAutoRemoveOnlyOneChildNode:  PropTypes.bool, //是否开启智能移除只有一个子节点节点
    isForceMutipleMode: PropTypes.bool, //是否强制使用多选模式,为了实现单选搜索和多选搜索效果一致
  }

  static defaultProps = {
    mode: 'edit',
    noCache: false,
    disabled: false,
    isAutoFocus: false,
    isOnlyChild: false,
    isOnlyShowText: false,
    isShowFullPath: true,
    viewRender: undefined,
    isEnabledPaste: false,
    fullPathSeparator: '|',
    treeCheckStrictly: false,
    isOnlyShowLeafNode: false,
    isForceMutipleMode: false,
    autoClearSearchValue: true,
    isAutoExpandTreeNode: false,
    isRootNodeSelectable: true,
    isDisabledItemSelectable: false,
    isAutoRemoveOnlyOneChildNode: false
  }
}