/** @format */

import IconButton from "@material-ui/core/IconButton";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	HowToVoteOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@material-ui/icons";
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import Button from "components/Button";
import React, {useEffect, useState} from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from "react-router-dom";
import { CountriesHelper, UtilitiesHelper } from "hoc/Helpers";
import Icon from '@mdi/react';
import { mdiAccountBoxOutline, mdiFileAccountOutline  } from '@mdi/js';
import { useGlobals } from "contexts/Globals";
import { connect } from "react-redux";
import { withTheme } from '@material-ui/core/styles';
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import compose from "recompose/compose";
import { apiCallRequest, setEmailingCache, clearEmailingCache, closeDialog, openDialog } from "state/actions";

let currentDate = new Date();

const ke_regions = CountriesHelper.regions("KE");


const Alert = (props) => {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const ConvertToUserIconAction = (props) => {
	const { application, layoutType, apiCallRequest, setEmailingCache, clearEmailingCache, closeDialog, openDialog, auth } = props;
	const { definations, sockets } = useGlobals();
	const [staffID, setStaffID] = useState(String.uid(8, false, true));
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [initiated, setInitiated] = useState(false);
	const [emailCacheTouched, setEmailCacheTouched] = useState(false);

	const handleCreateApplicantUserAccount = (sendEmail = false) => {			
			setLoading(true);
			setError(false);
			let accountDetails = JSON.fromJSON(application);
			delete accountDetails["_id"];
			delete accountDetails["entry"];
			accountDetails.staff_id = staffID;
			accountDetails.password = staffID;
			accountDetails.status = "active";
			apiCallRequest( "applications",
					{
						uri: "/recruitment/applications/"+application._id+"/create-user",
						type: "create",
						params: {p: "1"},
						data: accountDetails,
						cache: true,
						silent: true,
					}
			).then(data => {
				if (sendEmail) {
					setEmailingCache("recipient_address", data.email_address);
					setEmailingCache("recipient_name", data.first_name);
					setEmailingCache("subject", "Your qualification and new user account");
					setEmailingCache("content", "Hey "+data.first_name+", \n\nWe are glad to inform you that your application was successful. \nA new user account has been be created for you with the Staff ID: "+staffID+" and the following credentials.\n\nUsername: "+application.email_address+" \nPassword: "+staffID+"\n\nBe sure to change your password once you login. \nWe look forward to working with you.\nWelcome aboard!\n\n\n"+auth.user.first_name+"\nRealfield.io");
					setEmailingCache("context", "Application");
					setEmailingCache("record", application._id);
					setEmailingCache("popup_open", true);
					setEmailCacheTouched(true);

				}
				console.log("handleCreateApplicantUserAccount data", data)
				
				setError(false);
				setLoading(false);					
			}).catch(e => {
				setError(e);
				setLoading(false);
			});
	}

	const handleOnCreateUserAccountConfirm = () => {
		openDialog({
			title: "Add "+application.first_name+" "+application.last_name+" as a new user?",
			body:
				"A new user account will be created for <b> "+application.first_name+" "+application.last_name+"</b> with the staff ID: <b>"+staffID+"</b> and the following credentials.<br /><br /> <b> Username:</b>"+application.email_address+" <br /> <b>Password:</b>"+staffID,
			actions: {
				cancel: {
					text: "Cancel",
					color: "default",
					onClick: () => closeDialog(),
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
						handleCreateApplicantUserAccount(true);
					},
				},
			},
		});
	}

	const handleOnShowUser = () => {
		let profileContent = '<div class="flex flex-col w-full">';
		try {
			let profObjectStr = application.user.replace(/<[^>]*>?/gm, '');
			let profObject = JSON.parse(profObjectStr);
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
			Object.entries(profObject).map(([key, value]) => {
				profileContent = profileContent+' <div class="flex flex-row w-full"><b>'+key.humanize()+': </b> <span class="flex-grow mx-2">'+value+'</span></div>';
			});
			profileContent = profileContent + '</div>';
		} catch (e) {

		}
		openDialog({
			title: "User Account for  "+application.first_name+" "+application.last_name,
			body: profileContent,
			actions: {
				cancel: {
					text: "Dismiss",
					color: "default",
					onClick: () => closeDialog(),
				},
				send_mail: {
					text: "Email",
					color: "secondary",
					onClick: () => {
						closeDialog();
					},
				},
				send_message: {
					text: "Message",
					color: "primary",
					onClick: () => {
						closeDialog();
					},
				},
				revoke: {
					text: "Revoke",
					color: "warning",
					onClick: () => {
						closeDialog();
					},
				},
				revoke_send_mail: {
					text: "Revoke and Email",
					color: "error",
					onClick: () => {
						closeDialog();
					},
				},
			},
		});
	}

	const checkStaffIDAvailability = () => {
			setLoading(true);
			setError(false);
			apiCallRequest( "users",
					{
						uri: "/users",
						type: "records",
						params: {p: "1", staff_id: staffID},
						data: {},
						cache: false,
						silent: true,
					}
			).then(data => {
				console.log("checkStaffIDAvailability data", data)
				if (Array.isArray(data)) {
					if (data.length > 0) {
						let staff_id = String.uid(8, false, true);
						setStaffID(staff_id);
					}
					else {
						handleOnCreateUserAccountConfirm();
					}
				}
				setError(false);
				setLoading(false);					
			}).catch(e => {
				setError(e);
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
			{loading && <CircularProgress color="secondary" />}
			{(layoutType === "inline" && !loading) && <IconButton
				color={application.user? "secondary" : "inherit"}
				aria-label="Create application user"
				onClick={() => {
					setInitiated(true);
				}}
			>
				{!application.user && <PersonAddOutlinedIcon fontSize="small" />}
				{application.user && <AccountCircleOutlinedIcon fontSize="small" />}
			</IconButton>}
			{error && <Snackbar open={Boolean(error)} autoHideDuration={10000} onClose={() => setError(false)}>
		        <Alert onClose={() => setError(false)} severity="error">
					{error.toString()}
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
	connect(mapStateToProps, {apiCallRequest, setEmailingCache, clearEmailingCache, closeDialog, openDialog}),
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
						classes : {
							inputRoot: "inverse",
						}
					},
				},
				reference: {
					name: "vacancies",
					service_query: { active: 1, below: Date.now() },
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
				type: "string",
				label: "Date of birth",
				input: {
					type: "date",
					default: new Date().setFullYear(currentDate.getFullYear()-18),
					required: false,
					props: {
						maxDate: new Date().setFullYear(currentDate.getFullYear()-18),
						format:"DD/MM/YYYY",
						margin: "dense",
						InputProps: { 
							classes : {
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
					default: "KE",
					required: true,
					props: {
						margin: "dense",
						classes : {
							inputRoot: "inverse",
						},
					},
				},
				possibilities: CountriesHelper.names(),
			},

			region: {
				type: "string",
				label: "Region/ County",
				input: {
					type: "select",
					default: "Nairobi",
					required: true,
					/*props: {
						freeSolo: true,
					}	*/					
				},
				possibilities: CountriesHelper.regions("KE"),
				/*possibilities: (values, user) => {
						if (JSON.isJSON(values)) {
							console.log("values.country", values.country)
							return CountriesHelper.regions(values.country);
						}
						return {};
						
					}*/
			
			},

			

			subcounty: {
				type: "string",
				label: "Sub County",
				input: {
					type: "text",
					default: "",
					required: false,
					/*props: {
						freeSolo: true,
					}*/
				},
				/*possibilities: (values, user) => {
						if (JSON.isJSON(values)) {
							return CountriesHelper.subregions(values.region);
						}
						return {};
						
				}*/
			},

			ward: {
				type: "string",
				label: "Ward",
				input: {
					type: "text",
					default: "",
					required: false,
					
				},
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
						classes : {
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
							"Click to select or Drag & drop your selfie here",
						filesLimit: 1,
						dropzoneIcon: "portrait",
						containerStyle: {
							background: "#FFFFFF"
						}
					},
				},
				reference: {
					name: "attachments",
					service_query: {},
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
				label: "Documents",
				input: {
					type: "file",
					props: {
						acceptedFiles: [
							"image/*",
							"video/*",
							"audio/*",
							"application/*",
						],
						dropzoneText: "Click to select or Drag & drop your resume/ CV here",
						filesLimit: 1,
						dropzoneIcon: "insert_drive_file",
						containerStyle: {
							background: "#FFFFFF"
						}
					},
				},
				reference: {
					name: "attachments",
					service_query: {},
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
							"Click to select or Drag & drop your Copy of Government ID here",
						filesLimit: 1,
						dropzoneIcon: "credit_card",
						containerStyle: {
							background: "#FFFFFF"
						}
					},
				},
				reference: {
					name: "attachments",
					service_query: {},
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
						classes : {
							inputRoot: "inverse",
						},
					},
				},
				possibilities: {
					"Facebook": "Facebook",
					"Instagram": "Instagram",
					"Twitter": "Twitter",
					"LinkedIn": "LinkedIn",
					"WhatsApp": "WhatsApp",
					"Word of mouth": "Word of mouth",
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
			if (user) {
				return !(user.isAdmin || user.isCollector);
			}
			return true;
		},
		view: {
			summary: user => {
				return false;
			},
			all: user => {
				if (user) {
					return user.isAdmin || user.isCollector;
				}
				return false;
			},
			single: (user, record) => {
				if (user) {
					if (user.isAdmin) {
						return true;
					}
					if (record) {
						return UtilitiesHelper.isOfType(record.user, "json")
							? record.user._id === user._id
							: record.user === user._id;
					}
					return false;
				}
				return false;
			},
		},
		actions: {
			view_single: {
				restricted: user => {
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: entry => {
					return "applications/view/" + entry._id;
				},
				link: {
					inline: {
						default: (entry, className) => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"applications/view/" + entry._id
									).toUriWithDashboardPrefix()}
									className={className}
								>
									<IconButton
										color="inherit"
										aria-label="edit"
									>
										<OpenInNewIcon fontSize="small" />
									</IconButton>
								</Link>
							);
						},
					},
				},
			},
			create: {
				restricted: user => {
					return user ? !(user.isAdmin || user.isCollector) : true;
				},
				uri: "applications/add".toUriWithDashboardPrefix(),
				link: {
					inline: {
						default: props => {
							return (
								<Link
									to={"applications/add/".toUriWithDashboardPrefix()}
									{...props}
								>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Application
									</Button>
								</Link>
							);
						},
						listing: props => {
							return "";
						},
					},
				},
			},
			update: {
				restricted: user => {
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: entry => {
					return (
						"applications/edit/" + entry._id
					).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"applications/edit/" + entry._id
									).toUriWithDashboardPrefix()}
									className={className ? className : ""}
								>
									<IconButton
										color="inherit"
										aria-label="edit"
									>
										<EditIcon fontSize="small" />
									</IconButton>
								</Link>
							);
						},
					},
				},
			},
			create_application_user: {
				restricted: user => {
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: entry => {
					return (
						"applications/" + entry._id + "/user/create"
					).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {},
						listing: (entry, className = "grey_text") => {
							return (
								<ConvertToUserIconActionComponent application={entry} />
							);
						},
					},
				},
			},
			delete: {
				restricted: user => {
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: entry => {
					return (
						"applications/delete/" + entry._id
					).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (id, className = "error_text") => {},
						listing: (id, className = "error_text", onClick) => {
							return (
								<IconButton
									color="inherit"
									className={className ? className : ""}
									aria-label="delete"
									onClick={onClick}
								>
									<DeleteIcon fontSize="small" />
								</IconButton>
							);
						},
					},
				},
			},
		},
	},
};
