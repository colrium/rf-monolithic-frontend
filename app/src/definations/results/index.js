import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import Button from "components/Button";
import {
	AssignmentTurnedInOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
	Add as AddIcon,
	EditOutlined as EditIcon,
	DeleteOutlined as DeleteIcon,
} from "@mui/icons-material";

export default {
	name: "results",
	label: "Results",
	icon: <DefinationContextIcon />,
	color: "#4a148c",
	model: "Result",
	endpoint: "/training/results",
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

			user: {
				type: "string",
				label: "User",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				reference: {
					name: "users",
					service_query: (values, user) => {
						if (user && user.role !== "admin") {
							return { sort: "first_name", fields: "first_name,last_name,email_address,avatar", _id: user._id };
						}
						return { sort: "first_name", fields: "first_name,last_name,email_address,avatar", };
					},
					resolves: {
						value: "_id",
						display: {
							primary: ["first_name", "last_name"],
							secondary: ["email_address"],
							avatar: "avatar",
						},
					},
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return (user.role !== "admin");
						}
						return true;
					},
				},
			},

			quiz: {
				type: "string",
				label: "Quiz",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				reference: {
					name: "quizzes",
					service_query: (values, user) => {
						return {};
					},
					resolves: {
						value: "_id",
						display: {
							primary: ["title"],
							secondary: [],
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
							return !user.isAdmin
						}
						return true;
					},
				},
			},

			evaluation: {
				type: "number",
				label: "Evaluation",
				input: {
					type: "number",
					default: 0,
					required: false,
				},

				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						return !(user && user.role === "admin");
					},
				},
			},

			complete: {
				type: "boolean",
				label: "Complete",
				input: {
					type: "checkbox",
				},

				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						return !(user && user.role === "admin");
					},
				},
			},

			sent: {
				type: "boolean",
				label: "Sent",
				input: {
					type: "checkbox",
				},

				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						return !(user && user.role === "admin");
					},
				},
			},


		},
		identity: {
			primary: ["user"],
			secondary: ["quiz"],
			avatar: false,
		},
		dependencies: [],
		dependants: {},
	},
	access: {
		restricted: user => user?.role !== "admin" && user?.role !== "collector",
		view: {
			summary: user => user?.role === "admin" || user?.role === "collector",
			all: user => user?.role === "admin" || user?.role === "collector",
			single: (user) => user?.role === "admin" || user?.role === "collector",
		},
		actions: {
			view: {
				restricted: user => user?.role !== "admin" && user?.role !== "collector",
				uri: entry => {
					return (
						"/results/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "/results/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"/results/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("/results/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
		
	},
};