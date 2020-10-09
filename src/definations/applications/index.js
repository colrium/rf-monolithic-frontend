/** @format */

import IconButton from "@material-ui/core/IconButton";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	HowToVoteOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@material-ui/icons";

import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";
import { CountriesHelper, UtilitiesHelper } from "hoc/Helpers";
import Icon from '@mdi/react';
import { mdiAccountBoxOutline, mdiFileAccountOutline  } from '@mdi/js';

let currentDate = new Date();

const ke_regions = CountriesHelper.regions("KE");

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
			},


			bio: {
				type: "string",
				label: "Bio",
				input: {
					type: "textarea",
					default: "",
					rich_text: true,
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
				uri: id => {
					return "applications/view/" + id;
				},
				link: {
					inline: {
						default: (id, className) => {},
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={(
										"applications/view/" + id
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
				uri: id => {
					return (
						"applications/edit/" + id
					).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (id, className = "grey_text") => {},
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={(
										"applications/edit/" + id
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
			delete: {
				restricted: user => {
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: id => {
					return (
						"applications/delete/" + id
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
