/** @format */
import React, { useState } from "react";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import GridContainer from "components/Grid/GridContainer";
import Card from "components/Card";
import GridItem from "components/Grid/GridItem";
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
			<GridContainer className="px-8">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3">This website uses cookies</Typography>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<Typography variant="body2">{app.settings.legal["cookies-consent"]}</Typography>
				</GridItem>

				<GridContainer className="px-0">

					<GridItem xs={12} className="mb-2">
						<Checkbox
							name="necessary"
							label="Necessary"
						/>
					</GridItem>

					<GridItem xs={12} className="mb-2">
						<Checkbox
							name="statistics"
							label="Statistics"
						/>
					</GridItem>

					<GridItem xs={12} className="mb-2">
						<Checkbox
							name="preferences"
							label="Preferences"
						/>
					</GridItem>

					<GridItem xs={12} className="mb-2">
						<Checkbox
							name="marketing"
							label="Marketing"
						/>
					</GridItem>


				</GridContainer>

			</GridContainer>
		</Card>
	);
}
const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
});

export default (connect(mapStateToProps, {})(React.memo(Widget)));
