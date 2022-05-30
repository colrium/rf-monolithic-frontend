/** @format */
import React, { useCallback, useMemo, useRef } from "react"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

import FileDropZone from "components/FileDropZone"

import { usePersistentForm } from "hooks"

const stage = "scope"

const Stage = props => {
	const { onSubmit, title, description } = props

	const { submit, FilePicker, RadioGroup, setValue, getValues, formState } = usePersistentForm({
		name: "projectcomposer",
		defaultValues: { stage: stage },
		onSubmit: async (formData, e) => {
			if (Function.isFunction(onSubmit)) {
				onSubmit(formData, e)
			}
		},
	})
	const { isValid } = formState
	const stageValues = JSON.getDeepPropertyValue(`stages.${stage}`, getValues() || {}) || {}

	return (
		<Grid container>
			{/* {!!title && <Grid item  className="flex flex-row items-start">
                <Typography variant="h1" className="flex-1">
                    {title}
                </Typography>
            </Grid>} */}
			{!!description && (
				<Grid item className="flex flex-col items-start py-8">
					<Typography variant="body2">{description}</Typography>
				</Grid>
			)}

			<Grid item className={"py-12"}>
				<Grid container>
					<Grid item md={12} className={"py-8"}>
						<FilePicker
							name={`stages.${stage}.questions`}
							label="Upload Questions"
							helperText="Accepted Formats: doc, docx, csv, xlsx, xls, pdf"
							defaultValue={stageValues?.questions || []}
							variant={"filled"}
							accept={
								".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain,application/pdf"
							}
							filesLimit={20}
							rules={{
								required: "Questions File is Required",
								validate: {
									isNotEmpty: v => !Array.isEmpty(v) || "Questions Upload is Required",
								},
							}}
							required
						/>
					</Grid>

					<Grid item md={12} className={"py-8"}>
						<RadioGroup
							name={`stages.${stage}.data_gathering_format`}
							label="Data gathering format"
							defaultValue={stageValues?.data_gathering_format || ""}
							aria-label="data-gathering-format"
							options={{
								Written: "Written",
								Audio: "Audio",
								Video: "Video",
							}}
							rules={{
								validate: {
									isNotEmpty: v => !String.isEmpty(v) || "Data gathering format is Required",
								},
							}}
							required
						/>
					</Grid>
				</Grid>
			</Grid>

			<Grid item className="flex flex-col items-center  py-8">
				<Button onClick={submit} disabled={!isValid} color="accent" variant="contained">
					Now Select your Target
				</Button>
			</Grid>
		</Grid>
	)
}

export default Stage
