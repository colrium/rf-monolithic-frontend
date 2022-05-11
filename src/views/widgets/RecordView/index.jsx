/** @format */

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

//
import clsx from "clsx";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from '@mui/material/Typography';
import ListingView from "views/widgets/Listings";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
//
import Grid from '@mui/material/Grid';
;
import PropTypes from "prop-types";
import React from "react";
//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";

//
import CardView from "./CardView";
import * as definations from "definations";
import * as services from "services";
//


function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-force-tabpanel-${index}`}
			aria-labelledby={`scrollable-force-tab-${index}`}
			{...other}
		>
			<Box className="p-0">{children}</Box>
		</Typography>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `scrollable-force-tab-${index}`,
		"aria-controls": `scrollable-force-tabpanel-${index}`,
	};
}

class RecordView extends React.Component {
	state = {
		view: "cardview",
		views: {},
		viewMenuAnchorEl: null,
		expanded: true,
	};

	constructor(props) {
		super(props);
		this.prepareForView();
		this.handleExpandClick = this.handleExpandClick.bind(this);
		this.handleViewMenuItemClick = this.handleViewMenuItemClick.bind(this);
		this.handleRelatedTabValueChange = this.handleRelatedTabValueChange.bind(
			this
		);
		this.handleCloseViewsMenu = this.handleCloseViewsMenu.bind(this);
	}

	componentDidMount() { }

	handleViewMenuItemClick = name => event => {
		this.setState({ view: name, viewMenuAnchorEl: null });
	};

	handleRelatedTabValueChange(event, value) {
		this.setState({ relatedTab: value });
	}

	handleShowViewsMenu = event => {
		this.setState({ viewMenuAnchorEl: event.currentTarget });
	};

	handleCloseViewsMenu = () => {
		this.setState({ viewMenuAnchorEl: null });
	};

	handleExpandClick() {
		this.setState(prevState => ({ expanded: !prevState.expanded }));
	}

	prepareForView() {
		const { defination, auth } = this.props;
		let all_views = {
			cardview: "Card View",
			googlemapview: "Google Map View",
			vectormapview: "Vector Map View",
			calendarview: "Calendar View",
		};
		let views = {};
		let view = "cardview";
		if (defination.views.single.default in all_views) {
			view = defination.views.single.default;
		}
		for (let [name, label] of Object.entries(all_views)) {
			if (name in defination.views.single) {
				views[name] = label;
			}
		}
		let relatedTab = null;
		if (JSON.isJSON(defination.scope.dependants)) {
			for (let [key, value] of Object.entries(
				defination.scope.dependants
			)) {
				if (definations[key].name !== defination.name) {
					if (!String.isString(relatedTab)) {
						if (!definations[key].access.restricted(auth.user)) {
							relatedTab = definations[key].name;
						}
					} else {
						break;
					}
				}
			}
		}

		this.state.views = views;
		this.state.view = view;
		this.state.relatedTab = relatedTab;
	}

	render() {
		const { className, auth, defination, record, service } = this.props;
		return (
			<Grid container
				className={`${className ? className : ""} relative p-4`}
			>
				<Grid container>
					<Grid item  xs={12}>
						<Button
							className={"absolute right-4 bottom-4"}
							onClick={this.handleShowViewsMenu}
							aria-label="view-select"
						>
							{this.state.views[this.state.view]}
						</Button>
						<Menu
							id="lock-menu"
							anchorEl={this.state.viewMenuAnchorEl}
							keepMounted
							open={Boolean(this.state.viewMenuAnchorEl)}
							onClose={this.handleCloseViewsMenu}
						>
							{Object.entries(this.state.views).map(
								([name, label], index) => (
									<MenuItem
										key={name}
										selected={name === this.state.view}
										onClick={this.handleViewMenuItemClick(
											name
										)}
									>
										{label}
									</MenuItem>
								)
							)}
						</Menu>
					</Grid>
				</Grid>

				<Grid container>
					{this.state.view === "cardview" && (
						<CardView
							defination={defination}
							service={service}
							record={record}
						/>
					)}
				</Grid>
				<Grid container className="p-0">
					<Grid item  xs={12}>
						<Grid container>
							<Grid item  xs={2} md={1}>
								<IconButton
									className={clsx(`transform rotate-0`, {
										[`rotate-180`]: this.state.expanded,
									})}
									onClick={this.handleExpandClick}
									aria-expanded={this.state.expanded}
									aria-label="show more"
								>
									<ExpandMoreIcon />
								</IconButton>
							</Grid>
							<Grid item  xs={10} md={11}>
								<Typography
									color={
										this.state.expanded ? "text.secondary" : "text.disabled"
									}
									variant="body2"
								>
									{" "}
									Related to this{" "}
									{defination.label.singularize()}{" "}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item  xs={12}>
						<Collapse in={this.state.expanded} timeout="auto">
							{JSON.isJSON(defination.scope.dependants) ? (
								<AppBar
									position="static"
									color="transparent"
									elevation={0}
								>
									<Tabs
										value={this.state.relatedTab}
										onChange={
											this.handleRelatedTabValueChange
										}
										indicatorColor="primary"
										textColor="primary"
										variant="fullWidth"
										aria-label="related data tabs"
									>
										{Object.entries(
											defination.scope.dependants
										).map(
											([dependant, properties], cursor) =>
												!definations[
													dependant
												].access.restricted(
													auth.user
												) && (
													<Tab
														value={dependant}
														label={
															definations[
																dependant
															].label
														}
														icon={
															definations[
																dependant
															].icon
														}
														key={cursor + "_tab"}
														{...a11yProps(
															dependant
														)}
													/>
												)
										)}
									</Tabs>
								</AppBar>
							) : (
								<Typography color="grey" paragraph>
									{" "}
									No Related data{" "}
								</Typography>
							)}



							{JSON.isJSON(defination.scope.dependants) && Object.entries(defination.scope.dependants).map(
								([dependant, properties], cursor) =>
									!definations[
										dependant
									].access.restricted(auth.user) && (
										<TabPanel
											className="p-0"
											value={this.state.relatedTab}
											index={dependant}
											key={"tab-" + cursor}
										>
											<ListingView
												defination={
													definations[dependant]
												}
												service={
													services[dependant]
												}
												query={{
													...properties.query,
													[properties.column]:
														record._id,
												}}
												show_actions={false}
												showAddBtn={false}
											/>
										</TabPanel>
									)
							)}
						</Collapse>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}
RecordView.propTypes = {
	className: PropTypes.string,
	defination: PropTypes.object.isRequired,
	service: PropTypes.any.isRequired,
	record: PropTypes.object.isRequired,
	showRelated: PropTypes.bool,
};

RecordView.defaultProps = {};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(

	connect(mapStateToProps, {})
)(RecordView);
