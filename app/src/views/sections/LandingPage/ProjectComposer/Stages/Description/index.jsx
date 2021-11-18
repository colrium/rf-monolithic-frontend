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

    const { Field, TextField, formState, setValue, values, register, handleSubmit } = usePersistentForm({ name: "projectcomposer", defaultValues: { stage: stage, } });

    const stageValues = (JSON.getDeepPropertyValue(`stages.${stage}`, (values || {})) || {});
    const complete_stages = useMemo((() => (JSON.getDeepPropertyValue(`complete_stages`, values)) || []), [values]);
    const complete_stagesRef = useRef(complete_stages);
    const {errors, isValid} = formState;

    const changeStageValue = useCallback((name, value) => {
        setValue(name, value);
    }, []);


    const handleOnTextfieldChange = useCallback((name) => (event) => {
        changeStageValue(name, event.target.value);
    }, []);

    const submit = useCallback((formValues) => {        
        // let next_complete_stages = Array.isArray(complete_stagesRef.current) ? complete_stagesRef.current : [];
        // let indexOfStage = next_complete_stages.indexOf(stage);
        // if (next_complete_stages.indexOf(stage) === -1) {
        //     next_complete_stages.push(stage);
        //     setValue(`complete_stages`, next_complete_stages);
        // }
        if (Function.isFunction(onSubmit)) {
            onSubmit(stageValues);
        }
    }, [isValid, stageValues, onSubmit]);

    return (
        <GridContainer>
            {/* {!!title && <GridItem className="flex flex-row items-start">
                <Typography variant="h1" className="flex-1">
                    {title}
                </Typography>
            </GridItem>} */}
            {!!description && <GridItem className="flex flex-col items-start py-8">
                <Typography variant="body2">
                    {description}
                </Typography>
            </GridItem>}
            <GridItem className={"py-12"}>
                <GridContainer>
                    <GridItem md={12} className={"py-8"}>
                        <TextField
                            label="Project Name"
                            placeholder="This is the Project Title"
                            {...register(`stages.${stage}.project_name`, {
                                required: "Project Name is required.",                                
                            })}  
                            onChange={handleOnTextfieldChange(`stages.${stage}.project_name`)}
                            variant={"filled"}
                            required
                            fullWidth
                        />
                    </GridItem>

                    <GridItem md={12} className={"py-8"}>
                        <TextField
                            label="Project Summary"
                            {...register(`stages.${stage}.project_summary`, {
                                required: "Project Summary is required.",                                
                            })}
                            onChange={handleOnTextfieldChange(`stages.${stage}.project_summary`)}
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
                            {...register(`stages.${stage}.project_objectives`, {
                                required: "Project Objectives is required.",                                
                            })}
                            onChange={handleOnTextfieldChange(`stages.${stage}.project_objectives`)}
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
                <Button onClick={handleSubmit(submit)} disabled={!isValid} color="accent" variant="contained">
                    Great. Nearly there
                </Button>
            </GridItem>
        </GridContainer>
    )
}

export default Stage;