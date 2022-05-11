/** @format */
import React from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import Grid from '@mui/material/Grid'
import Card from "components/Card"

import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"

function Widget(props) {
	const settings = useSelector(state => ({ ...state?.app?.legal }))
	const {
		TextField,
		WysiwygEditor,
		values,
		setValue,
		formState: { errors },
	} = usePersistentForm({
		name: "legal-settings",
		volatile: true,
		defaultValues: {
			...settings,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-settings", {
				legal: { ...settings, ...values },
			})
		}
	}, [values])

	return (
		<Card>
			<Grid container className="px-8">
				<Grid item  xs={12} className="mb-2">
					<Typography variant="h3" sx={{ color: theme => theme.palette.text.disabled }}>
						Legal
					</Typography>
				</Grid>

				<Grid container className="px-0">
					<Grid item  xs={12} className="mb-1">
						<WysiwygEditor name="terms-of-use" label="Terms of use" multiline={true} minRows={4} />
					</Grid>

					<Grid item  xs={12} className="mb-1">
						<TextField name="end-user-agreement" label="End user agreement" multiline={true} minRows={4} />
					</Grid>
					<Grid item  xs={12} className="mb-1">
						<TextField name="privacy-policy" label="Privacy policy" multiline={true} minRows={8} />
					</Grid>

					<Grid item  xs={12} className="mb-1">
						<TextField name="cookies-consent" label="Cookies consent" multiline={true} minRows={8} />
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
}

export default React.memo(Widget)
