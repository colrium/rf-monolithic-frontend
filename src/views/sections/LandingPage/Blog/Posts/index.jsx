/** @format */
import GridContainer from "components/Grid/GridContainer"
import React, { useCallback } from "react"
import {useDidMount, useSetState} from "hooks"
import { useNetworkServices } from "contexts"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"
import ProgressIndicator from "components/ProgressIndicator"
import { Link } from "react-router-dom"

const Posts = props => {
	const { Api } = useNetworkServices()
	const [state, setState] = useSetState({
		records:  [],
		loading: false,
		error: false,
	})
	const loadData = useCallback((query={})=>{
		setState({
			loading: true,
			error: false,
		})
		Api.get("/posts", {
			params: { ...query, is: "type=blog", sort: "-created_on", pagination: "-1" },
		})
			.then(res => {
				const { data } = { ...res?.body }
				setState({
					records: Array.isArray(data) ? data : [],
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

	useDidMount(() => {
		loadData({})
	})
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
				{!state.loading && state.records.length === 0 && (
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
								No Posts yet
							</Typography>
						</Grid>
					</Grid>
				)}
				<Grid container sx={{ color: theme => theme.palette.text.secondary }} className={"p-0"}>
					{!state.loading &&
						state.records.length > 0 &&
						state.records.map(post => (
							<Grid item xs={12} md={4}  className={"flex flex-row "} key={`post-${post._id}`}>
								<Card>
									{post.featured_image && (
										<CardMedia
											component="img"
											height="140"
											image={Api.getAttachmentFileUrl(post.featured_image)}
											alt="Featured Image"
										/>
									)}
									<CardContent>
										<Typography gutterBottom variant="h5" component="div">
											{post.title}
										</Typography>
										<Typography gutterBottom variant="caption" component="div">
											{Date.prose(Date.parseFrom(post.created_on))}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{post.content.truncate(100)}
										</Typography>
									</CardContent>
									<CardActions>
										<Link
											className="flex flex-col"
											to={`/community/posts/${post._id}`.toUriWithLandingPagePrefix()}
											color="inherit"
										>
											<Button size="small">Read More</Button>
										</Link>
									</CardActions>
								</Card>
							</Grid>
						))}
				</Grid>
			</Grid>
		</Grid>
	)

}



export default React.memo(Posts)
