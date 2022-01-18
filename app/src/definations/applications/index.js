/** @format */

import IconButton from "@mui/material/IconButton";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	HowToVoteOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@mui/icons-material";
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Button from "components/Button";
import React, { useEffect, useState, useCallback } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom";
import { CountriesHelper, UtilitiesHelper } from "utils/Helpers";
import { useGlobals } from "contexts/Globals";
import { useGooglePlaces, useGeoLocation } from "hooks";
import { JSONViewDialog } from "components/JSONView";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import { useSetState } from 'hooks';
import compose from "recompose/compose";
import { apiCallRequest, setEmailingCache, clearEmailingCache, closeDialog, openDialog } from "state/actions";

let currentDate = new Date();

const ke_regions = CountriesHelper.administrative_features_options("KE", 2, "Nairobi");



const ConvertToUserIconAction = (props) => {
	const { data:application, layoutType, apiCallRequest, setEmailingCache, clearEmailingCache, closeDialog, openDialog, auth, ...rest } = props;
	const { definations, sockets } = useGlobals();
	const [staffID, setStaffID] = useState(String.uid(8, false, true));
	const [loading, setLoading] = useState(false);
	const [userAccountDialogOpen, setUserAccountDialogOpen] = useState(false);
	const [error, setError] = useState(false);
	const [initiated, setInitiated] = useState(false);
	const [emailCacheTouched, setEmailCacheTouched] = useState(false);
	const [state, setState, getState] = useSetState({
		userAccountDialog: {
			open: false,
			src: JSON.isJSON(application?.user)? application?.user : {}
		},
		userAccount: JSON.isJSON(application?.user)? application?.user : false
	})

	const handleCreateApplicantUserAccount = (sendEmail = false) => {
		setLoading(true);
		setError(false);
		let accountDetails = JSON.fromJSON(application);
		delete accountDetails["_id"];
		delete accountDetails["entry"];
		accountDetails.staff_id = staffID;
		accountDetails.password = staffID;
		accountDetails.status = "active";
		apiCallRequest("applications",
			{
				uri: "/recruitment/applications/" + application._id + "/create-user",
				type: "create",
				params: { p: "1" },
				data: accountDetails,
				cache: true,
				silent: true,
			}
		).then(res => {
			const { data } = res.body;


			if (sendEmail) {
				setEmailingCache("recipient_address", data.email_address);
				setEmailingCache("recipient_name", data.first_name);
				setEmailingCache("subject", "Your Realfield user account");
				setEmailingCache("content", `Hey ${data.first_name},\n\n\n
				Here are your unique login details.\n\n\n
				Username: ${application.email_address} \n
				Password: ${(!String.isEmpty(data.staffID) ? data.staffID : staffID)} \n\n\n
				When you login into app things are pretty self-explanatory and under the Reading tab, you'll find a stack of materials we'd like you to review over the next few days.\n
				You'll see a Realfield Training Manual and a number of other great resources for you to review.\nThe training will consist of a number elements that might start with a short quiz. 
				\nDon't worry, the purpose of the quiz is to give us an idea of where we need to provide additional support, it's not designed to catch you out.\n
				Following the quiz, we'll be scheduling a number of live sessions. These sessions are really important and designed to help us test our platform.\n
				They will also help us test things like responsiveness and accuracy, and each of the live sessions will be time sensitive. 
				For example, you may be given a number of hours or a couple of days to complete the training assignment.\n
				Many of you have been writing in with encouragement and questions, and we love it! If you have questions, 
				want to offer feedback or need support, please continue to use the jobs@realfield.io address.\n
				Asante sana and have an amazing week!!\n\n\n
				Realfield People Ops`);
				setEmailingCache("context", "Application");
				setEmailingCache("record", application._id);
				setEmailingCache("popup_open", true);
				setEmailCacheTouched(true);

			}

			setError(false);
			setLoading(false);
		}).catch(e => {


			let errMsg = e;
			if (JSON.isJSON(e)) {
				if (String.isString(e.error)) {
					errMsg = e.error;
				}
				else if (String.isString(e.message)) {
					errMsg = e.message;
				}
				else if (String.isString(e.msg)) {
					errMsg = e.msg;
				}
				else {
					errMsg = JSON.stringify(e);
				}
			}
			else {
				errMsg = e.toString();
			}
			setError(errMsg);
			setLoading(false);
		});
	}

	const handleOnCreateUserAccountConfirm = () => {
		openDialog({
			title: "Add " + application.first_name + " " + application.last_name + " as a new user?",
			body:
				"A new user account will be created for <b> " + application.first_name + " " + application.last_name + "</b> with the staff ID: <b>" + staffID + "</b> and the following credentials.<br /><br /> <b> Username:</b>" + application.email_address + " <br /> <b>Password:</b>" + staffID,
			actions: {
				cancel: {
					text: "Cancel",
					color: "default",
					onClick: () => {
						closeDialog();
						setError(false);
						setLoading(false);
					},
				},
				create: {
					text: "Create",
					color: "secondarys",
					onClick: () => {
						closeDialog();
						handleCreateApplicantUserAccount(false);

					},
				},
				create_send_mail: {
					text: "Create and send Email",
					color: "primary",
					onClick: () => {
						closeDialog();
						try {
							handleCreateApplicantUserAccount(true);
						} catch (err) {
							console.error("try handleCreateApplicantUserAccount err", err)
						}

					},
				},
			},
		});
	}

	const handleOnShowUser = useCallback(() => {
		const {userAccount} = getState()
		let userAccountObj = userAccount;
		if (JSON.isJSON(application?.user)) {
			userAccountObj = application?.user
		}
		else if (JSON.isEmpty(userAccount) && String.isString(application?.user) && !String.isEmpty(application?.user)) {
			//Fetch user Account
		}
		if (JSON.isJSON(userAccountObj)) {
			try {
				let profObject = JSON.fromJSON(userAccountObj);
				delete profObject["password"];
				delete profObject["__v"];
				delete profObject["preferences"];
				delete profObject["login_attempts"];
				delete profObject["last_login_attempt"];
				delete profObject["account_verified"];
				delete profObject["account_verifacation_code"];
				delete profObject["account_verifacation_mode"];
				delete profObject["password_reset_code"];
				delete profObject["password_reset_code_expiration"];
				delete profObject["provider"];
				delete profObject["provider_account_id"];
				delete profObject["provider_handle"];
				delete profObject["provider_url"];
				setState({
					userAccountDialog: {
						open: true, 
						src: profObject, 
						title: `User Account for  ${application.first_name} ${application.last_name}`
					},
					userAccount: profObject,
				})
			} catch (e) {

			}
		}
			
		
	}, [application])

	const checkStaffIDAvailability = () => {
		setLoading(true);
		setError(false);
		apiCallRequest("users",
			{
				uri: "/users",
				type: "records",
				params: { p: "1", staff_id: staffID },
				data: {},
				cache: false,
				silent: true,
			}
		).then(res => {
			const { data } = res.body;
			if (Array.isArray(data)) {
				if (data.length > 0) {
					let staff_id = String.uid(8, false, true);
					setStaffID(staff_id);
				}
				else {
					handleOnCreateUserAccountConfirm();
				}
			}
		}).catch(e => {
			let errMsg = e;
			if (JSON.isJSON(e)) {
				if (String.isString(e.error)) {
					errMsg = e.error;
				}
				else if (String.isString(e.message)) {
					errMsg = e.message;
				}
				else if (String.isString(e.msg)) {
					errMsg = e.msg;
				}
				else {
					errMsg = JSON.stringify(e);
				}
			}
			else {
				errMsg = e.toString();
			}
			setError(errMsg);
			setLoading(false);
		});

	}





	useEffect(() => {
		if (initiated) {
			if (!application.user) {
				checkStaffIDAvailability();
			}
			else {
				handleOnShowUser();
			}
		}
	}, [initiated, staffID]);

	useEffect(() => {
		return () => {
			if (emailCacheTouched) {
				clearEmailingCache();
			}
		}
	}, [emailCacheTouched]);

	return (
		<React.Fragment>
			{loading && <CircularProgress size={16} color="secondary" />}
			{ !loading && <JSONViewDialog {...state.userAccountDialog} onClose={()=>setState({userAccountDialog: {open: false, src: {}}})} />}
			{(layoutType === "inline" && !loading) && <IconButton
				color={application?.user ? "secondary" : "inherit"}
				aria-label="Translate to user"
				onClick={() => {
					if (initiated) {
						if (!application?.user && !(JSON.isJSON(state.userAccount) || !JSON.isEmpty(state.userAccount))) {
							checkStaffIDAvailability();
						}
						else {
							handleOnShowUser();
						}
					}
					else {
						setInitiated(true);
					}
				}}
				{...rest}
			>
				{!application?.user && (!JSON.isJSON(state.userAccount) || JSON.isEmpty(state.userAccount)) && <PersonAddOutlinedIcon fontSize="inherit" />}
				{!!application?.user && <AccountCircleOutlinedIcon fontSize="inherit" />}
			</IconButton>}
			{error && <Snackbar open={Boolean(error)} autoHideDuration={10000} onClose={() => setError(false)}>
				<Alert elevation={6} variant="filled" onClose={() => setError(false)} severity="error">
					{error}
				</Alert>
			</Snackbar>}
		</React.Fragment>
	)

};

ConvertToUserIconAction.defaultProps = {
	layoutType: "inline",
}

const mapStateToProps = state => ({
	auth: state.auth,
	cache: state.cache,
});

const ConvertToUserIconActionComponent = compose(
	connect(mapStateToProps, { apiCallRequest, setEmailingCache, clearEmailingCache, closeDialog, openDialog }),
	withTheme,
)(ConvertToUserIconAction);

export default {
	name: "applications",
	label: "Applications",
	icon: <DefinationContextIcon />,
	color: "#009688",
	model: "Application",
	endpoint: "/recruitment/applications",
	cache: true,
	views: {
		single: {
			default: "cardview",
		},
		listing: {
			default: "tableview",
			tableview: {
				avatar: false,
				title: ["title"],
			},
		},
	},
	scope: {
		columns: {
			vacancy: {
				type: "string",
				label: "Position",
				input: {
					type: "select",
					required: true,
					props: {
						margin: "dense",
						classes: {
							inputRoot: "inverse",
						}
					},
				},
				reference: {
					name: "vacancies",
					service_query: { pagination: -1, active: 1, below: Date.now() },
					resolves: {
						value: "_id",
						display: {
							primary: ["position"],
							secondary: [],
							avatar: false,
						},
					},
				},
			},

			submission_date: {
				type: "date",
				label: "Submission Date",
				input: {
					type: "hidden",
					required: true,
					props: {
						margin: "dense",
						classes: {
							inputRoot: "inverse",
						},
					},
				},

			},

			/*honorific: {
				type: "string",
				label: "Honorific",
				input: {
					type: "text",
					default: "",
					required: false,
				},		
			},*/

			first_name: {
				type: "string",
				label: "First name",
				input: {
					type: "text",
					required: true,
					size: 6,

				},
			},

			last_name: {
				type: "string",
				label: "Last name",
				input: {
					type: "text",
					default: "",
					required: true,
					size: 6,

				},
			},

			email_address: {
				type: "string",
				label: "Email address",
				icon: "email",
				input: {
					type: "email",
					default: "",
					required: true,

				},
			},

			phone_number: {
				type: "string",
				label: "Phone number",
				input: {
					type: "phone",
					default: "",
					required: false,

				},
			},

			gender: {
				type: "string",
				label: "Gender",
				input: {
					type: "select",
					default: "",
					required: false,
					props: {
						freeSolo: true,
					},
				},
				possibilities: {
					male: "Male",
					female: "Female",
					nonbinary: "Nonbinary",
					transgender: "Transgender",
					prefer_not_to_say: "Prefer not to say",
				},
			},

			dob: {
				type: "date",
				label: "Date of birth",
				input: {
					type: "date",
					default: new Date().setFullYear(currentDate.getFullYear() - 18),
					required: false,
					props: {
						maxDate: new Date().setFullYear(currentDate.getFullYear() - 18),
						format: "DD/MM/YYYY",
						margin: "dense",
						InputProps: {
							classes: {
								root: "inverse",
							}
						}
					},
				},
			},

			address: {
				type: "string",
				label: "Address",
				input: {
					type: "text",
					default: "",
					required: false,

				},
			},

			country: {
				type: "string",
				label: "Country",
				icon: "folder",
				input: {
					type: "select",
					//default: "KE",
					required: true,
					props: {
						margin: "dense",
						classes: {
							inputRoot: "inverse",
						},
					},
				},
				possibilities: CountriesHelper.names(),
			},



			administrative_level_1: {
				type: "string",
				label: "Region/County/Province",
				input: {
					type: "select",
					required: true,
					props: {
						freeSolo: true,
						margin: "dense",
						classes: {
							inputRoot: "inverse",
						},
					},
				},
				possibilities: async (values, user) => {
					//
					if (JSON.isJSON(values) && !String.isEmpty(values.country)) {
						return await CountriesHelper.administrative_features_options(values.country, 1).then(data => { return data }).catch(err => { return {} });
					}
					return {};

				}

			},



			administrative_level_2: {
				type: "string",
				label: "Sub County/Sub Region/District",
				input: {
					type: "select",
					default: "",
					required: false,
					props: {
						freeSolo: true,
						margin: "dense",
						classes: {
							inputRoot: "inverse",
						},
					}
				},
				possibilities: async (values, user) => {
					if (JSON.isJSON(values) && !String.isEmpty(values.country) && !String.isEmpty(values.administrative_level_1)) {
						return await CountriesHelper.administrative_features_options(values.country, 2, values.administrative_level_1).then(data => {
							return data;
						}).catch(err => {
							return {};
						});
					}
					return {};

				}
			},

			administrative_level_3: {
				type: "string",
				label: "Ward/Locality/Municipality",
				input: {
					type: "select",
					default: "",
					required: false,
					props: {
						margin: "dense",
						classes: {
							inputRoot: "inverse",
						},
					}

				},
				possibilities: async (values, user) => {
					if (JSON.isJSON(values) && !String.isEmpty(values.country) && !String.isEmpty(values.administrative_level_2)) {
						return await CountriesHelper.administrative_features_options(values.country, 3, values.administrative_level_2).then(data => {
							return data;
						}).catch(err => {
							return {};
						});
					}
					return {};

				}
			},
			region: {
				type: "string",
				label: "Region/County/Province",
				input: {
					type: "hidden",
					required: true,
					props: {
						freeSolo: true,
						margin: "dense",
						classes: {
							inputRoot: "inverse",
						},
					},
				},
				possibilities: async (values, user) => {
					//
					if (JSON.isJSON(values) && !String.isEmpty(values.country)) {
						return await CountriesHelper.administrative_features_options(values.country, 1).then(data => { return data }).catch(err => { return {} });
					}
					return {};

				}

			},



			subcounty: {
				type: "string",
				label: "Sub County/Sub Region/District",
				input: {
					type: "hidden",
					default: "",
					required: false,
					props: {
						freeSolo: true,
						margin: "dense",
						classes: {
							inputRoot: "inverse",
						},
					}
				},
				possibilities: async (values, user) => {
					if (JSON.isJSON(values) && !String.isEmpty(values.country) && !String.isEmpty(values.region)) {
						return await CountriesHelper.administrative_features_options(values.country, 2, values.region).then(data => {
							return data;
						}).catch(err => {
							return {};
						});
					}
					return {};

				}
			},

			ward: {
				type: "string",
				label: "Ward/Locality",
				input: {
					type: "hidden",
					default: "",
					required: false,
					props: {
						margin: "dense",
						classes: {
							inputRoot: "inverse",
						},
					}

				},
				possibilities: async (values, user) => {
					if (JSON.isJSON(values) && !String.isEmpty(values.country) && !String.isEmpty(values.subcounty)) {
						return await CountriesHelper.administrative_features_options(values.country, 3, values.subcounty).then(data => {
							return data;
						}).catch(err => {
							return {};
						});
					}
					return {};

				}
			},

			locale: {
				type: "string",
				label: "City/Town",
				input: {
					type: "text",
					default: "",
					required: false,

				},
			},

			education: {
				type: "string",
				label: "Education",
				input: {
					type: "select",
					default: "",
					required: true,
					props: {
						margin: "dense",
						classes: {
							inputRoot: "inverse",
						}
					},
				},
				possibilities: {
					technical: "Technical School",
					college: "College",
					undergraduate: "Under Graduate",
					postgraduate: "Post Graduate",
					doctorate: "Doctorate",
				},
			},

			institution: {
				type: "string",
				label: "Institution",
				input: {
					type: "text",
					default: "",
					required: true,

				},
			},

			course: {
				type: "string",
				label: "Course",
				input: {
					type: "text",
					default: "",
					required: true,

				},
			},

			cover_letter: {
				type: "string",
				label: "Cover letter",
				input: {
					type: "textarea",
					default: "",
					required: false,
					rich_text: true,

				},
				restricted: {
					display: (entry, user) => {
						return true;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},


			bio: {
				type: "string",
				label: "Bio",
				input: {
					type: "textarea",
					default: "",
					rich_text: true,
				},
				restricted: {
					display: (entry, user) => {

						return true;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},


			avatar: {
				type: "string",
				label: "Selfie",
				input: {
					type: "file",
					props: {
						acceptedFiles: ["image/*"],
						dropzoneText:
							"Click to select file \n OR \n Drag & drop your selfie here",
						filesLimit: 1,
						dropzoneIcon: "portrait",
						containerStyle: {
							background: "#FFFFFF"
						}
					},
				},
				reference: {
					name: "attachments",
					service_query: {pagination: -1, },
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["size"],
							avatar: false,
						},
					},
				},
			},

			documents: {
				type: ["string"],
				label: "Resume",
				input: {
					type: "file",
					props: {
						acceptedFiles: [
							"image/*",
							"video/*",
							"audio/*",
							"application/*",
						],
						dropzoneText: "Click to select file \n OR \n Drag & drop your Resume here",
						filesLimit: 1,
						dropzoneIcon: "insert_drive_file",
						containerStyle: {
							background: "#FFFFFF"
						}
					},
				},
				reference: {
					name: "attachments",
					service_query: {pagination: -1, },
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: [],
							avatar: false,
						},
					},
				},
			},
			government_id: {
				type: "string",
				label: "Copy of Government ID",
				input: {
					type: "file",
					size: 12,
					props: {
						acceptedFiles: ["image/*"],
						dropzoneText:
							"Click to select file \n OR \n Drag & drop your Copy of Government ID here",
						filesLimit: 1,
						dropzoneIcon: "credit_card",
						containerStyle: {
							background: "#FFFFFF"
						}
					},
				},
				reference: {
					name: "attachments",
					service_query: {pagination: -1, },
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["size"],
							avatar: false,
						},
					},
				},
			},
			source: {
				type: "string",
				label: "How did you learn about Realfield?",
				input: {
					type: "select",
					size: 12,
					props: {
						freeSolo: true,
						margin: "dense",
						classes: {
							inputRoot: "inverse",
						},
					},
				},
				possibilities: (values, user) => {
					let sources = {
						"Twitter": "Twitter",
						"Facebook": "Facebook",
						"Instagram": "Instagram",
						"LinkedIn": "LinkedIn",
						"WhatsApp": "WhatsApp",
						"University Career department": "University Career department",
						"Job Websites": "Job Websites",
						"Word of mouth": "Word of mouth",
					}
					if (JSON.isJSON(values) && values.country === "KE") {
						sources["Ajira"] = "Ajira";
					}

					return sources;
				},
			},

		},
		identity: {
			primary: ["title"],
			secondary: ["application_deadline"],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			actionlogs: {
				column: "record",
				query: { context: "Application" },
			},
		},
	},
	access: {
		restricted: user => {
			return user?.role !== "admin" && user?.role !== "collector";
		},
		view: {
			summary: user => {
				return false;
			},
			all: user => {
				
				return user?.role === "admin" || user?.role === "collector";
			},
			single: (user, record) => {
				if (user) {
					if (user.role==="admin") {
						return true;
					}
					if (record) {
						return record?.user?._id === user?._id || record?.user === user?._id;
					}
					return false;
				}
				return false;
			},
		},
		

		actions: {
			view: {
				restricted: user => (user?.role !== "admin" && user?.role !== "collector"),
				uri: entry => {
					return "applications/view/" + entry?._id;
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => (user?.role !== "admin"),
				uri: "applications/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => (user?.role !== "admin"),
				uri: entry => {
					return (
						"applications/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			create_application_user: {
				restricted: user => (user?.role !== "admin"),
				uri: entry => {
					return (
						"applications/" + entry?._id + "/user/create"
					).toUriWithDashboardPrefix();
				},
				Component: ConvertToUserIconActionComponent,
				label: "User Account",
			},
			delete: {
				restricted: user => {
					if (user) {
						return false;
					}
					return true;
				},
				uri: entry => {
					return ("answers/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
	},
};
