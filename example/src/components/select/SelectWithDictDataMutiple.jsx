import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { FormFieldSelect } from 'wuli-react-dynamic-form-render';

//多选
export default class SelectWithDictDataMutiple extends Component {
  state = {
    value: undefined,
    mode: 'edit'
  }

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
      disabled: false,//是否不可用
      keyName: 'code',//指定id的属性名,默认为code
      textName: 'name',//指定名称的属性名,默认为name
      isMultiple: true,//是否多选
      availableList: [],//指定显示的数据
      value: this.state.value,//当前值
      style: { width: 200 },//样式
      getData: this.handleGetData,//获取远程数据,需返回promise
      onLoaded: this.handleOnLoaded,//远程数据加载成功后回调,接收array,可用于预处理数据
      dropdownMatchSelectWidth: false,//下拉列表宽度是否匹配输入框宽度
      onChange: this.handleChange,//选中回调
      mode: this.state.mode,//指定模式:edit编辑,view预览
      field: { dictId: 'CPLM_OBJ_BOM_LEVEL' }//字典id需要唯一
    };
    return (
      <div>
        下拉多选，远程数据<strong>(需要配置isMultiple/getData/field.dictId)</strong>：<FormFieldSelect {...props} /><Button size="small" onClick={this.handleChangeMode} className="margin-left-8" type="primary">切换编辑状态</Button>
      </div>
    );
  }
}