import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
import {Icon } from "@material-ui/core";
import AccessErrorIcon from '@material-ui/icons/WarningRounded';
import withStyles from "@material-ui/core/styles/withStyles";
import { colors } from "assets/jss/app-theme";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import Button from "components/Button";
import Skeleton from '@material-ui/lab/Skeleton';
//
import * as definations from "definations";
import * as services from "services";
import { appendNavHistory } from "state/actions/ui/nav";
//
import { UtilitiesHelper } from "utils/Helpers";
import withRoot from "utils/withRoot";
//Widgets
import ContextDataForm from "views/forms/BaseForm";
//
import styles from "views/pages/styles";

class Page extends React.Component {
	state = {
		title: "",
		main_title: "New",
		main_subtitle: "Record",
		record: null,
		record_id: null,
		loading: true
	};
	defination = null;
	service = null;
	record_id = null;

	constructor(props) {
		super(props);
		const { componentProps, match: { params } } = props;
		this.context = componentProps.context;
		this.defination = definations[componentProps.context];
		this.service = services[componentProps.context];

		if ("id" in params) {
			this.record_id = params.id;
		}

		this.handleFormSuccess = this.handleFormSuccess.bind(this);
	}

	componentDidMount() {
		const { auth, location, appendNavHistory } = this.props;
		if (appendNavHistory && location && this.defination) {
			appendNavHistory({
				name:
					UtilitiesHelper.singularize(this.defination.name) +
					"_" +
					(this.record_id ? this.record_id : "new"),
				uri: location.pathname,
				title:
					(this.record_id ? "Update" : "New") +
					" " +
					UtilitiesHelper.singularize(
						typeof this.defination.label === "function"
							? this.defination.label(auth.user)
							: this.defination.label
					),
				view: null,
				color: this.defination.color
					? this.defination.color
					: colors.hex.primary,
				scrollTop: 0
			});
		}

		if (this.record_id) {
			this.getRecord();
		} else {
			this.setState(state => ({ loading: false }));
		}
	}

	handleFormSuccess(record){
		const { history } = this.props;
		if (JSON.isJSON(record)) {
			history.push((this.defination.name + "/view/" + record._id).toUriWithDashboardPrefix());
		}
	}

	async getRecord() {
		let response = await this.service.getRecordById(this.record_id);
		if (response.err) {
			if (response.err.code === 404) {
				this.props.history.push("/not-found");
			} else {
				this.setState(state => ({ load_error: response.err, loading: false }));
			}
		} else {
			let record = response.body.data;
			this.setState(state => ({
				record_id: this.record_id,
				record: record,
				loading: false
			}));
		}
	}

	render() {
		const { classes, auth, nav } = this.props;
		
		const last_location = Array.isArray(nav.entries) ? (nav.entries.length > 1 ? nav.entries[nav.entries.length-2].uri : false ) : false;
		const forbidden = this.state.loading ? false : (JSON.isJSON(this.state.record) ? this.defination.access.actions.update.restricted(auth.user) : this.defination.access.actions.create.restricted(auth.user));
		return (
			<GridContainer className={classes.root}>
				<GridItem xs={12}>
					{this.state.loading ? (
						<GridContainer
							className={classes.full_height}
							justify="center"
							alignItems="center"
						>
							<Skeleton variant="rect" width={"100%"} height={"100%"} />
						</GridContainer>
					) : (
							<GridContainer className="p-0 m-0">
								{this.state.load_error ? (
									<GridContainer>
										<GridItem xs={12}>
											<Typography color="error" variant="h1" center fullWidth>
												<Icon fontSize="large">error</Icon>
											</Typography>
										</GridItem>
										<GridItem xs={12}>
											<Typography color="error" variant="body1" center fullWidth>
												An error occured.
                    							<br />
												Status Code : {this.state.load_error.code}
												<br />
												{this.state.load_error.msg}
											</Typography>
										</GridItem>
									</GridContainer>
								) : (
										<GridContainer>
											{forbidden && <GridContainer className={classes.fullPageHeight} direction="column" justify="center" alignItems="center">
												<GridItem xs={12}>
													<Typography color="error" variant="h1" center fullWidth>
														<AccessErrorIcon className={classes.errorIcon}/>
													</Typography>
												</GridItem>
												<GridItem xs={12}>
													<Typography color="grey" variant="h3" center fullWidth>
														Access Denied!
													</Typography>
												</GridItem>

												<GridItem xs={12}>
													<Typography color="default" variant="body1" center fullWidth>
														Sorry! Access to this resource is prohibitted since you lack required priviledges. <br /> Please contact the system administrator for further details.
													</Typography>
												</GridItem>

												<GridItem xs={12}>
													<Typography color="error" variant="body1" center fullWidth>
														<Link to={("home").toUriWithDashboardPrefix()}> <Button variant="text" color="default" simple> Home </Button> </Link>
														{last_location && <Link to={last_location}> <Button variant="text" color="default" simple> Back </Button> </Link>}
													</Typography>
												</GridItem>
											</GridContainer>}

											{!forbidden && <GridContainer className="p-0 m-0">
												<GridItem className="p-0 m-0" xs={12}>
													<ContextDataForm
														record={this.state.record ? this.state.record._id : null}
														initialValues={this.state.record}
														defination={this.defination}
														service={this.service}
														onSubmitSuccess={this.handleFormSuccess}
														form={
															this.defination && "name" in this.defination
																? (this.state.record_id
																	? this.state.record_id
																	: "new") +
																"_" +
																UtilitiesHelper.singularize(
																	this.defination.name
																).toLowerCase() +
																"_form"
																: "record_form"
														}
													/>
												</GridItem>
											</GridContainer>}
										</GridContainer>
									)}
							</GridContainer>
						)}
				</GridItem>
			</GridContainer>
		);
	}
}

Page.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
});

export default withRoot(
	compose(
		withStyles(styles),
		connect(
			mapStateToProps,
			{ appendNavHistory }
		)
	)(Page)
);
