/** @format */

import React, { useContext } from "react"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import { ApplyFormContext } from "../../../ApplyForm"
import { useDerivedState } from "hooks"
import { useNotificationsQueue, useNetworkServices } from "contexts"
let contryCodeNames = {
	ET: "Ethiopia",
	KE: "Kenya",
	RW: "Rwanda",
	TZ: "Tanzania",
	UG: "Uganda",
}

const ApplicationForm = React.forwardRef((props, ref) => {
	const { submit, TextField, Field, Autocomplete, RadioGroup, getValues, setValue, resetValues, formState } = useContext(ApplyFormContext)
	const values = getValues()
	const { Api } = useNetworkServices()
	const { queueNotification } = useNotificationsQueue()

	const [adminLevel1Data] = useDerivedState(
		async prevState => {
			let adminLevelLabel = "Region/County/Province"
			let adminLevelOptions = {}

			if (!String.isEmpty(values?.country)) {
				if (prevState.updated) {
					setValue(`administrative_level_2`, null)
					setValue(`administrative_level_3`, null)
				}

				adminLevelOptions = await Api.get("/geography/boundaries", {
					params: {
						admin_level_0: contryCodeNames[values.country],
						pagination: "-1",
						admin_level: 1,
						fields: "name,admin_level_type",
					},
				})
					.then(res => {
						let possibilitiesData = {}
						if (Array.isArray(res?.body?.data)) {
							let administrativeLevelLabelSet = false
							possibilitiesData = res.body.data.reduce((acc, curr) => {
								acc[curr.name] = curr.name
								if (!administrativeLevelLabelSet) {
									adminLevelLabel = curr.admin_level_type
									administrativeLevelLabelSet = true
								}
								return acc
							}, {})
						}

						return possibilitiesData
					})
					.catch(err => {
						console.log("Location Details err", err)
						return {}
					})
			}
			const optionsKeys = Object.keys(adminLevelOptions) || []
			const firstKey = optionsKeys[0] || null

			return {
				label: adminLevelLabel,
				options: adminLevelOptions,
				// defaultValue: firstKey,
				disabled: false,
				loading: false,
				updated: true,
			}
		},
		[values.country],
		{ label: "Region/County/Province", options: {}, disabled: true, loading: true, loaded: false }
	)

	const [adminLevel2Data] = useDerivedState(
		async prevState => {
			let adminLevelLabel = "Sub County/Sub Region/District"
			let adminLevelOptions = {}

			if (!String.isEmpty(values.country) && !String.isEmpty(values.administrative_level_1)) {
				if (prevState.updated) {
					setValue(`administrative_level_3`, null)
				}
				adminLevelOptions = await Api.get("/geography/boundaries", {
					params: {
						admin_level_0: contryCodeNames[values.country],
						admin_level_1: values.administrative_level_1,
						pagination: "-1",
						admin_level: 2,
						fields: "name,admin_level_type",
					},
				})
					.then(res => {
						let possibilitiesData = {}
						if (Array.isArray(res?.body?.data)) {
							let administrativeLevelLabelSet = false
							possibilitiesData = res.body.data.reduce((acc, curr) => {
								acc[curr.name] = curr.name
								if (!administrativeLevelLabelSet) {
									adminLevelLabel = curr.admin_level_type
									administrativeLevelLabelSet = true
								}

								return acc
							}, {})
						}

						return possibilitiesData
					})
					.catch(err => {
						return {}
					})
			}
			const optionsKeys = Object.keys(adminLevelOptions) || []
			const firstKey = optionsKeys[0] || null

			return {
				label: adminLevelLabel,
				options: adminLevelOptions,
				disabled: false,
				loading: false,
				updated: true,
			}
		},
		[values.country, values.administrative_level_1],
		{ label: "Sub County/Sub Region/District", options: {}, disabled: true, loading: true }
	)

	const [adminLevel3Data] = useDerivedState(
		async () => {
			let adminLevelLabel = "Sub County/Sub Region/District"
			let adminLevelOptions = {}

			if (
				!String.isEmpty(values.country) &&
				!String.isEmpty(values.administrative_level_1) &&
				!String.isEmpty(values.administrative_level_2)
			) {
				adminLevelOptions = await Api.get("/geography/boundaries", {
					params: {
						admin_level_0: contryCodeNames[values.country],
						admin_level_1: values.administrative_level_1,
						admin_level_2: values.administrative_level_2,
						pagination: "-1",
						admin_level: 3,
						fields: "name,admin_level_type",
					},
				})
					.then(res => {
						let possibilitiesData = {}
						if (Array.isArray(res?.body?.data)) {
							let administrativeLevelLabelSet = false
							possibilitiesData = res.body.data.reduce((acc, curr) => {
								acc[curr.name] = curr.name
								if (!administrativeLevelLabelSet) {
									adminLevelLabel = curr.admin_level_type
									administrativeLevelLabelSet = true
								}
								return acc
							}, {})
						}

						return possibilitiesData
					})
					.catch(err => {
						return {}
					})
			}
			const optionsKeys = Object.keys(adminLevelOptions) || []
			const firstKey = optionsKeys[0] || null

			return {
				label: adminLevelLabel,
				options: adminLevelOptions,
				updated: true,
				disabled: false,
				loading: false,
			}
		},
		[values.country, values.administrative_level_1, values.administrative_level_2],
		{ label: "Ward/Locality/Municipality", options: {}, disabled: true, loading: true }
	)

	return (
		<Grid container spacing={4} {...props} component="div" ref={ref}>
			<Grid item xs={12} md={6} className="">
				<Autocomplete
					variant="filled"
					name={`country`}
					label="Country"
					placeholder="Country"
					rules={{
						required: "Country is required.",
					}}
					options={{
						ET: "Ethiopia",
						KE: "Kenya",
						RW: "Rwanda",
						TZ: "Tanzania",
						UG: "Uganda",
					}}
					size="small"
					margin="dense"
					fullWidth
					required
					validate
				/>
			</Grid>

			<Grid item xs={12} md={6} className="">
				<Autocomplete
					variant="filled"
					name={`administrative_level_1`}
					placeholder={`Select your ${adminLevel1Data.label || "Administrative level 1"}.`}
					rules={{
						required: `${adminLevel1Data.label} is required.`,
						// deps: [`country`],
					}}
					{...adminLevel1Data}
					size="small"
					margin="dense"
					fullWidth
					required
					validate
				/>
			</Grid>

			<Grid item xs={12} md={6} className="">
				<Autocomplete
					variant="filled"
					name={`administrative_level_2`}
					placeholder={`Select your ${adminLevel2Data.label || "Administrative level 2"}.`}
					rules={{
						required: `${adminLevel2Data.label} is required.`,
						// deps: [`country`],
					}}
					{...adminLevel2Data}
					size="small"
					margin="dense"
					fullWidth
					required
					validate
				/>
			</Grid>

			<Grid item xs={12} md={6} className="">
				<Autocomplete
					variant="filled"
					name={`administrative_level_3`}
					placeholder={`Select your ${adminLevel3Data.label || "Administrative level 3"}.`}
					rules={{
						required: `${adminLevel3Data.label} is required.`,
						// deps: [`country`],
					}}
					{...adminLevel3Data}
					size="small"
					margin="dense"
					fullWidth
					required
					validate
				/>
			</Grid>
		</Grid>
	)
})

export default React.memo(ApplicationForm)
