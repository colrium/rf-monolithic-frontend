/** @format */
import GridContainer from "components/Grid/GridContainer"
import React, { useCallback, useEffect } from "react"
import { useDidMount, useSetState } from "hooks"
import { useNetworkServices } from "contexts"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import CommentIcon from "@mui/icons-material/Comment"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"
import ProgressIndicator from "components/ProgressIndicator"
import { useLocation } from "react-router-dom"
import { app } from "assets/jss/app-theme.jsx"

const Post = props => {
	const { Api } = useNetworkServices()
	const location = useLocation()
	const [state, setState] = useSetState({
		record: null,
		loading: true,
		error: false,
		comments: []
	})
	const loadData = useCallback((slugId, query = {}) => {
		setState({
			loading: true,
			error: false,
		})
		Api.get(`/posts/${slugId}`, {
			params: { ...query, populate: "1" },
		})
			.then(res => {
				const { data } = { ...res?.body }
				document.title = app.title(data.title || "Post")
				setState({
					record: JSON.isJSON(data) ? data : null,
					loading: false,
					error: false,
				})
			})
			.catch(e => {
				setState({
					loading: false,
					error: e,
				})
			})
	}, [])

	useEffect(() => {
		const pathnameArr= location.pathname.split("/")
		const slugId = pathnameArr[pathnameArr.length - 1]
		loadData(slugId, {})
		console.log("slugId", slugId)
	}, [location.pathname])
	return (
		<Grid container className={"p-0 py-8"}>
			<Grid container className={"p-0"}>
				{state.loading && (
					<Grid item xs={12} className={"flex items-center flex-col justify-center"}>
						<ProgressIndicator />
						<Typography color="text.secondary" variant="subtitle2" paragraph>
							Loading...
						</Typography>
					</Grid>
				)}
				{state.error && (
					<Grid item xs={12} className={"flex items-center justify-center"}>
						<Typography color="error" variant="subtitle2" paragraph>
							{state.error.msg}
						</Typography>
					</Grid>
				)}
				{!state.loading && JSON.isEmpty(state.record) && (
					<Grid container sx={{ color: theme => theme.palette.text.secondary }} className={"p-0"}>
						<Grid
							item
							xs={12}
							sx={{ fontSize: theme => theme.spacing(10) }}
							className={"flex items-center flex-col justify-center"}
						>
							<FolderOpenIcon fontSize="inherit" />
						</Grid>
						<Grid item xs={12} className={"flex items-center flex-col justify-center py-8"}>
							<Typography color="text.secondary" variant="subtitle2" paragraph>
								Post not found
							</Typography>
						</Grid>
					</Grid>
				)}
				{state.record && (
					<Grid container sx={{ color: theme => theme.palette.text.secondary }} className={"p-0"}>
						<Grid
							item
							xs={12}
							md={8}
							sx={{ fontSize: theme => theme.spacing(10) }}
							className={"flex items-center flex-col justify-center"}
						>
							<Grid container className={"p-0"}>
								<Grid item xs={12}>
									<Typography color="text.disabled" variant="body2" paragraph>
										{Date.prose(Date.parseFrom(state.record.created_on))}
									</Typography>
									<Typography color="text.secondary" variant="h4" paragraph>
										{state.record.title}
									</Typography>
									<Typography color="accent.main" variant="subtitle2" paragraph>
										{`By ${state.record.author?.first_name || ""} ${state.record.author?.last_name || ""}`}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="body1" color="text.secondary" component="div">
										{state.record.content}
									</Typography>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} md={4} className={"p-0 md:pt-16 md:pl-6"}>
							<Card>
								<CardContent>
									<Grid container className={"p-0"}>
										<Grid item xs={12}>
											<Typography color="accent.main" variant="subtitle2" paragraph>
												{`Comments (${state.comments?.length || 0})`}
											</Typography>
										</Grid>
									</Grid>
									<Grid container className={"p-0"}>
										{state.comments?.length === 0 && (
											<Grid
												item
												xs={12}
												className="flex flex-col items-center p-4"
												sx={{ fontSize: theme => theme.spacing(10), color: theme => theme.palette.text.disabled }}
											>
												<CommentIcon fontSize="inherit" />
												<Typography color="text.disabled" variant="caption" paragraph>
													{`No Comments yet`}
												</Typography>
											</Grid>
										)}
									</Grid>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				)}
			</Grid>
		</Grid>
	)
}

export default React.memo(Post)
