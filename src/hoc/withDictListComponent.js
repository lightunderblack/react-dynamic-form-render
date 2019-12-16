import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'antd';
import { REPLACEMENT_CHARACTER } from '../constant/attrType';
import _ from 'lodash';

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
        this.loadData(null, dataSource);
      } else {
        if (dictId !== this.props.field.dictId) {
          this.loadData(dictId);
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

    getExtraParams() {
      const { extraParams } = this.props;
      return extraParams ? (_.isFunction(extraParams) ? extraParams() : extraParams) : {};
    }

    object2Array (array) {
      let { availableList, disabledList } = this.props;

      disabledList = disabledList || [];
      availableList = availableList || [];
      array = availableList.length ? array.filter(item => !!~_.indexOf(availableList, item[this.getKey()])) : array;
      array = array.map(item => {
        const isEnabled = item.isEnabled == null ? '1' : item.isEnabled;
        let isDisabled = isEnabled === '1' ? '0' : '1';
        if (!!~_.indexOf(disabledList, item[this.getKey()])) { isDisabled = '1'; }
        return ({ isDisabled, description: item.description, name: item[this.getName()], id: item[this.getKey()] });
      });

      return array;
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
  
    loadData (dictId, dataSource) {
      if (dictId) {
        this.loadDict({ apiName: dictId });
      } else {
        this.setState({ options: this.sortedByIsDisabled(this.object2Array(dataSource || this.props.dataSource || [])) });
      }
    }
  
    loadDict (params) {
      if (params.apiName) {
        const { noCache } = this.props;
        const key = `${filedName}_${params.apiName}`;
        const fetch = () => {
          this.props.getData({ params: { ...params, ...this.getExtraParams() } }).then(({ data: { content } }) => {
            this.setState({ options: this.sortedByIsDisabled(this.pretreatment(this.object2Array(content || []), content)) });
            sessionStorage.setItem(key, JSON.stringify(content || []));
          }, () => {
            this.setState({ options: [] });
          }).catch((error) => {
            throw new Error(error);
          });
        };

        if (noCache) {
          fetch();
        } else {
          const data = sessionStorage.getItem(key);
          if (data && JSON.parse(data).length) {
            const list = JSON.parse(data);
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
      const { viewRender } = this.props;
      const match = this.state.options.filter(item => !!~_.indexOf(value, item.id));
  
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
      }
  
      return (
        <div className="form-field-render-view" title={title}>
          <div className="form-field-render-view-value">{element}</div>
        </div>
      );
    }
    
    render() {
      const props = { 
        ...this.props,
        options: this.state.options,
        formatDefaultValue: this.formatDefaultValue,
        generateViewArea: this.generateViewArea.bind(this)
      };
      
      if (props.key != null) {
        props.key = `withDictListComponent_${props.key}`;
      }

      return <WrappedComponent {...props} />;
    }

    static defaultProps = {
      field: {}
    }
  };
}