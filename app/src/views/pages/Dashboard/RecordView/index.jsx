/** @format */

import { Icon } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import AccessErrorIcon from "@material-ui/icons/WarningRounded";
//
import { colors } from "assets/jss/app-theme";
import Button from "components/Button";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import ProgressIndicator from "components/ProgressIndicator";
import Typography from "components/Typography";
//
import * as definations from "definations";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import ApiService from "services/Api";
//
import { withErrorHandler } from "hoc/ErrorHandler";
import { appendNavHistory } from "state/actions/ui/nav";
import styles from "views/pages/styles";
//Widgets
import RecordView from "views/widgets/RecordView";

class Page extends React.Component {
	state = {
		loading: true,
		load_error: false,
		record: null,
	};
	defination = null;
	service = null;

	constructor(props) {
		super(props);
		const {
			componentProps,
			match: { params },
		} = props;
		this.context = componentProps.context;
		this.defination = definations[componentProps.context];
		this.service = ApiService.getContextRequests(this.defination?.endpoint);
		this.id = params.id;
	}

	componentDidMount() {
		const { auth, location, appendNavHistory } = this.props;
		if (appendNavHistory && location && this.defination) {
			appendNavHistory({
				name: this.defination.name.singularize() + "_" + this.id,
				uri: location.pathname,
				title: Function.isFunction(this.defination.label)
					? this.defination.label(auth.user).singularize()
					: this.defination.label.singularize(),
				view: null,
				color: this.defination.color
					? this.defination.color
					: colors.hex.primary,
				scrollTop: 0,
			});
		}
		this.getRecord();
	}

	getRecord() {
		this.service
			.getRecordById(this.id, { p: 1 })
			.then(res => {
				this.setState({ record: res.body.data, loading: false });
			})
			.catch(err => {
				this.setState({ loading: false, load_error: err });
			});
	}

	render() {
		const { classes, auth, nav } = this.props;

		const last_location = Array.isArray(nav.entries)
			? nav.entries.length > 1
				? nav.entries[nav.entries.length - 2].uri
				: false
			: false;
		const forbidden = this.state.loading
			? false
			: JSON.isJSON(this.state.record)
			? this.defination.access.actions.view_single.restricted(auth.user)
			: true;
		return (
			<GridContainer className={classes.root}>
				<GridItem xs={12}>
					{this.state.loading ? (
						<GridContainer
							className={classes.full_height}
							justify="center"
							alignItems="center"
						>
							<GridItem xs={1}>
								<ProgressIndicator
									size={24}
									thickness={4}
									className={classes.progress}
									color="secondary"
									disableShrink
								/>
							</GridItem>
						</GridContainer>
					) : (
						<GridContainer className="p-0 m-0">
							{this.state.load_error ? (
								<GridContainer>
									<GridItem xs={12}>
										<Typography
											color="error"
											variant="h1"
											center
											fullWidth
										>
											<Icon fontSize="large">error</Icon>
										</Typography>
									</GridItem>
									<GridItem xs={12}>
										<Typography
											color="error"
											variant="body1"
											center
											fullWidth
										>
											An error occured.
											<br />
											Status Code :{" "}
											{this.state.load_error.code}
											<br />
											{this.state.load_error.msg}
										</Typography>
									</GridItem>
								</GridContainer>
							) : (
								<GridContainer>
									{forbidden && (
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
													<AccessErrorIcon
														className={
															classes.errorIcon
														}
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
													Sorry! Access to this
													resource is prohibitted
													since you lack required
													priviledges. <br /> Please
													contact the system
													administrator for further
													details.
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
													{last_location && (
														<Link
															to={last_location}
														>
															{" "}
															<Button
																variant="text"
																color="default"
																simple
															>
																{" "}
																Back{" "}
															</Button>{" "}
														</Link>
													)}
												</Typography>
											</GridItem>
										</GridContainer>
									)}

									{!forbidden && (
										<GridContainer className="p-0 m-0">
											<GridItem
												className="p-0 m-0"
												xs={12}
											>
												{this.state.record && (
													<RecordView
														defination={
															this.defination
														}
														service={this.service}
														record={
															this.state.record
														}
													/>
												)}
											</GridItem>
										</GridContainer>
									)}
								</GridContainer>
							)}
						</GridContainer>
					)}
				</GridItem>
			</GridContainer>
		);
	}
}
const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
});

export default compose(
	withStyles(styles),
	connect(mapStateToProps, { appendNavHistory }),
	withErrorHandler
)(Page);
