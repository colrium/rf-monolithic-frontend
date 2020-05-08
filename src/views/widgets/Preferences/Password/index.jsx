/** @format */

import { VpnKeyOutlined as PasswordIcon } from "@material-ui/icons";
import { colors } from "assets/jss/app-theme";
import Avatar from "components/Avatar";
import Card from "components/Card";
import CardContent from "components/Card/CardContent";
import CardHeader from "components/Card/CardHeader";
import UsersDefination from "definations/users";
import React, { Component } from "react";
import { connect } from "react-redux";
import AuthService from "services/auth";
import BaseForm from "views/forms/BaseForm";
import { withErrorHandler } from "hoc/ErrorHandler";

class Password extends Component {
	state = {};

	constructor(props) {
		super(props);
		this.defination = UsersDefination;
		this.defination.scope.columns = {
			current_password: {
				type: "string",
				label: "Current Password",
				input: {
					type: "password",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return true;
					},
					input: (values, user) => {
						return false;
					},
				},
			},
			password: {
				type: "string",
				label: "New Password",
				input: {
					type: "password",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return true;
					},
					input: (values, user) => {
						return false;
					},
				},
			},
			repeat_password: {
				type: "string",
				label: "Confirm Password",
				input: {
					type: "password",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return true;
					},
					input: (values, user) => {
						return false;
					},
				},
			},
		};

		this.handlePasswordFormSubmit = this.handlePasswordFormSubmit.bind(
			this
		);
	}

	handlePasswordFormSubmit(data, event) {
		return AuthService.resetPassword(data)
			.then(res => {
				return true;
			})
			.catch(err => {
				throw err;
				return err;
			});
	}

	render() {
		const { className, auth } = this.props;

		return (
			<Card elevation={0} outlineColor="#cfd8dc" className={className}>
				<CardHeader
					avatar={
						<Avatar
							aria-label="Password"
							color={"rgba(" + colors.hex.default + ", 0.2)"}
						>
							<PasswordIcon />
						</Avatar>
					}
					title="Password"
					subheader="Change password below"
				/>
				<CardContent className="p-0">
					<BaseForm
						defination={this.defination}
						onSubmit={this.handlePasswordFormSubmit}
						form={auth.user._id + "_password_form"}
						submit_btn_text="Update Password"
						show_discard={false}
						show_title={false}
						onSubmitSuccessMessage="Password updated successfully"
					/>
				</CardContent>
			</Card>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {})(withErrorHandler(Password));
