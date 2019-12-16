### Introduction
表单组件渲染器，根据传入[attrType](/src/constant/README.md)值渲染对应表单组件

### API

### 属性

| 参数 | 说明 | 类型 | 必填 | 默认值 |
| ---- | ---- | ---- | ---- | ------ |
| value | 表单默认值，对非文本类型组件使用 | `string` or `array` | - | `null` |
| defaultValue | 表单默认值，对文本类型组件使用 | `string` | - | `null` |
| size | 设置组件大小，可选值为`default` or `small` or `large` | `string` | - | `default` |
| mode | 设置组件预览或者编辑模式，可选值为`view` or `edit` | `string` | - | `view` |
| autoFocus | 设置自动获取焦点，可选值为`"1"` or `"0"` | `string` | - | `"0"` |
| dropdownMatchSelectWidth | 下拉菜单和选择器同宽 | `boolean` | - | `false` |
| dataSource | 设置本地数据源，用于组件类型为`Radio` or `Checkbox` or `Select`，若设置该值，则数据字典以及用户自定义数据接口无效 | `boolean` | - | `false` |
| codeName | 指定id的属性名,默认为`code` | `string` | - | `name` |
| paramName | 指定关键字的属性名,默认为`name` | `string` | - | `name` |
| extraParams | 搜索组件使用，若搜索接口需要传入额外参数，可以设置该值 | `object` `()=> object` | - | `null` |
| style | 设置组件样式 | `object` | - | `null` |
| availableList | 设置[OptionsList](/src/type/OptionsList/README.md)数据类型组件比如`Radio` or `Checkbox` or `Select`哪些选项显示，对其他类型组件无效 | [OptionsList](/src/type/OptionsList/README.md) | - | `null` |
| getData | 获取远程数据,需返回promise | `(params) => proimse` | - | `null` |
| onLoaded | 远程数据加载成功后回调,接收array,可用于预处理数据,将数据转换成统一格式，形如`[{name: 'helloworld', code: '1'}]` | `(list) => array` | - | `null` |
| field | 设置组件状态（比如是否可用/是否可编辑等），数据源（比如数据字典id/获取数据后台接口/数据预处理等）| [Field](/src/type/Field/README.md) | 是 | |
| onBlur | 文本类型组件焦点失去事件回调 | `(e) => void` | - | `null` |
| onChange | 值变更事件回调，若表单控制权交给antd Form管理则不要设置该值 | `(value) => void` | - | `null` |
| onSelfChange | 值变更事件回调，若表单控制权交给antd Form又需要监听则可以设置该值 | `(value) => void` | - | `null` |

### example
```jsx
import FormFieldRender from '~/_components/FormFieldRender';
import {
  ATTR_TYPE_SELECT,
  ATTR_TYPE_SEARCH,
} from '~/_constant/attrType';

//对接csb数据字典搜索框
const searchFormDictProps = {
  size: 'small',//设置组件大小
  mode: 'edit',//设置组件编辑模式
  onChange: (value) => { },//设置组件值变更事件回调
  dropdownMatchSelectWidth: false,//设置下拉菜单和选择器同宽
  field: {
    attrType: ATTR_TYPE_SEARCH,//设置组件类型为搜索框，必填
    dictId: 'CPLM_OBJ_ORDERED_CLIENT'//设置数据字典id
  }
};
const searchFormDict = (<FormFieldRender {...searchFormDictProps} />);
```
```jsx
//用户自定义数据源搜索框
const searchFormCustomerDataSrouceProps = {
  size: 'small',//设置组件大小
  mode: 'edit',//设置组件编辑模式
  onChange: (value) => { },//设置组件值变更事件回调
  extraParams: { confId: this.props.id },//搜索时需要携带的额外参数，默认只传name
  dropdownMatchSelectWidth: false,//设置下拉菜单和选择器同宽
  getData: this.props.customerportfolio.searchCategory,//设置搜索调用用户自定义的数据接口
  field: {
    //若数据源是用户自定义接口非csb数据字典，则dictId无需设置
    attrType: ATTR_TYPE_SEARCH//设置组件类型为搜索框，必填
  },
  onLoaded: (array) => array.map(({ key, value }) => ({ name: value, code: key }))//远程数据加载成功后回调,接收array,可用于预处理数据,将数据转换成统一格式，形如[{name: 'helloworld', code: '1'}]
};
const searchFormCustomerDataSrouce = (<FormFieldRender {...searchFormCustomerDataSrouceProps} />);
```
```jsx
//用户自定义数据源并且搜索模糊接口参数名不是name或精确搜索接口参数名不是code
const searchFormCustomerDataSrouceAndParamNameNotDefaultProps = {
  size: 'small',//设置组件大小
  mode: 'edit',//设置组件编辑模式
  codeName: 'bomNumbers',//设置精确搜索接口参数名，默认为code
  paramName: 'bomNumbers',//设置模糊搜索接口参数名，默认为name
  onChange: (value) => { },//设置组件值变更事件回调
  dropdownMatchSelectWidth: false,//设置下拉菜单和选择器同宽
  getData: this.props.referenceBaseLine.getReferListForSelect,//设置搜索调用用户自定义的数据接口
  field: {
    //若数据源是用户自定义接口非csb数据字典，则dictId无需设置
    attrType: ATTR_TYPE_SEARCH//设置组件类型为搜索框，必填
  },
  onLoaded: (array) => array.map(({ key, value }) => ({ name: value, code: key }))//远程数据加载成功后回调,接收array,可用于预处理数据,将数据转换成统一格式，形如[{name: 'helloworld', code: '1'}]
};
const searchFormCustomerDataSrouceAndParamNameNotDefault = (<FormFieldRender {...searchFormCustomerDataSrouceAndParamNameNotDefaultProps} />);
```
```jsx
//人员搜索组件
const searchUserProps = {
  size: 'small',//设置组件大小
  mode: 'edit',//设置组件编辑模式
  onChange: (value) => { },//设置组件值变更事件回调
  dropdownMatchSelectWidth: false,//设置下拉菜单和选择器同宽
  field: {
    attrType: ATTR_TYPE_PERSON//设置组件为人员搜索,默认人员搜索数据源为4a
  }
};
const searchUser = (<FormFieldRender {...searchUserProps} />);
```
```jsx
//对接csb数据字典下拉选择框
const selectFormDictProps = {
  size: 'small',//设置组件大小
  mode: 'edit',//设置组件编辑模式
  field: {
    attrType: ATTR_TYPE_SELECT,
    dictId: 'CPLM_OBJ_BOM_LEVEL'//设置数据字典id
  }
};
const select = (<FormFieldRender {...selectFormDictProps} />);
```