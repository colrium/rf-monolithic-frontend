import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from "@material-ui/core/styles/withStyles";
import FolderIcon from '@material-ui/icons/FolderOutlined';
import MenuIcon from '@material-ui/icons/MoreVert';
import { colors } from "assets/jss/app-theme";
import Avatar from 'components/Avatar';
import Badge from 'components/Badge';
import Card from 'components/Card';
import CardActions from 'components/Card/CardActions';
import CardContent from 'components/Card/CardContent';
import CardHeader from 'components/Card/CardHeader';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Typography from 'components/Typography';
import * as definations from 'definations';
import PropTypes from 'prop-types';
import React from "react";
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import * as services from 'services';
import AggregatesPieChart from 'views/widgets/Charts/AggregatesPieChart';












const styles = theme => ({
	fullHeight: {
		height:"100% !important",
	}
});


class CompactAggregatesOverview extends React.Component {
	state = {
		context: null,
		defination: false,
		definations: {},
		aggregates: [],
		menuAnchorEl: null
	};
	constructor(props) {
		super(props);
		const { auth } = props;
		let possible_definations = {}
		for (let [name, defination] of Object.entries(definations)) {
			if (name in services && !defination.access.restricted(auth.user) && defination.access.view.summary(auth.user)) {
				possible_definations[name] = defination;
				if (!this.state.defination) {
					this.state.defination = defination;
				}
			}
		}
		this.state.definations = possible_definations;
		this.handleMenuOpen = this.handleMenuOpen.bind(this);
		this.handleMenuClose = this.handleMenuClose.bind(this);
		this.handleDefinationChange = this.handleDefinationChange.bind(this);
		this.handleOnAggregatesLoad = this.handleOnAggregatesLoad.bind(this);
	}

	handleMenuOpen = event =>{
		let menuAnchorMenuEl = event.currentTarget;
		this.setState(state=>({menuAnchorEl: menuAnchorMenuEl}));
	}

	handleMenuClose(){
		this.setState(state=>({menuAnchorEl: null}));
	}

	handleDefinationChange = name => event => {
		this.setState(state=>({menuAnchorEl: null, defination: state.definations[name] }));
	}

	handleOnAggregatesLoad(aggregates){
		this.setState(state=>({aggregates: aggregates}));
	}

	render() {
		const { classes, auth } = this.props;

		return (
							<Card elevation={0} outlineColor="#cfd8dc">
								<CardHeader avatar={
									  <Avatar aria-label={this.state.defination.label} style={{background:this.state.defination.color}}>
										{this.state.defination.icon}
									  </Avatar>
									}
									title={this.state.defination.label}
									subheader="Aggregates Overview"
									action={
							        	<div>
								          	<IconButton aria-label="menuicon" color="primary" className={classes.margin} onClick={this.handleMenuOpen}> <MenuIcon /> </IconButton>
											<Menu
												id="definations-menu"
												anchorEl={this.state.menuAnchorEl}
												keepMounted
												open={Boolean(this.state.menuAnchorEl)}
												onClose={this.handleMenuClose} >
												{Object.entries(this.state.definations).map(([name, defination], index) => (
													<MenuItem onClick={this.handleDefinationChange(name)} key={"aggregate-"+defination.name}> { defination.label } </MenuItem>
												))}
											</Menu>

								        </div>
								    } >
										
								</CardHeader>
								<CardContent className="p-0 m-0">
									<GridContainer className={classes.fullHeight} direction="column" justify="center" alignItems="center">
										<GridContainer className="p-0 m-0">
											<GridItem xs={12}>
												<GridContainer style={{ height:"100%" }} direction="column" justify="center" alignItems="center">
													<AggregatesPieChart defination={this.state.defination} service={services[this.state.defination.name]} color={this.state.defination.color? this.state.defination.color: colors.hex.primary } onLoadAggregates={this.handleOnAggregatesLoad} monochrome showTitle showMenu dynamic/>
												</GridContainer>
											</GridItem>
											<GridItem xs={12}>
												<GridContainer className="center" direction="column" justify="center" alignItems="center">
													<Typography color="grey" variant="body2" gutterBottom>Aggregates Index</Typography>
													<br />
													<br />
													<br />
													{ this.state.aggregates.length === 0 && <FolderIcon fontSize="large"/>}
													{ this.state.aggregates.map((aggregate, index) => (
														<Badge badgeContent={aggregate.count} color={aggregate.color} textColor={colors.hex.inverse} key={this.state.defination.name+"-aggregate-"+index} >
															<Typography color="default" variant="subtitle1" component="h3" gutterBottom>{aggregate.label}</Typography>
														</Badge>
													))}
												</GridContainer>
											</GridItem>
										</GridContainer>
									</GridContainer>
								</CardContent>
								<CardActions>
									<GridContainer className="p-0 m-0">
											<GridItem xs={12}>
												<Typography variant="body2">  {this.state.defination.label} by Aggregates</Typography>
											</GridItem>													
									</GridContainer>
								</CardActions>
								
							</Card>
		)
		
	}
}

CompactAggregatesOverview.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});


export default compose(withStyles(styles), connect(mapStateToProps, {}))(CompactAggregatesOverview);