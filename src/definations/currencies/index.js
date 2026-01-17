/**
 * /* eslint-disable react/display-name
 *
 * @format
 */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	AttachMoneyOutlined as DefinationContextIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "currencies",
	label: "Currencies",
	icon: <DefinationContextIcon />,
	color: "#001f40",
	model: "Currency",
	endpoint: "/currencies",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {},
		},
		listing: {
			default: "tableview",
			tableview: {},
		},
	},
	scope: {
		columns: {
			name: {
				type: "string",
				label: "Name",
				input: {
					type: "text",
					required: true,
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin;
						}
						return true;
					},
				},
			},
			symbol: {
				type: "string",
				label: "Symbol",
				input: {
					type: "text",
					required: true,
					size: 6,
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin;
						}
						return true;
					},
				},
			},
			html_symbol: {
				type: "string",
				label: "HTML Symbol",
				input: {
					type: "text",
					required: true,
					size: 6,
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin;
						}
						return true;
					},
				},
			},
			exchange_rate: {
				type: "number",
				label: "Exchange Rate",
				input: {
					type: "number",
					default: 1,
					required: true,
					size: 6,
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin;
						}
						return true;
					},
				},
			},
			exchange_rate_date: {
				type: "string",
				label: "Exchange Rate Date",
				input: {
					type: "datetime",
					required: false,
					size: 6,
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin;
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
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin;
						}
						return true;
					},
				},
			},
		},
		identity: {
			primary: ["symbol"],
			secondary: ["html_symbol"],
			avatar: false,
		},
		dependencies: [],
		dependants: [],
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
						"currencies/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "currencies/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"currencies/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("currencies/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
	},
};
