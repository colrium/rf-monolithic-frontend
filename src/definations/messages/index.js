/** @format */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	ForumOutlined as DefinationContextIcon,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import React from "react";
import { Link } from "react-router-dom";
export default {
	name: "messages",
	label: "Messages",
	icon: <DefinationContextIcon />,
	color: "#541400",
	model: "Message",
	endpoint: "/messages",
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
		},
		listing: {
			default: "tableview",
			/*listview: {
				avatar: false,
				primary: ["name"],
				secondary: ["code", "status", "expiration_date", "use"],
			},*/
			tableview: {
				avatar: false,
				title: ["name"],
			},
		},
	},
	scope: {
		columns: {
			name: {
				type: "string",
				label: "Conversation",
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
						return false;
					},
				},
				reference: {
					name: "conversations",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["owner"],
							secondary: ["created_on"],
							avatar: false,
						},
					},
				},
			},
			code: {
				type: "string",
				label: "Code",
				input: {
					type: "text",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},
			status: {
				type: "string",
				label: "Status",
				icon: "label",
				input: {
					type: "radio",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
				possibilities: {
					active: "active",
					used: "used",
					expired: "expired",
				},
			},

			customer: {
				type: "string",
				label: "Customer",
				icon: "label",
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
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
				reference: {
					name: "users",
					service_query: { pagination: -1, sort: "first_name", fields: "first_name,last_name,email_address,avatar", role: "customer" },
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

			expiration_date: {
				type: "string",
				label: "Expiration date",
				icon: "label",
				input: {
					type: "date",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},

			value_type: {
				type: "string",
				label: "Value Type",
				input: {
					type: "select",
					default: "",
					required: true,
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
				possibilities: {
					amount: "Amount",
					percentage: "Percentage",
				},
			},

			value: {
				type: "string",
				label: "value",
				icon: "label",
				input: {
					type: "number",
					default: "1",
					required: true,
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},

			use: {
				type: "string",
				label: "Use",
				icon: "label",
				input: {
					type: "radio",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
				possibilities: {
					once: "Once",
					multiple: "Multiple",
				},
			},
		},
		identity: {
			primary: ["name"],
			secondary: ["status"],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			orders: {
				column: "coupon",
				query: {},
			},
			actionlogs: {
				column: "record",
				query: { context: "Commission" },
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
						"messages/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "messages/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"messages/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("messages/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},

	},
};
