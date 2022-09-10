import React, { Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { performLogout } from './../../redux/actionCreators';
import Header from '../navigation/Header';
import ApplicationContent from './ApplicationContent';
import SideBar from '../navigation/SideBar';
import './Layout.css';
import Menu from '../../models/settings/Menu';
import { getMenuByMenuPath, extractMenuPath } from './../../constant/Menus';
class State {
  showSidebar?: boolean = false;
  activeMenuCode: any = null;
  menu?: Menu;
  sidebarMenus?: Menu[]
};
class MainLayout extends BaseComponent<any, State> {
  state = new State();
  private currentPathName = '';
  constructor(props: any) {
    super(props, false);
  }
  setMenuNull = () => {
    this.setState({ menu: undefined, showSidebar: false, activeMenuCode: null, sidebarMenus: undefined });
  }
  setMenu = (menu: Menu) => {
    if (menu == null) {
      return;
    }
    this.setState({ menu: menu, sidebarMenus: undefined, showSidebar: menu.showSidebar, activeMenuCode: menu.code });
  }
  setSidebarMenus = (sidebarMenus: Menu[]) => {
    // console.debug("Set sidebar menus: ", menus);
    this.setState({ sidebarMenus });
  }
  componentDidMount() {
    this.setCurrentMenu();
  }
  componentDidUpdate() {
    this.setCurrentMenu();
  }
  setCurrentMenu = () => {
    const pathName = extractMenuPath(this.props.location.pathname);

    if (pathName == this.currentPathName) {
      return;
    }
    this.currentPathName = pathName;
    const menu = getMenuByMenuPath(pathName);
    if (menu == null) {
      this.setMenuNull();
    } else {
      this.setMenu(menu);
    }
  }
  getSubMenus = () => {
    const menuState = this.state.menu;
    if (menuState && menuState.subMenus != null && menuState.subMenus?.length > 0) {
      return menuState.subMenus;
    }
    if (this.state.sidebarMenus) {
      return this.state.sidebarMenus;
    }
    return null;
  }
  render() {
    const showSidebar = this.state.showSidebar == true;
    const className = showSidebar ? "app-content" : "content";
    return (
      <Fragment>
        <Header
          setMenuNull={this.setMenuNull}
          activeMenuCode={this.state.activeMenuCode}
          setMenu={this.setMenu}
        />
        <div id="content-wrapper" className={`container-fluid  ${className}`}>
          <ApplicationContent setSidebarMenus={this.setSidebarMenus} />
        </div>
        {showSidebar && <SideBar sidebarMenus={this.getSubMenus()} parentMenu={this.state.menu} />}
      </Fragment>
    )
  }

}
const mapDispatchToProps = (dispatch: Function) => ({
  performLogout: (app: any) => dispatch(performLogout(app))
});

export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(MainLayout));
