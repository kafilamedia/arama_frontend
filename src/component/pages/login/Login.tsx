

import React, { ChangeEvent, FormEvent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { performLogin } from '../../../redux/actionCreators';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import Spinner from './../../loader/Spinner';
import './Login.css';
class State {
  loading = false; email = ""; editPassword = "";
}
class Login extends BaseComponent<any, State> {
  state: State = new State();
  constructor(props: any) {
    super(props, false);
  }
  startLoading = () => this.setState({ loading: true });
  endLoading = () => this.setState({ loading: false });
  login(e: FormEvent) {
    e.preventDefault();
    this.props.performLogin(this.state.email, this.state.editPassword, this);
  }
  componentDidMount() {
    document.title = "Login";
    if (this.isUserLoggedIn()) {
      this.props.history.push("/dashboard");
    }
  }
  componentDidUpdate() {

    if (this.isUserLoggedIn()) {
      this.props.history.push("/dashboard");
    }
  }
  updateCredentialProperty = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const name: string | null = target.getAttribute("name");
    if (null == name) return;
    this.setState({ [name]: target.value } as any);
  }
  render() {
    return (
      <div id="Login" className="mt-4" >
        <form name='login' onSubmit={(e) => { this.login(e) }} className="form-signin">
          <div className="text-center">
            <h2><i className="fas fa-user-circle"></i></h2>
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          </div>
          <EmailField value={this.state.email} onChange={this.updateCredentialProperty} />
          <PasswordField value={this.state.editPassword} onChange={this.updateCredentialProperty} />
          {
            this.state.loading ?
              <Spinner /> :
              <Fragment>
                <button className="btn text-light" style={{ marginRight: '5px', backgroundColor: 'rgb(9,26,78)' }} type="submit">
                  Sign in
                </button>
              </Fragment>
          }
          <input name="transport_type" type="hidden" value="rest" />
        </form>
      </div>
    )
  }

}
const PasswordField = ({ value, onChange }) => {
  return <Fragment>
    <label className="sr-only">Password</label>
    <input name="editPassword" value={value} onChange={onChange} type="password" id="inputPassword" className="form-control"
      placeholder="Password" required />
  </Fragment>
}
const EmailField = ({ value, onChange }) => {
  return (<Fragment>
    <label className="sr-only">Email</label>
    <input name="email" value={value} onChange={onChange} type="text" className="form-control"
      placeholder="Email" required autoFocus />
  </Fragment>)
}
const mapDispatchToProps = (dispatch: Function) => ({
  performLogin: (username: string, password: string, app: any) => dispatch(performLogin(username, password, app))
})


export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(Login))