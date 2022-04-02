/** @format */


import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { colors } from "assets/jss/app-theme";
import Button from "components/Button";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";

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
	defination = null;
	service = null;
	state = {
		query: {},
	};

	constructor(props) {
		super(props);
		const { context } = props
		this.context = context;
		this.defination = definations[context];
		this.service = ApiService.getContextRequests(this.defination?.endpoint);
		let urlQuery = (window.location.search.match(new RegExp("([^?=&]+)(=([^&]*))?", "g")) || []).reduce(function (result, each, n, every) {
			let [key, value] = decodeURI(each).split("=");
			result[key] = value;
			return result;
		}, {});

		/*);
		*/

		this.state.query = { ...this.state.query, ...urlQuery }
	}



	componentDidMount() {
		const { auth, location, appendNavHistory } = this.props;
		if (appendNavHistory && location) {
			appendNavHistory({
				name: this.defination.name,
				uri: location.pathname,
				title:
					typeof this.defination.label === "function"
						? this.defination.label(auth.user)
						: this.defination.label,
				view: null,
				state: this.state,
				color: this.defination.color
					? this.defination.color
					: colors.hex.primary,
				scrollTop: 0,
			});
		}
	}

	render() {
		const { auth } = this.props;
		return (
			<GridContainer>
				<GridItem xs={12}>
					{/*this.defination.access.restricted(auth.user) && (
						<GridContainer
							direction="column"
							justify="center"
							alignItems="center"
						>
							<GridItem xs={12} className={"flex items-center"}>
								<Typography
									color="error"
									variant="h1"
								>
									<WarningRoundedIcon
									/>
								</Typography>
							</GridItem>
							<GridItem xs={12} className={"flex items-center"}>
								<Typography
									color="grey"
									variant="h3"
								>
									Access Denied!
								</Typography>
							</GridItem>

							<GridItem xs={12} className={"flex items-center"}>
								<Typography

									variant="body1"
								>
									Sorry! Access to this resource has been
									denied since you lack required priviledges.
									<br /> Please contact the system
									administrator for further details.
								</Typography>
							</GridItem>

							<GridItem xs={12} className={"flex items-center"}>
									<Link
										to={"home".toUriWithDashboardPrefix()}
									>
										<Button
											variant="text"

																					>
											Home
										</Button>
									</Link>
							</GridItem>
						</GridContainer>
					)*/}

					{this.defination.access.restricted(auth.user) && <AccessDenied />}

					{!this.defination.access.restricted(auth.user) && (
						<Listings
							defination={this.defination}
							service={this.service}
							query={this.state.query}
						/>
					)}
				</GridItem>
			</GridContainer>
		);
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
