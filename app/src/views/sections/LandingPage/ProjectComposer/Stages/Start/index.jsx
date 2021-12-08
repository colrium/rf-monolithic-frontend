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
    const { trigger, register, Field, TextField, Select, getValues, setValue, values, formState, handleSubmit } = usePersistentForm({ name: "projectcomposer", defaultValues: { stage: stage, } });
    const { isValid, isSubmitted } = formState;
    const stageValues = (JSON.getDeepPropertyValue(`stages.${ stage }`, (values || {})) || {});
    const complete_stages = useMemo((() => (JSON.getDeepPropertyValue(`complete_stages`, values)) || []), [values]);
    const complete_stagesRef = useRef(complete_stages);


    const changeStageValue = useCallback((name, value) => {
        setValue(name, value);
    }, []);

    const handleOnChange = useCallback((name) => (value) => {
        changeStageValue(name, value);
    }, []);

    const handleOnTextfieldChange = useCallback((name) => (event) => {
        changeStageValue(name, event.target.value);
    }, []);

    const handleOnAutocompleteChange = useCallback((name) => (event, newValue) => {
        changeStageValue(name, newValue);
    }, []);

    const handleOnSelectChange = useCallback((name) => (event) => {
        changeStageValue(name, event.target.value);
    }, []);

    const submit = useCallback((formValues) => {
        // let next_complete_stages = Array.isArray(complete_stagesRef.current) ? complete_stagesRef.current : [];
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
            <GridItem className="p-6 flex flex-row justify-end">
                {/* {!!title && <Typography variant="h1" className="flex-1">
                    {title}
                </Typography>} */}
                {/* <Button color="primary" variant="outlined">
                    Sign in
                </Button> */}
            </GridItem>
            { !!description && <GridItem className="flex flex-col items-start py-8">
                <Typography variant="body2">
                    { description }
                </Typography>
            </GridItem> }
            <GridItem>
                <GridContainer>
                    <GridItem md={ 6 } className={ "py-8" }>
                        <TextField
                            label="First Name"
                            name={ `stages.${ stage }.first_name` }
                            defaultValue={ stageValues?.first_name || "" }
                            onChange={ handleOnTextfieldChange(`stages.${ stage }.first_name`) }
                            rules={ {
                                required: "Please enter your First Name.",
                            } }
                            variant={ "filled" }
                            required
                            fullWidth
                        />
                    </GridItem>
                    <GridItem md={ 6 } className={ "py-8" }>
                        <TextField
                            label="Last Name"
                            name={ `stages.${ stage }.last_name` }
                            defaultValue={ stageValues?.last_name || "" }
                            onChange={ handleOnTextfieldChange(`stages.${ stage }.last_name`) }
                            rules={ {
                                required: "Last Name is required.",
                            } }
                            variant={ "filled" }
                            required
                            fullWidth
                        />
                    </GridItem>
                    <GridItem md={ 6 } className={ "py-8" }>
                        <TextField
                            label="Email"
                            { ...register(`stages.${ stage }.email_address`, {
                                required: "Email is required.",
                                pattern: {
                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: 'Invalid Email'
                                }
                            }) }
                            onChange={ handleOnTextfieldChange(`stages.${ stage }.email_address`) }
                            variant={ "filled" }
                            required
                            fullWidth
                        />
                    </GridItem>
                    <GridItem md={ 6 } className={ "py-8" }>
                        <TextField
                            label="Phone"
                            placeholder="(Country Code) Telephone"
                            { ...register(`stages.${ stage }.phone`, {
                                required: "Phone is required.",
                                minLength: {
                                    value: 10,
                                    message: 'Phone is too short'
                                }
                            }) }
                            onChange={ handleOnTextfieldChange(`stages.${ stage }.phone`) }
                            variant={ "filled" }
                            required
                            fullWidth
                        />
                    </GridItem>

                    <GridItem md={ 12 } className={ "py-8" }>
                        <Select
                            name={ `stages.${ stage }.survey_type` }
                            label={ "Survey Type" }
                            defaultValue={ stageValues.survey_type || "Qualititive" }
                            onChange={ handleOnSelectChange(`stages.${ stage }.survey_type`) }
                            options={ { "Qualititive": "Qualititive", "Quantitative": "Quantitative" } }
                            sx={ { width: '100%' } }
                            variant={ "filled" }
                            required
                        />
                    </GridItem>

                    <GridItem md={ 6 } className={ "py-8" }>
                        <Field
                            label="Start Date"
                            name={ `stages.${ stage }.start_date` }
                            defaultValue={ stageValues?.start_date || new Date().addDays(7) }
                            onChange={ handleOnChange(`stages.${ stage }.start_date`) }
                            component={ StaticDateInput }
                            rules={ {
                                valueAsDate: true,
                                deps: [`stages.${ stage }.end_date`],
                                validate: {
                                    isEmpty: v => Date.isDate(Date.from(v)) || 'Start date is required ',
                                    isParseableDate: v => Date.isDate(Date.from(v)) || 'Start date is not a parseable date ',
                                    isValidDate: v => {

                                        const end_date_value = Date.from((JSON.getDeepPropertyValue(`stages.${ stage }.end_date`, (getValues() || {})) || null));
                                        const start_date_value = Date.from(v, new Date());

                                        if (Date.isDate(start_date_value)) {
                                            let start_difference = start_date_value.difference(new Date())


                                            if (start_date_value < new Date() && !start_difference.same_day) {
                                                return "Start date cannot be in the past"
                                            }

                                            if (Date.isDate(end_date_value)) {
                                                start_difference = end_date_value.difference(start_date_value)
                                                // console.log("start_difference", start_difference)
                                                return (start_difference.type === "past" || start_difference.same_day) || 'Start date cannot be in the future of End date'
                                            }

                                        }
                                        return Date.isDate(start_date_value) || "select a Date"

                                    },
                                }
                            } }
                            required
                        />
                    </GridItem>
                    <GridItem md={ 6 } className={ "py-8" }>
                        <Field
                            label="End Date"
                            name={ `stages.${ stage }.end_date` }
                            defaultValue={ stageValues?.end_date || new Date().addDays(14) }
                            onChange={ handleOnChange(`stages.${ stage }.end_date`) }
                            component={ StaticDateInput }
                            rules={ {
                                valueAsDate: true,
                                deps: [`stages.${ stage }.start_date`],
                                validate: {
                                    isEmpty: v => Date.isDate(Date.from(v)) || 'End date is required ',
                                    isParseableDate: v => Date.isDate(Date.from(v)) || 'Start date is not a parseable date ',
                                    isValidDate: v => {

                                        const start_date_value = Date.from((JSON.getDeepPropertyValue(`stages.${ stage }.start_date`, (getValues() || {})) || null));
                                        const end_date_value = Date.from(v, new Date());

                                        if (Date.isDate(end_date_value)) {
                                            let start_difference = end_date_value.difference(new Date())


                                            if (end_date_value < new Date() && !start_difference.same_day) {
                                                return "End date cannot be in the past"
                                            }

                                            if (Date.isDate(start_date_value)) {
                                                start_difference = end_date_value.difference(start_date_value)
                                                // console.log("start_difference", start_difference)
                                                return (start_difference.type === "past" || start_difference.same_day) || 'Start date cannot be in the past of End date'
                                            }

                                        }
                                        return Date.isDate(end_date_value) || "select a Date"

                                    },
                                }
                            } }
                            required
                        />
                    </GridItem>
                </GridContainer>
            </GridItem>

            <GridItem className="flex flex-col items-center py-20 mb-12">
                <Button onClick={ handleSubmit(submit) } disabled={ !isValid } color="accent" variant="contained">
                    Ok. Ready to continue
                </Button>
            </GridItem>
        </GridContainer>
    )
}

export default Stage;