### AttributeDtoList类型

类型为**对象数组**，对象包含如下属性

| 参数 | 说明 | 类型 | 必填 | 默认值 |
| ---- | ---- | ---- | ---- | ------ |
| id | 表单组件唯一id | `string` | 是 |  |
| name | 表单组件label显示名称 | `string` | 是 |  |
| attrType | 组件类型，可选值请查阅`constant/attrType` | `string` | 是 |  |
| dictId | 数据源id，若对接csb数据字典，则值对应为数据字典key值 | `string` | - | `null` |
| isEnabled | 是否可用，可选值为`"1"`或`"0"` | `string` | - | `"1"` |
| isEditable | 是否可编辑，可选值为`"1"`或`"0"` | `string` | - | `null` |
| verificationRule | 表单校验规则，值为JSON格式字符串 | `string` | - | |
| autoFocus | 设置自动获取焦点，可选值为`"1"` or `"0"` | `string` | - | `"0"` |
| dropdownMatchSelectWidth | 下拉菜单和选择器同宽 | `boolean` | - | `false` |
| dataSource | 设置本地数据源，用于组件类型为`Radio` or `Checkbox` or `Select`，若设置该值，则数据字典以及用户自定义数据接口无效 | `boolean` | - | `false` |
| codeName | 指定id的属性名,默认为`code` | `string` | - | `name` |
| paramName | 指定关键字的属性名,默认为`name` | `string` | - | `name` |
| extraParams | 搜索组件使用，若搜索接口需要传入额外参数，可以设置该值 | `object` `()=> object` | - | `null` |
| style | 设置组件样式 | `object` | - | `null` |
| availableList | 设置`List`数据类型组件比如`Radio` or `Checkbox` or `Select`哪些选项显示，对其他类型组件无效 | `List` | - | `null` |
| getData | 获取远程数据,需返回promise | `(params) => proimse` | - | `null` |
| onLoaded | 远程数据加载成功后回调,接收array,可用于预处理数据,将数据转换成统一格式，形如`[{name: 'helloworld', code: '1'}]` | `(list) => array` | - | `null` |
| onBlur | 文本类型组件焦点失去事件回调 | `(e) => void` | - | `null` |
| onChange | 值变更事件回调，若表单控制权交给antd Form管理则不要设置该值 | `(value) => void` | - | `null` |
| onSelfChange | 值变更事件回调，若表单控制权交给antd Form又需要监听则可以设置该值 | `(value) => void` | - | `null` |
| onPressEnter | 监听回车事件，仅针对 `Input` 有效 | `(value) => void` | - | `null` |