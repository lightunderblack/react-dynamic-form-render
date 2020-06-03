import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import withDictListComponent from '../../../hoc/withDictListComponent';

class FormFieldSwitch extends Component {
  handleChange = (checked) => {
    const { onChange, onSelfChange } = this.props;
    const { checkedChildrenItem, unCheckedChildrenItem } = this.getCheckedData();
    const value = checked ? checkedChildrenItem : unCheckedChildrenItem;
    onChange && onChange(value.id);
    onSelfChange && onSelfChange(value.id, value);
  }

  getCheckedData () {
    const { options, checkedChildren } = this.props;
    const checkedChildrenItem = options.find(({ id }) => id === checkedChildren);
    const unCheckedChildrenItem = options.filter(({ id }) => id !== (checkedChildrenItem || {}).id)[0];
    return ({ checkedChildrenItem, unCheckedChildrenItem });
  }

  generateViewArea (value) {
    let title;
    let element = null;
    const { viewRender, isOnlyShowText } = this.props;
    const { checkedChildrenItem, unCheckedChildrenItem } = this.getCheckedData();
    const match = value === checkedChildrenItem.id ? checkedChildrenItem : unCheckedChildrenItem;

    if (viewRender) {
      element = viewRender(match, this.props.options);
    } else {
      element = match.name;
      title = element;
      if (isOnlyShowText) {
        return title;
      }
    }

    return (
      <div className="form-field-render-view" title={title}><div className="form-field-render-view-value">{ element }</div></div>
    );
  }

  render () {
    const { size, mode, value, options, disabled, defaultChecked, style = {} } = this.props;
    
    if(options.length && options.length === 2) {
      const { checkedChildrenItem, unCheckedChildrenItem } = this.getCheckedData();
      const props = {
        size,
        style,
        disabled,
        defaultChecked,
        onChange: this.handleChange,
        checked: value === checkedChildrenItem.id,
        checkedChildren: checkedChildrenItem.name,
        unCheckedChildren: unCheckedChildrenItem.name,
      };
      return (mode === 'edit') ? (<Switch {...props} />) : this.generateViewArea(value);
    } else {
      return (
        <div className="form-field-render-view">
          <div className="form-field-render-view-value">选项只能两个</div>
        </div>
      );
    }
  }

  static propTypes = {
    mode: PropTypes.string,
    getData: PropTypes.func,
    value: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    onLoaded: PropTypes.func,
    dataSource: PropTypes.array,
    defaultChecked: PropTypes.bool,
    checkedChildren: PropTypes.any,
  }

  static defaultProps = {
    mode: 'edit',
    options: [],
    dataSource: [],
    disabled: false
  }
}

export default withDictListComponent(FormFieldSwitch, 'FORM_FILED_RENDER_SWITCH');