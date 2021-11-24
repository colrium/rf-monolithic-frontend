/** @format */
import React, { useCallback, useMemo } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { form as formConfig, stages } from "../config";
import { useDidMount, usePersistentForm } from "hooks";
const stagekeys = Object.keys(stages);


const Stages = (props) => {
    const { getValues, setValue, values, register } = usePersistentForm(formConfig);
    const stage = (JSON.getDeepPropertyValue(`stage`, values) || stagekeys[0]);
    const complete_stages = (JSON.getDeepPropertyValue(`complete_stages`, values) || []);

    const handleOnStageSubmit = useCallback((values) => {
        let indexOfStage = stagekeys.indexOf(stage);
        //]", stagekeys[(indexOfStage + 1)])
        console.log("indexOfStage < (stagekeys.length - 1)", indexOfStage < (stagekeys.length - 1))
        if (indexOfStage >= 0 && indexOfStage < (stagekeys.length - 1)) {
            let next_complete_stages = Array.isArray(complete_stages) ? complete_stages : [];
            if (next_complete_stages.indexOf(stage) === -1) {
                next_complete_stages.push(stage);
                setValue(`complete_stages`, next_complete_stages);
            }
            setValue(`stage`, stagekeys[(indexOfStage + 1)])
        }
    }, [stage, complete_stages]);

    useDidMount(() => {
        if (!JSON.getDeepPropertyValue(`stage`, values)) {
            const stageField = register("stage");
            setValue(`stage`, stagekeys[0])
        }
        
    });

    const { component: StageComponent, ...stageProps } = stages[stage] ? stages[stage] : stages[stagekeys[0]];

    return (
        <GridContainer
            className="min-h-screen p-0"

        >
            <GridItem className="p-0">
                {!!StageComponent && <StageComponent
                    onSubmit={handleOnStageSubmit}
                    stages={stages}
                    {...stageProps}
                />}
            </GridItem>
        </GridContainer>
    )
}

export default Stages;