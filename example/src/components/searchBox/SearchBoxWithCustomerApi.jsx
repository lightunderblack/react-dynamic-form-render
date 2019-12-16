import React, { Component } from 'react';
import { Button } from 'antd';
import { FormFieldSearchBox } from 'wuli-react-dynamic-form-render';
import _ from 'lodash';

//远程数据
export default class SearchBoxWithCustomerApi extends Component {
  state = {
    value: [],
    mode: 'edit'
  }

  //后台返回数据格式必须是{ data: { content: [] } }
  handleGetData (params) {
    //本地模拟异步请求，实际是调用具体接口
    let res = { data: { content: [] }};
    const data = [{ key: '1', value: 'lucy' }, { key: '2', value: 'jack' }, { key: '3', value: 'Kate' }];

    if ('value' in params.params) {
      res.data.content = params.params.value ? data.filter(({ value }) => value.includes(params.params.value)) : data;
    } else {
      res.data.content = data.filter(({ key }) => _.indexOf(params.params.key.split('')));
    }

    return Promise.resolve(res);
  }

  //由于接口返回的数据格式不是{code: 'id', name: 'text'}格式，可以通过onLoaded进行转换
  handleOnLoaded (array) {
    return array.map(({ key, value }) => ({ code: key, name: value }));
  }

  handleChange = (value) => {
    this.setState({ value });
  }

  handleChangeMode = () => {
    this.setState((state, props) => ({
      mode: state.mode === 'edit' ? 'view' : 'edit'
    }));
  }

  render () {
    //需要配置getData
    const props = {
      size: 'default',//设置搜索框大小:default/small/large
      disabled: false,//是否不可用
      codeName: 'key',//指定id的属性名,默认为code
      paramName: 'value',//指定关键字的属性名,默认为name
      isMultiple: false,//是否多选
      value: this.state.value,//当前值
      style: { width: 200 },//样式
      getData: this.handleGetData,//获取远程数据,需返回promise
      onLoaded: this.handleOnLoaded,//远程数据加载成功后回调,接收array,可用于预处理数据
      dropdownMatchSelectWidth: false,//下拉列表宽度是否匹配输入框宽度
      onChange: this.handleChange,//选中回调,若表单控制权交给antd的getFieldDecorator,则不要传入该参数
      onSelfChange: this.handleChange,//选中回调,若表单控制权交给antd的getFieldDecorator,若想对选中事件做处理,则可以使用它
      mode: this.state.mode,//指定模式:edit编辑,view预览,
    };
    return (
      <div>
        单选搜索，接入用户定义接口<strong>(需要配置getData)</strong>：<FormFieldSearchBox {...props} /><Button size="small" onClick={this.handleChangeMode} className="margin-left-8" type="primary">切换编辑状态</Button>
      </div>
    );
  }
}