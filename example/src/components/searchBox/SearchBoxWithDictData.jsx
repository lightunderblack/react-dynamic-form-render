import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { FormFieldSearchBox } from 'wuli-react-dynamic-form-render';

//远程数据
export default class SearchBoxWithDictData extends Component {
  state = {
    value: '',
    mode: 'edit'
  }

  //后台返回数据格式必须是{ data: { content: [] } }
  handleGetData (params) {
  }

  handleOnLoaded (array) {
    return array;
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
    //远程数据需要配置getData和dictId
    const props = {
      size: 'default',//设置搜索框大小:default/small/large
      disabled: false,//是否不可用
      codeName: 'code',//指定id的属性名,默认为code
      paramName: 'name',//指定关键字的属性名,默认为name
      isMultiple: true,//是否多选
      value: this.state.value,//当前值
      style: { width: 200 },//样式
      getData: this.handleGetData,//获取远程数据,需返回promise
      onLoaded: this.handleOnLoaded,//远程数据加载成功后回调,接收array,可用于预处理数据
      dropdownMatchSelectWidth: false,//下拉列表宽度是否匹配输入框宽度
      onChange: this.handleChange,//选中回调,若表单控制权交给antd的getFieldDecorator,则不要传入该参数
      onSelfChange: this.handleChange,//选中回调,若表单控制权交给antd的getFieldDecorator,若想对选中事件做处理,则可以使用它
      mode: this.state.mode,//指定模式:edit编辑,view预览,
      field: { dictId: 'CPLM_OBJ_PRODUCT_MODEL' }//若传入dictId则表示接入了对象管理数据字典接口,向后台请求时,会默认带入apiName,值未dictId指定值
    };
    return (
      <div>
        多选搜索，接入对象管理字典服务<strong>(需要配置getData和field.dictId;)</strong>：<FormFieldSearchBox {...props} /><Button size="small" onClick={this.handleChangeMode} className="margin-left-8" type="primary">切换编辑状态</Button>
      </div>
    );
  }
}