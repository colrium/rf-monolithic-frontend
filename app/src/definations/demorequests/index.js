/** @format */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	ExploreOutlined as DefinationContextIcon,
} from "@mui/icons-material";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "demorequests",
	label: "Demo Requests",
	icon: <DefinationContextIcon />,
	color: "#541400",
	model: "DemoRequest",
	endpoint: "/demo-requests",
	cache: true,
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
		},
		listing: {
			default: "tableview",
			tableview: {
				avatar: false,
				title: ["name"],
			},
			calendarview: {
				type: "date",
				date: ["expiration_date"],
				title: ["name", "status"],
			},
		},
	},
	scope: {
		columns: {
			requesting_email: {
				type: "string",
				label: "Email Address",
				input: {
					type: "text",
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
			},
			requested_time: {
				type: "string",
				label: "Preferred Time",
				input: {
					type: "datetime",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						return false;
					},
				},
			},
			date_made: {
				type: "string",
				label: "Date made",
				input: {
					type: "datetime",
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
			honored: {
				type: "string",
				label: "Honored",
				input: {
					type: "checkbox",
					default: false,
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

			date_honored: {
				type: "string",
				label: "Date honored",
				input: {
					type: "datetime",
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

			honored_by: {
				type: "string",
				label: "Honored by",
				input: {
					type: "select",
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
				reference: {
					name: "users",
					service_query: { pagination: -1, sort: "first_name", fields: "first_name,last_name,email_address,avatar", role: "admin" },
					resolves: {
						value: "_id",
						display: {
							primary: ["first_name", "last_name"],
							secondary: ["email_address"],
							avatar: false,
						},
					},
				},
			},

			feedback: {
				type: "string",
				label: "Feedback",
				input: {
					type: "textarea",
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
		},
		identity: {
			primary: ["requesting_email"],
			secondary: [],
			avatar: false,
		},
		dependencies: [],
		dependants: {},
	},
	access: {
		restricted: user => user?.role !== "admin",
		view: {
			summary:  user => user?.role === "admin",
			all: user => user?.role === "admin",
			single: (user) => user?.role === "admin",
		},
		actions: {
			view: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"demorequests/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "demorequests/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"demorequests/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("demorequests/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
		
	},
};
