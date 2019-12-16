import React, { Component } from 'react';
import { Button } from 'antd';
import { FormFieldSelect } from 'wuli-react-dynamic-form-render';

//本地数据
export default class SelectWithDataSource extends Component {
  state = {
    value: '',
    mode: 'edit'
  }

  handleChange = (value) => {
    this.setState({ value });
  }

  handleChangeMode = () => {
    this.setState((state, props) => ({
      mode: state.mode === 'edit' ? 'view' : 'edit'
    }));
  }

  render() {
    const props = {
      unitConfig: {          //单位配置、只对单选有效、默认为false
        valueKeyName: 'valueKeyName',//默认为code
        unitKeyName: 'unitInfo',//默认为name
      },
      unitDataSource: [         //默认为[]
        { name: 'A', enabled: true },
        { name: 'B', enabled: true },
        { name: 'C', enabled: false }
      ],
      disabled: false,//是否不可用
      keyName: 'code',//默认为code
      textName: 'name',//默认为name
      isMultiple: false,//是否多选
      availableList: [],//指定显示的数据
      value: this.state.value,//当前值
      style: { width: 200 },//样式
      dropdownMatchSelectWidth: false,//下拉列表宽度是否匹配输入框宽度
      onChange: this.handleChange,//选中回调
      mode: this.state.mode,//指定模式:edit编辑,view预览
      dataSource: [{ code: 'man', name: '男' }, { code: 'feman', name: '女' }]//传入本地数据
    };
    return (
      <div>
        下拉单选，本地数据<strong>(需要配置dataSource)</strong>：<FormFieldSelect {...props} /><Button size="small" onClick={this.handleChangeMode} className="margin-left-8" type="primary">切换编辑状态</Button>
      </div>
    );
  }
}