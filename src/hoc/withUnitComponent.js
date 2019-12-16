import React, { Component } from 'react';
import { Select, Input } from 'antd';
import { REPLACEMENT_CHARACTER } from '../constant/attrType';
import _ from 'lodash';

const { Option } = Select;
const { Group: InputGroup } = Input;

export default function withUnitComponent(WrappedComponent) {
  return class withUnitComponent extends Component {
    state = {
      id: '',
      name: '',
      unit: ''
    };

    get keyConfig() {
      const { unitConfig = false } = this.props;
      if (!unitConfig) return {}
      const { valueKeyName = 'attrValue', unitKeyName = 'unitInfo' } = unitConfig;
      return { valueKeyName, unitKeyName }
    }

    get unitData() {
      const { unitDataSource = [] } = this.props;
      return _.uniqBy(unitDataSource, 'name');
    }

    get enableData() {
      return _.filter(this.unitData, ({ enabled = true }) => enabled);
    }

    componentDidMount() {
      if (this.props.unitConfig && this.enableData.length > 0) {
        this.initValue(this.props.value);
      }
    }

    componentWillReceiveProps({ value = {} } = {}) {
      if (this.props.unitConfig && this.enableData.length > 0) {
        this.initValue(value);
      }
    }

    initValue = (value = {}) => {
      const { valueKeyName, unitKeyName } = this.keyConfig;
      const attrValue = value[valueKeyName];
      const unitValue = value[unitKeyName];
      if (attrValue && unitValue) {
        const [id = '', unit = ''] = unitValue.split(REPLACEMENT_CHARACTER);
        const name = attrValue.slice(0, attrValue.length - unit.length);
        this.setState({ id, name, unit });
      } else {
        if (this.enableData.length === 1) {
          this.setState({ id: '', unit: (this.enableData[0] || {}).name, name: '' });
        } else {
          this.setState({ id: '', unit: '', name: '' });
        }
      }
    }

    handleValueChange = (value = {}) => {
      const { id = '', name = '' } = value;
      this.setState({ id, name });
      this.triggerChange({ id, name });
    }

    handleUnitChange = (unit) => {
      this.setState({ unit })
      this.triggerChange({ unit });
    }

    triggerChange = ({ id = this.state.id, name = this.state.name, unit = this.state.unit } = {}) => {
      const { onChange, onSelfChange } = this.props;
      const { valueKeyName, unitKeyName } = this.keyConfig;
      const value = { [valueKeyName]: `${name}${unit}`, [unitKeyName]: `${id}${REPLACEMENT_CHARACTER}${unit}` };
      onChange && onChange(value);
      onSelfChange && onSelfChange(value);
    }

    generateViewArea() {
      const { id, unit } = this.state;
      return (id != null && !!`${id}`.trim()) &&(
        <div className="form-field-render-view"><div className="form-field-render-view-value">{unit}</div></div>
      );
    }

    generateUnitSelect() {
      const props = {
        ..._.pick(this.props, ['disabled', 'size', 'dropdownMatchSelectWidth']),
        style: { minWidth: 100, width: '30%' },
        value: this.state.unit,
        onChange: this.handleUnitChange
      }
      return (
        <Select {...props}>
          {this.unitData.map(unit => {
            const { name = '', enabled = true } = unit;
            return <Option key={name} value={name} disabled={!enabled}>{name}</Option>
          })}
        </Select>
      )
    }

    generateWithUnitComponent() {
      const { mode } = this.props;
      const props = {
        ..._.omit(this.props, ['onSelfChange']),
        isMultiple: false,
        value: this.state.id,
        onChange: this.handleValueChange
      };
      if (props.key != null) {
        props.key = `withUnitComponent_${props.key}`;
      }
      
      return (
        mode === 'edit' ?
          <InputGroup compact={true} style={{ display: 'flex', flexWarp: 'nowarp' }}>
            <WrappedComponent {...props} />
            {this.generateUnitSelect()}
          </InputGroup>
          :
          <div style={{ display: 'flex', flexWarp: 'nowarp' }}>
            <WrappedComponent {...props} />
            {this.generateViewArea()}
          </div>
      )
    }

    generateWithoutUnitComponent () {
      const props = {
        ...this.props,
        unitConfig: false
      };

      if (props.key != null) {
        props.key = `withUnitComponent_${props.key}`;
      }

      return (
        <WrappedComponent {...props } />
      );
    }

    render() {
      const { unitConfig = false } = this.props;
      return (
        unitConfig && this.enableData.length > 0 ? this.generateWithUnitComponent() : this.generateWithoutUnitComponent()
      )
    }

    static defaultProps = {
      mode: 'edit',
      disabled: false
    }
  }
}