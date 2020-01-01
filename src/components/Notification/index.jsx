import { Box, Snackbar } from "@material-ui/core";
import NotificationMp3 from "assets/audio/notification.mp3";
import NotificationOgg from "assets/audio/notification.ogg";
import { colors } from "assets/jss/app-theme";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import PropTypes from "prop-types";
import React from "react";
import DesktopNotification from "./Desktop";

class Notification extends React.Component {
  state = {
    snackBarOpen: true,
    snackBarColor: "info",
    snackBarMessage: "",
    desktopNotificationProps: {},
    windowNotificationProps: {},
    embeddedNotificationProps: {},
    onShow: null,
    onClick: null,
    onClose: null,
    onError: null,
    timeout: 6000,
    title: "",
    body: "",
    icon: null,
    type: "window"
  };

  constructor(props) {
    super(props);
    this.state = { ...this.state, ...props };
    this.onCloseSnackbar = this.onCloseSnackbar.bind(this);
    this.handleDesktopNotSupported = this.handleDesktopNotSupported.bind(this);
    this.handleDesktopPermissionGranted = this.handleDesktopPermissionGranted.bind(
      this
    );
    this.handleDesktopPermissionDenied = this.handleDesktopPermissionDenied.bind(
      this
    );
    this.handleDesktopNotificationOnShow = this.handleDesktopNotificationOnShow.bind(
      this
    );
    this.handleDesktopNotificationOnClick = this.handleDesktopNotificationOnClick.bind(
      this
    );
    this.handleDesktopNotificationOnClose = this.handleDesktopNotificationOnClose.bind(
      this
    );
    this.handleDesktopNotificationOnError = this.handleDesktopNotificationOnError.bind(
      this
    );
  }

  /*static getDerivedStateFromProps(nextProps, prevState){
		if (!Object.areEqual(this.props, nextProps)) {
			return { ...prevState, ...nextProps };
		}
		else{
			return { ...prevState }
		}
		
	}*/

  /*componentDidMount(){

	}

	componentWillUpdate(nextProps){
		if (Object.areEqual(this.props, nextProps)) {

		}
	}

	componentWillUnmount(){
		
	}*/

  onCloseSnackbar() {
    this.setState({
      snackBarOpen: false
    });
  }

  handleDesktopPermissionGranted() {
    console.log("Permission Granted");
    this.setState({
      ignore: false
    });
  }
  handleDesktopPermissionDenied() {
    console.log("Permission Denied");
    this.setState({
      ignore: true
    });
  }
  handleDesktopNotSupported() {
    console.log("Web Notification not Supported");
    this.setState({
      ignore: true
    });
  }

  handleDesktopNotificationOnClick(e, tag) {
    console.log(e, "Notification clicked tag:" + tag);
  }

  handleDesktopNotificationOnError(e, tag) {
    console.log(e, "Notification error tag:" + tag);
  }

  handleDesktopNotificationOnClose(e, tag) {
    console.log(e, "Notification closed tag:" + tag);
  }

  handleDesktopNotificationOnShow(e, tag) {
    this.playSound();
    console.log(e, "Notification shown tag:" + tag);
  }

  playSound(filename) {
    document.getElementById("sound").play();
  }

  render() {
    console.log("Notification this.state", this.state);
    const {
      type,
      title,
      body,
      icon,
      timeout,
      color,
      onShow,
      onClick,
      onClose,
      onError,
      desktopNotificationProps,
      windowNotificationProps,
      embeddedNotificationProps
    } = this.state;
    let typeArr = Array.isArray(type) ? type : [type];
    console.log("typeArr", typeArr);
    return (
      <Box>
        <audio id="sound" preload="auto">
          <source src={NotificationMp3} type="audio/mpeg" />
          <source src={NotificationOgg} type="audio/ogg" />
          <embed
            hidden={true}
            autostart="false"
            loop={false}
            src={NotificationMp3}
          />
        </audio>

        {typeArr.includes("desktop") && (
          <DesktopNotification
            notSupported={this.handleDesktopNotSupported}
            onPermissionGranted={this.handleDesktopPermissionGranted}
            onPermissionDenied={this.handleDesktopPermissionDenied}
            onShow={this.handleDesktopNotificationOnShow}
            onClick={this.handleDesktopNotificationOnClick}
            onClose={this.handleDesktopNotificationOnClose}
            onError={this.handleDesktopNotificationOnError}
            timeout={timeout}
            title={title}
            {...desktopNotificationProps}
          />
        )}

        {typeArr.includes("window") && (
          <Snackbar
            {...windowNotificationProps}
            open={this.state.snackBarOpen}
            onClose={this.onCloseSnackbar}
          >
            <SnackbarContent
              onClose={this.onCloseSnackbar}
              color={color}
              message={title + " <br/> " + body}
            />
          </Snackbar>
        )}
      </Box>
    );
  }

  close(n) {
    if (n && typeof n.close === "function") {
      n.close();
    }
  }

  // for debug
  _getNotificationInstance(tag) {
    return this.notifications[tag];
  }
}

Notification.propTypes = {
  desktopNotificationProps: PropTypes.object,
  windowNotificationProps: PropTypes.object,
  embeddedNotificationProps: PropTypes.object,
  onShow: PropTypes.func,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  onError: PropTypes.func,
  timeout: PropTypes.number,
  title: PropTypes.string.isRequired,
  body: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.oneOf(colors.names),
  type: PropTypes.oneOfType([
    PropTypes.oneOf(["embedded", "window", "desktop"]),
    PropTypes.array
  ])
};

Notification.defaultProps = {
  windowNotificationProps: {
    anchorOrigin: {
      vertical: "top",
      horizontal: "right"
    },
    autoHideDuration: 6000
  },
  onShow: () => {},
  onClick: () => {},
  onClose: () => {},
  onError: () => {},
  timeout: 6000,
  options: {},
  body: "",
  color: "inverse",
  type: ["window", "desktop"]
};

export default Notification;
