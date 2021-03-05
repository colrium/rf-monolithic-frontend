/** @format */

import withStyles from "@material-ui/core/styles/withStyles";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import { colors } from "assets/jss/app-theme";
import Button from "components/Button";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import * as definations from "definations";
import PropTypes from "prop-types";
import React from "react";
//Redux imports
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import * as services from "services";
//
//
import { appendNavHistory } from "state/actions/ui/nav";
import { withErrorHandler } from "hoc/ErrorHandler";
//
import styles from "views/pages/styles";
//Context Views Imports
import Listings from "views/widgets/Listings";



class Page extends React.Component {
	defination = null;
	service = null;
	state = {
		query: {},
	};

	constructor(props) {
		super(props);
		const { componentProps } = props;
		this.context = componentProps.context;
		this.defination = definations[componentProps.context];
		this.service = services[componentProps.context];
		let urlQuery = (window.location.search.match(new RegExp("([^?=&]+)(=([^&]*))?", "g")) || []).reduce(function(result, each, n, every) {
			let [key, value] = decodeURI(each).split("=");
			result[key] = value;
			return result;
		}, {});

		/*console.log("window.location.search", decodeURI(window.location.search));
		console.log("urlQuery", urlQuery);*/

		this.state.query = {...this.state.query, ...urlQuery}
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
		const { classes, auth } = this.props;
		return (
			<GridContainer className={classes.root}>
				<GridItem xs={12}>
					{this.defination.access.restricted(auth.user) && (
						<GridContainer
							className={classes.fullPageHeight}
							direction="column"
							justify="center"
							alignItems="center"
						>
							<GridItem xs={12}>
								<Typography
									color="error"
									variant="h1"
									center
									fullWidth
								>
									<WarningRoundedIcon
										className={classes.errorIcon}
									/>
								</Typography>
							</GridItem>
							<GridItem xs={12}>
								<Typography
									color="grey"
									variant="h3"
									center
									fullWidth
								>
									Access Denied!
								</Typography>
							</GridItem>

							<GridItem xs={12}>
								<Typography
									color="default"
									variant="body1"
									center
									fullWidth
								>
									Sorry! Access to this resource has been
									denied since you lack required priviledges.{" "}
									<br /> Please contact the system
									administrator for further details.
								</Typography>
							</GridItem>

							<GridItem xs={12}>
								<Typography
									color="error"
									variant="body1"
									center
									fullWidth
								>
									<Link
										to={"home".toUriWithDashboardPrefix()}
									>
										{" "}
										<Button
											variant="text"
											color="default"
											simple
										>
											{" "}
											Home{" "}
										</Button>{" "}
									</Link>
								</Typography>
							</GridItem>
						</GridContainer>
					)}

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
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default withErrorHandler(
	compose(
		withStyles(styles),
		connect(mapStateToProps, { appendNavHistory })
	)(Page)
);
