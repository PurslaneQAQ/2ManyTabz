/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './sharedview/header';
import { requestSignIn, requestSignUp } from '../../../shared/actions/loginactions';
import { ignoreError, frontendError } from '../../../shared/actions/erroractions';
import '../scss/login.scss';

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      email: '',
      password: '',
      confpw: '',
    };
    // this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
    this.submitSignIn = this.submitSignIn.bind(this);
    this.submitSignUp = this.submitSignUp.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.checkName = this.checkName.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.checkConfPw = this.checkConfPw.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { authenticated } = this.props;
    if (authenticated && !prevProps.authenticated) {
      this.props.history.push({ pathname: '/modal:synchronize', state: { modal: true } });
    }
  }

  onTypeChange(event) {
    this.props.ignoreError();
  }

  submitSignIn = () => {
    if (!(this.checkEmail() && this.checkPassword())) return;
    const { email, password } = this.state;
    this.props.requestSignIn({ email, password }, this.props.history);
  }


  submitSignUp = () => {
    if (!this.checkEmail() && this.checkPassword() && this.checkConfPw()) return;
    const { email, password, userName } = this.state;
    this.props.requestSignUp({ email, password, userName }, this.props.history);
  }

  submitSignOut = () => {
    this.props.requestSignOut(this.props.history);
  }

  checkEmail(e) {
    const email = e ? e.target.value : this.state.email;
    if (!email || !validateEmail(email)) {
      this.props.frontendError('Please enter a valid email!');
      if (e)e.target.focus();
      return false;
    } else {
      this.setState({
        email,
      });
      this.props.ignoreError();
      return true;
    }
  }

  checkPassword(e) {
    const password = e ? e.target.value : this.state.password;
    if (!password) {
      this.props.frontendError('Please enter a valid email!');
      if (e)e.target.focus();
      return false;
    } else {
      this.setState({
        password,
      });
      this.props.ignoreError();
      return true;
    }
  }

  checkConfPw(e) {
    const confpw = e ? e.target.value : this.state.password;
    if (!confpw) {
      this.props.frontendError('Please enter a valid email!');
      if (e)e.target.focus();
      return false;
    } else {
      this.setState({
        confpw,
      });
      this.props.ignoreError();
      return true;
    }
  }

  checkName(e) {
    const userName = e ? e.target.value : this.state.name;
    if (!userName || !/^[a-zA-Z]+$/.test(String(userName))) {
      this.props.frontendError('Please enter a valid email!');
      if (e)e.target.focus();
      return false;
    } else {
      this.setState({
        userName,
      });
      this.props.ignoreError();
      return true;
    }
  }

  render() {
    const {
      userName, email, password, confpw,
    } = this.state;
    const { error } = this.props;
    const signInBtn = (
      <button
        type="button"
        className="primary"
        onClick={() => {
          this.submitSignIn();
        }}
      >SignIn
      </button>
    );

    const signUpBtn = (
      <button
        type="button"
        className="primary"
        onClick={() => {
          this.submitSignUp();
        }}
      >SignUp
      </button>
    );

    const nameDiv = (
      <input type="text" placeholder="Name(should contain only charactors)" defaultValue={userName} onBlur={this.checkName} />
    );

    const emailDiv = (
      <input type="text" placeholder="Email" defaultValue={email} onBlur={this.checkEmail} />
    );

    const passDiv = (
      <input type="password" placeholder="Password" defaultValue={password} onBlur={this.checkPassword} />
    );

    const confPwDiv = (
      <input type="password" placeholder="Comfirmed Password" defaultValue={confpw} onBlur={this.checkConfPw} />
    );

    const errorDiv = error ? <div className="error-msg">{ error } </div> : null;

    return (
      <div id="login">
        <Header />
        <div className="sign-container">
          <div className="tabs">
            <div className="tab">
              <input type="radio" id="sign-in-page" name="sign-type" value="0" onChange={this.onTypeChange} defaultChecked />
              <label htmlFor="sign-in-page">Sign in</label>
              <div className="content">
                {emailDiv}
                {passDiv}
                {signInBtn}
                {errorDiv}
              </div>
            </div>

            <div className="tab">
              <input type="radio" id="sign-up-page" name="sign-type" value="1" onChange={this.onTypeChange} />
              <label htmlFor="sign-up-page">Sign up</label>
              <div className="content">
                {nameDiv}
                {emailDiv}
                {passDiv}
                {confPwDiv}
                {signUpBtn}
                {errorDiv}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (reduxState) => ({
  authenticated: reduxState.auth.authenticated,
  userName: reduxState.auth.userName,
  error: reduxState.error.errorMsg,
});

export default connect(mapStateToProps, {
  requestSignIn, requestSignUp, ignoreError, frontendError,
})(Login);
