/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GoogleIcon from 'mdi-react/GooglePlusIcon';
import { apiBaseUrl } from "config";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import {withGlobals} from "contexts/Globals";
import styles from "./styles";


class OAuth extends Component {
	state = {
		provider: "facebook",
		disabled: false,
		socketId: undefined,
	};
	constructor(props) {
		super(props);
		this.handleOAuthBtnClick = this.handleOAuthBtnClick.bind(this);
		this.handleOnOAuth = this.handleOnOAuth.bind(this);
	}

	componentDidMount() {
		const { sockets } = this.props;
		let that = this;
		if (sockets.default) {
			sockets.default.on("connect", () => {
				that.setState({ socketId: sockets.default.id });
			});
			sockets.default.on("disconnect", () => {
				that.setState({ socketId: undefined });
			});
		}
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
		const url = `${apiBaseUrl}${this.state.provider}?socketId=${this.state.socketId}`;

		return window.open(
			url,
			"",
			`toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
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
		const { sockets } = this.props;
		if (!this.state.disabled) {
			this.popup = this.openPopup();
			if (sockets.default) {
				sockets.default.on(
					this.state.provider + "-authorization",
					data => {
						if (data.socketId === this.state.socketId) {
							this.popup.close();
							this.handleOnOAuth(data);
						}
					}
				);
			}

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
						<GoogleIcon
							className={classes.oauthBtnIcon}
						/>
						Proceed with Google
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
						<FacebookIcon
							className={classes.oauthBtnIcon}
						/>
						Proceed with Facebook
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
						<LinkedInIcon
							className={classes.oauthBtnIcon}
						/>
						Proceed with LinkedIn
					</Button>
				</GridContainer>
			</GridContainer>
		);
	}
}

OAuth.propTypes = {
	onOAuthSuccess: PropTypes.func,
	onOAuthError: PropTypes.func,
};

const mapStateToProps = state => ({
	auth: state.auth,
});
export default withGlobals(compose(withStyles(styles), connect(mapStateToProps, {}))(OAuth));
