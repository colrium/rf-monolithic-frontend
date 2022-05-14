/** @format */


import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { colors } from "assets/jss/app-theme";
import Button from "@mui/material/Button";
//
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';

import PropTypes from "prop-types";
import React from "react";
//Redux imports
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import * as definations from "definations";
import ApiService from "services/Api";
//
//
import { appendNavHistory } from "state/actions/ui/nav";

//
//Context Views Imports
import Listings from "views/widgets/Listings";
import AccessDenied from "views/widgets/Catch/AccessDenied";



class Page extends React.Component {
	defination = null
	service = null
	state = {
		query: {},
	}

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		const { auth, location, appendNavHistory } = this.props
		if (appendNavHistory && location) {
			appendNavHistory({
				name: this.defination.name,
				uri: location.pathname,
				title: typeof this.defination.label === "function" ? this.defination.label(auth.user) : this.defination.label,
				view: null,
				state: this.state,
				color: this.defination.color ? this.defination.color : colors.hex.primary,
				scrollTop: 0,
			})
		}
	}

	render() {
		const { auth, context } = this.props
		const defination = definations[context]
		const service = ApiService.getContextRequests(defination?.endpoint)
		const urlQuery = (window.location.search.match(new RegExp("([^?=&]+)(=([^&]*))?", "g")) || []).reduce(function (
			result,
			each,
			n,
			every
		) {
			let [key, value] = decodeURI(each).split("=")
			result[key] = value
			return result
		},
		{})
		return (
			<Grid container>
				<Grid item  xs={12}>
					{defination.access.restricted(auth.user) && <AccessDenied />}

					{!defination.access.restricted(auth.user) && (
						<Listings defination={defination} service={service} query={{ ...this.state.query, ...urlQuery }} />
					)}
				</Grid>
			</Grid>
		)
	}
}

Page.propTypes = {

};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(

	connect(mapStateToProps, { appendNavHistory })
)(Page);
