/** @format */
import React from "react";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import { RadioInput, SelectInput } from "components/FormInputs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"
import { locales } from "config";


function Widget({ preferences }) {

	const {
		RadioGroup,
		Autocomplete,
		values,
		formState: { errors },
	} = usePersistentForm({
		name: "default-preferences",
		volatile: true,
		defaultValues: {
			theme: preferences.theme || "light",
			locale: preferences.locale || "en",
		},
	})


	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			EventRegister.emit("change-preferences", { ...values })
		}
	}, [values])


	return (
		<GridContainer className="px-2">
			<GridItem xs={12} className="mb-2">
				<Typography variant="h3"> Preferences</Typography>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<RadioGroup
					name="theme"
					label="Theme"
					options={{ light: "Light", dark: "Dark" }}
					rules={{
						required: true,
					}}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<Autocomplete
					name="locale"
					label="Locale"
					options={locales}
					rules={{
						required: true,
					}}
				/>
			</GridItem>
		</GridContainer>
	)
}
const mapStateToProps = state => ({
	preferences: state.app.preferences || {},
})

export default (connect(mapStateToProps, {})(React.memo(Widget)));
