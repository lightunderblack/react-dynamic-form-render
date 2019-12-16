import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Button, Alert, message as Message } from 'antd';
import DynamicFormRender from '../../DynamicFormRender';
import { ATTR_TYPE_CLOB, ATTR_TYPE_CHECKBOX } from '../../../constant/attrType';

import _ from 'lodash';

import './style.less';

@Form.create()
export default class PasteModal extends Component {
  state = {
    key: 1,
    message: null,
    visible: false,
    disabled: true,
  }

  componentWillMount () {
    this.validValues = [];
  }

  componentWillUnmount () {
    this.validValues = [];
    this.setState = () => {};
  }

  getMutipleValues () {
    const mutipleValues = [];
    const values = this.props.form.getFieldsValue();
    _.forEach(values, (value, key) => {
      if (key.startsWith('mutiple_')) { mutipleValues.push(...(value || [])) }
    });
    return mutipleValues;
  }

  handleSubmit = () => {
    const validValues = this.validValues || [];
    const data = _.uniq([...validValues, ...this.getMutipleValues()]);
    this.props.onSubmit(data).then(() => {
      this.handleReset();
      Message.success('导入成功', 3);
    });
  }

  handleValidate = () => {
    this.props.form.validateFields((error, values) => {
      this.validValues = [];

      if (error) { return; }

      const content = values.content.split(/\r\n|[\r\n]|[;；]/gi).filter(v => !!(v || '').trim()).map(v => v.trim());
      if (!content.length) { Message.warn('粘贴导入的内容不能为空', 3); return; }

      let matchMessage;
      let mutipleMessage;
      let noFoundMessage;
      const { match, mutiple, noFound } = this.props.onValidate(content);

      if (noFound.length) {
        noFoundMessage = (
          <div>
            <strong>未找到匹配值</strong>
            <ul>{noFound.map((value, i) => (<li key={i}>{value}</li>))}</ul>
          </div>
        );
      }
      if (mutiple.length) {
        const props = {
          mode: 'edit',
          size: 'small',
          isCollapse: false,
          form: this.props.form,
          direction: 'vertical',
          itemList: mutiple.map((item, index) => {
            const { name, match } = item;
            const id = `mutiple_${index}`;
            return {
              id,
              dataSource: [...match],
              attrType: ATTR_TYPE_CHECKBOX,
              name: <span className="red-star">{name}</span>,
              onSelfChange: (value) => this.handleSelfChange(value, id)
            }
          })
        };
        mutipleMessage = (
          <div>
            <div><strong>匹配到多个值</strong></div>
            {<DynamicFormRender {...props}/>}
          </div>
        );
      }

      if (match.length) {
        matchMessage = (
          <div>
            <strong>匹配成功的值</strong>
            <ul>{match.map(({ name }, i) => (<li key={i}>{name}</li>))}</ul>
          </div>
        );
        this.setState({ disabled: false });//设置确认导入按钮可用
        this.validValues = match.map(({ code }) => code);//缓存匹配成功的值
      } else {
        const data = _.uniq([...this.getMutipleValues()]);
        this.setState({ disabled: !data.length });//设置确认导入按钮不可用
      }

      if (noFoundMessage || mutipleMessage || matchMessage) {
        this.setState({
          key: this.state.key + 1,
          message: (<div>{mutipleMessage}{matchMessage}{noFoundMessage}</div>)
        });
      } else {
        this.setState({ message: null, key: this.state.key + 1 });
      }
    });
  }

  handleShowModal = () => {
    this.setState({ visible: true });
  }

  handleSelfChange = (value, id) => {
    let disabled = true;

    if (value && value.length) {
      disabled = false;
    } else {
      const values = this.getMutipleValues();
      if (values && values.length) { disabled = false }
    }
    
    this.setState({ disabled, key: this.state.key + 1 });
  }

  handleReset = () => {
    this.validValues = [];
    this.props.form.resetFields(['content']);
    this.setState({ visible: false, disabled: true, message: null });
  }

  handleCancel = () => {
    this.handleReset();
  }

  handleAfterClose = () => {
    this.handleReset();
  }

  generateButton () {
    const { text, size } = this.props;
    const props = { 
      size,
      onClick: this.handleShowModal
    };
    return (
      <Button {...props}>{text}</Button>
    );
  }

  generateModal () {
    const { visible } = this.state;
    const props = {
      visible,
      width: 800,
      okText: '确定',
      title: '导入数据',
      maskClosable: false,
      onCancel: this.handleCancel,
      footer: this.generateFooter(),
      afterClose: this.handleAfterClose,
      className: 'wuli-dynamic-form-render-paste-modal'
    };
    return (
      <Modal {...props}>
        { this.generateForm() }
        { this.generateAlert() }
      </Modal>
    );
  }

  generateFooter () {
    const cancelProp = {
      onClick: this.handleCancel,
      className: 'margin-right-4'
    };
    const validateProp = {
      className: 'margin-right-4',
      onClick: this.handleValidate
    };
    const submitProp = {
      type: 'primary',
      onClick: this.handleSubmit,
      disabled: this.state.disabled
    };
    return (
      <div className="wuli-dynamic-form-render-paste-modal-footer">
        <Button {...cancelProp}>取消</Button>
        <Button {...validateProp}>校验内容</Button>
        <Button {...submitProp}>确定导入</Button>
      </div>
    );
  }

  generateForm () {
    const props = {
      mode: 'edit',
      size: 'small',
      isCollapse: false,
      form: this.props.form,
      direction: 'vertical',
      itemList: [
        {
          id: 'content',
          name: '导入内容',
          isRequired: '1',
          attrType: ATTR_TYPE_CLOB,
          placeholder: '一行一值或分号分割'
        }
      ]
    };
    return (
      <DynamicFormRender {...props} />
    );
  }

  generateAlert () {
    const { message } = this.state;
    const props = {
      message,
      type: 'info',
      closable: false,
      key: this.state.key,
      style: { marginTop: 8 }
    };
    return message && (<Alert {...props} />);
  }

  render () {
    const { style = {} } = this.props;
    return (
      <div style={{...style, display: 'inline-block'}}>
        {this.generateButton()}
        {this.generateModal()}
      </div>
    );
  }

  static propTypes = {
    text: PropTypes.string,
    size: PropTypes.string,
    style: PropTypes.object,
    onSubmit: PropTypes.func,
    onValidate: PropTypes.func
  }

  static defaultProps = {
    text: '导入',
    size: 'default'
  }
}