### Introduction
搜索区域表单，根据用户传入的多个表单组件数据渲染，对`DynamicFormRender`进行包裹，赋予特定参数。

### API

### 属性

| 参数 | 说明 | 类型 | 必填 | 默认值 |
| ---- | ---- | ---- | ---- | ------ |
| itemList | 设置表单组件数据 | [AttributeDtoList](/src/type/AttributeDtoList/README.md) | 是 |  |
| columnCount | 设置每列显示多少个表单组件 | `number` | 否 | 3 |
| hasFeedback | 展示校验状态图标 | `boolean` | 否 | `true` |
| onClear | 点击清除按钮事件回调 | `() => void` | 否 |  |
| onSubmit | 点击搜索按钮事件回调，需返回`Promise`对象 | `(values) => promise` | 是 |  |

### example

```jsx
import DynamicSearchForm from '~/_components/FormFieldRender/DynamicSearchForm';
import {
  ATTR_TYPE_TEXT,
  ATTR_TYPE_SELECT
} from '~/_constant/attrType';

const props = {
  columnCount: 4, //每列显示4行
  onClear: () => {}, //清除按钮点击事件回调
  onSubmit: (filterData) => Promise.resolve(), //搜索按钮点击事件回调
  itemList: [
    {
      name: '编号', //表单label名称
      id: 'serialNumber', //表单唯一id 
      attrType : ATTR_TYPE_TEXT //组件类型为单行文本输入框
    }, 
    {
      name: '描述', //表单label名称 
      id: 'description', //表单唯一id
      attrType : ATTR_TYPE_TEXT //组件类型为单行文本输入框
    },
    {
      name: '状态', //表单label名称 
      id: 'currentStatus', //表单唯一id
      attrType : ATTR_TYPE_SELECT, //组件类型为单选下拉列表
      dictId: 'CPLM_OBJ_CHANGE_STATUS', //设置对接csb数据字典的字典id
      onLoaded: (value) => [{ name: '全部', id: '' }, ...value], //接口返回数据预处理，为了格式统一
    },
    {
      name: '事业部', //表单label名称 
      id: 'orgCode', //表单唯一id
      dictId: 'CPLM_OBJ_ORG_UNIT', //设置对接csb数据字典的字典id
      attrType : ATTR_TYPE_SELECT, //组件类型为单选下拉列表
      dropdownMatchSelectWidth: false, //下拉菜单宽度自适应
      onLoaded: (value) => [{ name: '全部', id: '' }, ...value], //接口返回数据预处理，为了格式统一
    },
    {
      name: '创建人', //表单label名称 
      id: 'crtName', //表单唯一id
      attrType : ATTR_TYPE_TEXT //组件类型为单选下拉列表
    }
  ]
};
const searchForm = (<DynamicSearchForm {...props} />);
```
