import * as React from 'react';
import { connect } from 'react-redux';
import { login } from 'actions/auth';
import { voidFn } from 'global-utils';

class Login extends React.PureComponent<any, any> {

  redirectTo: any;

  login = async () => {
    await this.props.login();
    if (this.redirectTo) {
      this.props.history.push(this.redirectTo.pathname);
    }
  }

  render() {
    const state = this.props.location.state;
    this.redirectTo = state && state.from;
    return (
      <div>
        <h1>This is Login page</h1>
        {
          this.redirectTo ? (
            <div>You tried to reach <strong>{this.redirectTo.pathname}</strong> page, which requires authentication. Please
            login first</div>
          ) : ''
        }
        <div onClick={this.login}><strong>Login</strong></div>
      </div>
    );
  }
}

export const mapDispatchToProps = {
  login
};

export const LoginPage = connect(voidFn, mapDispatchToProps)(Login);
