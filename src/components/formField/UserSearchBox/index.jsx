import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchBox from '../SearchBox';

export default class UserSearchBox extends Component {
  render() {
    const props = { 
      ...this.props,
      getData: this.props.getData,
      isAllowViewModeCodeNotMatch: true,
      isHideDropDownListAfterSelect: true,
      codeName: this.props.codeName || 'accounts',
      onLoaded: this.props.onLoaded || (data => (data || []).map(({ name, loginName }) => ({ code: loginName, name: [name, loginName].filter(v => v).join('|') })))
    };
    return (<SearchBox {...props} />);
  }

  static propTypes = {
    value: PropTypes.any,
    mode: PropTypes.string,
    disabled: PropTypes.bool,
    isMultiple: PropTypes.bool,
    getData: PropTypes.func.isRequired,
    dropdownMatchSelectWidth: PropTypes.any
  }

  static defaultProps = {
    mode: 'edit',
    disabled: false,
    isMultiple: false
  }
}