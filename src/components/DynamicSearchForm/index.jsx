import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, Button } from 'antd';
import DynamicFormRender from '../DynamicFormRender';
import {
  REPLACEMENT_CHARACTER,
  ATTR_TYPE_CUSTOM_COMP
} from '../../constant/attrType';

import _ from 'lodash';

@Form.create()
export default class DynamicSearchForm extends Component {
  state = {
    loading: false
  }

  getCustomCompFieldIds () {
    return this.props.itemList.filter(({ attrType }) => {
      return attrType === ATTR_TYPE_CUSTOM_COMP;
    }).map(({ id }) => {
      return id;
    });
  }

  handleSubmit = () => {
    this.props.form.validateFields((error, value) => {
      if (error) {
        return null;
      }
      const customCompFieldIds = this.getCustomCompFieldIds();
      
      value = _.transform(value, (r, v, k) => {
        if (!!~_.indexOf(customCompFieldIds, k)) {
          r[k] = (v || '').replace(new RegExp(REPLACEMENT_CHARACTER, 'g'), '');
        } else {
          r[k] = v;
        }
      }, {});
      this.setState({ loading: true });
      this.props.onSubmit({ ...value }).then(() => {
        this.setState({ loading: false });
      }, () => {
        this.setState({ loading: false });
      }).catch(() => {
        this.setState({ loading: false });
      });
    });
  }

  handleClear = () => {
    this.props.onClear();
    this.props.form.resetFields();
  }

  generateForm () {
    const { formRender, hasFeedback } = this.props;
    const DynamicFormRenderComponent = formRender || DynamicFormRender;
    const props = {
      mode: 'edit',
      size: 'small',
      isCollapse: false,
      direction: 'horizontal',
      hasFeedback: hasFeedback == null ? false : hasFeedback,
      ..._.pick(this.props, ['form', 'itemList', 'columnCount', 'formItemLayout', 'isTextAreaAlone'])
    };
    return (
      <DynamicFormRenderComponent {...props} />
    );
  }

  generateToolbar () {
    return (
      <div className="text-right margin-top-8">
        <Button className="margin-right-8" type="primary" size="small" icon="search" htmlType="submit" onClick={this.handleSubmit} loading={this.state.loading}>搜索</Button>
        <Button className="margin-right-8" size="small" onClick={this.handleClear}>清除</Button>
      </div>
    );
  }

  render () {
    const props = {};
    
    if (this.props.key != null) {
      props.key = `dynamicSearchForm_${this.props.key}`;
    }

    return (
      <div {...props} className="well baseline-limit-materials-search-box">
        <Form>
          {this.generateForm()}
          {this.generateToolbar()}
        </Form>
      </div>
    );
  }

  static propTypes = {
    key: PropTypes.string,
    columnCount: PropTypes.number,
    isTextAreaAlone: PropTypes.bool,
    formItemLayout: PropTypes.object,
    onClear: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    itemList: PropTypes.array.isRequired
  }

  static defaultProps = {
    columnCount: 3,
    isTextAreaAlone: false
  }
}