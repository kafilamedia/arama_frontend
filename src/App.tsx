
import React, { Component, Fragment, RefObject } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SockJsClient from 'react-stomp';
import './App.css';
import Alert from './component/alert/Alert';
import MainLayout from './component/layout/MainLayout';
import Loader from './component/loader/Loader';
import Spinner from './component/loader/Spinner';
import AnchorWithIcon from './component/navigation/AnchorWithIcon';
import { mapCommonUserStateToProps } from './constant/stores';
import * as url from './constant/Url';
import WebResponse from './models/commons/WebResponse';
import User from './models/User';
import * as actions from './redux/actionCreators';
import UserService from './services/UserService';
import { doItLater, updateFavicon } from './utils/EventUtil';
import { performWebsocketConnection, registerWebSocketCallbacks, setWebSocketUrl } from './utils/websockets';
import { resolve } from 'inversify-react';

class State {
  loading = false;
  loadingPercentage  = 0;
  requestId?: string;
  mainAppUpdated = new Date();
  showAlert  = false;
  withProgress = false;
  appIdStatus = "Loading App Id";
  errorAuthenticatingApp = false;
}
class App extends Component<any, State> {
  private wsConnected = false;
  private loadings = 0;
  private alertTitle = "Info";
  private alertBody: any = null;
  private alertIsYesOnly = true;
  private alertIsError = false;
  private alertOnYesCallback = function (e) { };
  private alertOnCancelCallback = function (e) { };
  private wsUpdateHandler: Function | undefined = undefined;

  @resolve(UserService)
  private userService: UserService;
  // alertRef: RefObject<Alert> = React.createRef();
  alertCallback = {
    title: "Info", message: "Info", yesOnly: false,
    onOk: () => { }, onNo: () => { }
  }

  constructor(props: any) {
    super(props);
    this.state = new State();
    this.props.setMainApp(this);
  }
  refresh = () => { this.setState({ mainAppUpdated: new Date() }); }

  requestAppId = () => {
    this.setState({ appIdStatus: "Authenticating application", errorAuthenticatingApp: false });
    this.userService.requestApplicationId((reqIdResp) => {
      this.getLoggedUser(reqIdResp);
    }, this.retryRequestAppId)
  }
  getLoggedUser = (reqIdResp) => {
    const onSuccess = (data) => {
      this.setState({ errorAuthenticatingApp: false }, () => {
        this.props.setRequestId(reqIdResp, this);
        this.props.setLoggedUser(data.result);
        this.refresh();
      });
    }
    this.userService.getLoggedUser(onSuccess, console.error);
  }
  retryRequestAppId = () => {
    this.setState({ appIdStatus: "Authenticating application (Retrying)", errorAuthenticatingApp: false });
    this.userService.requestApplicationIdNoAuth((response) => {
      this.props.setRequestId(response, this);
      this.setState({ errorAuthenticatingApp: false });
    }, () => this.setState({ errorAuthenticatingApp: true }))

  }
  incrementLoadings() {
    this.loadings++;
  }

  decrementLoadings() {
    this.loadings--;
    if (this.loadings < 0) {
      this.loadings = 0;
    }
  }

  startLoading(withProgress: boolean = false) {
    this.incrementLoadings();
    this.setState({ loading: true, withProgress });
  }

  endLoading() {
    this.decrementLoadings();
    if (this.loadings == 0) {
      if (this.state.withProgress) {
        this.setState({ loadingPercentage: 100 }, this.smoothEndLoading);
      } else {
        this.setState({ loading: false, loadingPercentage: 0 });
      }
    }
  }

  smoothEndLoading = () => {
    doItLater(() => {
      this.setState({ loading: false, loadingPercentage: 0 });
    }, 100);
  }

  handleProgress = (msg: WebResponse) => {
    const percentageFloat: number = msg.percentage ?? 0;
    let percentage = Math.floor(percentageFloat);
    if (percentageFloat < 0 || percentageFloat > 100) {
      this.endLoading();
    }
    this.setState({ loadingPercentage: percentage });
  }

  showAlert(title: string, body: any, yesOnly: boolean, yesCallback: Function, noCallback?: Function) {
    this.alertTitle = title;
    this.alertBody = body;
    this.alertIsYesOnly = yesOnly;
    const app = this;
    this.alertOnYesCallback = function (e) {
      app.dismissAlert();
      yesCallback(e);
    }
    if (!yesOnly) {
      this.alertOnCancelCallback = function (e) {
        app.dismissAlert();
        if (noCallback != null) {
          noCallback(e);
        }
      };
    }
    this.setState({ showAlert: true });
  }

  dismissAlert() {
    this.alertIsError = false;
    this.setState({ showAlert: false })
  }
  showAlertError(title: string, body: any, yesOnly: boolean, yesCallback: Function, noCallback?: Function) {
    this.alertIsError = true;
    this.showAlert(title, body, yesOnly, yesCallback, noCallback)
  }

  componentDidUpdate() {
    // console.debug("APP UPDATED");
    if (this.props.applicationProfile) {
      updateFavicon(this.props.applicationProfile);
    }
    if (this.props.requestId && !this.wsConnected) {
      this.initWebsocket();
    }
  }

  componentDidMount() {
    this.requestAppId();
    this.setState({ loadingPercentage: 0 });
  }

  initWebsocket = () => {
    setWebSocketUrl(url.contextPath('withProgress-app'));
    registerWebSocketCallbacks({
      subscribeUrl: `/wsResp/progress/${this.props.requestId}`,
      callback: this.handleProgress  //must use lambda
    },
    {
      subscribeUrl: `/wsResp/${this.props.requestId}/update`,
      callback: (response) => this.handleWsUpdate(response)
    });
    performWebsocketConnection();
    this.wsConnected = true;
  }

  private handleWsUpdate = (response: any) => {

    if (this.wsUpdateHandler) {
      this.wsUpdateHandler(response);
    }
  }

  setWsUpdateHandler = (handler: Function | undefined) => {
    this.wsUpdateHandler = handler;
  }
  resetWsUpdateHandler = () => {
    this.setWsUpdateHandler(undefined);
  }

  render() {
    if (!this.props.requestId) {
      return (
        <div className="text-center" style={{ paddingTop: '10%' }}>
          <h2>{this.state.appIdStatus}</h2>
          {this.state.errorAuthenticatingApp ?
            <AnchorWithIcon iconClassName="fas fa-redo" onClick={this.retryRequestAppId} children="Retry" /> :
            <Spinner />}
        </div>
      )
    }
    return (
      <Fragment>
        <Loading withProgress={this.state.withProgress} loading={this.state.loading} loadingPercentage={this.state.loadingPercentage} />
        {this.state.showAlert ?
          <Alert title={this.alertTitle}
            isError={this.alertIsError}
            onClose={(e) => this.setState({ showAlert: false })}
            yesOnly={this.alertIsYesOnly}
            onYes={this.alertOnYesCallback} onNo={this.alertOnCancelCallback}
          >{this.alertBody}</Alert> :
          null}
        <MainLayout />
        {/* <SockJsClient url={usedHost + 'withProgress-app'} topics={['/wsResp/progress/' + this.props.requestId]}

          onMessage={(msg: WebResponse) => { this.handleMessage(msg) }}
          ref={this.clientRef} /> */}
      </Fragment>
    )
  }
}

function Loading(props) {
  if (props.loading == true) {
    return (
      <Loader withProgress={props.withProgress} progress={props.loadingPercentage} text="Please wait..." type="loading" />
    );
  }
  return null;
}


const mapDispatchToProps = (dispatch: Function) => ({
  setLoggedUser: (user: User) => dispatch(actions.setLoggedUser(user)),
  setMainApp: (app: App) => dispatch(actions.setMainApp(app)),
  setRequestId: (response: WebResponse, app: App) => dispatch(actions.setRequestId(response, app)),
})

export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(App))
