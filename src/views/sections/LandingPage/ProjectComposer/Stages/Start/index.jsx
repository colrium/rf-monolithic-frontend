/** @format */
import React, { useCallback, useRef, useEffect, useMemo } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";



import {
    StaticDateInput,
} from "components/FormInputs";
import { usePersistentForm, useSetState, useDidUpdate, useDidMount } from "hooks";

const stage = "start";

const Stage = (props) => {
    const { onSubmit, title, description } = props;
    const { trigger, register, Field, TextField, Select, getValues, resetValues, setValue, values, formState, submit } =
		usePersistentForm({ name: "projectcomposer", defaultValues: { stage: stage }, onSubmit: async (formData, e) => {
			if (Function.isFunction(onSubmit)) {
				onSubmit(formData, e)
			}
		} })
    const { isValid, isSubmitted } = formState;
    const stageValues = (JSON.getDeepPropertyValue(`stages.${ stage }`, (values || {})) || {});
    const complete_stages = useMemo((() => (JSON.getDeepPropertyValue(`complete_stages`, values)) || []), [values]);
    const complete_stagesRef = useRef(complete_stages);



	useDidMount(() => {
		// resetValues();
	});


    return (
		<GridContainer>
			<GridItem className="p-6 flex flex-row justify-end">
				{/* {!!title && <Typography variant="h1" className="flex-1">
                    {title}
                </Typography>} */}
				{/* <Button color="primary" variant="outlined">
                    Sign in
                </Button> */}
			</GridItem>
			{!!description && (
				<GridItem className="flex flex-col items-start py-8">
					<Typography variant="body2">{description}</Typography>
				</GridItem>
			)}
			<GridItem>
				<GridContainer>
					<GridItem md={6} className={"py-8"}>
						<TextField
							label="First Name"
							name={`stages.${stage}.first_name`}
							rules={{
								required: "Please enter your First Name.",
							}}
							variant={"filled"}
							required
							fullWidth
						/>
					</GridItem>
					<GridItem md={6} className={"py-8"}>
						<TextField
							label="Last Name"
							name={`stages.${stage}.last_name`}
							rules={{
								required: "Last Name is required.",
							}}
							variant={"filled"}
							required
							fullWidth
						/>
					</GridItem>
					<GridItem md={6} className={"py-8"}>
						<TextField
							label="Email"
							name={`stages.${stage}.email_address`}
							rules={{
								required: "Email is required.",
								validate: {
									pattern: val =>
										/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
											val
										) || "Invalid Email",
								},
							}}
							variant={"filled"}
							required
							fullWidth
						/>
					</GridItem>
					<GridItem md={6} className={"py-8"}>
						<TextField
							label="Phone"
							placeholder="(Country Code) Telephone"
							name={`stages.${stage}.phone`}
							rules={{
								required: "Phone is required.",
							}}
							variant={"filled"}
							required
							fullWidth
						/>
					</GridItem>

					<GridItem md={12} className={"py-8"}>
						<Select
							name={`stages.${stage}.survey_type`}
							label={"Survey Type"}
							defaultValue={stageValues.survey_type || "Qualititive"}
							options={{ Qualititive: "Qualititive", Quantitative: "Quantitative" }}
							sx={{ width: "100%" }}
							variant={"filled"}
							required
						/>
					</GridItem>

					<GridItem md={6} className={"py-8"}>
						<Field
							label="Start Date"
							name={`stages.${stage}.start_date`}
							defaultValue={stageValues?.start_date || new Date().addDays(7)}
							component={StaticDateInput}
							rules={{
								valueAsDate: true,
								deps: [`stages.${stage}.end_date`],
								validate: {
									isEmpty: v => Date.isDate(Date.parseFrom(v)) || "Start date is required ",
									isParseableDate: v => Date.isDate(Date.parseFrom(v)) || "Start date is not a parseable date ",
									isValidDate: v => {
										const end_date_value = Date.parseFrom(
											JSON.getDeepPropertyValue(`stages.${stage}.end_date`, getValues() || {}) || null
										)
										const start_date_value = Date.parseFrom(v, new Date())

										if (Date.isDate(start_date_value)) {
											let start_difference = start_date_value.difference(new Date())

											if (start_date_value < new Date() && !start_difference.same_day) {
												return "Start date cannot be in the past"
											}

											if (Date.isDate(end_date_value)) {
												start_difference = end_date_value.difference(start_date_value)
												// console.log("start_difference", start_difference)
												return (
													start_difference.type === "past" ||
													start_difference.same_day ||
													"Start date cannot be in the future of End date"
												)
											}
										}
										return Date.isDate(start_date_value) || "select a Date"
									},
								},
							}}
							required
						/>
					</GridItem>
					<GridItem md={6} className={"py-8"}>
						<Field
							label="End Date"
							name={`stages.${stage}.end_date`}
							defaultValue={stageValues?.end_date || new Date().addDays(14)}
							component={StaticDateInput}
							rules={{
								valueAsDate: true,
								deps: [`stages.${stage}.start_date`],
								validate: {
									isEmpty: v => Date.isDate(Date.parseFrom(v)) || "End date is required ",
									isParseableDate: v => Date.isDate(Date.parseFrom(v)) || "Start date is not a parseable date ",
									isValidDate: v => {
										const start_date_value = Date.parseFrom(
											JSON.getDeepPropertyValue(`stages.${stage}.start_date`, getValues() || {}) || null
										)
										const end_date_value = Date.parseFrom(v, new Date())

										if (Date.isDate(end_date_value)) {
											let start_difference = end_date_value.difference(new Date())

											if (end_date_value < new Date() && !start_difference.same_day) {
												return "End date cannot be in the past"
											}

											if (Date.isDate(start_date_value)) {
												start_difference = end_date_value.difference(start_date_value)
												// console.log("start_difference", start_difference)
												return (
													start_difference.type === "past" ||
													start_difference.same_day ||
													"Start date cannot be in the past of End date"
												)
											}
										}
										return Date.isDate(end_date_value) || "select a Date"
									},
								},
							}}
							required
						/>
					</GridItem>
				</GridContainer>
			</GridItem>

			<GridItem className="flex flex-col items-center py-20 mb-12">
				<Button onClick={submit} disabled={!isValid} color="accent" variant="contained">
					Ok. Ready to continue
				</Button>
			</GridItem>
		</GridContainer>
	)
}

export default Stage;
