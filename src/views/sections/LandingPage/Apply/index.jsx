import React, { useEffect, useCallback } from "react";

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Section from "components/Section";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom"
import { usePersistentForm, useDidMount, useSetState, useDidUpdate } from "hooks"
import { useTheme } from "@mui/material/styles"
import { useNetworkServices, useNotificationsQueue, PersistentFormsProvider } from "contexts"
import { useDispatch, useSelector } from "react-redux"
import ApplicationForm from "./Form"
import StepperForm from "./Stepper"
import steps from "./steps.json"
const stepsKeys = steps.reduce((acc, curr) => acc.concat([curr.key]), [])
const stepsDescriptions = steps.reduce((acc, curr) => {
	acc[curr.key] = curr.description
	return acc
}, {})
const SectionComponent = props => {
	const [searchParams, setSearchParams] = useSearchParams()
	const theme = useTheme()
	const authSettings = useSelector(state => ({ ...state?.app.settings?.auth }))
	const { Api } = useNetworkServices()
	const { queueNotification } = useNotificationsQueue()
	const { hash, pathname } = useLocation()
	const navigate = useNavigate()
	const [state, setState, getState] = useSetState({
		active_step: stepsKeys.indexOf(hash ? hash.replace("#", "").trim().toLowerCase() : "vacancy"),
		content: "form",
	})
	const formConfig = {
		name: `job-application-form`,
		mode: "onChange",
		reValidateMode: "onChange",
		// volatile: true,
		defaultValues: { country: "KE", dob: new Date().setFullYear(new Date().getFullYear() - 18) },
		onSubmit: async (formData, e) => {
			const { active_step } = getState()
			if (active_step < stepsKeys.length - 1) {
				// setState({ active_step: active_step + 1 })
				navigate(`${pathname}#${stepsKeys[active_step + 1]}`)
			} else {
				return await Api.post("/recruitment/applications", formData)
					.then(res => {
						queueNotification({
							severity: "success",
							content: `Application subbmitted successfully!`,
						})
						navigate(`${pathname}`)
						setState({content: "acknowledgement"})
					})
					.catch(err => {
						queueNotification({
							severity: "error",
							content: `Error submitting Application. ${err.msg || "Something went wrong!"}`,
						})
					})
			}
		},
	}
	useEffect(() => {
		if (!String.isEmpty(hash)) {
			setState({ active_step: stepsKeys.indexOf(hash.replace("#", "").trim().toLowerCase()) })
		} else {
			navigate(`${pathname}#vacancy`)
		}
	}, [hash])

	const handleOnClickStep = useCallback(
		(event, index) => {
			console.log("handleOnClickStep", index)
			const { active_step } = getState()
			const key = stepsKeys[index]
				navigate(`${pathname}#${key}`)

		},
		[pathname]
	)

	return (
		<Section id="jobs-apply" {...props}>
			<Grid container className={"p-0"}>
				<Grid item xs={12} className={"p-0"}>
					<Grid container className={"p-0"}>
						<Grid item xs={12} sm={12} className={"p-0 pt-8 pb-4"}>
							<Typography variant="h3">Fielder Registration</Typography>
						</Grid>
					</Grid>

					<Grid container className={"p-0"}>
						<Grid item xs={12} sm={12} className={"p-0 py-2 pb-4"}>
							<Typography variant="subtitle2">
								It’s great to meet you! Please complete all fields required within the form below to register your interest
								in becoming a Real Fielder. All applications will be reviewed, and you will be contacted by our Team with
								further details. Thanks! We look forward to working with you soon!
							</Typography>
						</Grid>
					</Grid>

					<Grid container className={"p-0"}>
						{state.content === "form" && (
							<Grid item xs={12} className={"p-0 flex justify-center items-center text-center py-16"}>
								{/* <Typography variant="h3" className="text-center" color="text.disabled">
									We are temporarily not accepting applications. Please check back again soon!
								</Typography> */}
								<PersistentFormsProvider config={formConfig}>
									<StepperForm steps={steps} step={state.active_step} onClickStep={handleOnClickStep} />
								</PersistentFormsProvider>

							</Grid>
						)}

						{state.content === "acknowledgement" && (
							<Grid item xs={12} className={"p-0 py-48 flex flex-col justify-center items-center"}>
								<Typography variant="subtitle1" color="primary" paragraph>
									Your application has been submitted successfully. Thankyou for your interest in working with us.
								</Typography>
								<Typography variant="body1" paragraph>
									A member of our will get in touch with you about your application as soon as possible{" "}
								</Typography>
							</Grid>
						)}
					</Grid>
				</Grid>
			</Grid>
		</Section>
	)
}


export default (SectionComponent);
