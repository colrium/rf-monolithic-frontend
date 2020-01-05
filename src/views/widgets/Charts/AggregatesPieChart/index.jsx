import { Icon, Menu, MenuItem } from '@material-ui/core';
//
import withStyles from "@material-ui/core/styles/withStyles";
import { MoreVert as AggregateMenuIcon } from '@material-ui/icons';
import EmptyStateImage from 'assets/img/empty-state.svg';
import React from "react";
import PropTypes from 'prop-types';
import { defaults, Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Skeleton from '@material-ui/lab/Skeleton';
import { colors } from 'assets/jss/app-theme';
import Button from 'components/Button';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Typography from 'components/Typography';

//
import { UtilitiesHelper } from 'utils/Helpers';
import styles from './styles';

//
defaults.global.legend.display = false;

class AggregatesPieChart extends React.Component {
	state = {
		loading: true,
		load_error: false,
		aggregate: "status",
		aggregates: [],
		chart_data: {
				labels: [],
				datasets: [{
					data: []
				}]
		},
		aggregateMenuEl: null,
	};
	aggregatables = [];
	colors = [];

	constructor(props) {
		super(props);
		
		this.handleShowAggregateMenu = this.handleShowAggregateMenu.bind(this);
		this.handleCloseAggregateMenu = this.handleCloseAggregateMenu.bind(this);

		
	}

	componentDidMount(){		
		this.prepareForData();	
		this.loadAggregates();
	}

	componentDidUpdate(prevProps) {
		if(!Object.entries(this.props.defination).equals(Object.entries(prevProps.defination))){
			this.prepareForData();
			this.loadAggregates();
		}
	} 

	prepareForData(){
		let { dynamic, monochrome, color, colors, defination, service, aggregate, onResolveAggregates } = this.props;

		if ( dynamic ) {
			this.aggregatables = [];
			for (let [column, properties] of Object.entries(defination.scope.columns)) {
				if (properties.possibilities) {
					this.aggregatables.push({name: column, label: properties.label});
				}
			}
		}



		if ( !aggregate && this.aggregatables.length > 0) {
			aggregate = this.aggregatables[0].name;
			if (onResolveAggregates) {
				onResolveAggregates(defination.name, this.aggregatables)
			}
		}

		if (dynamic) {
			this.state.aggregate = aggregate;
			
			//generate color scheme if monochromatic 
			if (monochrome) {
				let no_of_colors = this.aggregatables.length > 0 ? this.aggregatables.length : 1;
				let monochrome_colors = UtilitiesHelper.monochromeColorScheme(color, no_of_colors);
				this.colors = monochrome_colors;
			}
			else if (colors) {
				this.colors = colors;
			}
			else{
				let no_of_colors = this.aggregatables.length > 0 ? this.aggregatables.length : 1;
				let rotation_colors = UtilitiesHelper.rotationColorScheme(color, no_of_colors);
				this.colors = rotation_colors;
			}
		}
	}


	

	loadAggregates(query_data) {
		const { monochrome, color, colors, aggregate, defination, service, auth, onLoadAggregates } = this.props;

		if (!query_data) {
			query_data = { g: this.state.aggregate }
		}

		let new_aggregate = "g" in query_data? query_data.g : ("group" in query_data? query_data.group : false);
		this.setState(state => ({ aggregate: new_aggregate, loading: true }));

		service.getAggregatesCount(query_data).then(response => {
			let response_data = response.body.data;
			let possibilities = defination.scope.columns[this.state.aggregate] ? defination.scope.columns[this.state.aggregate].possibilities : {};
			if (typeof possibilities === "function") {
				possibilities = possibilities(false, auth.user);
			}
			//generate color scheme if monochromatic 
			if (monochrome) {
				let no_of_colors = response_data.length > 0 ? response_data.length : 1;
				let monochrome_colors = UtilitiesHelper.monochromeColorScheme(color, no_of_colors);
				this.colors = monochrome_colors;
			}
			else if (colors) {
				this.colors = colors;
			}
			else {
				let no_of_colors = response_data.length > 0 ? response_data.length : 1;
				let rotation_colors = UtilitiesHelper.rotationColorScheme(color, no_of_colors);
				this.colors = rotation_colors;
			}

			let chart_data_labels = [];
			let chart_data_data = [];
			let onload_callback_data = [];

			if (typeof possibilities === "object") {
				for (var i = 0; i < response_data.length; i++) {
					if (response_data[i]._id in possibilities) {
						chart_data_labels.push(possibilities[response_data[i]._id]);
						chart_data_data.push(response_data[i].count);
						if (onLoadAggregates) {
							onload_callback_data.push({
								name: response_data[i]._id,
								label: possibilities[response_data[i]._id],
								count: response_data[i].count,
								color: this.colors[i]
							})
						}

					}
				}
			}

			let chart_data = {
				labels: chart_data_labels,
				datasets: [{
					data: chart_data_data,
					backgroundColor: this.colors,
				}]
			}

			this.setState(state => ({ aggregates: response_data, chart_data: chart_data, loading: false }));
			if (onLoadAggregates) {
				onLoadAggregates(onload_callback_data);
			}
		}).catch(err => {
			this.setState(state => ({ load_error: err, loading: false }));
		});
			
	}

	handleShowAggregateMenu = event => {
		let aggregateMenuEl = event.currentTarget;
		this.setState({ aggregateMenuEl: aggregateMenuEl });
	}

	handleCloseAggregateMenu() {
		this.setState({ aggregateMenuEl: null });
	}

	handleAggregateMenuItemClick = column => event => {
		//this.handleCloseAggregateMenu();
		this.setState({ aggregateMenuEl: null });
		this.loadAggregates({g: column})
	}

	render() {
		const { classes, className, aggregate, dynamic, defination, service, showTitle, showMenu } = this.props;
		return (
				<GridContainer className={className+" p-0 m-0"}>
					<GridItem xs={12} className="p-0 m-0">
						{this.state.loading? (
							<GridContainer className="h-full" justify="center" alignItems="center">
								<Skeleton variant="circle" width={150} height={150} />
							</GridContainer>
							) : (
							<GridContainer className="p-0 m-0">
								{this.state.load_error? (
									<GridContainer >
										<GridItem xs={12}>
											<Typography color="error" variant="h3" center fullWidth>
												<Icon fontSize="large">error</Icon>
											</Typography>
											<Typography color="error" variant="body1" center fullWidth>
												An error occured. 
												{this.state.load_error.msg}
											</Typography>
										</GridItem>
										
									</GridContainer>
									): (
									<GridContainer className="p-0 m-0">
										{(showMenu || showTitle) && (
											<GridItem xs={12}>
												<GridContainer>
													{showTitle && !showMenu && <GridItem xs={12}>
															<Typography color="default" variant="body1" fullWidth center>
																{defination.scope.columns[this.state.aggregate]? defination.scope.columns[this.state.aggregate].label : "Unknown"} Aggregate
															</Typography>
														</GridItem>}
													
													{dynamic && showMenu && <GridItem className="p-0 m-0" xs={12}>
															<Button aria-controls="aggregate-menu" aria-haspopup="true" onClick={this.handleShowAggregateMenu} color="default" className="float-right" size="md" aria-label="Aggregate Menu" simple>
																{defination.scope.columns[this.state.aggregate]? defination.scope.columns[this.state.aggregate].label : "Unknown"} Aggregate 
																<AggregateMenuIcon />
															</Button>
															<Menu
																id="surveys-aggregate-menu"
																anchorEl={this.state.aggregateMenuEl}
																keepMounted
																open={Boolean(this.state.aggregateMenuEl)}
																onClose={this.handleCloseAggregateMenu}
															>
															{this.aggregatables.map((aggregatable, index) => (
																<MenuItem onClick={this.handleAggregateMenuItemClick(aggregatable.name)} key={"aggregate_"+aggregatable.name}>{ aggregatable.label+" Aggregate" }</MenuItem>
															))}

															</Menu>
													</GridItem>}
												</GridContainer>
														
											</GridItem>
										)}								
											
										<GridItem className="p-0 m-0" xs={12}>
											{ Array.isArray(this.state.chart_data.labels) && this.state.chart_data.labels.length > 0? (<Pie data={this.state.chart_data} />) : (
												<GridContainer className="p-0 m-0" justify="center" alignItems="center">
													<img alt="Empty Aggregates" className={classes.emptyImage} src={EmptyStateImage} />
													<Typography className={classes.emptyText} color="grey" variant="body2" center fullWidth>
														No {defination.scope.columns[this.state.aggregate]? defination.scope.columns[this.state.aggregate].label : ""} Aggregates
													</Typography>
												</GridContainer> 
												) }
										</GridItem>
												
										
									</GridContainer>								
								)}
							</GridContainer>
						)}
					</GridItem>
				</GridContainer>
		);
	}
}

AggregatesPieChart.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	dynamic: PropTypes.bool,
	showTitle: PropTypes.bool,
	showMenu: PropTypes.bool,
	monochrome: PropTypes.bool,
	color: PropTypes.string,
	colors: PropTypes.array,
	defination: PropTypes.object.isRequired,
	service: PropTypes.any.isRequired,
	aggregate: PropTypes.string,
	onResolveAggregates: PropTypes.func,
	onLoadAggregates: PropTypes.func,
	
};

AggregatesPieChart.defaultProps = {
	//colors: [colors.hex.accent, colors.hex.primary, colors.hex.secondary, colors.hex.primarydark, colors.hex.default],
	color: colors.hex.accent,
	monochrome: true,
};

const mapStateToProps = state => ({
	auth: state.auth
});


export default compose(withStyles(styles), connect(mapStateToProps, {}))(AggregatesPieChart);

