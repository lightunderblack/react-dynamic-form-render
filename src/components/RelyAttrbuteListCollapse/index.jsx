import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import DynamicFormRender from '../DynamicFormRender';

import _ from 'lodash';
import './style.less';

const { Panel } = Collapse;

export default class RelyAttrbuteListCollapse extends Component {
  generateCollapse () {
    const props = { key: '1', header: '关联属性信息' };
    return (
      <Collapse defaultActiveKey={['1']} className="rely-attrbute-list-collapse">
        <Panel {...props}>{this.generateRelyAttributeListPanel()}</Panel>
      </Collapse>
    );
  }

  generateRelyAttributeListPanel () {
    const { values, relyAttributeList } = this.props;
    const match = values.filter(({ code }) => relyAttributeList[code].length);

    if (match.length) {
      if (match.length === 1) {
        const data = match[0];
        const itemList = relyAttributeList[data.code];
        return this.generateDynamicFormRender(itemList.map(item => ({ ...item, id: `${data.code}_${item.id}` })));
      } else {
        return (
          <ul className="rely-attrbute-list-collapse-item">
            {
              match.map(({ code, name }) => {
                const itemList = relyAttributeList[code];
                return (
                  <li key={code}>
                    <p className="rely-attrbute-list-item-name">{name}</p>
                    {this.generateDynamicFormRender(itemList.map(item => ({ ...item, id: `${code}_${item.id}` })))}
                  </li>
                );
              })
            }
          </ul>
        );
      }
    } else {
      return (<div>没有内容</div>);
    }
  }

  generateDynamicFormRender (itemList) {
    const props = {
      itemList,
      mode: 'view',
      size: 'small',
      isCollapse: false,
      form: this.props.form,
      direction: 'horizontal',
      columnCount: this.props.columnCount,
      formFiledRender: this.props.formFiledRender
    };
    return (
      <DynamicFormRender {...props} />
    );
  }

  render () {
    return this.generateCollapse();
  }

  static propTypes = {
    form: PropTypes.object,
    values: PropTypes.array,
    columnCount: PropTypes.number,
    relyAttributeList: PropTypes.object,
    formFiledRender: PropTypes.func.isRequired,
  }

  static defaultProps = {
    columnCount: 3
  }
}