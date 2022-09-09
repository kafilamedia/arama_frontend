
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { getMenus } from '../../constant/Menus';
import { mapCommonUserStateToProps } from './../../constant/stores';
import ApplicationProfile from './../../models/ApplicationProfile';
import Menu from './../../models/settings/Menu';
import User from './../../models/User';
import { performLogout } from './../../redux/actionCreators';
import BaseComponent from './../BaseComponent';
import './Header.css';
class IState {
  showNavLinks: boolean = false;
}
class Header extends BaseComponent<any, IState> {
  state: IState = new IState();
  buttonToggleNavRef: React.RefObject<HTMLButtonElement> = React.createRef();
  constructor(props: any) {
    super(props, false);
  }
  toggleNavLinks = () => {
    this.setState({ showNavLinks: !this.state.showNavLinks });
  }
  onLogout = (e: any) => {
    const app = this;
    app.showConfirmation("Logout?").then(
      function (ok) {
        if (ok) {
          app.props.performLogout(app.parentApp);
        }
      }
    )
  }
  setMenu = (menu: Menu) => {
    if (this.state.showNavLinks && this.buttonToggleNavRef.current) {
      this.buttonToggleNavRef.current.click();
    }
    this.props.setMenu(menu);

  }
  render() {
    const showNavLinks: boolean = this.state.showNavLinks;
    const menus = getMenus();
    const user = this.getLoggedUser();
    const profile = this.getApplicationProfile();
    const { appName } = profile;
    return (
      <div className="bg-dark container-fluid" style={{ position: 'fixed', zIndex: 55, padding: 0, margin: 0 }}>
        <NavBarTop profile={profile} />
        <nav id="navbar" className="w-100 navbar navbar-expand-lg navbar-dark bg-dark">
          <a id="navbar-brand" className="navbar-brand" href="#">
            {appName} | Semester: {profile.semester} {profile.year}
          </a>
          <button
            ref={this.buttonToggleNavRef}
            onClick={this.toggleNavLinks}
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarToggler"
            aria-controls="navbarToggler"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className={showNavLinks ? "fas fa-times" : "fas fa-bars"} />
          </button>
          <div className="collapse navbar-collapse" id="navbarToggler">
            <ul id="navbar-top" className="navbar-nav mr-auto mt-2 mt-lg-0">
              {menus.map(menu => {
                if (menu == null || (menu.authenticated && !user)) return null;
                if (menu.userAuthorized && menu.userAuthorized(user) == false) return null;
                const isActive = this.props.activeMenuCode == menu.code;
                return (
                  <li key={"header-menu-" + new String(menu.code)} className={"nav-item " + (isActive ? "active nav-active" : "nav-inactive")}>
                    <Link onClick={() => this.setMenu(menu)} className={"nav-link  "}
                      to={menu.url}><span>{menu.name}</span>
                    </Link></li>
                )
              })}
            </ul >
            <form className="form-inline my-2 my-lg-0">
              <UserIcon setMenuNull={this.props.setMenuNull}
                onLogout={this.onLogout} user={user} />
            </form >
          </div >
        </nav >
      </div>
    )
  }

}
const NavBarTop = (props: { profile: ApplicationProfile }) => {
  const { profile } = props;
  return (
    <div id="navbar-brand-top" style={{ paddingLeft: '0.5rem' }} className="container-fluid">
      <a style={{ fontSize: '15px' }} className="text-white navbar-brand" href="#">
        <strong>{profile.appName} | Semester {profile.semester} {profile.year}</strong>
      </a>
    </div>
  );
}
const UserIcon = (props: { user: User | undefined, setMenuNull(): any, onLogout(e): any }) => {
  if (props.user) {
    return (
      <Fragment>
        <Link
          onClick={props.setMenuNull}
          className="btn btn-light btn-sm my-2 my-sm-0 mr-2"
          to='/settings/user-profile'
        >
          <i className="fas fa-user-circle mr-2" />
          <span>{props.user.displayName}</span>
        </Link>
        <a className="mr-1 btn btn-danger btn-sm  my-2 my-sm-0"
          onClick={props.onLogout}><i className="fas fa-sign-out-alt mr-2" /><span>Logout</span>
        </a>
      </Fragment>);
  }
  return (

    <Link
      onClick={props.setMenuNull}
      className="btn btn-sm btn-info my-2 my-sm-0 mr-2"
      to='/login'
    >
      <i className="fas fa-sign-in-alt mr-2"></i><span>Login</span>
    </Link>
  );
}

const mapDispatchToProps = (dispatch: Function) => ({
  performLogout: (app: any) => dispatch(performLogout(app))
})


export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(Header))