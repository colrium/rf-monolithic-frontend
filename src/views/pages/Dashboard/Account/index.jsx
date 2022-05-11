/** @format */

// Material helpers

//
import { colors } from "assets/jss/app-theme";
// Material components
import Grid from '@mui/material/Grid';
;
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
// Externals
import compose from "recompose/compose";
import { appendNavHistory } from "state/actions/ui/nav";
// Shared layouts
//Redux imports

// Custom components
import { AccountDetails, AccountProfile, Profile } from "./components";

class Account extends Component {
	componentDidMount() {
		const { location, appendNavHistory } = this.props;
		if (appendNavHistory && location) {
			appendNavHistory({
				name: "account",
				uri: location.pathname,
				title: "My Account",
				view: null,
				color: colors.hex.primary,
				scrollTop: 0,
			});
		}
	}

	render() {

		return (
			<Grid container>
				<Grid container>
					<Grid item  xs={12}>
						<Profile />
					</Grid>
				</Grid>

				<Grid container>
					<Grid item  xs={12}>
						<AccountProfile />
					</Grid>
				</Grid>

				<Grid container>
					<Grid item  xs={12}>
						<AccountDetails />
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

Account.propTypes = {

};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(
	connect(mapStateToProps, { appendNavHistory })
)(Account);
