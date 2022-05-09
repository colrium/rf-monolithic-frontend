/** @format */
import React, {useCallback, useMemo} from "react";
import {useTheme} from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import {form as formConfig, stages} from "../../config";
import {useDidMount, usePersistentForm} from "hooks";
import ApiService from "services/Api";


const stagekeys = Object.keys( stages );

const Mobile = ( props ) => {
    const {title, complete, ...rest} = props
    const theme = useTheme()
    const {setValue, values, formState} = usePersistentForm( formConfig );
    const {errors, isValid} = formState;
    const stage = ( JSON.getDeepPropertyValue( `stage`, values ) || stagekeys[0] );
    const complete_stages = ( JSON.getDeepPropertyValue( `complete_stages`, values ) || [] );
    const indexOfstage = stagekeys.indexOf( stage );
    const handleOnSelect = useCallback( ( key ) => {
        setValue( `stage`, key );
    }, [complete] );


    // console.log( "complete_stages", complete_stages)
    const handleNext = useCallback( () => {
        if( indexOfstage < (stagekeys.length -1)) {
            setValue( `stage`, stagekeys[( indexOfstage + 1)] );
        }
    }, [indexOfstage] );

    const handlePrevious = useCallback( () => {
        if( indexOfstage > 0 && indexOfstage <= ( stagekeys.length - 1 ) ) {
            setValue( `stage`, stagekeys[( indexOfstage - 1 )] );
        }
    }, [indexOfstage] );

    return (
        <Box {...rest}>
            <MobileStepper
                variant="text"
                steps={stagekeys.length}
                position="static"
                activeStep={indexOfstage}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={!isValid || indexOfstage === stagekeys.length - 1}
                    >
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button
                        size="small"
                        onClick={handlePrevious}
                        disabled={indexOfstage === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                }
            />
        </Box>
    )
}

Mobile.defaultProps = {
    title: "Survey",
    complete: stagekeys
}

export default Mobile;
