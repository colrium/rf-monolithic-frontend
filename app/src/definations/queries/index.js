/**
 * /* eslint-disable react/display-name
 *
 * @format
 */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	ContactSupportOutlined as DefinationContextIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@mui/icons-material";
import { colors } from "assets/jss/app-theme";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";
import { CountriesHelper } from "utils/Helpers";

export default {
	name: "queries",
	label: "Queries",
	icon: <DefinationContextIcon />,
	color: colors.hex.accent,
	model: "SurveyQuery",
	endpoint: "/queries",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["question"],
				subtitle: ["survey"],
				tags: ["response_type", "status"],
				body: ["sample_size", "country", "locality"],
			},
		},
		listing: {
			default: "tableview",
			/*listview: {
				avatar: false,
				primary: ["question"],
				secondary: ["survey", "response_type", "status"],
			},*/
			tableview: {
				avatar: false,
				title: ["question"],
			},
		},
	},
	scope: {
		columns: {
			survey: {
				type: "string",
				label: "survey",
				icon: "label",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				reference: {
					name: "surveys",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["title"],
							secondary: ["status"],
							avatar: false,
						},
					},
				},
			},
			question: {
				type: "string",
				label: "Question",
				icon: "label",
				input: {
					type: "textarea",
					default: "",
					required: true,
				},
			},
			sample_size: {
				type: "integer",
				label: "Sample size",
				icon: "subject",
				input: {
					type: "number",
					default: 1,
					props: {
						min: 1,
					},
				},
			},
			country: {
				type: "string",
				label: "Country",
				icon: "map",
				input: {
					type: "select",
					default: "",
					required: false,
				},
				possibilities: CountriesHelper.names(),
			},
			locality: {
				type: "string",
				label: "Locality",
				input: {
					type: "text",
					default: "",
					required: false,
				},
			},
			response_type: {
				type: "string",
				label: "Response type",
				input: {
					type: "radio",
					default: "text",
					required: true,
				},
				possibilities: {
					text: "Text",
					image: "Image",
					audio: "Audio",
					video: "Video",
					file: "File",
				},
			},
		},
		identity: {
			primary: ["question"],
			secondary: [],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			responses: {
				column: "query",
				query: {},
			},
			commissions: {
				column: "queries",
				query: {},
			},
			actionlogs: {
				column: "record",
				query: { context: "SurveyQuery" },
			},
		},
	},
	access: {
		restricted: user => String.isEmpty(user?.role),
		view: {
			summary: user => !String.isEmpty(user?.role),
			all: user => !String.isEmpty(user?.role),
			single: (user) => !String.isEmpty(user?.role),
		},
		actions: {
			view: {
				restricted: user => String.isEmpty(user?.role),
				uri: entry => {
					return (
						"queries/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "queries/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"queries/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("queries/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
		
	},
};
