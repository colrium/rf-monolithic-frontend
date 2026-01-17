/** @format */


import classNames from "classnames";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography'
import PropTypes from "prop-types"
import React, { Component } from "react"
import { connect } from "react-redux"
import { withTheme } from "@mui/styles"
import compose from "recompose/compose"
import { apiCallRequest } from "state/actions"
import * as definations from "definations"

//

class Overview extends Component {
	state = {
		counts: {},
		aggregates: {},
	}

	constructor(props) {
		super(props)
		const { contexts, cache } = this.props
	}

	componentDidMount() {
		const { contexts } = this.props
		Object.entries(contexts).map(([context, { title, type, icon, description, query, value, ...rest }]) => {
			if (definations[context]) {
				if (["count", "aggregates"].includes(type) && !value) {
					this.loadData(context, type, JSON.isJSON(query) ? query : {})
				}
			}
		})
	}

	loadData(context, type, query) {
		const { apiCallRequest } = this.props
		let contextDefination = definations[context]
		if (contextDefination) {
			apiCallRequest(contextDefination.name + (type !== "records" ? "_" + type : ""), {
				uri: contextDefination.endpoint,
				type: type,
				params: JSON.isJSON(query) ? query : {},
				data: {},
				cache: true,
			}) /*.then(count => {
				this.setState(prevState=>({
					counts: {
						...prevState.counts,
						[contextDefination.name]: count,
					}
				}));
			});*/
		}
	}

	render() {
		const { className, auth, cache, contexts, theme, wrapperSize } = this.props
		const rootClassName = classNames(className)
		const defaultValues = {
			count: 0,
			aggregates: {},
		}
		let views_data = {}

		if (JSON.isJSON(contexts)) {
			Object.entries(contexts).map(([context, { title, type, icon, description, query, value, ...rest }]) => {
				if (definations[context]) {
					if (JSON.isJSON(cache.data) && !value) {
						if (context + "_" + type in cache.data) {
							views_data[context] = {
								...rest,
								type: type,
								title: title ? title : definations[context].label,
								description: description ? description : (type == "count" ? "Total " : "") + definations[context].label,
								icon: icon ? icon : definations[context].icon,
								query: JSON.isJSON(query) ? query : {},
								value: cache.data[context + "_" + type],
							}
						} else {
							views_data[context] = {
								...rest,
								type: type,
								title: title ? title : definations[context].label,
								description: description ? description : (type == "count" ? "Total " : "") + definations[context].label,
								icon: icon ? icon : definations[context].icon,
								query: JSON.isJSON(query) ? query : {},
								value: defaultValues[type],
							}
						}
					} else if (value) {
						views_data[context] = {
							...rest,
							type: type,
							title: title ? title : definations[context].label,
							description: description ? description : (type == "count" ? "Total " : "") + definations[context].label,
							icon: icon ? icon : definations[context].icon,
							query: JSON.isJSON(query) ? query : {},
							value: value,
						}
					} else {
						views_data[context] = {
							...rest,
							type: type,
							title: title ? title : definations[context].label,
							description: description ? description : (type == "count" ? "Total " : "") + definations[context].label,
							icon: icon ? icon : definations[context].icon,
							query: JSON.isJSON(query) ? query : {},
							value: defaultValues[type],
						}
					}
				}
			})
		}

		return (
			<Grid container className="p-0 m-0" className={rootClassName}>
				{Object.entries(views_data).map(
					([context, { title, type, icon, description, size, query, value, resolveValue, view, ...rest }], cursor) => (
						<Grid
							item
							xs={12}
							md={size ? size : wrapperSize >= 8 ? 3 : 6}
							sx={{ minHeight: theme => theme.spacing(40) }}
							className="px-2 py-2"
							key={context + "-numbers"}
						>
							<Card  elevation={1} >
								<CardHeader
									title={
										<Typography variant="h5" style={{ color: theme.palette.text.disabled, fontWeight: "500" }}>
											{Function.isFunction(title) ? title(value) : title}
										</Typography>
									}
								/>

								<CardContent>
									<Grid container className="p-0 m-0 flex items-center">
										<Grid item xs={12} className="flex items-center justify-center">
											{type === "count" && (
												<Typography
													variant="h2"
													className="text-5xl"
													style={{ color: theme.palette.accent.main, fontWeight: "700", fontSize: "2rem" }}
												>
													{" "}
													{value}{" "}
												</Typography>
											)}
											{type === "aggregates" && !view && Function.isFunction(resolveValue) && (
												<Typography
													variant="h2"
													style={{ color: theme.palette.accent.main, fontWeight: "700", fontSize: "2rem" }}
												>
													{" "}
													{resolveValue(value)}{" "}
												</Typography>
											)}
										</Grid>
									</Grid>
								</CardContent>

								<CardActions>
									<Typography variant="body2" style={{ color: theme.palette.text.default }}>
										{Function.isFunction(description) ? description(value) : description}
									</Typography>
								</CardActions>
							</Card>
						</Grid>
					)
				)}
			</Grid>
		)
	}
}

Overview.propTypes = {
	className: PropTypes.string,

	contexts: PropTypes.object.isRequired,
	showGraphs: PropTypes.bool,
	wrapperSize: PropTypes.number,
}

Overview.defaultProps = {
	showGraphs: true,
	wrapperSize: 12,
	contexts: {
		surveys: {
			type: "count",
			query: {},
		},
		commissions: {
			type: "count",
			query: {},
		},
		responses: {
			type: "count",
			query: {},
		},
		queries: {
			type: "count",
			query: {},
		},
		tracks: {
			type: "count",
			query: {},
		},
		applications: {
			type: "count",
			query: {},
		},
		users: {
			type: "aggregates",
			query: {
				group: "gender",
				role: "collector",
			},
			title: value => {
				let new_value = ""
				if (Array.isArray(value)) {
					value.map(entry => {
						if (entry._id) {
							new_value = new_value + (new_value.length > 0 ? " / " : "") + entry._id.humanize()
						}
					})
				}
				return new_value
			},
			description: value => {
				let new_value = ""
				if (Array.isArray(value)) {
					value.map(entry => {
						if (entry._id) {
							new_value = new_value + (new_value.length > 0 ? " / " : "") + entry._id.humanize()
						}
					})
				}
				return "Total " + new_value
			},
			resolveValue: value => {
				let new_value = ""
				if (Array.isArray(value)) {
					value.map(entry => {
						if (entry._id && entry.count) {
							new_value = new_value + (new_value.length > 0 ? " / " : "") + entry.count
						}
					})
				}
				return new_value
			},
		},
	},
}

const mapStateToProps = state => ({
	auth: state.auth,
	cache: state.cache,
})

export default compose(connect(mapStateToProps, { apiCallRequest }), withTheme)(Overview)
