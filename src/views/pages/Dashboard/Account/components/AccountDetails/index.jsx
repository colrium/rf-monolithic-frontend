/** @format */

// Material helpers
import { CircularProgress, withStyles } from "@material-ui/core";
import GridContainer from "components/Grid/GridContainer";
// Shared components
import Portlet from "components/Portlet";
import PortletContent from "components/Portlet/Content";
import PortletHeader from "components/Portlet/Header";
import PortletLabel from "components/Portlet/Label";
import Typography from "components/Typography";
import UsersDefination from "definations/users";
import React, { Component } from "react";
//Redux imports
import { connect } from "react-redux";
// Externals
import compose from "recompose/compose";
import AuthService from "services/auth";
import { updateCurrentUser } from "state/actions/auth";
import {withErrorHandler} from "hoc/ErrorHandler";
import BaseForm from "views/forms/BaseForm";
//
// Component styles
import styles from "./styles";

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

		this.state.user_id = auth.user._id;
		this.state.excludedFields = excludedFields;
		this.state.formValues = initialValues;

		this.handleProfileFormSubmit = this.handleProfileFormSubmit.bind(this);
	}

	componentDidMount() {
		AuthService.profile({})
			.then(res => {
				if (!res.err) {
					let formValues = res.body.data;

					for (var i = 0; i < this.state.excludedFields.length; i++) {
						delete formValues[this.state.excludedFields[i]];
					}
					this.setState(state => ({ formValues: formValues }));
				}
			})
			.catch(e => {
				console.log(e);
			});
	}

	handleProfileFormSubmit(data, event) {
		const { updateCurrentUser } = this.props;
		return AuthService.update_profile(data)
			.then(res => {
				updateCurrentUser(res.body.data);
				return true;
			})
			.catch(err => {
				throw err;
				return err;
			});
	}

	render() {
		const { classes } = this.props;
		return (
			<Portlet className={classes.root}>
				<PortletHeader>
					<PortletLabel
						subtitle="The information can be edited"
						title="Profile"
					/>
				</PortletHeader>
				<PortletContent>
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
						<GridContainer>
							<CircularProgress color="secondary" />

							<Typography>Loading Profile </Typography>
						</GridContainer>
					)}
				</PortletContent>
			</Portlet>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default withErrorHandler(
	compose(
		withStyles(styles),
		connect(mapStateToProps, { updateCurrentUser })
	)(Account)
);
