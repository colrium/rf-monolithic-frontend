/** @format */
import React from "react"
import { connect } from "react-redux";
import { Typography } from "@mui/material";
import GridContainer from "components/Grid/GridContainer";
import Card from "components/Card";
import GridItem from "components/Grid/GridItem";
import { EventRegister } from "utils"
import { usePersistentForm, useDidUpdate } from "hooks"

function Widget (props) {
	const { preferences } = props;
	const { TextField, Autocomplete, values, formState: {errors} } = usePersistentForm({
		name: "data-preferences",
		volatile: true,
		defaultValues: {
			pagination: 10,
			defaultMapZoom: 15,
			...preferences.data
		},
	})

	useDidUpdate(() => {
		if (JSON.isEmpty(errors)) {
			let data_values = { ...values }
			data_values.pagination = parseInt(data_values.pagination)
			data_values.defaultMapZoom = parseInt(data_values.defaultMapZoom)
			EventRegister.emit("change-preferences", { data: data_values })
		}

	}, [values])


	return (
		<Card elevation={0}>
			<GridContainer className="px-2">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3">
						Display and Visualization
					</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-2">
						<Typography variant="h5">Data</Typography>
					</GridItem>
					<GridItem xs={12} className="mb-2">
						<Autocomplete
							name="pagination"
							label="Records per Page"
							type="number"
							options={{
								5: "5",
								10: "10",
								25: "25",
								50: "50",
								100: "100",
								250: "250",
								500: "500",
								"-1": "All",
							}}
							rules={{
								validate: {
									isSet: val =>
										val === "-1" ||
										val >= 5 ||
										"Value is Required",
								},
							}}
						/>
					</GridItem>

					<GridItem xs={12} className="mb-4">
						<TextField
							name="defaultMapZoom"
							label="Default Map Zoom"
							type="number"
							rules={{
								validate: {
									isAboveMin: val =>
										val >= 5 ||
										"Value should be greater than or equal to 5 ",
									isBelowMax: val =>
										val <= 25 ||
										"Value should be greater than or equal to 5 ",
								},
								valueAsNumber: true,
							}}
						/>
					</GridItem>
				</GridContainer>
			</GridContainer>
		</Card>
	)
}
const mapStateToProps = state => ({
	preferences: state.app.preferences || {},
})

export default connect(mapStateToProps, {})(React.memo(Widget));
