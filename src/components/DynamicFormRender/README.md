### Introduction
表单组组件，根据用户传入的多个表单组件数据渲染，支持分组，默认分组样式为`Collpase`

### API

### 属性

| 参数 | 说明 | 类型 | 必填 | 默认值 |
| ---- | ---- | ---- | ---- | ------ |
| mode | 设置组件预览或者编辑模式，可选值为`view` or `edit` | `object` | 是 | `view` |
| form | `antd`的`Form`对象，外部注入，表单控制权交给`Form` | `Form` | 是 | |
| size | 设置组件大小，可选值为`default` or `small` or `large` | `string` | 是 | `default` |
| direction | 设置布局方式，可选值为`horizontal` or `vertical`，水平模式下默认三列布局，垂直模式下只能单列布局 | `string` | 是 | `horizontal` |
| itemList | 设置表单组件数据，若`isCollapse`为`true`，则传[ItemList](/src/type/ItemList/README.md)类型数据；若`isCollapse`为`false`，则传[AttributeDtoList](/src/type/AttributeDtoList/README.md)类型数据 | [ItemList](/src/type/ItemList/README.md) or [AttributeDtoList](/src/type/AttributeDtoList/README.md) | 是 |  |
| values | 设置表单值，它是对象类型，key为表单的id，value则为表单的值 | `object` | 否 | `null` |
| columnCount | 设置每列显示多少个表单组件，用于水平模式下网格布局，仅对水平模式下有效 | `number` | 否 | 3 |
| isCollapse | 设置是否分组，默认为分组 | `boolean` | 否 | `true` |
| hasFeedback | 展示校验状态图标 | `boolean` | 否 | `true` |

### example

```jsx
  import DynamicFormRender from '~/_components/FormFieldRender/DynamicFormRender';
  import {
    ATTR_TYPE_TEXT,
    ATTR_TYPE_RADIO,
    ATTR_TYPE_SEARCH,
    ATTR_TYPE_SELECT,
    ATTR_TYPE_MULTI_SELECT
  } from '~/_constant/attrType';

  //不分组垂直布局
  const formWithoutGroupVerticalProps = {
    mode: 'edit',
    size: 'small',
    isCollapse: false, //不需分组
    direction: 'vertical', //垂直布局
    form: this.props.form, //外部antd Form对象注入
    //不分组，则itemList值为AttributeDtoList类型对象
    itemList: [
      {
        id: 'buId', //表单唯一id
        name: '事业部', //表单label名称
        isRequired: '1', //是否必填
        dictId: 'CPLM_OBJ_ORG_UNIT', //设置对接csb数据字典的字典id
        attrType : ATTR_TYPE_SELECT, //设置组件类型为下拉单选
      }, 
      {
        isRequired: '1', //是否必填
        id: 'requireId', //表单唯一id
        name: '客户管控规则', //表单label名称
        attrType: ATTR_TYPE_SEARCH, //设置组件类型为单选搜索
        onLoaded: (value) => value.map(({ key, value }) => ({ code: key, name: value })), //接口返回数据预处理，为了格式统一
        getData: this.props.baselineLimitMaterials.getBaselineRequireAll //用户自定义数据源接口
      }, 
      {
        name: '产品型号', //表单label名称
        id: 'prodModel', //表单唯一id
        isRequired: '1', //是否必填
        attrType : ATTR_TYPE_SEARCH, //设置组件类型为单选搜索
        extraParams: { existAsterisk: 1 }, //搜索接口需要额外参数
        getData: this.props.baselineLimitMaterials.searchProdModelWithAsterisk //用户自定义数据源接口
      }
    ]
  };
  const formWithoutGroupVertical = (<DynamicFormRender {...formWithoutGroupProps} />);
```

```jsx
  //分组水平布局
  const formWitGroupHorizontalProps = {
      mode: 'edit',
      size: 'small',
      columnCount: 3, //三列布局
      isCollapse: true, //分组
      hasFeedback: false, //不显示表单校验结果图标
      form: this.props.form, //外部antd Form对象注入
      direction: 'horizontal', //水平布局
      values: this.state.values, // 设置表单值，它是对象类型，key为表单的id，value则为表单的值
      //分组，则itemList值为ItemList类型对象
      itemList: [
        { 
          id: 'report',
          apiName: 'report', 
          name: '报表格式条件', 
          attributeDtoList: [
            {
              id: 'bomFormat', //表单唯一id
              name: 'BOM格式', //表单label名称
              isRequired: '1', //是否必填
              attrType : ATTR_TYPE_RADIO, //设置组件类型为单选框
              dataSource: [{ name: 'CVTE BOM', code: 'cvte' }, { name: 'CKD BOM', code: 'ckd' }] //设置本地数据源，此时就不用配置数据字典id或用户自定义数据源接口
            },
            {
              name: '导出语言', //表单label名称
              isRequired: '1', //是否必填
              id: 'exportLang', //表单唯一id
              attrType : ATTR_TYPE_RADIO, //设置组件类型为单选框
              dataSource: [{ name: '中文', code: 'ch' }, { name: '英文', code: 'en' }] //设置本地数据源，此时就不用配置数据字典id或用户自定义数据源接口
            },
            {
              isRequired: '1', //是否必填
              id: 'blOperation', //表单唯一id
              name: '基线运算条件', //表单label名称
              attrType : ATTR_TYPE_RADIO, //设置组件类型为单选框
              dataSource: [{ name: '增加未进入事业部基线替代料', code: '0' }, { name: '仅运算进入事业部基线替代料', code: '1' }, { name: '运算所有基线物料', code: '2' }] //设置本地数据源，此时就不用配置数据字典id或用户自定义数据源接口
            }
          ] 
        }, 
        { 
          id: 'bom',
          apiName: 'bom', 
          name: 'BOM条件', 
          attributeDtoList: [
            {
              id: 'bomNo', //表单唯一id
              name: '产品代码', //表单label名称
              isRequired: '1', //是否必填
              attrType : ATTR_TYPE_TEXT, //设置组件类型为单行文本框
              onBlur: (value) => {} //设置文本框焦点失去事件回调
            },
            {
              name: 'BOM版本',
              id: 'bomVersionId',
              attrType : ATTR_TYPE_SELECT,
              dataSource: this.formatBomVersionList()
            },
            {
              isEditable: '0',
              id: 'requireName',
              name: '客户管控规则',
              attrType : ATTR_TYPE_TEXT,
            },
            {
              id: 'bomLevel',
              name: 'BOM等级',
              isEditable: '0',
              attrType : ATTR_TYPE_TEXT
            },
            {
              name: '物料状态',
              isRequired: '1',
              id: 'mateStatus',
              attrType : ATTR_TYPE_MULTI_SELECT,
              dataSource: STATUS_DICT.map(code => ({ code, name: code }))
            }
          ]
        }
      ]
  };
  const formWithGroupHorizontal = (<DynamicFormRender {...formWitGroupHorizontalProps} />);
```
