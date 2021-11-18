/** @format */

// Material helpers
import { LinearProgress, Typography } from "@mui/material";

import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
// Shared components
import Portlet from "components/Portlet";
import PortletContent from "components/Portlet/Content";
import PortletFooter from "components/Portlet/Footer";
import UsersDefination from "definations/users";
import React, { Component } from "react";
//Redux imports
import { connect } from "react-redux";
// Externals
import compose from "recompose/compose";
import ApiService from "services/Api";
import { updateCurrentUser } from "state/actions/auth";

//
import BaseForm from "views/forms/BaseForm";
// Component styles


class AccountProfile extends Component {
	state = {
		avatar: false,
		includedFields: ["avatar", "documents"],
		formValues: null,
	};

	constructor(props) {
		super(props);
		const { auth } = props;

		if (auth.user.avatar) {
			this.state.formValues = {
				avatar: auth.user.avatar,
				documents: auth.user.douments,
			};
		}

		this.state.user_id = auth.user._id;
		this.handleProfileFormSubmit = this.handleProfileFormSubmit.bind(this);
	}
	componentDidMount() {
		ApiService.profile({})
			.then(res => {
				if (!res.err) {
					let formValues = res.body.data;
					if (formValues.avatar) {
						this.setState(state => ({
							formValues: {
								avatar: formValues.avatar,
								documents: formValues.documents,
							},
						}));
					}
				}
			})
			.catch(e => { });
	}

	handleProfileFormSubmit(data, event) {
		const { updateCurrentUser } = this.props;
		return ApiService.update_profile(data)
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
		const { className, auth } = this.props;

		return (
			<Portlet className={className}>
				<PortletContent>
					<div className={"mt-4"}>
						<Typography variant="body1">
							Profile Completeness: 70%
						</Typography>
						<LinearProgress value={70} variant="determinate" />
					</div>

					<GridContainer>
						<GridItem xs={12}>
							<BaseForm
								defination={UsersDefination}
								onSubmit={this.handleProfileFormSubmit}
								record={this.state.user_id}
								initialValues={this.state.formValues}
								form="user_avatar_form"
								fields={this.state.includedFields}
								submit_btn_text="Update Profile"
								show_discard={false}
								show_title={false}
								onSubmitSuccessMessage="Profile changes saved"
							/>
						</GridItem>
					</GridContainer>
				</PortletContent>
				<PortletFooter></PortletFooter>
			</Portlet>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(

	connect(mapStateToProps, { updateCurrentUser })
)(AccountProfile);
