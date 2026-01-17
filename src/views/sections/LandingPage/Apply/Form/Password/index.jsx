/** @format */

import React, { useCallback } from "react"
import Snackbar from "@mui/material/Snackbar"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"
import Alert from "@mui/material/Alert"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"

import { useSearchParams, useNavigate } from "react-router-dom"
import { usePersistentForm, useDidMount, useSetState } from "hooks"
import { Link } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { useNetworkServices, useNotificationsQueue } from "contexts"
import { GoogleLoginButton } from "views/forms/Auth/OAuth"
const steps = {
	vacancy: "Select Vacancy",
	personal: "Personal Details",
	contact: "Contact Details",
	location: "Contact Details",
}
const ApplicationForm = React.forwardRef((props, ref) => {
	const { onSubmit, ...rest } = props || {}

	const { Api } = useNetworkServices()
	const { queueNotification } = useNotificationsQueue()

	const [state, setState] = useSetState({
		options: {},
		loading: false,
		vacancies: [],
	})

	const { submit, TextField, Autocomplete, RadioGroup, getValues, setValue, resetValues, formState } = usePersistentForm({
		name: `job-application-form`,
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: { country: "KE" },
		onSubmit: async (formData, e) => {
			if (Function.isFunction(onSubmit)) {
				onSubmit(formData, e)
			}
		},
	})

	useDidMount(() => {
		setState({ loading: true })
		Api.get("/recruitment/vacancies")
			.then(res => {
				let vacancies = Array.isArray(res?.body?.data) ? res.body.data : []
				let options = vacancies.reduce((acc, cur) => {
					acc[cur._id] = cur.title || cur.position
					return acc
				}, {})

				console.error("ApplicationForm options", options)
				setState({ vacancies: vacancies, options: options, loading: false })
			})
			.catch(err => {
				queueNotification({
					severity: "error",
					content: `Error getting vacancies. ${err.msg || "Something went wrong!"}`,
				})
				setState({ loading: false, options: {}, vacancies: [] })
			})
	})

	return (
		<Grid container {...rest} component="div" ref={ref}>
			<Grid item xs={12} md={6} className="">
				<TextField
					type="password"
					variant="filled"
					name={`password`}
					label="Password"
					placeholder="Password"
					rules={{
						required: "Password is required.",
					}}
					size="small"
					fullWidth
					required
					validate
				/>
			</Grid>
			<Grid item xs={12} md={6} className="">
				<TextField
					type="password"
					variant="filled"
					name={`repeat_password`}
					label="Repeat Password"
					placeholder="Confirm Password"
					rules={{
						required: "Password is required.",
						deps: [`password`],
						validate: {
							matchesPassword: val => getValues().password === val || "Should match password",
						},
					}}
					size="small"
					fullWidth
					required
					validate
				/>
			</Grid>
		</Grid>
	)
})

export default React.memo(ApplicationForm)
