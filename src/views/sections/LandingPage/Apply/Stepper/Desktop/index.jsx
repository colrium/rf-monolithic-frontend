/** @format */

import React, { useEffect, useCallback } from "react"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"
import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
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
import { useNetworkServices, useNotificationsQueue, usePersistentForms } from "contexts"

import VacancyDetails from "../../Form/Vacancy"
import PersonalDetails from "../../Form/PersonalDetails"
import LocationDetails from "../../Form/Location"
import EducationDetails from "../../Form/Education"
import ResumeDetails from "../../Form/Resume"
import SourceChannelDetails from "../../Form/SourceChannel"



const DesktopStepperForm = React.forwardRef((props, ref) => {
	const { onClickStep, steps={}, step, ...rest } = props || {}
	const theme = useTheme()
	const [searchParams, setSearchParams] = useSearchParams()
	const authSettings = useSelector(state => ({ ...state?.app.settings?.auth }))
	const { Api } = useNetworkServices()
	const { queueNotification } = useNotificationsQueue()
	const { hash, pathname } = useLocation()
	const navigate = useNavigate()
	const stepsKeys = steps.reduce((acc, curr) => acc.concat([curr.key]), [])
	const stepsDescriptions = steps.reduce((acc, curr) => {
		acc[curr.key] = curr.description
		return acc
	}, {})

	const applicationForm = usePersistentForms("job-application-form")
	const { submit, TextField, Autocomplete, RadioGroup, values, setValue, resetValues, formState } = applicationForm



	const handleOnClickStep = useCallback(
		(index) => event => {
			if (Function.isFunction(onClickStep)) {
				onClickStep(event, index)
			}
		},
		[onClickStep, step]
	)

	return (
		<Grid container {...rest} component="form" onSubmit={submit} ref={ref}>
			<Grid item xs={12} md={12} className="inline-block text-left px-4 md:px-20 lg:px-32">
				<Stepper activeStep={step}>
					{steps.map(({ key, label, description }, index) => (
						<Step key={key}>
							<StepLabel className={`cursor-pointer`} onClick={handleOnClickStep(index)}>
								{label}
							</StepLabel>
						</Step>
					))}
				</Stepper>
			</Grid>
			<Grid item xs={12} md={12} className="inline-block text-left py-8 px-4 md:px-20 lg:px-32">
				<Typography color="text.disabled" variant="body1">
					{stepsDescriptions[stepsKeys[step]]}
				</Typography>
			</Grid>
			<Grid item xs={12} md={12} className="inline-block text-left px-4 md:px-20 lg:px-32 min-h-1/3-screen">
					{stepsKeys[step] === "vacancy" && <VacancyDetails />}
					{stepsKeys[step] === "personal" && <PersonalDetails />}
					{stepsKeys[step] === "education" && <EducationDetails />}
					{stepsKeys[step] === "location" && <LocationDetails />}
					{stepsKeys[step] === "documents" && <ResumeDetails />}
					{stepsKeys[step] === "source" && <SourceChannelDetails />}
			</Grid>
			<Grid container spacing={4}>
				<Grid item xs={12} className="flex flex-row px-4 md:px-20 lg:px-32 justify-between items-center my-8">
					<Button
						className="capitalize rounded-full px-8 mx-8"
						variant={`text`}
						color="secondary"
						onClick={handleOnClickStep(step - 1)}
						disabled={step < 1 || formState.isSubmitting}
						startIcon={<ArrowBackIcon />}
					>
						Previous
					</Button>
					{step === stepsKeys.length - 1 && (
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
					{step < stepsKeys.length - 1 && (
						<Button
							className="capitalize rounded-full px-8 mx-8"
							variant={`text`}
							color="primary"
							onClick={handleOnClickStep(step + 1)}
							disabled={!formState.isValid || formState.isSubmitting}
							endIcon={<ArrowForwardIcon />}
						>
							Next
						</Button>
					)}
				</Grid>
			</Grid>
		</Grid>
	)
})

export default React.memo(DesktopStepperForm)
