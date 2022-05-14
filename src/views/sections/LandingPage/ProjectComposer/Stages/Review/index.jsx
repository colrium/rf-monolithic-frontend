/** @format */
import React, { useCallback, useMemo, useEffect } from "react";
import Grid from '@mui/material/Grid';
;
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

    const { handleSubmit, register, setError, errors, formState: { isValid }, ErrorMessage, Field, Select, trigger, RadioGroup, Autocomplete, getValues, values: allValues, setValue } = usePersistentForm({ name: "projectcomposer", defaultValues: { stage: stage, } });
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
		<Grid container>
			{/* {!!title && <Grid item  className="flex flex-row items-start">
                <Typography variant="h1" className="flex-1">
                    {title}
                </Typography>
            </Grid>} */}
			{/*!!description && <Grid item  className="flex flex-col items-start py-8">
                <Typography variant="body2">
                    {description}
                </Typography>
            </Grid> */}
			<Grid item className="p-0">
				<Grid container>
					<Grid item xs={12} md={6} className={"py-4"}>
						<Typography variant="h5" component="div" className={"py-8"} color={"text.secondary"}>
							Review Your Detais
						</Typography>
						<Card
							elevation={0}
							className={"mb-8"}
							sx={{
								backgroundColor: "transparent",
								border: theme => `1px solid ${theme.palette.divider}`,
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
										onClick={event => setValue("stage", "start")}
										color="primary"
										size="small"
										aria-label="Details"
									>
										<EditIcon fontSize="inherit" />
									</IconButton>
								}
							/>
							<CardContent>
								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">First Name</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{stagesValues?.start?.first_name}
									</Typography>
								</Grid>
								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Last Name</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{stagesValues?.start?.last_name}
									</Typography>
								</Grid>
								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Email</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{stagesValues?.start?.email_address}
									</Typography>
								</Grid>

								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Survey Type</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{stagesValues?.start?.survey_type}
									</Typography>
								</Grid>

								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Date</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{new Date(stagesValues?.start?.start_date).toLocaleDateString()} <em>To</em>{" "}
										{new Date(stagesValues?.start?.end_date).toLocaleDateString()}
									</Typography>
								</Grid>
							</CardContent>
						</Card>

						<Card
							elevation={0}
							className={"mb-8"}
							sx={{
								backgroundColor: "transparent",
								border: theme => `1px solid ${theme.palette.divider}`,
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
										onClick={event => setValue("stage", "description")}
										color="primary"
										size="small"
										aria-label="Details"
									>
										<EditIcon fontSize="inherit" />
									</IconButton>
								}
							/>
							<CardContent>
								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Project Title</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{stagesValues?.description?.project_name}
									</Typography>
								</Grid>

								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Project Summary</Typography>
									<Button
										onClick={handleOnOpenPreviewDialog(
											"Project Summary",
											stagesValues?.description?.project_summary || ""
										)}
										color="accent"
										className="mx-8 capitalize font-bold"
										size="small"
									>
										View
									</Button>
								</Grid>

								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Project Objectives</Typography>
									<Button
										onClick={handleOnOpenPreviewDialog(
											"Project Objectives",
											stagesValues?.description?.project_objectives || ""
										)}
										color="accent"
										className="mx-8 capitalize font-bold"
										size="small"
									>
										View
									</Button>
								</Grid>
							</CardContent>
						</Card>

						<Card
							elevation={0}
							className={"mb-8"}
							sx={{
								backgroundColor: "transparent",
								border: theme => `1px solid ${theme.palette.divider}`,
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
										onClick={event => setValue("stage", "scope")}
										color="primary"
										size="small"
										aria-label="Details"
									>
										<EditIcon fontSize="inherit" />
									</IconButton>
								}
							/>
							<CardContent>
								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Questions Uploaded</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{Array.isArray(stagesValues?.scope?.questions) ? "Yes" : "No"}
									</Typography>
								</Grid>

								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Data gathering format</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{stagesValues?.scope?.data_gathering_format}
									</Typography>
								</Grid>
							</CardContent>
						</Card>

						<Card
							elevation={0}
							className={"mb-8"}
							sx={{
								backgroundColor: "transparent",
								border: theme => `1px solid ${theme.palette.divider}`,
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
										onClick={event => setValue("stage", "target")}
										color="primary"
										size="small"
										aria-label="Details"
									>
										<EditIcon fontSize="inherit" />
									</IconButton>
								}
							/>
							<CardContent>
								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Confidence Level</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{`${stagesValues?.target?.confidence_level}`}
									</Typography>
								</Grid>

								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Error Margin</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{`${stagesValues?.target?.error_margin}`}
									</Typography>
								</Grid>

								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Sample Size</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{`${stagesValues?.target?.sample_size}`}
									</Typography>
								</Grid>

								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Regions</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{Array.isArray(stagesValues?.target?.regions) &&
											stagesValues.target.regions.map((region, index) =>
												index > 0
													? `, ${geojsonUtils.getAdminLevelName(region)}`
													: `${geojsonUtils.getAdminLevelName(region)}`
											)}
									</Typography>
								</Grid>
							</CardContent>
						</Card>

						<Card
							elevation={0}
							className={"mb-8"}
							sx={{
								backgroundColor: "transparent",
								border: theme => `1px solid ${theme.palette.divider}`,
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
										onClick={event => setValue("stage", "workforce")}
										color="primary"
										size="small"
										aria-label="Details"
									>
										<EditIcon fontSize="inherit" />
									</IconButton>
								}
							/>
							<CardContent>
								<Grid item xs={12} className={"p-0 py-1 flex flex-row items-center"}>
									<Typography color="text.disabled">Fielders</Typography>
									<Typography className={"mx-8 font-bold"} color="text.secondary">
										{`${
											stagesValues?.workforce?.autoSelect
												? "Auto select"
												: stagesValues?.workforce?.fielders?.length || "0"
										}`}
									</Typography>
								</Grid>
							</CardContent>
						</Card>

						<Grid item xs={12} className={"p-0 py-4 flex flex-row items-center"}>
							<Typography color="text.disabled">Last Autosave</Typography>
							<Typography className={"mx-8 font-bold"} color="text.secondary">
								{allValues.persist_timestamp ? `${new Date(allValues.persist_timestamp).toLocaleString()}` : "None"}
							</Typography>
						</Grid>
					</Grid>

					<Grid item xs={12} md={6} className={"py-4"}>
						<Grid container className={"p-0"}>
							<Grid item md={12} className={"p-0"}>
								<Typography variant="h5" className={"py-8"} component="div" color={"text.secondary"}>
									Account Creation
								</Typography>
							</Grid>

							<Grid item md={12} className={"py-4"}>
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
							</Grid>

							<Grid item md={12} className={"py-4"}>
								<Select
									name={`stages.${stage}.sector`}
									label={"Sector"}
									defaultValue={values.sector || ""}
									onChange={handleOnSelectChange(`stages.${stage}.sector`)}
									options={{ Private: "Private", "Non-Profit": "Non-Profit", Government: "Government" }}
									sx={{ width: "100%" }}
									variant={"filled"}
									rules={{
										validate: {
											isNotEmpty: v => !String.isEmpty(v) || "Sector is Required",
										},
									}}
									required
								/>
							</Grid>

							<Grid item md={12} className={"py-4"}>
								<Autocomplete
									variant="filled"
									name={`stages.${stage}.country`}
									label="Country"
									placeholder="Country"
									rules={{
										required: "Country is required.",
									}}
									options={{
										AD: "Andorra",
										AE: "United Arab Emirates",
										AF: "Afghanistan",
										AG: "Antigua and Barbuda",
										AI: "Anguilla",
										AL: "Albania",
										AM: "Armenia",
										AO: "Angola",
										AQ: "Antarctica",
										AR: "Argentina",
										AS: "American Samoa",
										AT: "Austria",
										AU: "Australia",
										AW: "Aruba",
										AX: "Aland Islands",
										AZ: "Azerbaijan",
										BA: "Bosnia and Herzegovina",
										BB: "Barbados",
										BD: "Bangladesh",
										BE: "Belgium",
										BF: "Burkina Faso",
										BG: "Bulgaria",
										BH: "Bahrain",
										BI: "Burundi",
										BJ: "Benin",
										BL: "Saint Barthelemy",
										BM: "Bermuda",
										BN: "Brunei",
										BO: "Bolivia",
										BQ: "Bonaire, Saint Eustatius and Saba ",
										BR: "Brazil",
										BS: "Bahamas",
										BT: "Bhutan",
										BV: "Bouvet Island",
										BW: "Botswana",
										BY: "Belarus",
										BZ: "Belize",
										CA: "Canada",
										CC: "Cocos Islands",
										CD: "Democratic Republic of the Congo",
										CF: "Central African Republic",
										CG: "Republic of the Congo",
										CH: "Switzerland",
										CI: "Ivory Coast",
										CK: "Cook Islands",
										CL: "Chile",
										CM: "Cameroon",
										CN: "China",
										CO: "Colombia",
										CR: "Costa Rica",
										CU: "Cuba",
										CV: "Cape Verde",
										CW: "Curacao",
										CX: "Christmas Island",
										CY: "Cyprus",
										CZ: "Czech Republic",
										DE: "Germany",
										DJ: "Djibouti",
										DK: "Denmark",
										DM: "Dominica",
										DO: "Dominican Republic",
										DZ: "Algeria",
										EC: "Ecuador",
										EE: "Estonia",
										EG: "Egypt",
										EH: "Western Sahara",
										ER: "Eritrea",
										ES: "Spain",
										ET: "Ethiopia",
										FI: "Finland",
										FJ: "Fiji",
										FK: "Falkland Islands",
										FM: "Micronesia",
										FO: "Faroe Islands",
										FR: "France",
										GA: "Gabon",
										GB: "United Kingdom",
										GD: "Grenada",
										GE: "Georgia",
										GF: "French Guiana",
										GG: "Guernsey",
										GH: "Ghana",
										GI: "Gibraltar",
										GL: "Greenland",
										GM: "Gambia",
										GN: "Guinea",
										GP: "Guadeloupe",
										GQ: "Equatorial Guinea",
										GR: "Greece",
										GS: "South Georgia and the South Sandwich Islands",
										GT: "Guatemala",
										GU: "Guam",
										GW: "Guinea-Bissau",
										GY: "Guyana",
										HK: "Hong Kong",
										HM: "Heard Island and McDonald Islands",
										HN: "Honduras",
										HR: "Croatia",
										HT: "Haiti",
										HU: "Hungary",
										ID: "Indonesia",
										IE: "Ireland",
										IL: "Israel",
										IM: "Isle of Man",
										IN: "India",
										IO: "British Indian Ocean Territory",
										IQ: "Iraq",
										IR: "Iran",
										IS: "Iceland",
										IT: "Italy",
										JE: "Jersey",
										JM: "Jamaica",
										JO: "Jordan",
										JP: "Japan",
										KE: "Kenya",
										KG: "Kyrgyzstan",
										KH: "Cambodia",
										KI: "Kiribati",
										KM: "Comoros",
										KN: "Saint Kitts and Nevis",
										KP: "North Korea",
										KR: "South Korea",
										KW: "Kuwait",
										KY: "Cayman Islands",
										KZ: "Kazakhstan",
										LA: "Laos",
										LB: "Lebanon",
										LC: "Saint Lucia",
										LI: "Liechtenstein",
										LK: "Sri Lanka",
										LR: "Liberia",
										LS: "Lesotho",
										LT: "Lithuania",
										LU: "Luxembourg",
										LV: "Latvia",
										LY: "Libya",
										MA: "Morocco",
										MC: "Monaco",
										MD: "Moldova",
										ME: "Montenegro",
										MF: "Saint Martin",
										MG: "Madagascar",
										MH: "Marshall Islands",
										MK: "Macedonia",
										ML: "Mali",
										MM: "Myanmar",
										MN: "Mongolia",
										MO: "Macao",
										MP: "Northern Mariana Islands",
										MQ: "Martinique",
										MR: "Mauritania",
										MS: "Montserrat",
										MT: "Malta",
										MU: "Mauritius",
										MV: "Maldives",
										MW: "Malawi",
										MX: "Mexico",
										MY: "Malaysia",
										MZ: "Mozambique",
										NA: "Namibia",
										NC: "New Caledonia",
										NE: "Niger",
										NF: "Norfolk Island",
										NG: "Nigeria",
										NI: "Nicaragua",
										NL: "Netherlands",
										NO: "Norway",
										NP: "Nepal",
										NR: "Nauru",
										NU: "Niue",
										NZ: "New Zealand",
										OM: "Oman",
										PA: "Panama",
										PE: "Peru",
										PF: "French Polynesia",
										PG: "Papua New Guinea",
										PH: "Philippines",
										PK: "Pakistan",
										PL: "Poland",
										PM: "Saint Pierre and Miquelon",
										PN: "Pitcairn",
										PR: "Puerto Rico",
										PS: "Palestinian Territory",
										PT: "Portugal",
										PW: "Palau",
										PY: "Paraguay",
										QA: "Qatar",
										RE: "Reunion",
										RO: "Romania",
										RS: "Serbia",
										RU: "Russia",
										RW: "Rwanda",
										SA: "Saudi Arabia",
										SB: "Solomon Islands",
										SC: "Seychelles",
										SD: "Sudan",
										SE: "Sweden",
										SG: "Singapore",
										SH: "Saint Helena",
										SI: "Slovenia",
										SJ: "Svalbard and Jan Mayen",
										SK: "Slovakia",
										SL: "Sierra Leone",
										SM: "San Marino",
										SN: "Senegal",
										SO: "Somalia",
										SR: "Suriname",
										SS: "South Sudan",
										ST: "Sao Tome and Principe",
										SV: "El Salvador",
										SX: "Sint Maarten",
										SY: "Syria",
										SZ: "Swaziland",
										TC: "Turks and Caicos Islands",
										TD: "Chad",
										TF: "French Southern Territories",
										TG: "Togo",
										TH: "Thailand",
										TJ: "Tajikistan",
										TK: "Tokelau",
										TL: "East Timor",
										TM: "Turkmenistan",
										TN: "Tunisia",
										TO: "Tonga",
										TR: "Turkey",
										TT: "Trinidad and Tobago",
										TV: "Tuvalu",
										TW: "Taiwan",
										TZ: "Tanzania",
										UA: "Ukraine",
										UG: "Uganda",
										UM: "United States Minor Outlying Islands",
										US: "United States",
										UY: "Uruguay",
										UZ: "Uzbekistan",
										VA: "Vatican",
										VC: "Saint Vincent and the Grenadines",
										VE: "Venezuela",
										VG: "British Virgin Islands",
										VI: "U.S. Virgin Islands",
										VN: "Vietnam",
										VU: "Vanuatu",
										WF: "Wallis and Futuna",
										WS: "Samoa",
										XK: "Kosovo",
										YE: "Yemen",
										YT: "Mayotte",
										ZA: "South Africa",
										ZM: "Zambia",
										ZW: "Zimbabwe",
									}}
									fullWidth
									required
									validate
								/>
							</Grid>

							<Grid item md={12} className={"py-4"}>
								<RadioGroup
									name={`stages.${stage}.currency`}
									label="Pay in"
									value={values?.currency || ""}
									options={["USD", "KES"]}
									onChange={handleOnTextfieldChange(`stages.${stage}.currency`)}
									rules={{
										validate: {
											isNotEmpty: v => !String.isEmpty(v) || "Currency is Required",
										},
									}}
									row
								/>
							</Grid>

							<Grid item md={12} className={"py-4"}>
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
											isNotEmpty: v => !String.isEmpty(v) || "Password is Required",
										},
									}}
									required
									fullWidth
								/>
							</Grid>

							<Grid item md={12} className={"py-4"}>
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
											isNotEmpty: v => !String.isEmpty(v) || "Password confirmation is Required",
										},
									}}
									required
									fullWidth
								/>
							</Grid>

							<Grid item className="flex flex-col xs:items-center md:items-end md:px-20 py-8 mb-20">
								<Button onClick={handleSubmit(submit)} disabled={!isValid} color="accent" variant="contained">
									Continue to Checkout
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<Dialog
				open={state.previewDialogOpen}
				onClose={handleOnClosePreviewDialog}
				aria-labelledby="review-dialog-title"
				aria-describedby="review-dialog-description"
			>
				<DialogTitle id="review-dialog-title">{state.previewDialogTitle}</DialogTitle>
				<DialogContent>
					<DialogContentText id="review-dialog-description">{state.previewDialogContent}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleOnClosePreviewDialog} color={"error"} autoFocus>
						Dismiss
					</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	)
};

export default Stage;
