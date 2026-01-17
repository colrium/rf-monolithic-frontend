/** @format */

import React, { useCallback } from "react"
import Snackbar from "@mui/material/Snackbar"
import Grid from "@mui/material/Grid"
import LoadingButton from "@mui/lab/LoadingButton"
import Alert from "@mui/material/Alert"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import GoogleIcon from "@mui/icons-material/Google"
import MailIcon from "@mui/icons-material/Mail"
import { useSearchParams, useNavigate } from "react-router-dom"
import { usePersistentForm, useDidMount, useSetState } from "hooks"
import { Link } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { useNetworkServices, useNotificationsQueue } from "contexts"
import { GoogleLoginButton } from "views/forms/Auth/OAuth"

const SignupForm = React.forwardRef((props, ref) => {
	const { username, password, onSubmit, onSubmitSuccess, onSubmitError, googleLoginProps, ...rest } = props || {}

	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth)
	const authSettings = useSelector(state => ({ ...state?.app.settings?.auth }))
	const navigateTo = searchParams.get("navigateTo") || "/home".toUriWithDashboardPrefix()
	const { Api } = useNetworkServices()
	const { queueNotification } = useNotificationsQueue()

	const [state, setState] = useSetState({
		submitting: false,
		alert: false,
		showEmail: true,
		strategy: null,
	})

	const { submit, TextField, Autocomplete, RadioGroup, getValues, setValue, resetValues, formState } = usePersistentForm({
		name: `user-signup-form`,
		mode: "onChange",
		reValidateMode: "onChange",
		// volatile: true,
		defaultValues: { country: "KE", interest: "demo" },
		onSubmit: async (formData, e) => {
			return await Api.post("/signup", formData)
				.then(res => {
					if (formData.interest === "demo") {
						queueNotification({
							severity: "success",
							content: `Signup request successfull! Thank you for your interest in Realfield! We will be in touch shortly to schedule your demo at your convenience. `,
						})
					} else if (formData.interest === "quote") {
						queueNotification({
							severity: "success",
							content: `Signup request successfull! We will be in touch directly to arrange a time to discuss your project and how we can provide you with the data you need. Realfield Team`,
						})
						let quoteData = { ...formData }
						delete quoteData.password
						delete quoteData.repeat_password

						const newParams = new URLSearchParams(quoteData).toString()
						navigate(`/compose-project?${newParams}`.toUriWithLandingPagePrefix())
					} else {
						queueNotification({
							severity: "success",
							content: `Signup request successfull! `,
						})
						navigate(`/community`.toUriWithLandingPagePrefix())
					}

					if (Function.isFunction(onSubmitSuccess)) {
						onSubmitSuccess(res)
					}
					resetValues()
				})
				.catch(err => {
					console.error("err", err)
					queueNotification({
						severity: "error",
						content: `Signup request failed. ${err.msg || "Something went wrong!"}`,
					})
					if (Function.isFunction(onSubmitError)) {
						onSubmitError(err)
					}
				})
		},
	})

	const onGoogleSuccess = ({ data, res }) => {
		if (data.interest === "demo") {
			queueNotification({
				severity: "success",
				content: `Signup request successfull! Thank you for your interest in Realfield! We will be in touch shortly to schedule your demo at your convenience. `,
			})
		} else if (data.interest === "quote") {
			queueNotification({
				severity: "success",
				content: `Signup request successfull! Thank you for your interest in Realfield! We will be in touch shortly`,
			})
			let quoteData = { ...data }
			delete quoteData.password
			delete quoteData.repeat_password

			const newParams = new URLSearchParams(quoteData).toString()
			navigate(`/compose-project?${newParams}`.toUriWithLandingPagePrefix())
		} else {
			queueNotification({
				severity: "success",
				content: `Signup request successfull! `,
			})
			navigate(`/community`.toUriWithLandingPagePrefix())
		}
	}

	const onGoogleError = ({ data, error }) => {
		// queueNotification({
		// 	severity: "error",
		// 	content: `Signup failed! ${error.message || error.msg || "Something went wrong!"}`,
		// })
	}

	return (
		<Grid container {...rest} component="form" onSubmit={submit} ref={ref}>
			<Grid container>
				<Grid item xs={12} md={6} className="my-4 px-4 flex flex-col">
					<TextField
						variant="filled"
						name={`first_name`}
						label="First Name"
						placeholder="First Name"
						rules={{
							required: "First Name is required.",
						}}
						fullWidth
						required
						validate
					/>
				</Grid>
				<Grid item xs={12} md={6} className="my-4 px-4 flex flex-col">
					<TextField
						variant="filled"
						name={`last_name`}
						label="Last Name"
						placeholder="Last Name"
						rules={{
							required: "Last Name is required.",
						}}
						fullWidth
						required
						validate
					/>
				</Grid>
				<Grid item xs={12} md={6} className="my-4 px-4 flex flex-col">
					<TextField
						type="email"
						variant="filled"
						name={`email_address`}
						label="Email address"
						placeholder="email@example.com"
						rules={{
							required: "Email address is required.",
							pattern: {
								value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: "Invalid Email Address",
							},
						}}
						fullWidth
						required
						validate
					/>
				</Grid>
				<Grid item xs={12} md={6} className="my-4 px-4 flex flex-col">
					<Autocomplete
						variant="filled"
						name={`country`}
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
				<Grid item xs={12} md={6} className="my-4 px-4 flex flex-col">
					<TextField
						type="password"
						variant="filled"
						name={`password`}
						label="Password"
						placeholder="Password"
						rules={{
							required: "Password is required.",
						}}
						fullWidth
						required
						validate
					/>
				</Grid>
				<Grid item xs={12} md={6} className="my-4 px-4 flex flex-col">
					<TextField
						type="password"
						variant="filled"
						name={`repeat_password`}
						label="Repeat Password"
						placeholder="Confirm Password"
						rules={{
							required: "Password is required.",
							deps: [`password`],
							validate: {
								matchesPassword: val => getValues().password === val || "Should match password",
							},
						}}
						fullWidth
						required
						validate
					/>
				</Grid>

				<Grid item xs={12} className="my-4 px-4 flex flex-col">
					<RadioGroup
						name={`interest`}
						label="Interest"
						options={{ demo: "Demo", quote: "Quote", community: "Community" }}
						rules={{
							required: "Interest is required.",
						}}
						fullWidth
						validate
					/>
				</Grid>
				<Grid item xs={12} className="flex flex-row justify-center items-center my-4">
					<LoadingButton
						disabled={!formState.isValid || formState.isSubmitting}
						loading={formState.isSubmitting}
						className="capitalize rounded-full px-8"
						variant="contained"
						sx={
							{
								// color: theme => theme.palette.text.primary,
								// backgroundColor: theme => theme.palette.background.paper,
							}
						}
						type="submit"
					>
						Submit
					</LoadingButton>
				</Grid>
			</Grid>

			{!String.isEmpty(getValues().interest) && (
				<Grid container>
					<Grid item xs={12} className="flex flex-col justify-center my-4 items-center">
						<GoogleLoginButton
							onSuccess={onGoogleSuccess}
							onError={onGoogleError}
							postData={{ interest: getValues().interest }}
							{...googleLoginProps}
						/>
					</Grid>
				</Grid>
			)}
		</Grid>
	)
})

export default React.memo(SignupForm)
