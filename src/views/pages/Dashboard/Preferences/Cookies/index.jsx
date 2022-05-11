/** @format */
import React, { useState } from "react";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import Card from "components/Card";
;
import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"



function Widget(props) {

	const { app } = props;
	let preferences = app.preferences.cookies
	const {
		Checkbox,
		values,
		formState: { errors },
	} = usePersistentForm({
		name: "cookies-preferences",
		volatile: true,
		defaultValues: {
			...preferences,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-preferences", { cookies: { ...preferences, ...values } })
		}
	}, [values])



	return (
		<Card>
			<Grid container className="px-8">
				<Grid item  xs={12} className="mb-2">
					<Typography variant="h3">This website uses cookies</Typography>
				</Grid>

				<Grid item  xs={12} className="mb-2">
					<Typography variant="body2">{app.settings.legal["cookies-consent"]}</Typography>
				</Grid>

				<Grid container className="px-0">

					<Grid item  xs={12} className="mb-2">
						<Checkbox
							name="necessary"
							label="Necessary"
						/>
					</Grid>

					<Grid item  xs={12} className="mb-2">
						<Checkbox
							name="statistics"
							label="Statistics"
						/>
					</Grid>

					<Grid item  xs={12} className="mb-2">
						<Checkbox
							name="preferences"
							label="Preferences"
						/>
					</Grid>

					<Grid item  xs={12} className="mb-2">
						<Checkbox
							name="marketing"
							label="Marketing"
						/>
					</Grid>


				</Grid>

			</Grid>
		</Card>
	);
}
const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
});

export default (connect(mapStateToProps, {})(React.memo(Widget)));
