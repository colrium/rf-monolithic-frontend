/** @format */
import React, { useCallback, useMemo, useRef } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { usePersistentForm } from "hooks";

const stage = "description";
const Stage = (props) => {
    const { onSubmit, title, description } = props;

    const { Field, TextField, formState, setValue, values, register, submit } = usePersistentForm({
		name: "projectcomposer",
		defaultValues: { stage: stage },
		onSubmit: async (formData, e) => {
			if (Function.isFunction(onSubmit)) {
				onSubmit(formData, e)
			}
		},
	})

    const stageValues = (JSON.getDeepPropertyValue(`stages.${stage}`, (values || {})) || {});
    const complete_stages = useMemo((() => (JSON.getDeepPropertyValue(`complete_stages`, values)) || []), [values]);
    const complete_stagesRef = useRef(complete_stages);
    const {errors, isValid} = formState;


    return (
		<GridContainer>
			{/* {!!title && <GridItem className="flex flex-row items-start">
                <Typography variant="h1" className="flex-1">
                    {title}
                </Typography>
            </GridItem>} */}
			{!!description && (
				<GridItem className="flex flex-col items-start py-8">
					<Typography variant="body2">{description}</Typography>
				</GridItem>
			)}
			<GridItem className={"py-12"}>
				<GridContainer>
					<GridItem md={12} className={"py-8"}>
						<TextField
							label="Project Name"
							placeholder="This is the Project Title"
							name={`stages.${stage}.project_name`}
							rules={{
								required: "Project Name is required.",
							}}
							variant={"filled"}
							required
							fullWidth
						/>
					</GridItem>

					<GridItem md={12} className={"py-8"}>
						<TextField
							label="Project Summary"
							name={`stages.${stage}.project_summary`}
							rules={{
								required: "Project Summary is required.",
							}}
							helperText={"Please give us a short description of your project"}
							variant={"filled"}
							multiline
							rows={8}
							required
							fullWidth
						/>
					</GridItem>

					<GridItem md={12} className={"py-8"}>
						<TextField
							label="Project Objectives"
							name={`stages.${stage}.project_objectives`}
							rules={{
								required: "Project Objectives is required.",
							}}
							helperText={"Please give us a short description of your project"}
							variant={"filled"}
							multiline
							rows={12}
							required
							fullWidth
						/>
					</GridItem>
				</GridContainer>
			</GridItem>

			<GridItem className="flex flex-col items-center py-20 mb-12">
				<Button onClick={submit} disabled={!isValid} color="accent" variant="contained">
					Great. Nearly there
				</Button>
			</GridItem>
		</GridContainer>
	)
}

export default Stage;
