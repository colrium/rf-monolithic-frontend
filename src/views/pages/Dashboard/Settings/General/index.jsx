/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"

import { EventRegister } from "utils"
import { usePersistentForm, useDidMount } from "hooks"

function Widget(props) {
	const settings = useSelector(state => ({ ...state?.app?.general }))
	const {
		TextField,
		RadioGroup,
		observer$,
		setValue,
		formState: { errors },
	} = usePersistentForm({
		name: "general-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})
	useDidMount(() => {
		const subscription = observer$.subscribe(formData => {
			if (JSON.isEmpty(formData.errors)) {
				EventRegister.emit("change-settings", {
					general: { ...settings, ...formData.values },
				})
			}
		})
		return () => subscription.unsubscribe()
	})

	return (
		<Card>
			<Grid container className="p-4">
				<Grid container spacing={2}>
					<Grid item xs={12} className="mb-2">
						<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
							General
						</Typography>
					</Grid>

					<Grid item xs={12}>
						<Typography variant="body2" sx={{ color: theme => theme.palette.text.disabled }}>
							SEO
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="seo-title"
							label="SEO Title"
							variant="filled"
							size="small"
							margin="dense"
							rules={{
								required: true,
							}}
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField
							name="seo-tagline"
							label="SEO Tagline"
							variant="filled"
							size="small"
							margin="dense"
							rules={{
								required: true,
							}}
							multiline={true}
							minRows={4}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body2" sx={{ color: theme => theme.palette.text.disabled }}>
							Ownership
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="copyright"
							label="Copyright"
							variant="filled"
							size="small"
							margin="dense"
							rules={{
								required: true,
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="trademark"
							label="Trademark"
							variant="filled"
							size="small"
							margin="dense"
							rules={{
								required: true,
							}}
						/>
					</Grid>
					<Grid item xs={12} className="mb-2">
						<Typography variant="body2" sx={{ color: theme => theme.palette.text.disabled }}>
							Routing
						</Typography>
					</Grid>
					<Grid item xs={12} className="mb-4">
						<RadioGroup
							name="landing-page-routing"
							label="Landing page routing"
							options={{ sections: "# (Hash) aware Sections", normal: "Normal" }}
							rules={{
								required: true,
							}}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}

export default React.memo(Widget)
