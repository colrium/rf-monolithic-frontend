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
    SelectInput,
} from "components/FormInputs";
import { useSetState, useDidUpdate } from "hooks";



const Stage = (props) => {
    const { onFieldChange, onSubmit, values, title, description } = props;
    const [state, setState] = useSetState({
        invalid: true
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
            <GridItem className="flex flex-row items-start">
                {/* {!!title && <Typography variant="h1" className="flex-1">
                    {title}
                </Typography>} */}
                <Button color="primary" variant="outlined">
                    Sign in
                </Button>
            </GridItem>
            {!!description && <GridItem className="flex flex-col items-start py-8">
                <Typography variant="body2">
                    {description}
                </Typography>
            </GridItem>}
            <GridItem>
                <GridContainer>
                    <GridItem md={6} className={"py-8"}>
                        <TextInput
                            label="First Name"
                            defaultValue={internalValues.first_name}
                            onChange={handleOnChange("first_name")}
                            variant={"filled"}
                            required
                        />
                    </GridItem>
                    <GridItem md={6} className={"py-8"}>
                        <TextInput
                            label="Last Name"
                            defaultValue={internalValues.last_name}
                            onChange={handleOnChange("last_name")}
                            variant={"filled"}
                            required
                        />
                    </GridItem>
                    <GridItem md={6} className={"py-8"}>
                        <TextInput
                            label="Email"
                            type="email"
                            defaultValue={internalValues.email_address}
                            onChange={handleOnChange("email_address")}
                            variant={"filled"}
                            required
                        />
                    </GridItem>
                    <GridItem md={6} className={"py-8"}>
                        <TextInput
                            label="Phone"
                            placeholder="(Country Code) Telephone"
                            type="phone"
                            defaultValue={internalValues.phone}
                            onChange={handleOnChange("phone")}
                            variant={"filled"}
                            required
                        />
                    </GridItem>

                    <GridItem md={12} className={"py-8"}>
                        <SelectInput
                            label="Survey Type"
                            defaultValue={internalValues.survey_type}
                            onChange={handleOnChange("survey_type")}
                            variant={"filled"}
                            options={{
                                qualitative: "Qualititive",
                                quantitative: "Quantitative",
                            }}
                            required
                        />
                    </GridItem>

                    <GridItem md={6} className={"py-8"}>
                        <DateInput
                            label="Start Date"
                            defaultValue={internalValues.start_date}
                            onChange={handleOnChange("start_date")}
                            inputVariant={"filled"}
                            required
                        />
                    </GridItem>
                    <GridItem md={6} className={"py-8"}>
                        <DateInput
                            label="End Date"
                            defaultValue={internalValues.end_date}
                            onChange={handleOnChange("end_date")}
                            inputVariant={"filled"}
                            required
                        />
                    </GridItem>
                </GridContainer>
            </GridItem>

            <GridItem className="flex flex-col items-center  py-8">
                <Button onClick={handleOnSubmit} disabled={state.invalid} className="accent inverse-text" variant="outlined">
                    Ok. Ready to continue
                </Button>
            </GridItem>
        </GridContainer>
    )
}

export default Stage;