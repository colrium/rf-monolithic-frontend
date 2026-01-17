/** @format */
import Grid from '@mui/material/Grid'
import React from "react"
import {useDidMount} from "hooks"
import Typography from "@mui/material/Typography"
import { Outlet } from "react-router-dom"
import { app } from "assets/jss/app-theme.jsx"

const Page = props => {
	useDidMount(() => {
		document.title = app.title("Community")
		document.querySelector('meta[name="description"]').setAttribute("content", "Welcome to the Realfield Community Page! We hope you enjoy the content and invite you to share your thoughts on the articles we post in the comments section")
	})
		return (
			<Grid container className={"md:px-32 py-20"}>
				<Grid container className={"p-0 "} sx={{ background: theme => theme.palette.background.paper }}>
					<Grid item xs={12}>
						<Typography variant="h3" sx={{ color: theme => theme.palette.accent.main }} color="accent">
							Realfield Community
						</Typography>
					</Grid>
					<Grid item xs={12} className="my-8">
						<Typography variant="subtitle2" sx={{ color: theme => theme.palette.accent.main }} color="accent">
							Welcome to the Realfield Community Page! We hope you enjoy the content and invite you to share your thoughts on
							the articles we post in the comments section
						</Typography>
					</Grid>
				</Grid>
				<Grid container className={"p-0 "} sx={{ background: theme => theme.palette.background.paper }}>
					<Grid item xs={12}>
						<img src="/img/map_with_fielders.png" alt="Fielders Map" className="w-full h-auto" />
					</Grid>
				</Grid>
				<Grid container className={"p-0"} sx={{ background: theme => theme.palette.background.paper }}>
					<Outlet />
				</Grid>
			</Grid>
		)

}



export default React.memo(Page)
