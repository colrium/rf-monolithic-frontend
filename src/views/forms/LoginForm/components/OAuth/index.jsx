import withStyles from "@material-ui/core/styles/withStyles";
import FacebookIcon from "assets/img/icons/facebook-white.svg";
import GoogleIcon from "assets/img/icons/google-white.svg";
import LinkedinIcon from "assets/img/icons/linkedin-white.svg";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import { AUTH } from "config/api";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { authSocket } from "utils/Sockets";
import withRoot from "utils/withRoot";
import styles from "./styles";

class OAuth extends Component {
	state = {
		provider: "facebook",
		disabled: false,
		socketId: undefined
	};
	constructor(props) {
		super(props);
		this.handleOAuthBtnClick = this.handleOAuthBtnClick.bind(this);
		this.handleOnOAuth = this.handleOnOAuth.bind(this);
		this.auth_server_socket = authSocket();
	}

	componentDidMount() {
		let that = this;
		
		this.auth_server_socket.on("connect", () => {
			that.setState({ socketId: this.auth_server_socket.id });
		});
		this.auth_server_socket.on("disconnect", () => {
			that.setState({ socketId: undefined });
		});
	}

	checkPopup() {
		const check = setInterval(() => {
			const { popup } = this;
			if (!popup || popup.closed || popup.closed === undefined) {
				clearInterval(check);
				this.setState({ disabled: false });
			}
		}, 1000);
	}

	handleOAuthBtnClick = name => event => {
		this.setState({ provider: name }, () => {
			this.executeOAuth();
		});
	};

	openPopup() {
		const width = 600,
			height = 600;
		const left = window.innerWidth / 2 - width / 2;
		const top = window.innerHeight / 2 - height / 2;
		const url = `${AUTH}${this.state.provider}?socketId=${this.state.socketId}`;

		return window.open(
			url,
			"",
			`toolbar=no, location=no, directories=no, status=no, menubar=no, 
			scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
			height=${height}, top=${top}, left=${left}`
		);
	}

	handleOnOAuth(data) {
		const { onOAuthSuccess, onOAuthError } = this.props;
		if (data.status === "success") {
			if (onOAuthSuccess) {
				onOAuthSuccess(data);
			}
		} else {
			if (onOAuthError) {
				onOAuthError(data);
			}
		}
	}

	executeOAuth() {
		if (!this.state.disabled) {
			this.popup = this.openPopup();
			this.auth_server_socket.on(this.state.provider + "-authorization", data => {
				if (data.socketId === this.state.socketId) {
					this.popup.close();
					this.handleOnOAuth(data);
				}
			});
			this.checkPopup();
			this.setState({ disabled: true });
		}
	}

	render() {
		const { classes } = this.props;
		const { provider, disabled } = this.state;
		const atSymbol = provider === "twitter" ? "@" : "";

		return (
			<GridContainer>
				<GridContainer
					className="m-0 p-0"
					direction="row"
					justify="center"
					alignItems="center"
				>
					<Button
						color="google"
						className={classes.oauthBtn}
						onClick={this.handleOAuthBtnClick("google")}
						textCase="wordcase"
					>
						<img
							className={classes.oauthBtnIcon}
							src={GoogleIcon}
							alt="Google"
						/>{" "}
						Signin with Google
          </Button>
				</GridContainer>

				<GridContainer
					className="m-0 p-0"
					direction="row"
					justify="center"
					alignItems="center"
				>
					<Button
						color="facebook"
						className={classes.oauthBtn}
						onClick={this.handleOAuthBtnClick("facebook")}
						textCase="wordcase"
					>
						<img
							className={classes.oauthBtnIcon}
							src={FacebookIcon}
							alt="Facebook"
						/>{" "}
						Signin with Facebook
          </Button>
				</GridContainer>

				<GridContainer
					className="m-0 p-0"
					direction="row"
					justify="center"
					alignItems="center"
				>
					<Button
						color="linkedin"
						className={classes.oauthBtn}
						onClick={this.handleOAuthBtnClick("linkedin")}
						textCase="wordcase"
					>
						<img
							className={classes.oauthBtnIcon}
							src={LinkedinIcon}
							alt="LinkedIn"
						/>{" "}
						Signin with linkedin
          </Button>
				</GridContainer>
			</GridContainer>
		);
	}
}

OAuth.propTypes = {
	onOAuthSuccess: PropTypes.func,
	onOAuthError: PropTypes.func
};

export default withRoot(withStyles(styles)(OAuth));
