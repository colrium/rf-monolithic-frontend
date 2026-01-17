/** @format */

import React from "react"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { useDerivedState } from "hooks"
import { useNetworkServices, useNotificationsQueue } from "contexts"
import { usePersistentForms } from "contexts"

const ApplicationForm = React.forwardRef((props, ref) => {

	const { submit, TextField, Autocomplete, RadioGroup, values, setValue, resetValues, formState } =  usePersistentForms("job-application-form")
	const { queueNotification } = useNotificationsQueue()
	const { Api } = useNetworkServices()



	const [vacancyData] = useDerivedState(
		async () => {
			let options = await Api.get("/recruitment/vacancies")
					.then(res => {
						let vacancies = Array.isArray(res?.body?.data) ? res.body.data : []
						let possibilitiesData = vacancies.reduce((acc, cur) => {
							acc[cur._id] = cur.title || cur.position
							return acc
						}, {})
						return possibilitiesData
					})
					.catch(err => {
						queueNotification({
							severity: "error",
							content: `Error getting vacancies. ${err.msg || "Something went wrong!"}`,
						})
						return {}
					})

			const optionsKeys = Object.keys(options) || []
			const firstKey = optionsKeys[0] || null

			return {
				label: "Vacancy",
				options: options,
				disabled: false,
				loading: false
			}
		},
		[],
		{ label: "Vacancy", options: {}, value: null, disabled: true, loading: true  },
	)

	return (
		<Grid container {...props} component="div" ref={ref}>
			<Grid spacing={4} container>
				<Grid item xs={12} md={12} className="inline-block text-left">
					<Autocomplete
							variant="filled"
							name={`vacancy`}
							label="Vacancy"
							placeholder="Select Vacancy"
							rules={{
								required: "Vacancy is required.",
							}}
							{...vacancyData}
							fullWidth
							required
							validate
						/>
					{/* <RadioGroup
						name={`vacancy`}
						label="Vacancy"
						rules={{
							required: "Vacancy is required.",
						}}
						{...vacancyData}
						required
						validate
					/> */}
				</Grid>
			</Grid>
		</Grid>
	)
})

export default React.memo(ApplicationForm)
