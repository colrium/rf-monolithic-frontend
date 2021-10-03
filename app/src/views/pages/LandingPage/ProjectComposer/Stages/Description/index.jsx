/** @format */
import React, { useCallback, useRef } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useSetState, useDidUpdate } from "hooks";
import {
    TextInput,
} from "components/FormInputs";



const Stage = (props) => {
    const { onFieldChange, onSubmit, values, title, description } = props;
    const [state, setState] = useSetState({
        invalid: false,
        errors: {}
    });

    const [internalValues, setInternalValues] = useSetState({ ...values });

    const handleOnChange = useRef((name) => (value) => {
        setInternalValues({ [name]: value });
        if (Function.isFunction(onFieldChange)) {
            onFieldChange(name, value)
        }
    }).current;

    const handleOnSubmit = useCallback(() => {
        if (Function.isFunction(onSubmit)) {
            onSubmit(internalValues);
        }
    }, [internalValues]);

    useDidUpdate(() => {
        setInternalValues(values);
    }, [values]);

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
                        <TextInput
                            label="Project Name"
                            placeholder="This is the Project Title"
                            defaultValue={internalValues.project_name}
                            onChange={handleOnChange("project_name")}
                            variant={"filled"}
                            required
                        />
                    </GridItem>

                    <GridItem md={12} className={"py-8"}>
                        <TextInput
                            label="Project Summary"
                            defaultValue={internalValues.project_summary}
                            onChange={handleOnChange("project_summary")}
                            helperText={"Please give us a short description of your project"}
                            variant={"filled"}
                            multiline
                            rows={8}
                            required
                        />
                    </GridItem>

                    <GridItem md={12} className={"py-8"}>
                        <TextInput
                            label="Project Objectives"
                            defaultValue={internalValues.project_objectives}
                            onChange={handleOnChange("project_objectives")}
                            helperText={"Please give us a short description of your key perfomance indicators. <br> If focus group selected please indicate what the nature of the focus group should be"}
                            variant={"filled"}
                            multiline
                            rows={12}
                            required
                        />
                    </GridItem>

                </GridContainer>
            </GridItem>

            <GridItem className="flex flex-col items-center  py-8">
                <Button onClick={handleOnSubmit} disabled={state.invalid} className="accent inverse-text" variant="outlined">
                    Great. Nearly there
                </Button>
            </GridItem>
        </GridContainer>
    )
}

export default Stage;