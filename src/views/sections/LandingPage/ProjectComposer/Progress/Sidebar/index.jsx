/** @format */
import React, { useCallback, useMemo } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { IconButton, Button, Typography, SvgIcon, Tooltip } from '@mui/material';
import { form as formConfig, stages } from "../../config";
import { useDidMount, usePersistentForm } from "hooks";
import ApiService from "services/Api";


const stagekeys = Object.keys(stages);

const Sidebar = (props) => {
    const { title, complete } = props
    const { setValue, values } = usePersistentForm(formConfig);
    const stage = (JSON.getDeepPropertyValue(`stage`, values) || stagekeys[0]);
    const complete_stages = (JSON.getDeepPropertyValue(`complete_stages`, values) || []);
    const indexOfstage = stagekeys.indexOf(stage);
    const handleOnSelect = useCallback((key) => {
        setValue(`stage`, key);
    }, [complete]);

    return (
        <GridContainer className="min-h-screen">
            <GridItem className="flex flex-col items-end px-4">
                <img src={("https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/survey.png")} />
            </GridItem>

            <GridItem className="flex flex-col items-end justify-center px-8">
                {Object.entries(stages).map(([key, value], index) => (
                    key !== stage && !complete_stages.includes(key) ? (
                        <IconButton
                            onClick={() => handleOnSelect(key)}
                            className={"transform rotate-180 "}
                            disabled
                            sx={{
                                color: (theme) => theme.palette.background.default
                            }}
                            key={`stage-${index}`}
                        >
                            <SvgIcon viewBox="0 0 243.33 243.33">
                                <g>
                                    <polygon points="115.84,32.59 115.84,180.42 22.45,210.75" fill="inherit" />
                                    <polygon points="127.5,32.59 127.5,180.42 220.88,210.75" fill="inherit" />
                                </g>
                            </SvgIcon>
                        </IconButton>
                    ) : (
                        <Tooltip title={value.title} aria-label={value.title} key={`stage-${index}`}>
                            <IconButton
                                onClick={() => handleOnSelect(key)}
                                className={"transform rotate-180 "}
                                disabled={key !== stage && !complete_stages.includes(key)}
                                sx={{
                                    color: (theme) => (stage === key ? theme.palette.accent.main : theme.palette.background.paper)
                                }}
                            >
                                <SvgIcon viewBox="0 0 243.33 243.33">
                                    <g>
                                        <polygon points="115.84,32.59 115.84,180.42 22.45,210.75" fill="inherit" />
                                        <polygon points="127.5,32.59 127.5,180.42 220.88,210.75" fill="inherit" />
                                    </g>
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                    )

                ))}
            </GridItem>
            <GridItem className="flex flex-col items-end px-8">
                <Typography variant="body1" color="text.secondary" className=" px-4">
                    {`Stage ${(stagekeys.indexOf(stage) + 1)} of ${stagekeys.length}`}
                </Typography>
            </GridItem>
            <GridItem className="flex flex-col items-end px-8">
                <Typography
                    variant="body2"
                    color="accent.main"
                    className="px-4"
                >
                    {stages[stage]?.title}
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
