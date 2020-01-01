import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import withStyles from "@material-ui/core/styles/withStyles";
//
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import PropTypes from 'prop-types';
import React from "react";
//Redux imports
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import CalendarView from './CalendarView';
import GoogleMapView from './GoogleMapView';
import ListView from './ListView';
//
import styles from './styles';
//
import TableView from './TableView';





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

	constructor(props) {
		super(props);

		const { defination, service, query } = props;
		this.state.defination = defination;
		this.state.service = service;
		this.state.query = query? {...query, p:1} : {p:1};

		this.handleViewItemClick = this.handleViewItemClick.bind(this);		
	}

	componentDidMount(){
		this.prepareForRender();
	}

	getSnapshotBeforeUpdate(prevProps) {
		return { prepareForRenderRequired: !Object.areEqual(prevProps, this.props) };
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot.prepareForRenderRequired) {
			this.prepareForRender();
		}
	} 

	handleViewItemClick = name => event => {
		this.setState({ view: name, viewMenuAnchorEl: null });
	};

	handleShowViewsMenu = event => {
		this.setState({ viewMenuAnchorEl: event.currentTarget });
	};

	handleCloseViewsMenu = () => {
		this.setState({ viewMenuAnchorEl: null });
	};
	
	prepareForRender(){
		const { defination, service, query, view, showViewOptions, showAddBtn } = this.props;
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
			for(let [name, label] of Object.entries(all_views)){
				if (name in defination.views.listing) {
					views[name] = label;
				}			
			}
			this.setState(state=>({ defination: defination, service: service, query: query? {...query, p:1} : {p:1}, views: views, view: view? view : default_view, showViewOptions: showViewOptions, showAddBtn: showAddBtn }));
		}
			
	}
	
	

	render() {
		const { classes, auth, query } = this.props;
		return (
			<GridContainer className="p-0 m-0">
				<GridContainer className="p-0 m-0">
					{ this.state.showViewOptions && <GridItem sm={12} md={8}>
						<ButtonGroup className="float-left" color="secondary" aria-label="view change button group">
							{Object.entries(this.state.views).map(([name, label], index) => (
								<Button onClick={this.handleViewItemClick(name)} key={name}>{label}</Button>
							))}															
						</ButtonGroup>

					</GridItem> }
					{ this.state.showAddBtn && this.state.defination && !this.state.defination.access.actions.create.restricted(auth.user) && (
						<GridItem  sm={12} md={this.state.showViewOptions? 4 : 12}>
							{ this.state.defination.access.actions.create.link.inline.default({className: "float-right" }) }
						</GridItem>
					)}
						
						
				</GridContainer>

				<GridItem xs={12} className="p-0 m-0">
					{this.state.view === "tableview" && <TableView defination={this.state.defination} service={this.state.service} query={this.state.query}/>}
					{this.state.view === "calendarview" && <CalendarView defination={this.state.defination} service={this.state.service} query={this.state.query}/>}
					{this.state.view === "googlemapview" && <GoogleMapView defination={this.state.defination} service={this.state.service} query={this.state.query}/>}
					{this.state.view === "listview" && <ListView defination={this.state.defination} service={this.state.service} query={this.state.query}/>}
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
	query:{},
};


const mapStateToProps = state => ({
	auth: state.auth
});

export default compose(withStyles(styles), connect(mapStateToProps, {}))(ListingView);
