import React from "react";
import Grid from '@mui/material/Grid';
//
import { useNetworkServices } from "context/NetworkServices";
import { useDidUpdate, useDidMount, useSetState } from "hooks"
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

const InputField = (props) => {
	const { component: InputComponent, ...rest } = props;
	return (
		<InputComponent {...rest} />
	);
};

const BaseInput = (props) => {
    const {name, placeholder, value, options, defaultValue, onChange, data, blueprint,  ...rest} = props || {};

    
    const {Api} = useNetworkServices()

    const [state, setState, getState] = useSetState({
		blueprint: {},
		loading: false,
	});


    const loadFieldValuePosibilities = useCallback(() => {
        
    }, [blueprint]);

    const applyChangeEffects = useCallback(() => {
        
    }, [blueprint])


    const applyBlueprint = useCallback(() => {
        
    }, [blueprint]);


    useDidUpdate(() => {
        
    }, [blueprint])

    return (
        <Grid container {...rest}>
            <Grid item xs={12}>

            </Grid>
        </Grid>
    )
}

export default React.memo(BaseInput);