import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ignoreError } from '../../../../shared/actions/erroractions';

class Error extends Component {
  componentWillUnmount() {
    this.props.ignoreError();
  }

  render() {
    return <div>{this.props.error}</div>;
  }
}
const mapStateToProps = (reduxState) => ({
  error: reduxState.error.errorMsg,
});

export default connect(mapStateToProps, { ignoreError })(Error);
