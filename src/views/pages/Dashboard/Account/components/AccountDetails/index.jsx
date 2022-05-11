/** @format */

// Material helpers
import { CircularProgress } from "@mui/material";

import Grid from '@mui/material/Grid';
// Shared components
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import Typography from '@mui/material/Typography';
import UsersDefination from "definations/users";
import React, { Component } from "react";
//Redux imports
import { connect } from "react-redux";
// Externals
import compose from "recompose/compose";
import ApiService from "services/Api";
import { updateCurrentUser } from "state/actions/auth";

import BaseForm from "views/forms/BaseForm";
//
// Component styles

class Account extends Component {
	state = {
		excludedFields: [],
		initialValues: {},
	};

	constructor(props) {
		super(props);
		const { auth } = props;
		let excludedFields = [
			"email_address",
			"password",
			"login_attempts",
			"last_login_attempt",
			"role",
			"provider",
			"provider_account_id",
			"avatar",
			"status",
			"account_verified",
			"account_verifacation_code",
			"account_verifacation_mode",
			"password_reset_code",
			"password_reset_code_expiration",
			"preferences",
			"documents",
		];

		let initialValues = auth.user;

		this.state.user_id = auth.user?._id;
		this.state.excludedFields = excludedFields;
		this.state.formValues = initialValues;

		this.handleProfileFormSubmit = this.handleProfileFormSubmit.bind(this);
	}

	componentDidMount() {
		ApiService.profile({}).then(res => {
			if (!res.err) {
				let formValues = res.body.data;

				for (var i = 0; i < this.state.excludedFields.length; i++) {
					delete formValues[this.state.excludedFields[i]];
				}
				this.setState(state => ({ formValues: formValues }));
			}
		})
			.catch(e => { });
	}

	handleProfileFormSubmit(data, event) {
		const { updateCurrentUser } = this.props;
		return ApiService.update_profile(data).then(res => {
			updateCurrentUser(res.body.data);
			return true;
		})
			.catch(err => {
				throw err;
				return err;
			});
	}

	render() {
		return (
			<Card>
				<CardHeader subheader="Edit to update profile" title="Profile" />
				<CardContent>
					{Object.keys(this.state.formValues).length > 0 ? (
						<BaseForm
							defination={UsersDefination}
							onSubmit={this.handleProfileFormSubmit}
							record={this.state.user_id}
							initialValues={this.state.formValues}
							form="user_profile_form"
							fields={this.state.excludedFields}
							exclude
							submit_btn_text="Update Profile"
							onSubmitSuccessMessage="Profile updated"
							show_discard={false}
							show_title={false}
						/>
					) : (
						<Grid container>
							<CircularProgress color="secondary" />

							<Typography>Loading Profile </Typography>
						</Grid>
					)}
				</CardContent>
			</Card>
		)
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(

	connect(mapStateToProps, { updateCurrentUser })
)(Account);
