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
	const { app } = props
	let preferences = app.preferences.subscriptions
	const {
		Checkbox,
		values,
		formState: { errors },
	} = usePersistentForm({
		name: "subscriptions-preferences",
		volatile: true,
		defaultValues: {
			...preferences,
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-preferences", {
				subscriptions: { ...preferences, ...values },
			})
		}
	}, [values])

	return (
		<Card>
			<GridContainer className="px-8">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3">Subscriptions</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-2">
						<Checkbox
							name="newsletter"
							label="Newsletter"
						/>
					</GridItem>

					<GridItem xs={12} className="mb-2">
						<Checkbox
							name="posts"
							label="Blog posts"
						/>
					</GridItem>

					<GridItem xs={12} className="mb-2">
						<Checkbox
							name="updates"
							label="Updates"
						/>
					</GridItem>
				</GridContainer>
			</GridContainer>
		</Card>
	)
}
const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
});

export default (connect(mapStateToProps, {})(React.memo(Widget)));
