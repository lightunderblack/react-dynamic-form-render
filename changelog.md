### 1.1.62
- [bugfix] `DynamicFormRender`大文本单独成行实现存在问题，会打乱用户传入的表单配置顺序

### 1.1.61
- [feature] `Select`、`Checkbox`、`Radio`等`List`类型组件支持传入`extraParams`参数，已实现在调用接口时可向后台传递额外参数

### 1.1.60
- [feature] `SearchBox`返回结果若包含前后空格，或者用户输入值包含前后空格，需去除

### 1.1.59
- [feature] `TreeSelect`支持`isAutoFocus`配置项，是否默认获取焦点

### 1.1.58
- [feature] `TreeSelect`支持`isAutoRemoveOnlyOneChildNode`配置项，是否开启智能移除只有一个子节点节点
- [feature] `TreeSelect`支持`isAutoExpandTreeNode`配置项，是否开启智能展开树节点功能

### 1.1.57
- [feature] `Select`支持描述搜索
- [feature] `SearchBox`开启`defaultActiveFirstOption`方便用户回车选中

### 1.1.56
- [bugfix] `List`类型组件在多选时，`value`或`defaultValue`为null，需转成`undefined`

### 1.1.55
- [feature] `List`类型组件`onChange`支持接收`options`信息

### 1.1.54
- [feature] `Tree`启用是否导入配置项`isEnabledPaste`

### 1.1.53
- [bugfix] 搜索类型输入框`isAllowViewModeCodeNotMatch`在编辑模式下无效

### 1.1.52
- [feature] `DynamicFormRender`判断若是搜索类型输入框，则默认开启`isAllowViewModeCodeNotMatch`

### 1.1.51
- [feature] `DatePicker`和`RangePicker`接受`showTime`

### 1.1.50
- [feature] `Number`接受`verificationRule`的`min`和`max`

### 1.1.49
- [feature] `Tree`启用是否显示全路径配置项`isShowFullPath`

### 1.1.48
- 文本组件若未传入最大长度限制，不启用默认值

### 1.1.47
- [feature] 定制组件初始值解析，若包含半角/全角符号，生成正则表达式匹配时需要都支持全角半角符号匹配
- [feature] `Tree`支持`dropdownStyle`

### 1.1.46
- [feature] `UserSearchBox`在多选时，选择值后默认收取下拉区域

### 1.1.45
- [bugfix] `Tree`支持`isForceMutipleMode`强制单选以多选样式呈现，但无法清空值

### 1.1.44
- [bugfix] `Tree`支持`isForceMutipleMode`强制单选以多选样式呈现，但无法清空值

### 1.1.43
- [feature] `Tree`支持`isForceMutipleMode`强制单选以多选样式呈现

### 1.1.42
- [feature] `DynamicFormRender`支持正则表达式校验规则

### 1.1.41
- [feature] `Tree`支持`isOnlyShowLeafNode`是否只展示叶子节点

### 1.1.40
- [bugfix] 定制组件在通过`setFieldValues`设置值时无效，必填校验时有值还会提醒

### 1.1.39
- [bugfix] 定制组件若输入框是对接数据字典，输入值时会报错

### 1.1.38
- [bugfix] 定制组件输入框输入值是会报错

### 1.1.37
- [feature] `Tree`支持搜索若匹配父节点需展示子节点

### 1.1.36
- [feature] 自定义组件值解析优化

### 1.1.35
- [bugfix] 若值加单位在校验最大最小值时需要判空

### 1.1.34
- [bugfix] 输入加单位组件，若输入没有值则在预览模式下，不显示

### 1.1.33
- [bugfix] 定制组件若所有输入类型元素无值，则值未空不展示

### 1.1.32
- [bugfix] 定制组件若包含对接数据字典下拉列表，在渲染模式下未转换

### 1.1.31
- [bugfix] 定制组件若下拉列表为数据字典会报错

### 1.1.30
- [feature] `Tree`支持`isDisabledItemSelectable`设置禁用节点是否可选
- [feature] 定制组件支持数据字典列表显示

### 1.1.29
- [bufix] 修复`Tree`若父级`isEnabled`为`1`时，所有子元素`isEnabled`为`1`了

### 1.1.28
- [bufix] `List`类型以及`Tree`类型组件，若选项没带有`isDisabled`或`isEnabled`时，没有出现在选项列表中

### 1.1.27
- [bufix] `TreeSelect`父级若`isEnabled`为`'0'`则所有子元素的`isEnabled`为`'1'`
- [feature] 将`disabled`选项放置后面

### 1.1.26
- [bufix] `SearchBox`为`combobox`时回填到选择框的为`title`改为`value`

### 1.1.25
- [feature] `TreeSelect`、`SearchBox`、`UserSearch`以及`List`类型组件支持`isEnabled`、`description`属性

### 1.1.24
- [bugfix] `TreeSelect` 去除对 `DataSource` 长度为 `0` 时的判空校验

### 1.1.23
- [bugfix] `TreeSelect` 类型组件在 `DataSource` 更新时不刷新的问题

### 1.1.22
- [feature] `List`类型组件支持`noCache`参数，若传入`true`则不使用缓存，默认为`false`

### 1.1.21
- [feature] `Tree`组件缓存碾平数据，在预览模式下，将转换逻辑进行优化，避免每次`render`时去读取解析碾平的缓存数据，以提高性能

### 1.1.20
- [feature] `Tree`组件缓存碾平数据，用于优化在预览模式下转换值性能

### 1.1.19
- [feature] 组件预览模式下支持title显示

### 1.1.18
- [bugfix] 新增树形多选类型

### 1.1.17
- [bugfix] 修复自定义组件无法识别默认值为0

### 1.1.16
- [feature] 新增树形多选类型

### 1.1.15
- [feature] 树形控件在预览模式下值展示全路径

### 1.1.14
- [feature] 动态表单渲染组件默认不展示校验图标
- [feature] 表单数据支持传入key值
- [feature] 表单组件涉及到异步请求接口若有异常则往上抛出

### 1.1.13
- [feature] `DynamicFormRender`每个`Collapse`每个`Tab`都包好有`data-id`属性

### 1.1.12
- [feature] `FormFieldTreeSelect`keyName默认值为`code`

### 1.1.11
- [feature] `DynamicSearchForm`支持输入框回车搜索
- [feature] `List`组件`onLoaded`方法第二参数接收为格式化所有数据

### 1.1.10
- [feature] `TreeSelect`支持传入`showCheckedStrategy`，决定多行文本是否单独行展示

### 1.1.9
- [feature] 搜索组件支持传入`isTextAreaAlone`，决定多行文本是否单独行展示

### 1.1.8
- [bugfix] 列表类型若传入`dataSource`是空数组，列表未清空

### 1.1.7
- [bugfix] 非常奇怪的bug,antd有时会自动设置ant-collapse-content-active的高度，导致内容区展示内容不全

### 1.1.6
- [feature] 去除表单域固定高度样式

### 1.1.5
- [feature] `DynamicFormRender`支持传入`isTextAreaAlone`决定`Textarea`是否单独行

### 1.1.4
- [feature] 列表类组件`Select`,`Radio`,`Checkbox`支持传入`disabledList`决定是否禁用选项

### 1.1.3
- [feature] `DynamicFormRender`支持传入`isSetDefaultValue`决定是否设置默认值

### 1.1.2
- [bugfix] 修复定制组件解析错误bug
- [opti] 优化定制组件必填校验

### 1.1.1
- [feature] `Input` 新增 `onPressEnter` 支持

### 1.1.0
- [feature] 组件支持带单位

### 1.0.63
- [feature] 树形组件支持DataSource传入数据

### 1.0.62
- [bugfix] 修复保存是多选类型组件的默认值格式错误
- [bugfix] 修复CustomComponent组件不支持disabled

### 1.0.61
- [bugfix] 自定义组件若传入moduleConfigInfo值为undefined会报错

### 1.0.60
- [bugfix] 组件配置默认值未正确显示

### 1.0.59
- [bugfix] TagInput预览模式下未显示值
- [bugfix] 优化数字输入框样式，去除上下箭头样式

### 1.0.58
- [bugfix] CustomComponent若有单位，则使用下拉列表展示

### 1.0.57
- [bugfix] DynamicFormRender支持传入：isValidateRequired设置是否必填校验；labelRender设置formItem的label外部定制

### 1.0.56
- [bugfix] 修复单位控件选择样式

### 1.0.55
- [bugfix] 自定义组件无法识别默认值

### 1.0.54
- [feature] 组件支持用户传入viewRender定制显示预览模式效果
- [bugfix] 日期组件指定中文语言包

### 1.0.53
- [bugfix] SearchBox支持用户搜索选择值后，匹配到的结果列表保留以供连续选择

### 1.0.52
- [bugfix] DynamicSearchForm搜索时未将条件值传入给onSubmit回调函数

### 1.0.51
- [feature] FormFieldRender支持传入viewWrapper，以实现用户灵活定制预览模式显示效果

### 1.0.50
- [feature] 新增定制组件CustomComponent
- [feature] DynamicSearchForm判断是否有定制组件类型组件，若有则回传值时需对定制组件类型的值做替换处理，输出正确的值

### 1.0.49
- [feature] 新增TagInput多标签输入模式
- [feature] TagInput支持数据字典
- [feature] TagInput支持DataSource

### 1.0.48
- [feature] 新增定制组件类型字段
- [feature] DynamicFormRender/DynamicSearchForm支持formItemLayout传入，设置表单布局样式

### 1.0.47
- [feature] TreeSelect数据添加isLeaf字段

### 1.0.46
- [feature] TreeSelect组件节点接收属性放开，以支持灵活控制节点

### 1.0.45
- [feature] Select/TreeSelect组件支持接收getPopupContainer属性

### 1.0.44
- [feature] 为了解决性能，将TreeSelect的treeDefaultExpandAll默认值为false
- [feature] TreeSelect的onSelfChange接收TreeNode

### 1.0.42
- [feature] DatePicker组件接收参数与Antd参数一致
- [feature] 去除DynamicFormRender传入FormFieldRender参数限制

### 1.0.41
- [feature] 新增Switch组件

### 1.0.40
- [bugfix] DynamicFormRender支持传入onBlur

### 1.0.39
- [bugfix] 将文本输入框maxLength值由字符串转数值

### 1.0.38
- [bugfix] List组件(Select/Radio/Checkbox)为了与Search参数保持一致，兼容传入codeName
- [feature] 动态表单渲染器支持传入maxTagCount和maxTagPlaceholder

### 1.0.37
- [feature] input类型表单支持onBlur事件

### 1.0.36
- [bugfix] 修复单选框onSelfChange无传入值问题

### 1.0.35
- [feature] Select组件支持maxTagCount参数

### 1.0.34
- [bugfix] 字典列表读取缓存后未做值过滤

### 1.0.33
- [feature] 人员搜索支持如果域账号未匹配到后台数据仍然可以显示

### 1.0.32
- [feature] DynamicFormRender传入FormFieldRender的props限制放开

### 1.0.31
- [feature] field默认赋值为空对象

### 1.0.30
- [optimize] 表单处于预览模式时，文字过长需要换行

### 1.0.29
- [feature] DynamicFormRender支持传入values
- [feature] 支持自定义组件
- [feature] 支持传入rules

### 1.0.28
- [feature] 动态表单渲染组件支持接收paramName参数

### 1.0.27
- [optimize] 若表单域没有名称,则label不显示,表单需要设置offset

### 1.0.26
- [optimize] 搜索框若值未变更则无需再向后台发起请求

### 1.0.25
- [feature] 下拉列表和搜索框支持清除选择内容

### 1.0.0
- 添加readme
- 动态表单渲染器

