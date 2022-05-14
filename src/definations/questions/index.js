import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import {
	LiveHelpOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
	Add as AddIcon,
	EditOutlined as EditIcon,
	DeleteOutlined as DeleteIcon,
} from "@mui/icons-material";

const currentDate = new Date();

export default {
	name: "questions",
	label: "Questions",
	icon: <DefinationContextIcon />,
	color: "#4a148c",
	model: "Question",
	endpoint: "/training/questions",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {
				resolveData: entry => {
					let view_data = {};

					return view_data;
				},
				title: ["action"],
				subtitle: ["context"],
				body: [
					"description",
					"catalyst",
					"generator",
					"record",
					"catalyst_ip",
					"action_timestamp",
				],
			},
		},
		listing: {
			default: "tableview",
			tableview: {
				title: ["name"],
			},
		},
	},
	scope: {
		columns: {
			quiz: {
				type: "string",
				label: "Quiz",
				input: {
					type: "select",
					required: true,
				},
				reference: {
					name: "quizes",
					service_query: (values, user) => {
						return {pagination: -1, };
					},
					resolves: {
						value: "_id",
						display: {
							primary: ["title"],
							secondary: ["description"],
							avatar: "",
						},
					},
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin
						}
						return true;
					},
				},
			},

			value: {
				type: "string",
				label: "Question",
				input: {
					type: "textarea",
					default: "",
					required: true,
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin
						}
						return true;
					},
				},

			},


			type: {
				type: "string",
				label: "Type",
				input: {
					type: "select",
					default: "open",
					required: true,
				},
				possibilities: {
					'open': "Open",
					'truth': "True or False",
					'single_choice': "Single Choice",
					'multiple_choice': "Multiple Choice"
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin
						}
						return true;
					},
				},
			},



		},
		identity: {
			primary: ["value"],
			secondary: [],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			answers: {
				column: "question",
				query: {},
			},
			actionlogs: {
				column: "record",
				query: { context: "Question" },
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
						"questions/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "questions/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"questions/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("questions/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},

	},
};
