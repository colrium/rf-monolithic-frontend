/** @format */

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import withStyles from "@material-ui/core/styles/withStyles";
//
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import PropTypes from "prop-types";
import React from "react";
//Redux imports
import { connect } from "react-redux";
import compose from "recompose/compose";
import CalendarView from "./CalendarView";
import GoogleMapView from "./GoogleMapView";
import ListView from "./ListView";
import { withErrorHandler } from "hoc/ErrorHandler";
//
import styles from "./styles";
//
import TableView from "./TableView";

class ListingView extends React.Component {
	state = {
		defination: null,
		service: null,
		view: "tableview",
		views: {},
		showViewOptions: true,
		showAddBtn: true,
		query: {},
		viewMenuAnchorEl: null,
	};
	mounted = false;

	constructor(props) {
		super(props);

		const { defination, service, query } = props;
		this.state.defination = defination;
		this.state.service = service;
		this.state.query = query ? { ...query, p: 1 } : { p: 1 };
		this.handleViewItemClick = this.handleViewItemClick.bind(this);
	}

	componentDidMount() {
		this.mounted = true;
		this.prepareForRender();
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	getSnapshotBeforeUpdate(prevProps) {
		this.mounted = false;
		return {
			prepareForRenderRequired: !Object.areEqual(prevProps, this.props),
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.mounted = true;
		if (snapshot.prepareForRenderRequired) {
			this.prepareForRender();
		}
	}

	handleViewItemClick = name => event => {
		if (this.mounted) {
			this.setState({ view: name, viewMenuAnchorEl: null });
		} else {
			this.state.view = name;
			this.state.viewMenuAnchorEl = null;
		}
	};

	handleShowViewsMenu = event => {
		const viewMenuAnchorEl = event.currentTarget;
		if (this.mounted) {
			this.setState({ viewMenuAnchorEl: viewMenuAnchorEl });
		} else {
			this.state.viewMenuAnchorEl = viewMenuAnchorEl;
		}
	};

	handleCloseViewsMenu = () => {
		if (this.mounted) {
			this.setState({ viewMenuAnchorEl: null });
		} else {
			this.state.viewMenuAnchorEl = null;
		}
	};

	async prepareForRender() {
		const {
			defination,
			service,
			query,
			view,
			showViewOptions,
			showAddBtn,
		} = this.props;
		if (defination && service) {
			let all_views = {
				tableview: "Table View",
				//listview: "List View",
				googlemapview: "Google Map View",
				vectormapview: "Vector Map View",
				calendarview: "Calendar View",
			};
			let views = {};
			let default_view = "tableview";
			if (defination.views.listing.default in all_views) {
				default_view = defination.views.listing.default;
			}
			for (let [name, label] of Object.entries(all_views)) {
				if (name in defination.views.listing) {
					views[name] = label;
				}
			}
			if (this.mounted) {
				this.setState(state => ({
					defination: defination,
					service: service,
					query: query ? { ...query, p: 1 } : { p: 1 },
					views: views,
					view: view ? view : default_view,
					showViewOptions: showViewOptions,
					showAddBtn: showAddBtn,
				}));
			} else {
				this.state = {
					...this.state,
					defination: defination,
					service: service,
					query: query ? { ...query, p: 1 } : { p: 1 },
					views: views,
					view: view ? view : default_view,
					showViewOptions: showViewOptions,
					showAddBtn: showAddBtn,
				};
			}
		}
	}

	render() {
		const { classes, auth, query, defination, service } = this.props;
		const { view } = this.state;
		return (
			<GridContainer className="p-0 m-0">
				<GridContainer className="p-0 m-0">
					{this.state.showViewOptions && (
						<GridItem sm={12} md={8}>
							<ButtonGroup
								className="float-left"
								color="secondary"
								aria-label="view change button group"
							>
								{Object.entries(this.state.views).map(
									([name, label], index) => (
										<Button
											onClick={this.handleViewItemClick(
												name
											)}
											key={name}
										>
											{label}
										</Button>
									)
								)}
							</ButtonGroup>
						</GridItem>
					)}
					{this.state.showAddBtn &&
						defination &&
						!defination.access.actions.create.restricted(
							auth.user
						) && (
							<GridItem
								sm={12}
								md={this.state.showViewOptions ? 4 : 12}
							>
								{defination.access.actions.create.link.inline.default(
									{ className: "float-right" }
								)}
							</GridItem>
						)}
				</GridContainer>

				<GridItem xs={12} className="p-0 m-0">
					{view === "tableview" && (
						<TableView
							defination={defination}
							service={this.state.service}
							query={this.state.query}
						/>
					)}
					{view === "calendarview" && (
						<CalendarView
							defination={defination}
							service={this.state.service}
							query={this.state.query}
						/>
					)}
					{view === "googlemapview" && (
						<GoogleMapView
							defination={defination}
							service={this.state.service}
							query={this.state.query}
						/>
					)}
					{view === "listview" && (
						<ListView
							defination={defination}
							service={this.state.service}
							query={this.state.query}
						/>
					)}
				</GridItem>
			</GridContainer>
		);
	}
}
ListingView.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	defination: PropTypes.object.isRequired,
	service: PropTypes.any.isRequired,
	view: PropTypes.string,
	query: PropTypes.object,
	showViewOptions: PropTypes.bool,
	show_actions: PropTypes.bool,
	show_links: PropTypes.bool,
	showAddBtn: PropTypes.bool,
};

ListingView.defaultProps = {
	show_actions: true,
	show_links: true,
	showViewOptions: true,
	showAddBtn: true,
	query: {},
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(
	withStyles(styles),
	connect(mapStateToProps, {}),
	withErrorHandler
)(ListingView);
