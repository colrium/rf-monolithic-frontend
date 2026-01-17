/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"

import { EventRegister } from "utils"
import { usePersistentForm, useDidMount } from "hooks"

function Widget(props) {
	const settings = useSelector(state => ({ ...state?.app?.legal }))
	const {
		TextField,
		WysiwygEditor,
		observer$,
		setValue,
		formState: { errors },
	} = usePersistentForm({
		name: "legal-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})
	useDidMount(() => {
		const subscription = observer$.subscribe(formData => {
			if (JSON.isEmpty(formData.errors)) {
				EventRegister.emit("change-settings", {
					legal: { ...settings, ...formData.values },
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
							Legal
						</Typography>
					</Grid>

					<Grid item xs={12} className="mb-1">
						<WysiwygEditor name="terms-of-use" label="Terms of use" multiline={true} minRows={4} />
					</Grid>

					<Grid item xs={12} className="mb-1">
						<TextField
							name="end-user-agreement"
							variant="filled"
							size="small"
							margin="dense"
							label="End user agreement"
							multiline={true}
							minRows={4}
						/>
					</Grid>
					<Grid item xs={12} className="mb-1">
						<TextField
							name="privacy-policy"
							variant="filled"
							size="small"
							margin="dense"
							label="Privacy policy"
							multiline={true}
							minRows={8}
						/>
					</Grid>

					<Grid item xs={12} className="mb-1">
						<TextField
							name="cookies-consent"
							variant="filled"
							size="small"
							margin="dense"
							label="Cookies consent"
							multiline={true}
							minRows={8}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}

export default React.memo(Widget)
