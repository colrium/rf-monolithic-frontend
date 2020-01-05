import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from "@material-ui/core/styles/withStyles";
import MenuIcon from '@material-ui/icons/MoreVert';
import { colors } from 'assets/jss/app-theme';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import CardActions from 'components/Card/CardActions';
import CardContent from 'components/Card/CardContent';
import CardHeader from 'components/Card/CardHeader';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Typography from 'components/Typography';
import * as definations from 'definations';
import React from "react";
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import * as services from 'services';
import ListingView from 'views/widgets/Listings';
import styles from './styles';









class GoogleMapOverview extends React.Component {
	state={
		definations: {},
		services: {},
		defination: null,
		service: null,
		menuAnchorEl: null,
	};

	constructor(props){
		super(props);
		this.prepareForView();
		this.handleMenuOpen = this.handleMenuOpen.bind(this);
		this.handleMenuClose = this.handleMenuClose.bind(this);
	}

	prepareForView(){
		const { auth } = this.props;
		let current_defination = null;
		let current_service = null;
		let possible_definations = {};
		let possible_services = {};
		for (let [name, defination] of Object.entries(definations)) {
			if (!defination.access.restricted(auth.user) && name in services) {
				if (defination.views.listing.googlemapview) {
					possible_definations[name] = defination;
					possible_services[name] = services[name];
					if (current_defination === null ) {
						current_defination = defination;
						current_service = services[name];
					}
				}
			}
		}
		this.state.definations = possible_definations;
		this.state.services = possible_services;
		this.state.defination = current_defination;
		this.state.service = current_service;
	}

	handleMenuOpen = event =>{
		let menuAnchorMenuEl = event.currentTarget;
		this.setState(state=>({menuAnchorEl: menuAnchorMenuEl}));
	}

	handleMenuClose(){
		this.setState(state=>({menuAnchorEl: null}));
	}

	handleDefinationChange = name => event => {
		this.setState(state=>({menuAnchorEl: null, defination: state.definations[name], service: state.services[name]}));
	}


	render() {
		const { classes, showAll } = this.props;
		return (
							<Card elevation={0} outlineColor="#cfd8dc">

								<CardHeader avatar={
							          <Avatar aria-label={this.state.defination? this.state.defination.label: ""} style={{background:this.state.defination? this.state.defination.color: colors.hex.default}}>
							            {this.state.defination? this.state.defination.icon: null}
							          </Avatar>
							        }
							        title={this.state.defination? this.state.defination.label: ""}
							        subheader="Click on any context marker, route or polyline in the map for more infomation on the context "

							        action={
							        	<div>
								          	<IconButton aria-label="delete" color="primary" className={classes.margin} onClick={this.handleMenuOpen}> <MenuIcon /> </IconButton>
								          	<Menu
													id="definations-menu"
													anchorEl={this.state.menuAnchorEl}
													keepMounted
													open={Boolean(this.state.menuAnchorEl)}
													onClose={this.handleMenuClose} >
													{Object.entries(this.state.definations).map(([name, defination], index) => (
														<MenuItem onClick={this.handleDefinationChange(name)} key={"defination-"+index}>{defination.label}</MenuItem>
													))}
													
											</Menu>

								        </div>
								        } >
										
								</CardHeader>
								<CardContent className="p-0 m-0">
									<GridContainer className="p-0 m-0">
										{this.state.defination && <ListingView defination={this.state.defination} service={this.state.service} view='googlemapview' showViewOptions={false} showAddBtn={false}/>}
										
									</GridContainer>
								</CardContent>
								<CardActions>
									<GridContainer className="p-0 m-0">
											<GridItem xs={12}>
												<Typography variant="body2"> {this.state.defination? this.state.defination.label: "Overview"} by Map</Typography>
											</GridItem>													
									</GridContainer>
								</CardActions>
								
							</Card>
		)
	}
}

const mapStateToProps = state => ({
	auth: state.auth
});


export default compose(withStyles(styles), connect(mapStateToProps, {}))(GoogleMapOverview);