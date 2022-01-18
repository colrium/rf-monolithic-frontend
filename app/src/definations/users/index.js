import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	PeopleOutlined as DefinationContextIcon,
	PersonOutlined as EntryIcon,
} from "@mui/icons-material";
import Button from "components/Button";
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { CountriesHelper } from "utils/Helpers";
import compose from "recompose/compose";
import { apiCallRequest, setEmailingCache, clearEmailingCache, closeDialog, openDialog } from "state/actions";
import IconButton from "@mui/material/IconButton";
import { withTheme } from '@mui/styles';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useGlobals } from "contexts/Globals";
import { connect } from "react-redux";
import Typography from "components/Typography";
import Avatar from "components/Avatar";
import ApiService from "services/Api";

const presences = {
	online: { label: "Online", color: "#4caf50" },
	away: { label: "Away", color: "#ffab00" },
	offline: { label: "Offline", color: "#4caf50" },
};



const EmailUserAction = (props) => {
	const { apiCallRequest, setEmailingCache, clearEmailingCache, closeDialog, openDialog, auth, cache, data, ...rest } = props;

	const handleOnClick = useCallback(() => {
		if (!!data && !!data?._id) {
			clearEmailingCache();
			setEmailingCache("recipient_address", data.email_address);
			setEmailingCache("recipient_name", data.first_name);
			setEmailingCache("subject", "");
			setEmailingCache("content", "Hey " + data.first_name + ", \n\n\n\n\n" + auth.user.first_name + "\nRealfield.io");
			setEmailingCache("popup_open", true);
		}
			
	}, [data] );


	return (
		<IconButton
				color={"secondary"}
				aria-label="Send Email"
				{...rest}
				onClick={handleOnClick}
			>
				<MailOutlineIcon fontSize="inherit" />
		</IconButton>
	)

};

EmailUserAction.defaultProps = {
	layoutType: "inline",
}

const mapStateToProps = state => ({
	auth: state.auth,
	cache: state.cache,
});

const EmailUserActionComponent = compose(
	connect(mapStateToProps, { setEmailingCache, clearEmailingCache, closeDialog, openDialog }),
	withTheme,
)(EmailUserAction);

export default {
	name: "users",
	label: "Users",
	icon: <DefinationContextIcon />,
	color: "#01579b",
	model: "User",
	endpoint: "/users",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {
				avatar: "avatar",
				title: ["honorific", "first_name", "last_name"],
				subtitle: ["email_address"],
				tags: ["status", "presence"],
				body: [
					"phone_number",
					"address",
					"contacts",
					"user_sector",
					"company",
					"job_title",
					"country",
					"region",
					"city",
					"location_type",
					"location",
					"provider",
					"provider_account_id",
				],
			},
		},
		listing: {
			default: "tableview",
			listview: {
				avatar: false,
				resolveData: async (entries, user = null, isPopulated = true) => {
					let resolved_data = [];
					if (Array.isArray(entries)) {
						resolved_data = entries.map((entry, index) => {
							return {
								id: entry?._id,
								icon: isPopulated && entry.avatar ? null : (<EntryIcon />),
								avatar: (isPopulated && entry.avatar ? (
									<Avatar
										alt={entry.first_name}
										src={ApiService.getAttachmentFileUrl(entry.avatar)}
									/>
								) : null),
								title: (<Typography
									className={"truncate"}
									component="p"
									variant="body1"

								>
									{entry.first_name + " " + entry.last_name}
								</Typography>),
								body: (
									<React.Fragment>
										{entry.email_address && <Typography
											component="p"
											className={"truncate"}
											variant="body2"

										>
											{entry.email_address}
										</Typography>}

										{entry.role && <Typography
											component="p"
											variant="body2"

										>
											{entry.role}
										</Typography>}


									</React.Fragment>
								),
							};
						});
					}
					return resolved_data;
				},
			},
			tableview: {
				avatar: entry => {
					return;
				},
				title: ["first_name", "last_name"],
			},
		},
	},
	scope: {
		columns: {
			honorific: {
				type: "string",
				label: "Honorific",
				input: {
					type: "text",
					default: "",
					required: false,
					size: 2,
				},
			},
			first_name: {
				type: "string",
				label: "First name",
				input: {
					type: "text",
					default: "",
					required: true,
					size: 5,
				},
			},
			last_name: {
				type: "string",
				label: "Last name",
				input: {
					type: "text",
					default: "",
					required: true,
					size: 5,
				},
			},
			email_address: {
				type: "string",
				label: "Email address",
				input: {
					type: "email",
					default: "",
					required: true,
				},
			},
			phone_number: {
				type: "string",
				label: "Phone number",
				icon: "label",
				input: {
					type: "phone",
					default: "",
					required: false,
				},
			},
			staff_id: {
				type: "string",
				label: "Staff ID",
				icon: "label",
				input: {
					type: "text",
					required: false,
				},
			},
			presence: {
				type: "string",
				label: "Presence",
				input: {
					type: "radio",
					default: "online",
					required: false,
				},

				possibilities: {
					online: "Online",
					away: "Away",
					offline: "Offline",
				},

				colors: {
					online: "#4caf50",
					away: "#ffab00",
					offline: "#f44336",
				},
			},
			locale: {
				type: "string",
				label: "Locale",
				input: {
					type: "text",
					required: false,
				},
			},
			gender: {
				type: "string",
				label: "Gender",
				input: {
					type: "select",
					default: "male",
					required: true,
				},

				possibilities: {
					female: "Female",
					male: "Male",
					other: "Other",
				},
			},

			address: {
				type: "string",
				label: "address",
				input: {
					type: "textarea",
					default: "",
					required: false,
				},
			},
			contacts: {
				type: "string",
				label: "Other contacts",
				input: {
					type: "textarea",
					default: "",
					required: false,
				},
			},
			job_title: {
				type: "string",
				label: "Job title",
				icon: "work",
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
					default: "",
					required: true,
				},
				possibilities: CountriesHelper.names(),
			},

			region: {
				type: "string",
				label: "State/Province/Region/County",
				input: {
					type: "text",
					default: "",
					required: false,
				},
			},

			city: {
				type: "string",
				label: "City/Town",
				input: {
					type: "text",
					default: "",
					required: false,
				},
			},

			company: {
				type: "string",
				label: "Company",
				icon: "folder",
				input: {
					type: "text",
					default: "",
					required: false,
				},
			},
			user_sector: {
				type: "string",
				label: "User sector",
				icon: "folder",
				input: {
					type: "select",
					default: "",
					required: false,
				},

				possibilities: {
					academic: "Academic",
					researcher: "Researcher",
					public_sector: "Public Sector",
					private_sector: "Private Sector",
					ngo: "NGO",
					individual: "Individual",
				},
			},

			avatar: {
				type: "string",
				label: "Avatar",
				input: {
					type: "file",
					props: {
						acceptedFiles: ["image/*"],
						filesLimit: 1,
						dropzoneText:
							"Click to select or drag n drop image file here",
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

			documents: {
				type: ["string"],
				label: "Documents",
				input: {
					type: "file",
					accepts: ["image/*", "video/*", "audio/*", "application/*"],
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

			password: {
				type: "string",
				label: "Password",
				input: {
					type: "password",
					default: "",
				},
				restricted: {
					display: (entry, user) => {
						return true;
					},
					input: (values, user) => {
						return false;
					},
				},
			},

			repeat_password: {
				type: "string",
				label: "Repeat Password",
				input: {
					type: "password",
					default: "",
				},
				restricted: {
					display: (entry, user) => {
						return true;
					},
					input: (values, user) => {
						return false;
					},
				},
			},

			login_attempts: {
				type: "integer",
				label: "Login attempts",
				icon: "folder",
				input: {
					type: "number",
					default: 0,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},
			role: {
				type: "string",
				label: "Role",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
				},
				possibilities: {
					customer: "Customer",
					collector: "Collector",
					admin: "Administrator",
				},
			},
			provider: {
				type: "string",
				label: "Provider",
				input: {
					type: "select",
					default: "local",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
				},
				possibilities: {
					local: "Local",
					google: "Google",
					facebook: "Facebook",
					twitter: "Twitter",
					linkedin: "Linkedin",
				},
			},
			provider_account_id: {
				type: "string",
				label: "Provider account id",
				icon: "folder",
				input: {
					type: "text",
					default: "",
					required: false,
				},
			},

			status: {
				type: "string",
				label: "Status",
				icon: "folder",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				restrictions: ["admin"],
				possibilities: {
					pending: "Pending",
					active: "Active",
					inactive: "Inactive",
				},
			},
			account_verified: {
				type: "string",
				label: "Account verified",
				icon: "folder",
				input: {
					type: "checkbox",
					default: "",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},
			account_verifacation_code: {
				type: "string",
				label: "Account verifacation code",
				input: {
					type: "text",
					default: "",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},
			account_verifacation_mode: {
				type: "string",
				label: "Account verifacation mode",
				input: {
					type: "select",
					default: "",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
				},
				possibilities: {
					none: "None",
					admin: "Admin",
					email: "Email",
					sms: "SMS",
					call: "Call",
				},
			},
			password_reset_code: {
				type: "string",
				label: "Password reset code",
				icon: "folder",
				input: {
					type: "text",
					default: "",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},
			/*password_reset_code_expiration: {
				type: "string",
				label: "Password reset code expiration",
				icon: "folder",
				input: {
					type: "date",
					default: "",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},*/
		},
		identity: {
			primary: ["honorific", "first_name", "last_name"],
			secondary: ["email_address"],
			avatar: "avatar",
		},
		dependencies: [],
		dependants: {
			commissions: {
				column: "individual",
				query: { involvement: "individual" },
			},
			teams: {
				column: "members",
				query: {},
			},
			tracks: {
				column: "user",
				query: {},
			},
			responses: {
				column: "submitter",
				query: {},
			},
			orders: {
				column: "customer",
				query: {},
			},
			invoices: {
				column: "owner",
				query: {},
			},
			payments: {
				column: "made_by",
				query: {},
			},
			events: {
				column: "user",
				query: {},
			},
			attachments: {
				column: "attached_by",
				query: {},
			},
			answers: {
				column: "user",
				query: {},
			},
			actionlogs: {
				column: "catalyst",
				query: {},
			},
		},
	},
	access: {
		restricted: user => user?.role !== "admin",
		view: {
			summary: user => user?.role === "admin",
			all: user => user?.role === "admin",
			single: (user) => user?.role === "admin",
		},
		actions: {
			view: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"/users/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "/users/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"/users/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			
			email_user: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("/").toUriWithDashboardPrefix();
				},
				Component: EmailUserActionComponent,
				className: "purple-text",
				label: "Email User",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("/users/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
		
	},
	
};
