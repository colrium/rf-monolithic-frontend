/** @format */
import React, { useCallback, useRef } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {
    TextInput,
    DateInput,
    DateTimeInput,
    RadioInput,
    WysiwygInput,
    CheckboxInput,
    SliderInput,
    TranferListInput,
    MultiSelectInput,
    SelectInput,
    FileInput,
    MapInput,
    DynamicInput,
    GooglePlacesAutocomplete,
} from "components/FormInputs";

import { useSetState, useDidUpdate } from "hooks";



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
                        <FileInput
                            label="Upload Questions"
                            helperText="Accepted Formats: doc, docx, csv, xlsx, xls, pdf"
                            defaultValue={internalValues.questions}
                            onChange={handleOnChange("questions")}
                            variant={"filled"}
                            acceptedFiles={["application/*"]}
                            filesLimit={20}
                        />
                    </GridItem>

                    <GridItem md={12} className={"py-8"}>
                        <RadioInput
                            label="Data gathering format"
                            value={internalValues.format}
                            onChange={handleOnChange("format")}
                            options={{
                                audio: "Audio",
                                video: "Video",
                                written: "Written"
                            }}
                            required
                        />
                    </GridItem>

                    <GridItem md={12} className={"py-8"}>
                        <MultiSelectInput
                            label="Countries"
                            value={internalValues.countries}
                            onChange={handleOnChange("countries")}
                            variant={"filled"}
                            options={{ KE: "Kenya", }}
                            required
                        />
                    </GridItem>

                </GridContainer>
            </GridItem>

            <GridItem className="flex flex-col items-center  py-8">
                <Button onClick={handleOnSubmit} disabled={state.invalid} className="accent inverse-text" variant="outlined">
                    Now Select the Regions
                </Button>
            </GridItem>
        </GridContainer>
    )
}

export default Stage;