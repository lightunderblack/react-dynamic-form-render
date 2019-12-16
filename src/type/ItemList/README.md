### ItemList类型

类型为**对象数组**，对象包含如下属性

| 参数 | 说明 | 类型 | 必填 | 默认值 |
| ---- | ---- | ---- | ---- | ------ |
| id | 组唯一标识 | `string`  | 是 |  |
| apiName | 一般值与id相同 | `string` | 是 |  |
| name | 组显示名称 | `string` | 否 |  |
| attributeDtoList | 表单组件数据 | [AttributeDtoList](/src/type/AttributeDtoList/README.md) | 是 |  |