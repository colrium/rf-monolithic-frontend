/** @format */

import { Icon } from "@mui/material"

import AccessErrorIcon from "@mui/icons-material/WarningRounded"
//
import Skeleton from "@mui/material/Skeleton"
import Button from "components/Button"
//
import Grid from '@mui/material/Grid'

import ProgressIndicator from "components/ProgressIndicator"
import Typography from '@mui/material/Typography'
//
import * as definations from "definations"
import React, { useCallback } from "react"
import { connect } from "react-redux"
import { Link, useParams, useNavigate } from "react-router-dom"
import compose from "recompose/compose"
import ApiService from "services/Api"
//
import ContextDataForm from "views/forms/BaseForm/index"
import { useDidMount, useSetState, useDidUpdate } from "hooks"

const Page = props => {
	const { context, auth, nav } = props
	const params = useParams()
	const defination = definations[context]
	const service = ApiService.getContextRequests(defination?.endpoint)
	const id = params.id
	const [state, setState] = useSetState({
		loading: false,
		load_error: false,
		record: null,
	})
	const navigate = useNavigate()
	const last_location = Array.isArray(nav.entries) ? (nav.entries.length > 1 ? nav.entries[nav.entries.length - 2].uri : false) : false
	const forbidden = state.loading
		? false
		: JSON.isJSON(state.record)
		? defination.access.actions.update.restricted(auth.user)
		: defination.access.actions.create.restricted(auth.user)

	const getRecord = useCallback(() => {
		if (id) {
			setState({ loading: true, load_error: false })
			service
				.getRecordById(id, { p: 1 })
				.then(res => {
					setState({ record: res.body.data, loading: false })
				})
				.catch(err => {
					setState({ loading: false, load_error: err })
				})
		}
	}, [id, service])

	const handleFormSuccess = record => {
		if (JSON.isJSON(record)) {
			navigate(`/${defination.name}/view/${record._id}`.toUriWithDashboardPrefix())
		}
	}

	useDidMount(() => {
		getRecord()
	})
	useDidUpdate(() => {
		getRecord()
	}, [id, service])

	return (
		<Grid container>
			<Grid item  xs={12}>
				{state.loading ? (
					<Grid container justify="center" alignItems="center">
						<Skeleton variant="rect" width={"100%"} height={"100%"} />
					</Grid>
				) : (
					<Grid container className="p-0 m-0">
						{state.load_error ? (
							<Grid container>
								<Grid item  xs={12}>
									<Typography color="error" variant="h1" fullWidth>
										<Icon fontSize="large">error</Icon>
									</Typography>
								</Grid>
								<Grid item  xs={12}>
									<Typography color="error" variant="body1" fullWidth>
										An error occured.
										<br />
										Status Code : {state.load_error.code}
										<br />
										{state.load_error.msg}
									</Typography>
								</Grid>
							</Grid>
						) : (
							<Grid container>
								{forbidden && (
									<Grid container className={"min-h-screen"} direction="column" justify="center" alignItems="center">
										<Grid item  xs={12}>
											<Typography color="error" variant="h1" fullWidth>
												<AccessErrorIcon />
											</Typography>
										</Grid>
										<Grid item  xs={12}>
											<Typography color="grey" variant="h3" fullWidth>
												Access Denied!
											</Typography>
										</Grid>

										<Grid item  xs={12}>
											<Typography variant="body1" fullWidth>
												Sorry! Access to this resource is prohibitted since you lack required priviledges. <br />{" "}
												Please contact the system administrator for further details.
											</Typography>
										</Grid>

										<Grid item  xs={12}>
											<Typography color="error" variant="body1" fullWidth>
												<Link to={"home".toUriWithDashboardPrefix()}>
													{" "}
													<Button variant="text"> Home </Button>{" "}
												</Link>
												{last_location && (
													<Link to={last_location}>
														{" "}
														<Button variant="text"> Back </Button>{" "}
													</Link>
												)}
											</Typography>
										</Grid>
									</Grid>
								)}

								{!forbidden && (
									<Grid container className="p-0 m-0">
										<Grid item  className="p-0 m-0" xs={12}>
											<ContextDataForm
												record={state.record ? state.record._id : null}
												initialValues={state.record}
												defination={defination}
												service={service}
												onSubmitSuccess={handleFormSuccess}
												form={
													defination && "name" in defination
														? (state.record?._id || "new") +
														  "_" +
														  defination.name.singularize().toLowerCase() +
														  "_form"
														: "record_form"
												}
											/>
										</Grid>
									</Grid>
								)}
							</Grid>
						)}
					</Grid>
				)}
			</Grid>
		</Grid>
	)
}
const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
})

export default compose(connect(mapStateToProps, {}))(Page)
