/** @format */
import React, { useCallback, useMemo, useRef } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import FileDropZone from "components/FileDropZone";

import { usePersistentForm } from "hooks";


const stage = "scope";

const Stage = (props) => {
    const { onSubmit, title, description } = props;

    const { handleSubmit, submit, FilePicker, RadioGroup, values, setValue, getValues, formState } = usePersistentForm({ name: "projectcomposer", defaultValues: { stage: stage, } });
    const { isValid } = formState;
    const stageValues = (JSON.getDeepPropertyValue(`stages.${ stage }`, (values || {})) || {});




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
					</GridItem>

					<GridItem md={12} className={"py-8"}>
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
					</GridItem>

					{/* <GridItem md={12} className={"py-8"}>
                        <MultiSelectInput
                            label="Countries"
                            value={values.countries}
                            onChange={handleOnChange("countries")}
                            variant={"filled"}
                            options={{ KE: "Kenya", }}
                            required
                        />
                    </GridItem>*/}
				</GridContainer>
			</GridItem>

			<GridItem className="flex flex-col items-center  py-8">
				{/* <Button onClick={handleSubmit(submit)} disabled={!isValid} color="accent" variant="contained">
                    Now Select your Target
                </Button> */}
				<Button onClick={handleSubmit(submit)} disabled={!isValid} color="accent" variant="contained">
					Now Select your Target
				</Button>
			</GridItem>
		</GridContainer>
	)
}

export default Stage;
