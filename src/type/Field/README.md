### Field类型

类型为**对象**，包含如下属性

| 参数 | 说明 | 类型 | 必填 | 默认值 |
| ---- | ---- | ---- | ---- | ------ |
| attrType | 组件类型，可选值请查阅[attrType](/src/constant/README.md) | `string` | 是 |  |
| dictId | 数据源id，若对接csb数据字典，则值对应为数据字典key值 | `string` | - | `null` |
| isEnabled | 是否可用，可选值为`"1"`或`"0"` | `string` | - | `"1"` |
| verificationRule | 表单校验规则，值为JSON格式字符串 | `string` | - | |