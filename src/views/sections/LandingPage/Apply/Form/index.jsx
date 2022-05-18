/** @format */

import React, { useEffect } from "react"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepContent from "@mui/material/StepContent"
import StepLabel from "@mui/material/StepLabel"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { useLocation, useSearchParams, useNavigate } from "react-router-dom"
import { usePersistentForm, useDidMount, useSetState, useDidUpdate } from "hooks"
import { Link } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { useNetworkServices, useNotificationsQueue } from "contexts"
import VacancyDetails from "./Vacancy"
import PersonalDetails from "./PersonalDetails"
import LocationDetails from "./Location"
import EducationDetails from "./Education"
import ResumeDetails from "./Resume"
import SourceChannelDetails from "./SourceChannel"

const steps = {
	vacancy: "Vacancy",
	personal: "Personal",
	location: "Location",
	education: "Education",
	resume: "Resume",
	source: "Source"
}

const stepsDescriptions = {
	vacancy: "From the available positions below, select the one that best suits your interests. All job applications made here are anonymous and applicant's user account crredentials will be sent upon successful shortlisting, validation and qualification.",
	personal: "Tell us a little about yourself",
	location: "Add your administrative boundary details",
	education: "Whats your education details",
	resume: "Please upload your resume/CV or any other relevant proffessional documents",
	source: "How did you hear about us",
}

const stepsKeys = Object.keys(steps)

const ApplicationForm = React.forwardRef((props, ref) => {
	const {onSubmitSuccess, onSubmitError, ...rest } = props || {}
	const [searchParams, setSearchParams] = useSearchParams()
	const authSettings = useSelector(state => ({ ...state?.app.settings?.auth }))
	const { Api } = useNetworkServices()
	const { queueNotification } = useNotificationsQueue()
	const { hash, pathname } = useLocation()
	const navigate = useNavigate()

	const [state, setState, getState] = useSetState({
		active_tab: stepsKeys.indexOf(hash ? hash.replace("#", "").trim().toLowerCase() : "vacancy")
	})

	const { submit, TextField, Autocomplete, RadioGroup, values, setValue, resetValues, formState } = usePersistentForm({
		name: `job-application-form`,
		mode: "onChange",
		reValidateMode: "onChange",
		// volatile: true,
		defaultValues: { country: "KE" },
		onSubmit: async (formData, e) => {
			const { active_tab } = getState()
			if (active_tab < stepsKeys.length - 1) {
				// setState({ active_tab: active_tab + 1 })
				navigate(`${pathname}#${stepsKeys[active_tab + 1]}`)
			}
			else {
				return await Api.post("/recruitment/applications", formData)
					.then(res => {
						resetValues()
						queueNotification({
							severity: "success",
							content: `Application subbmitted successfully!`,
						})
						if (Function.isFunction(onSubmitSuccess)) {
							onSubmitSuccess(err)
						}
					})
					.catch(err => {
						queueNotification({
							severity: "error",
							content: `Error submitting Application. ${err.msg || "Something went wrong!"}`,
						})
						if (Function.isFunction(onSubmitError)) {
							onSubmitError(err)
						}
					})
			}

		},
	})

	useEffect(() => {
		if (!String.isEmpty(hash)) {
			setState({ active_tab: stepsKeys.indexOf(hash.replace("#", "").trim().toLowerCase()) })
		} else {
			setState({ active_tab: stepsKeys.indexOf("vacancy") })
		}
	}, [hash])

	const handleOnTabChange = (event, newValue) => {
		// setState({ active_tab: newValue })
		navigate(`${pathname}#${newValue}`)
	}


	return (
		<Grid container {...rest} component="form" onSubmit={submit} ref={ref}>
			<Grid item xs={12} md={12} className="inline-block text-left px-4 md:px-20 lg:px-32">
				<Stepper activeStep={state.active_tab}>
					{Object.entries(steps).map(([key, label], index) => (
						<Step key={key}>
							<StepLabel
								optional={
									<Typography color="text.disabled" variant="caption">
										{stepsDescriptions[stepsKeys[key]]}
									</Typography>
								}
							>
								{label}
							</StepLabel>
						</Step>
					))}
				</Stepper>
			</Grid>
			<Grid item xs={12} md={12} className="inline-block text-left py-8 px-4 md:px-20 lg:px-32">
				<Typography color="text.disabled" variant="body1">
					{stepsDescriptions[stepsKeys[state.active_tab]]}
				</Typography>
			</Grid>
			<Grid item xs={12} md={12} className="inline-block text-left px-4 md:px-20 lg:px-32 min-h-1/3-screen">
				{stepsKeys[state.active_tab] === "vacancy" && <VacancyDetails />}
				{stepsKeys[state.active_tab] === "personal" && <PersonalDetails />}
				{stepsKeys[state.active_tab] === "education" && <EducationDetails />}
				{stepsKeys[state.active_tab] === "location" && <LocationDetails />}
				{stepsKeys[state.active_tab] === "resume" && <ResumeDetails />}
				{stepsKeys[state.active_tab] === "source" && <SourceChannelDetails />}
			</Grid>
			<Grid container spacing={4}>
				<Grid item xs={12} className="flex flex-row px-4 md:px-20 lg:px-32 justify-between items-center my-8">
					<Button
						className="capitalize rounded-full px-8 mx-8"
						variant={`text`}
						color="secondary"
						onClick={() => navigate(`${pathname}#${stepsKeys[state.active_tab - 1]}`)}
						disabled={state.active_tab < 1 || !formState.isValid || formState.isSubmitting}
						startIcon={<ArrowBackIcon />}
					>
						Previous
					</Button>
					{state.active_tab === stepsKeys.length - 1 && (
						<LoadingButton
							disabled={!formState.isValid || formState.isSubmitting}
							loading={formState.isSubmitting}
							className="capitalize rounded-full px-8"
							variant={`${"contained"}`}
							sx={
								{
									// color: theme => theme.palette.text.primary,
									// backgroundColor: theme => theme.palette.background.paper,
								}
							}
							type="submit"
						>
							Submit
						</LoadingButton>
					)}
					{state.active_tab < stepsKeys.length - 1 && (
						<Button
							className="capitalize rounded-full px-8 mx-8"
							variant={`text`}
							color="primary"
							onClick={() => navigate(`${pathname}#${stepsKeys[state.active_tab + 1]}`)}
							disabled={!formState.isValid || formState.isSubmitting}
							endIcon={<ArrowForwardIcon />}
						>
							Previous
						</Button>
					)}
				</Grid>
			</Grid>
		</Grid>
	)
})

export default React.memo(ApplicationForm)
