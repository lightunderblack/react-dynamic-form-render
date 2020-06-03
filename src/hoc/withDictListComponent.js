import React, { Component } from 'react';
import { Icon, Tooltip } from 'antd';
import RelyAttrbuteListCollapse from '../components/RelyAttrbuteListCollapse';
import { REPLACEMENT_CHARACTER } from '../constant/attrType';

import _ from 'lodash';
import Tools from '../util/tool';

export default function withDictListComponent(WrappedComponent, filedName) {
  return class WithDictListComponent extends Component {
    state = {
      options: []
    }

    componentDidMount () {
      const { field: { dictId }, dataSource } = this.props;
      if (_.isArray(dataSource)) {
        this.loadData(null, dataSource);
      } else {
        this.loadData(dictId);
      }
    }

    componentWillReceiveProps (nextProps) {
      const { field: { dictId }, dataSource } = nextProps;
      if (_.isArray(dataSource)) {
        this.loadData(null, dataSource, nextProps);
      } else {
        if (dictId !== this.props.field.dictId) {
          this.loadData(dictId, null, nextProps);
        }
      }
    }

    componentWillUnmount() {
      this.setState = () => {};
    }

    getKey () {
      return this.props.keyName || this.props.codeName || 'code';//为了与Search组件参数一致，也兼容传入codeName
    }
  
    getName () {
      return this.props.textName || 'name';
    }

    getExtraParams(props) {
      const { extraParams } = props;
      if (extraParams) {
        if (_.isFunction(extraParams)) {
          return extraParams();
        } else {
          return extraParams;
        }
      } else {
        return {};
      }
    }

    object2Array (array) {
      let { disabledList } = this.props;

      disabledList = disabledList || [];
      array = array.map(item => {
        const isEnabled = item.isEnabled == null ? '1' : item.isEnabled;
        let isDisabled = isEnabled === '1' ? '0' : '1';
        if (!!~_.indexOf(disabledList, item[this.getKey()])) { isDisabled = '1'; }
        return ({ isDisabled, description: item.description, name: item[this.getName()], id: item[this.getKey()] });
      });

      return array;
    }

    filterAvaliable (options) {
      const { availableList } = this.props;
      return (availableList || []).length ? (options || []).filter(({ id }) => !!~_.indexOf(availableList, id)) : options;
    }

    //将可用选项排前，不可用选项排后
    sortedByIsDisabled (array) {
      const result = [];
      const groups = _.groupBy(array, 'isDisabled');

      _.forEach(groups, (group, key) => {
        if (key === '0') {
          result.unshift(...(group || []));
        } else {
          result.push(...(group || []));
        }
      });

      return result;
    }
  
    pretreatment (array, list) {
      const { onLoaded } = this.props;
      return onLoaded ? onLoaded(array, list) : array;
    }
  
    loadData (dictId, dataSource, props = this.props) {
      if (dictId) {
        this.loadDict({ apiName: dictId }, props);
      } else {
        this.setState({ options: this.sortedByIsDisabled(this.object2Array(dataSource || props.dataSource || [])) });
      }
    }
  
    loadDict (params, props) {
      if (params.apiName) {
        const { noCache } = this.props;
        const key = `${filedName}_${params.apiName}`;
        const fetch = () => {
          this.props.getData({ params: { ...params, ...this.getExtraParams(props) } }).then(({ data: { content } }) => {
            this.setState({ options: this.sortedByIsDisabled(this.pretreatment(this.object2Array(content || []), content)) });
            Tools.sessionStorage.add(key, (content || []));
          }, () => {
            this.setState({ options: [] });
          }).catch((error) => {
            throw new Error(error);
          });
        };

        if (noCache) {
          fetch();
        } else {
          const data = Tools.sessionStorage.get(key);
          if (data && data.length) {
            const list = data;
            this.setState({ options: this.sortedByIsDisabled(this.pretreatment(this.object2Array(list), list)) });
          } else {
            fetch();
          }
        }
      } else {
        this.setState({ options: [] });
      }
    }

    formatDefaultValue (defaultValue, isMultiple) {
      //若是多选，默认值有值并且为字符串
      if (isMultiple) {
        if (defaultValue) {
          if (_.isString(defaultValue)) {
            defaultValue = defaultValue.split(new RegExp(REPLACEMENT_CHARACTER)); //切割字符串生成数组
          }
        } else {
          defaultValue = undefined;
        }
      }
      return defaultValue;
    }

    generateViewArea (value) {
      let title;
      let element = null;
      const { viewRender, isOnlyShowText } = this.props;
      const match = (value || []).map(id => this.state.options.find(item => item.id === id)).filter(v => v);
  
      if (viewRender) {
        element = viewRender(match, this.state.options);
      } else {
        title = match.map(item => item.name).join(';');
        element = match.map((item, index) => {
          const { id, name, description } = item;
          if (description) {
            return (
              <span key={id}>
                <span>
                  {name}
                  <Tooltip placement="top" title={description}>
                    <Icon type="question-circle-o" style={{ color: 'gray' }} />
                  </Tooltip>
                </span>
                {index !== (match.length - 1) ? ';' : ''}
              </span>
            );
          } else {
            return (
              <span key={id}>{name}{index !== (match.length - 1) ? ';' : ''}</span>
            );
          }
        });
        if (isOnlyShowText) { return title; }
      }
  
      return (
        <div className="form-field-render-view" title={title}>
          <div className="form-field-render-view-value">{element}</div>
        </div>
      );
    }

    generateRelyAttributeList (relyAttributeList) {
      let { value, isMultiple } = this.props;

      value = this.formatDefaultValue(value, isMultiple);
      value = isMultiple ? [...(value || [])] : (value ? [value] : []);

      const values = this.state.options.filter(item => {
        return !!~_.indexOf(value, item.id);
      }).map(({ id, name }) => {
        return ({ name, code: id });
      });
      const props = {
        values,
        form: this.props.form,
        columnCount: this.props.columnCount,
        relyAttributeList: relyAttributeList,
        formFiledRender: this.props.formFiledRender
      };

      return (
        <RelyAttrbuteListCollapse {...props} />
      );
    }
    
    render() {
      const props = { 
        ...this.props,
        formatDefaultValue: this.formatDefaultValue,
        options: this.filterAvaliable(this.state.options),
        generateViewArea: this.generateViewArea.bind(this)
      };
      
      if (props.key != null) {
        props.key = `withDictListComponent_${props.key}`;
      }

      const { mode, relyAttributeList } = this.props;
      const element = (<WrappedComponent {...props} />);

      if (mode === 'view' && !_.isEmpty(relyAttributeList)) {
        //显示关联属性
        return (
          <React.Fragment>
            {element}
            {this.generateRelyAttributeList(relyAttributeList)}
          </React.Fragment>
        );
      } else {
        return element;
      }
    }

    static defaultProps = {
      field: {}
    }
  };
}