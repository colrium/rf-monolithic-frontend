/** @format */
import React, { useCallback, useMemo } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { form as formConfig, stages } from "../config";
import { useReduxForm } from "hooks";



const Stages = (props) => {
    const { useFieldValue, destroy, reset, submit } = useReduxForm(formConfig);


    const [stage, setStage] = useFieldValue("stage");
    const [values, setValues] = useFieldValue("values");
    const [description, setDescription] = useFieldValue("description");


    const handleOnValueChange = useCallback((name) => (field, value) => {
        let stageValues = JSON.isJSON(values) ? { ...values[name], [field]: value } : { [field]: value }
        //setValues({ ...values, ...stageValues })
    }, [values]);

    const handleOnSubmit = useCallback((name) => (fieldvalues) => {
        let stageValues = JSON.isJSON(values) ? { ...values[name], ...fieldvalues } : { ...fieldvalues }
        setValues({ ...values, ...stageValues })
    }, [values]);

    const { component: StageComponent, ...stageProps } = useMemo(() => stages[stage], [stage]);

    return (
        <GridContainer className="min-h-screen p-0">
            <GridItem className="p-0">
                {!!StageComponent && <StageComponent
                    values={values[stage]}
                    onValueChange={handleOnValueChange(stage)}
                    onSubmit={handleOnSubmit(stage)}
                    {...stageProps}
                />}
            </GridItem>
        </GridContainer>
    )
}

export default Stages;