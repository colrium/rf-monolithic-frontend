/** @format */


import Button from "@mui/material/Button";
import GridContainer from "components/Grid/GridContainer";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GoogleIcon from 'mdi-react/GooglePlusIcon';
import ApiService from "services/Api";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withGlobals } from "contexts/Globals";



class OAuth extends React.Component {
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
		const url = ApiService.endpoint(`${this.state.provider}?socketId=${this.state.socketId}`);

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
		const { provider, disabled } = this.state;
		const atSymbol = provider === "twitter" ? "@" : "";

		return (
			<GridContainer className="m-0 p-0 flex-col items-center justify-center">

				<Button
					color="google"
					className={"rounded-full m-2 capitalize"}
					onClick={this.handleOAuthBtnClick("google")}
					sx={{
						// backgroundColor: theme => theme.palette.background.paper
					}}

				>
					<GoogleIcon
						className={"mr-4"}
					/>
					Proceed with Google
				</Button>
				<Button
					color="facebook"
					className={"rounded-full m-2 capitalize"}
					onClick={this.handleOAuthBtnClick("facebook")}
					sx={{
						// backgroundColor: theme => theme.palette.background.paper
					}}
				>
					<FacebookIcon
						className={"mr-4"}
					/>
					Proceed with Facebook
				</Button>
				<Button
					color="linkedin"
					className={"rounded-full m-2 capitalize"}
					onClick={this.handleOAuthBtnClick("linkedin")}
					sx={{
						// backgroundColor: theme => theme.palette.background.paper
					}}
				>
					<LinkedInIcon
						className={"mr-4"}
					/>
					Proceed with LinkedIn
				</Button>
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
export default withGlobals(compose(connect(mapStateToProps, {}))(OAuth));
