/** @format */
import React, { useCallback } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { IconButton, Button, Typography, SvgIcon, Tooltip } from '@material-ui/core';
import { form as formConfig, stages } from "../../config";
import { useReduxForm } from "hooks";
import SurveyIMG from "assets/img/realfield/survey.png";

const stagekeys = Object.keys(stages);

const Sidebar = (props) => {
    const { title, complete } = props
    const { useFieldValue } = useReduxForm(formConfig);
    const [stage, setStage] = useFieldValue("stage");
    //const [completeStages, setCompleteStages] = useFieldValue("completeStages");
    //console.log("stage: " + stage);

    const handleOnSelect = useCallback((key) => {
        setStage(key);
    }, [complete]);

    return (
        <GridContainer className="min-h-screen">
            <GridItem className="flex flex-col items-end px-4">
                <img src={SurveyIMG} />
            </GridItem>

            <GridItem className="flex flex-col items-end justify-center px-8">
                {Object.entries(stages).map(([key, value], index) => (
                    <Tooltip title={value.title} aria-label={value.title}>
                        <IconButton
                            onClick={() => handleOnSelect(key)}
                            className={"transform rotate-180 " + (stage === key ? "accent-text" : "inverse-text")}
                            key={"stage-" + key}
                            disabled={!complete.includes(stage)}
                        >
                            <SvgIcon viewBox="0 0 243.33 243.33">
                                <g>
                                    <polygon points="115.84,32.59 115.84,180.42 22.45,210.75" fill="inherit" />
                                    <polygon points="127.5,32.59 127.5,180.42 220.88,210.75" fill="inherit" />
                                </g>
                            </SvgIcon>
                        </IconButton>
                    </Tooltip>
                ))}
            </GridItem>
            <GridItem className="flex flex-col items-end px-8">
                <Typography variant="body1" className="accent-text">
                    {(stagekeys.indexOf(stage) + 1) + "/" + stagekeys.length}
                </Typography>
            </GridItem>\
            <GridItem className="flex flex-col items-end px-8">
                <Typography variant="body1" className="accent-text">
                    {stages[stage].title}
                </Typography>
            </GridItem>
        </GridContainer>
    )
}

Sidebar.defaultProps = {
    title: "Survey",
    complete: stagekeys
}

export default Sidebar;