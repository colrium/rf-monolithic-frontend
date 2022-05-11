/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from '@mui/material/Grid'
import Card from "components/Card"

import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"

function Widget(props) {
	const settings = useSelector(state => ({ ...state?.app?.general }))
	const {
		TextField,
		RadioGroup,
		values,
		setValue,
		formState: { errors },
	} = usePersistentForm({
		name: "general-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-settings", {
				general: { ...settings, ...values },
			})
		}
	}, [values])

	return (
		<Card>
			<Grid container className="px-8">
				<Grid item  xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						General
					</Typography>
				</Grid>

				<Grid container className="px-0">
					<Grid item  xs={12} className="mb-1">
						<Typography variant="body2" sx={{ color: theme => theme.palette.text.disabled }}>
							SEO
						</Typography>
					</Grid>
					<Grid item  xs={12} className="mb-1">
						<TextField
							name="seo-title"
							label="SEO Title"
							rules={{
								required: true,
							}}
						/>
					</Grid>

					<Grid item  xs={12} className="mb-1">
						<TextField
							name="seo-tagline"
							label="SEO Tagline"
							rules={{
								required: true,
							}}
							multiline={true}
							minRows={4}
						/>
					</Grid>
					<Grid item  xs={12} className="mb-2">
						<Typography variant="body2" sx={{ color: theme => theme.palette.text.disabled }}>
							Ownership
						</Typography>
					</Grid>
					<Grid item  xs={12} className="mb-1">
						<TextField
							name="copyright"
							label="Copyright"
							rules={{
								required: true,
							}}
						/>
					</Grid>
					<Grid item  xs={12} className="mb-1">
						<TextField
							name="trademark"
							label="Trademark"
							rules={{
								required: true,
							}}
						/>
					</Grid>
					<Grid item  xs={12} className="mb-2">
						<Typography variant="body2" sx={{ color: theme => theme.palette.text.disabled }}>
							Routing
						</Typography>
					</Grid>
					<Grid item  xs={12} className="mb-4">
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
