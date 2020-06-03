export const ATTR_TYPE_TEXT = "1"; // 单行文本
export const ATTR_TYPE_CLOB = "2"; // 多行文本
export const ATTR_TYPE_INT = "3"; // 整数
export const ATTR_TYPE_FLOAT = "4"; // 小数
export const ATTR_TYPE_DATE = "5"; // 日期
export const ATTR_TYPE_RADIO = "6"; // 单选框
export const ATTR_TYPE_CHECKBOX = "7"; // 复选框
export const ATTR_TYPE_SELECT = "8"; // 下拉单选
export const ATTR_TYPE_MULTI_SELECT = "9"; // 下拉多选
export const ATTR_TYPE_SEARCH = "10"; // 单选搜索
export const ATTR_TYPE_MULTI_SEARCH = "11"; // 多选搜索
export const ATTR_TYPE_TREE_SELECT = "12"; // 树形选择
export const ATTR_TYPE_PERSON = "13"; //人员单选
export const ATTR_TYPE_MULTI_PERSON = "14";//人员多选
export const ATTR_TYPE_TAG_INPUT = "15";//标签输入框
export const ATTR_TYPE_DATE_RANGE = "16";//日期区间选择
export const ATTR_TYPE_SWTICH = "17";//开关选择器
export const ATTR_TYPE_SINGLE_TAG_INPUT = "18";//单标签输入框
export const ATTR_TYPE_TREE_MULTI_SELECT = "19"; // 树形多选
export const ATTR_TYPE_LABEL = "999";//文本标签
export const ATTR_TYPE_CUSTOM_COMP = "9999";//定制组件
export const ATTR_TYPE_CUSTOM_COMP_MULTI = "10000";//定制组件多值
export const ATTR_TYPE_COMPONENT = "9999999";//预留自定义组件

export const REPLACEMENT_CHARACTER = "\uFFFD";//特殊分隔符
export const MAX_CACHE_CHARACTER_LENGTH = 8000000;//缓存字符最大长度

export const CUSTOM_COMP_ITEM_TYPE_PREFIX = "1";//定制组件-前缀
export const CUSTOM_COMP_ITEM_TYPE_INPUT = "2";//定制组件-输入
export const CUSTOM_COMP_ITEM_TYPE_CONNECT = "3";//定制组件-连接
export const CUSTOM_COMP_ITEM_TYPE_SUFFIX = "4";//定制组件-后缀
export const CUSTOM_COMP_ITEM_TYPE_LIST = [{
  text: '前缀',
  value: CUSTOM_COMP_ITEM_TYPE_PREFIX
}, {
  text: '输入',
  value: CUSTOM_COMP_ITEM_TYPE_INPUT
}, {
  text: '连接',
  value: CUSTOM_COMP_ITEM_TYPE_CONNECT
}, {
  text: '后缀',
  value: CUSTOM_COMP_ITEM_TYPE_SUFFIX
}];
export const CUSTOM_COMP_TYPE_LIST = [{
  text: '文本标签',
  value: ATTR_TYPE_LABEL
}, {
  text: '单行文本',
  value: ATTR_TYPE_TEXT
}, {
  text: '数字',
  value: ATTR_TYPE_INT
}, {
  text: '下拉单选',
  value: ATTR_TYPE_SELECT
}];

//可对接列表字典表单域
export const IS_DICT_LIST_FIELDS = {
  [ATTR_TYPE_SWTICH]: 1,
  [ATTR_TYPE_SEARCH]: 1,
  [ATTR_TYPE_RADIO]: 1,
  [ATTR_TYPE_MULTI_SEARCH]: 1,
  [ATTR_TYPE_CHECKBOX]: 1,
  [ATTR_TYPE_SELECT]: 1,
  [ATTR_TYPE_MULTI_SELECT]: 1
};

//多选值表单组件类型
export const IS_MUTIPLE_VALUE_FIELDS = {
  [ATTR_TYPE_CHECKBOX]: 1,
  [ATTR_TYPE_TAG_INPUT]: 1,
  [ATTR_TYPE_MULTI_SELECT]: 1,
  [ATTR_TYPE_MULTI_SEARCH]: 1,
  [ATTR_TYPE_MULTI_PERSON]: 1,
};

//可对接树形字典表单域
export const IS_DICT_TREE_FIELDS = {
  [ATTR_TYPE_TREE_SELECT]: 1,
  [ATTR_TYPE_TREE_MULTI_SELECT]: 1,
};

//可对接人员搜索字典表单域
export const IS_PERSON_SEARCH_FIELDS = {
  [ATTR_TYPE_PERSON]: 1,
  [ATTR_TYPE_MULTI_PERSON]: 1
};

export const ATTR_TYPE_LIST = [{
  text: '单行文本',
  value: ATTR_TYPE_TEXT
}, {
  text: '多行文本',
  value: ATTR_TYPE_CLOB
}, {
  text: '数字',
  value: ATTR_TYPE_INT
}, {
  text: '日期',
  value: ATTR_TYPE_DATE
}, {
  text: '日期区间',
  value: ATTR_TYPE_DATE_RANGE
}, {
  text: '单选框',
  value: ATTR_TYPE_RADIO
}, {
  text: '复选框',
  value: ATTR_TYPE_CHECKBOX
}, {
  text: '下拉单选',
  value: ATTR_TYPE_SELECT
}, {
  text: '下拉多选',
  value: ATTR_TYPE_MULTI_SELECT
}, {
  text: '单选搜索',
  value: ATTR_TYPE_SEARCH
}, {
  text: '多选搜索',
  value: ATTR_TYPE_MULTI_SEARCH
}, {
  text: '树形选择',
  value: ATTR_TYPE_TREE_SELECT
}, {
  text: '树形多选',
  value: ATTR_TYPE_TREE_MULTI_SELECT
}, {
  text: '人员单选',
  value: ATTR_TYPE_PERSON
}, {
  text: '人员多选',
  value: ATTR_TYPE_MULTI_PERSON
}, {
  text: '多标签输入',
  value: ATTR_TYPE_TAG_INPUT
}, {
  text: '单标签输入',
  value: ATTR_TYPE_SINGLE_TAG_INPUT,
}, {
  text: '定制组件',
  value: ATTR_TYPE_CUSTOM_COMP
}, {
  text: '定制组件多值',
  value: ATTR_TYPE_CUSTOM_COMP_MULTI
}]