/** @format */

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import FolderIcon from "@mui/icons-material/FolderOutlined";
import MenuIcon from "@mui/icons-material/MoreVert";
import { colors } from "assets/jss/app-theme";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography'
import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import compose from "recompose/compose"
import AggregatesPieChart from "views/widgets/Charts/AggregatesPieChart"
import AggregatesBarChart from "views/widgets/Charts/AggregatesBarChart"
import ApiService from "services/Api"
import * as definations from "definations"

const styles = theme => ({
	fullHeight: {
		height: "100% !important",
	},
})

class CompactAggregatesOverview extends React.Component {
	state = {
		context: null,
		defination: false,
		definations: {},
		aggregates: [],
		menuAnchorEl: null,
	}
	constructor(props) {
		super(props)
		const { auth, contexts } = props
		let possible_definations = {}
		for (let [name, defination] of Object.entries(definations)) {
			if (!defination.access.restricted(auth.user) && defination.access.view.summary(auth.user) && contexts.includes(name)) {
				possible_definations[name] = defination
				if (!this.state.defination) {
					this.state.defination = defination
				}
			}
		}
		this.state.definations = possible_definations
		this.handleMenuOpen = this.handleMenuOpen.bind(this)
		this.handleMenuClose = this.handleMenuClose.bind(this)
		this.handleDefinationChange = this.handleDefinationChange.bind(this)
		this.handleOnAggregatesLoad = this.handleOnAggregatesLoad.bind(this)
	}

	handleMenuOpen = event => {
		let menuAnchorMenuEl = event.currentTarget
		this.setState(state => ({ menuAnchorEl: menuAnchorMenuEl }))
	}

	handleMenuClose() {
		this.setState(state => ({ menuAnchorEl: null }))
	}

	handleDefinationChange = name => event => {
		this.setState(state => ({
			menuAnchorEl: null,
			defination: state.definations[name],
		}))
	}

	handleOnAggregatesLoad(aggregates) {
		this.setState(state => ({ aggregates: aggregates }))
	}

	render() {
		const { classes, auth, contexts, gridSize, theme, chartType } = this.props

		return (
			<Card>
				<CardHeader
					avatar={
						<Avatar aria-label={this.state.defination.label} style={{ background: this.state.defination.color }}>
							{this.state.defination.icon}
						</Avatar>
					}
					title={this.state.defination.label}
					subheader="Aggregates Overview"
					action={
						contexts.length > 1 && (
							<div>
								<IconButton aria-label="menuicon" color="primary" className={classes?.margin} onClick={this.handleMenuOpen}>
									{" "}
									<MenuIcon />{" "}
								</IconButton>
								<Menu
									id="definations-menu"
									anchorEl={this.state.menuAnchorEl}
									keepMounted
									open={Boolean(this.state.menuAnchorEl)}
									onClose={this.handleMenuClose}
								>
									{Object.entries(this.state.definations).map(
										([name, defination], index) =>
											!defination.access.restricted(auth.user) &&
											defination.access.view.summary(auth.user) &&
											contexts.includes(name) && (
												<MenuItem onClick={this.handleDefinationChange(name)} key={"aggregate-" + defination.name}>
													{" "}
													{defination.label}{" "}
												</MenuItem>
											)
									)}
								</Menu>
							</div>
						)
					}
				></CardHeader>
				<CardContent className="p-0 m-0">
					<Grid
						container
						className={classes?.fullHeight}
						direction="column"
						className="p-0 m-0 flex flex-col justify-center items-center"
					>
						<Grid container className="p-0 m-0">
							<Grid item xs={12}>
								<Grid
									container
									style={{ height: "100%" }}
									direction="column"
									className="p-0 m-0 justify-center items-center"
								>
									{chartType === "pie" && (
										<AggregatesPieChart
											defination={this.state.defination}
											service={ApiService.getContextRequests(this.state.defination.endpoint)}
											color={this.state.defination.color ? this.state.defination.color : colors.hex.primary}
											onLoadAggregates={this.handleOnAggregatesLoad}
											monochrome
											showTitle
											showMenu
											dynamic
										/>
									)}
									{chartType === "bar" && (
										<AggregatesBarChart
											defination={this.state.defination}
											service={ApiService.getContextRequests(this.state.defination.endpoint)}
											color={this.state.defination.color ? this.state.defination.color : colors.hex.primary}
											onLoadAggregates={this.handleOnAggregatesLoad}
											monochrome
											showTitle
											showMenu
											dynamic
										/>
									)}
								</Grid>
							</Grid>
							<Grid item xs={12}>
								<Grid container className="p-0 m-0 justify-center items-center" direction="column">
									<Typography color="grey" variant="body2" gutterBottom>
										Aggregates Index
									</Typography>
									<br />
									<br />
									<br />
									{this.state.aggregates.length === 0 && <FolderIcon fontSize="large" />}
									{this.state.aggregates.map((aggregate, index) => (
										<Badge
											badgeContent={aggregate.count}
											color={aggregate.color}
											textColor={colors.hex.inverse}
											key={this.state.defination.name + "-aggregate-" + index}
										>
											<Typography variant="subtitle1" component="h3" gutterBottom>
												{aggregate.label}
											</Typography>
										</Badge>
									))}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
				<CardActions>
					<Grid container className="p-0 m-0">
						<Grid item xs={12}>
							<Typography variant="body2">{this.state.defination.label} by Aggregates</Typography>
						</Grid>
					</Grid>
				</CardActions>
			</Card>
		)
	}
}

CompactAggregatesOverview.propTypes = {
	gridSize: PropTypes.number,
	chartType: PropTypes.string,
	contexts: PropTypes.array,
	aggregates: PropTypes.array,
}

CompactAggregatesOverview.defaultProps = {
	gridSize: 12,
	chartType: "pie",
	contexts: ["commissions", "surveys", "responses"],
	aggregates: [],
}

const mapStateToProps = state => ({
	auth: state.auth,
})

export default compose(connect(mapStateToProps, {}))(CompactAggregatesOverview)
