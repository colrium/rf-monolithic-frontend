/** @format */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	BallotOutlined as DefinationContextIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";
import { CountriesHelper } from "utils/Helpers";

export default {
	name: "vacancies",
	label: "Vacancies",
	icon: <DefinationContextIcon />,
	color: "#00bcd4",
	model: "Vacancy",
	endpoint: "/recruitment/vacancies",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["name"],
				subtitle: ["code"],
				body: [
					"status",
					"customer",
					"expiration_date",
					"value_type",
					"value",
					"use",
				],
			},
			calendarview: {
				title: ["title"],
				subtitle: ["code"],
				body: [
					"status",
					"customer",
					"expiration_date",
					"value_type",
					"value",
					"use",
				],
			},
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
			position: {
				type: "string",
				label: "Position Name",
				input: {
					type: "text",
					required: true,
					default: "",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			description: {
				type: "string",
				label: "Description",
				input: {
					type: "textarea",
					default: "",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			banner: {
				type: "string",
				label: "Banner",
				input: {
					type: "file",
					accepts: ["image/*"],
					props: {
						acceptedFiles: ["image/*"],
						dropzoneText: "Drag & drop vacancy banner image here",
						dropzoneIcon: <ImageIcon />,
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

			qualifications: {
				type: "string",
				label: "Qualifications",
				input: {
					type: "textarea",
					default: "",
					required: true,
					rich: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			requirements: {
				type: "string",
				label: "Requirements",
				input: {
					type: "textarea",
					default: "",
					required: true,
					rich: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			responsibilitiea: {
				type: "string",
				label: "Responsibilitiea",
				input: {
					type: "textarea",
					default: "",
					rich: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
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

			notes: {
				type: "string",
				label: "Notes",
				input: {
					type: "textarea",
					default: "",
					rich: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			maximum_applications: {
				type: "string",
				label: "Maximum No of applications",
				input: {
					type: "number",
					default: "1",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			bias: {
				type: "string",
				label: "Bias",
				input: {
					type: "text",
					default: "",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			application_deadline: {
				type: "string",
				label: "Application Deadline",
				input: {
					type: "datetime",
					default: new Date().addDays(30).toString(),
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			active: {
				type: "boolean",
				label: "Active",
				input: {
					type: "checkbox",
					default: true,
				},
			},
		},
		identity: {
			primary: ["position"],
			secondary: ["application_deadline"],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			applications: {
				column: "vacancy",
				query: {},
			},
			actionlogs: {
				column: "record",
				query: { context: "Vacancy" },
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
				restricted: user => String.isEmpty(user?.role),
				uri: entry => {
					return (
						"vacancies/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "vacancies/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"vacancies/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("vacancies/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
		
	},
};
