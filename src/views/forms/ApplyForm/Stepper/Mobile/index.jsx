/** @format */

import React, { useEffect, useCallback, useContext } from "react"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"
import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import MobileStepper from "@mui/material/MobileStepper"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import { useLocation, useSearchParams, useNavigate } from "react-router-dom"
import { useDidMount, useSetState, useDidUpdate } from "hooks"
import { Link } from "react-router-dom"
import { ApplyFormContext } from "../../index"
import { useDispatch, useSelector } from "react-redux"
import { useNetworkServices, useNotificationsQueue } from "contexts"
import VacancyDetails from "../../Sections/Vacancy"
import PersonalDetails from "../../Sections/PersonalDetails"
import LocationDetails from "../../Sections/Location"
import EducationDetails from "../../Sections/Education"
import ResumeDetails from "../../Sections/Resume"
import SourceChannelDetails from "../../Sections/SourceChannel"



const MobileStepperForm = React.forwardRef((props, ref) => {
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
	const { submit, TextField, Autocomplete, RadioGroup, values, setValue, resetValues, formState } = useContext(ApplyFormContext)
	console.log("MobileStepperForm applicationForm formState", formState)


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
			<Grid item xs={12} md={12} className="">

				<Paper
					square
					elevation={0}
					sx={{
						display: "flex",
						alignItems: "center",
						height: 50,
						pl: 2,
						bgcolor: "background.default",
					}}
				>
					<Typography variant="subtitle2" color="secondary">{steps[step]?.label}</Typography>
				</Paper>
			</Grid>
			<Grid item xs={12} md={12} className="px-4 mb-2">
				<Typography color="text.disabled" className="text-left" variant="body1">
					{steps[step].description}
				</Typography>
			</Grid>
			<Grid item xs={12} md={12} className="inline-block text-left px-4 py-4 min-h-1/3-screen">
				{stepsKeys[step] === "vacancy" && <VacancyDetails />}
				{stepsKeys[step] === "personal" && <PersonalDetails />}
				{stepsKeys[step] === "education" && <EducationDetails />}
				{stepsKeys[step] === "location" && <LocationDetails />}
				{stepsKeys[step] === "documents" && <ResumeDetails />}
				{stepsKeys[step] === "source" && <SourceChannelDetails />}
			</Grid>
			<Grid container spacing={4}>
				<Grid item xs={12}>
					<MobileStepper
						steps={steps.length}
						position="static"
						activeStep={step}
						backButton={
							<Button
								size="small"
								onClick={handleOnClickStep(step - 1)}
								disabled={step < 1}
							>
								{theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
								Back
							</Button>
						}
						nextButton={
							<Button
								size="small"
								onClick={handleOnClickStep(step + 1)}
								disabled={!formState.isValid}
							>
								Next
								{theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
							</Button>
						}
					/>
				</Grid>
			</Grid>
		</Grid>
	)
})

export default React.memo(MobileStepperForm)
