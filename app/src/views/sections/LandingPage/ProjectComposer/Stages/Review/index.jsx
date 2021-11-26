/** @format */
import React, { useCallback, useMemo, useEffect } from "react";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import Typography from "@mui/material/Typography";

import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import CountryAutocomplete from "components/CountryAutocomplete";
import { useSetState, usePersistentForm, useGeojson, useDidMount } from "hooks";


const stage = "review";

const Stage = (props) => {
    const { onSubmit, stages, title, description } = props;

    const [state, setState] = useSetState({
        invalid: false,
        previewDialogOpen: false,
        previewDialogTitle: "",
        previewDialogContent: "",
    });

    const { handleSubmit, register, setError, errors, formState: { isValid }, ErrorMessage, Field, Select, trigger, RadioGroup, getValues, values: allValues, setValue } = usePersistentForm({ name: "projectcomposer", defaultValues: { stage: stage, } });
    const stagesValues = useMemo(() => (JSON.getDeepPropertyValue(`stages`, allValues) || {}), [allValues]);
    const values = useMemo(() => (JSON.getDeepPropertyValue(`stages.${stage}`, allValues) || {}), [allValues]);

    const geojsonUtils = useGeojson();

    

    useDidMount(() => {
        // register(`stages.${stage}`, {
        //     validate: validateStage
        // })
    })

    const changeStageValue = useCallback((name, value) => {
        setValue(name, value);
        //trigger([`stages.${stage}`])
    }, []);

    const handleOnTextfieldChange = useCallback((name) => (event) => {
        changeStageValue(name, event.target.value);
    }, []);

    const handleOnSelectChange = useCallback((name) => (event) => {
        changeStageValue(name, event.target.value);
    }, []);


    const submit = useCallback((formValues) => {        
        if (Function.isFunction(onSubmit)) {
            onSubmit(formValues);
        }
    }, [onSubmit]);

    const handleOnOpenPreviewDialog = useCallback((previewDialogTitle, previewDialogContent) => () => {
        setState({
            previewDialogOpen: true,
            previewDialogTitle: previewDialogTitle,
            previewDialogContent: previewDialogContent,
        });
    }, []);

    const handleOnClosePreviewDialog = useCallback(() => {
        setState({
            previewDialogOpen: false,
            previewDialogTitle: "",
            previewDialogContent: "",
        });
    }, []);

    return (
        <GridContainer>
            {/* {!!title && <GridItem className="flex flex-row items-start">
                <Typography variant="h1" className="flex-1">
                    {title}
                </Typography>
            </GridItem>} */}
            {/*!!description && <GridItem className="flex flex-col items-start py-8">
                <Typography variant="body2">
                    {description}
                </Typography>
            </GridItem> */}
            <GridItem className="p-0">
                <GridContainer>

                    <GridItem xs={12} md={6} className={"py-4"}>
                        <Typography variant="h5" component="div" className={"py-8"} color={"text.secondary"}>
                            Review Your Detais
                        </Typography>
                        <Card
                            elevation={0}
                            className={"mb-8"}
                            sx={{
                                backgroundColor: "transparent",
                                border: (theme) => (`1px solid ${theme.palette.divider}`)
                            }}
                        >
                            <CardHeader
                                title={stages.start.title}
                                subheader={stages.start.subtitle}
                                titleTypographyProps={{
                                    color: "text.disabled",
                                    variant: "subtitle2",
                                }}
                                subheaderTypographyProps={{
                                    color: "text.secondary",
                                    variant: "caption",
                                }}
                                action={
                                    <IconButton
                                        onClick={(event) => setValue("stage", "start")}
                                        color="primary"
                                        size="small"
                                        aria-label="Details"
                                    >
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                }
                            />
                            <CardContent>
                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        First Name
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {stagesValues?.start?.first_name}
                                    </Typography>
                                </GridItem>
                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Last Name
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {stagesValues?.start?.last_name}
                                    </Typography>
                                </GridItem>
                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Email
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {stagesValues?.start?.email_address}
                                    </Typography>
                                </GridItem>

                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Survey Type
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {stagesValues?.start?.survey_type}
                                    </Typography>
                                </GridItem>

                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Date
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {new Date(stagesValues?.start?.start_date).toLocaleDateString()} <em>To</em> {new Date(stagesValues?.start?.end_date).toLocaleDateString()}
                                    </Typography>
                                </GridItem>
                            </CardContent>
                        </Card>

                        <Card
                            elevation={0}
                            className={"mb-8"}
                            sx={{
                                backgroundColor: "transparent",
                                border: (theme) => (`1px solid ${theme.palette.divider}`)
                            }}
                        >
                            <CardHeader
                                title={stages.description.title}
                                subheader={stages.description.subtitle}
                                titleTypographyProps={{
                                    color: "text.disabled",
                                    variant: "subtitle2",
                                }}
                                subheaderTypographyProps={{
                                    color: "text.secondary",
                                    variant: "caption",
                                }}
                                action={
                                    <IconButton
                                        onClick={(event) => setValue("stage", "description")}
                                        color="primary"
                                        size="small"
                                        aria-label="Details"
                                    >
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                }
                            />
                            <CardContent>
                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Project Title
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {stagesValues?.description?.project_name}
                                    </Typography>
                                </GridItem>


                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Project Summary
                                    </Typography>
                                    <Button
                                        onClick={handleOnOpenPreviewDialog("Project Summary", (stagesValues?.description?.project_summary || ""))}
                                        color="accent"
                                        className="mx-8 capitalize font-bold"
                                        size="small"
                                    >
                                        View
                                    </Button>
                                </GridItem>

                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled" >
                                        Project Objectives
                                    </Typography>
                                    <Button
                                        onClick={handleOnOpenPreviewDialog("Project Objectives", (stagesValues?.description?.project_objectives || ""))}
                                        color="accent"
                                        className="mx-8 capitalize font-bold"
                                        size="small"
                                    >
                                        View
                                    </Button>
                                </GridItem>
                            </CardContent>
                        </Card>


                        <Card
                            elevation={0}
                            className={"mb-8"}
                            sx={{
                                backgroundColor: "transparent",
                                border: (theme) => (`1px solid ${theme.palette.divider}`)
                            }}
                        >
                            <CardHeader
                                title={stages.scope.title}
                                subheader={stages.scope.subtitle}
                                titleTypographyProps={{
                                    color: "text.disabled",
                                    variant: "subtitle2",
                                }}
                                subheaderTypographyProps={{
                                    color: "text.secondary",
                                    variant: "caption",
                                }}
                                action={
                                    <IconButton
                                        onClick={(event) => setValue("stage", "scope")}
                                        color="primary"
                                        size="small"
                                        aria-label="Details"
                                    >
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                }
                            />
                            <CardContent>

                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Questions Uploaded
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {Array.isArray(stagesValues?.scope?.questions) ? "Yes" : "No"}
                                    </Typography>
                                </GridItem>

                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Data gathering format
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {stagesValues?.scope?.data_gathering_format}
                                    </Typography>
                                </GridItem>
                            </CardContent>
                        </Card>


                        <Card
                            elevation={0}
                            className={"mb-8"}
                            sx={{
                                backgroundColor: "transparent",
                                border: (theme) => (`1px solid ${theme.palette.divider}`)
                            }}
                        >
                            <CardHeader
                                title={stages.target.title}
                                subheader={stages.target.subtitle}
                                titleTypographyProps={{
                                    color: "text.disabled",
                                    variant: "subtitle2",
                                }}
                                subheaderTypographyProps={{
                                    color: "text.secondary",
                                    variant: "caption",
                                }}
                                action={
                                    <IconButton
                                        onClick={(event) => setValue("stage", "target")}
                                        color="primary"
                                        size="small"
                                        aria-label="Details"
                                    >
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                }
                            />
                            <CardContent>

                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Confidence Level
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {`${stagesValues?.target?.confidence_level}`}
                                    </Typography>
                                </GridItem>

                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Error Margin
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {`${stagesValues?.target?.error_margin}`}
                                    </Typography>
                                </GridItem>

                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Sample Size
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {`${stagesValues?.target?.sample_size}`}
                                    </Typography>
                                </GridItem>

                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Regions
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {Array.isArray(stagesValues?.target?.regions) && stagesValues.target.regions.map((region, index) => (
                                            index > 0 ? `, ${geojsonUtils.getAdminLevelName(region)}` : `${geojsonUtils.getAdminLevelName(region)}`
                                        ))}
                                    </Typography>
                                </GridItem>
                            </CardContent>
                        </Card>


                        <Card
                            elevation={0}
                            className={"mb-8"}
                            sx={{
                                backgroundColor: "transparent",
                                border: ( theme ) => ( `1px solid ${ theme.palette.divider }` )
                            }}
                        >
                            <CardHeader
                                title={stages.workforce.title}
                                subheader={stages.workforce.subtitle}
                                titleTypographyProps={{
                                    color: "text.disabled",
                                    variant: "subtitle2",
                                }}
                                subheaderTypographyProps={{
                                    color: "text.secondary",
                                    variant: "caption",
                                }}
                                action={
                                    <IconButton
                                        onClick={( event ) => setValue( "stage", "workforce" )}
                                        color="primary"
                                        size="small"
                                        aria-label="Details"
                                    >
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                }
                            />
                            <CardContent>

                                <GridItem xs={12} className={"p-0 py-1 flex flex-row items-center"}>
                                    <Typography color="text.disabled">
                                        Fielders
                                    </Typography>
                                    <Typography className={"mx-8 font-bold"} color="text.secondary">
                                        {`${ stagesValues?.workforce?.autoSelect ? "Auto select" : ( stagesValues?.workforce?.fielders?.length || "0") }`}
                                    </Typography>
                                </GridItem>
                            </CardContent>
                        </Card>

                        <GridItem xs={12} className={"p-0 py-4 flex flex-row items-center"}>
                            <Typography color="text.disabled">
                                Last Autosave
                            </Typography>
                            <Typography className={"mx-8 font-bold"} color="text.secondary">
                                {allValues.persist_timestamp ? `${new Date(allValues.persist_timestamp).toLocaleString()}` : "None"}
                            </Typography>
                        </GridItem>
                    </GridItem>

                    <GridItem xs={12} md={6} className={"py-4"}>
                        <GridContainer className={"p-0"}>

                            <GridItem md={12} className={"p-0"}>
                                <Typography variant="h5" className={"py-8"} component="div" color={"text.secondary"}>
                                    Account Creation
                                </Typography>
                            </GridItem>

                            <GridItem md={12} className={"py-4"}>
                                <Field
                                    label="Company Name"
                                    name={`stages.${stage}.company_name`}
                                    defaultValue={values.company_name || ""}
                                    onChange={handleOnTextfieldChange(`stages.${stage}.company_name`)}
                                    component={TextField}
                                    variant={"filled"}
                                    required
                                    fullWidth
                                />
                            </GridItem>

                            <GridItem md={12} className={"py-4"}>
                                <Select
                                    name={`stages.${stage}.sector`}
                                    label={"Sector"}
                                    defaultValue={values.sector || ""}
                                    onChange={handleOnSelectChange(`stages.${stage}.sector`)}
                                    options={{ "Private": "Private", "Non-Profit": "Non-Profit", "Government": "Government" }}
                                    sx={{ width: '100%' }}
                                    variant={"filled"}
                                    rules={{
                                        validate: {
                                            isNotEmpty: v => !String.isEmpty(v) || 'Sector is Required',
                                        }
                                    }}
                                    required
                                />
                            </GridItem>

                            <GridItem md={12} className={"py-4"}>
                                <Field
                                    name={`stages.${stage}.country`}
                                    label="Country"
                                    defaultValue={values?.country || "Kenya"}
                                    onChange={(event, newValue) => changeStageValue(`stages.${stage}.country`, newValue.label)}
                                    variant={"filled"}
                                    component={CountryAutocomplete}
                                    rules={{
                                        validate: {
                                            isNotEmpty: v => !String.isEmpty(v) || 'Country is Required',
                                        }
                                    }}
                                />
                            </GridItem>

                            <GridItem md={12} className={"py-4"}>
                                <RadioGroup
                                    name={`stages.${stage}.currency`}
                                    label="Pay in"
                                    value={values?.currency || ""}
                                    options={["USD", "KES"]}
                                    onChange={handleOnTextfieldChange(`stages.${stage}.currency`)}
                                    rules={{
                                        validate: {
                                            isNotEmpty: v => !String.isEmpty(v) || 'Currency is Required',
                                        }
                                    }}
                                    row
                                />
                            </GridItem>



                            <GridItem md={12} className={"py-4"}>
                                <Field
                                    name={`stages.${stage}.password`}
                                    label="Password"
                                    placeholder="Set Password"
                                    defaultValue={values.password || ""}
                                    onChange={handleOnTextfieldChange(`stages.${stage}.password`)}
                                    component={TextField}
                                    variant={"filled"}
                                    type="password"
                                    rules={{
                                        validate: {
                                            isNotEmpty: v => !String.isEmpty(v) || 'Password is Required',
                                        }
                                    }}
                                    required
                                    fullWidth
                                />
                            </GridItem>

                            <GridItem md={12} className={"py-4"}>
                                <Field
                                    name={`stages.${stage}.repeat_password`}
                                    label="Repeat Password"
                                    placeholder="Enter Password again to confirm"
                                    defaultValue={values.repeat_password || ""}
                                    onChange={handleOnTextfieldChange(`stages.${stage}.repeat_password`)}
                                    component={TextField}
                                    variant={"filled"}
                                    type="password"
                                    rules={{
                                        validate: {
                                            isNotEmpty: v => !String.isEmpty(v) || 'Password confirmation is Required',
                                        }
                                    }}
                                    required
                                    fullWidth
                                />
                            </GridItem>

                            <GridItem className="flex flex-col xs:items-center md:items-end md:px-20 py-8 mb-20">
                                <Button onClick={handleSubmit(submit)} disabled={!isValid} color="accent" variant="contained">
                                    Continue to Checkout
                                </Button>
                            </GridItem>

                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </GridItem>

            <Dialog
                open={state.previewDialogOpen}
                onClose={handleOnClosePreviewDialog}
                aria-labelledby="review-dialog-title"
                aria-describedby="review-dialog-description"
            >
                <DialogTitle id="review-dialog-title">
                    {state.previewDialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="review-dialog-description">
                        {state.previewDialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleOnClosePreviewDialog}
                        color={"error"}
                        autoFocus
                    >
                        Dismiss
                    </Button>
                </DialogActions>
            </Dialog>


        </GridContainer>
    )
};

export default Stage;