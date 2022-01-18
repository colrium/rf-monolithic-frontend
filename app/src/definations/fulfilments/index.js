/** @format */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	LocalOfferOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@mui/icons-material";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "fulfilments",
	label: "Fulfilments",
	icon: <DefinationContextIcon />,
	color: "#001987",
	model: "Fulfilment",
	endpoint: "/retail/fulfilments",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["name"],
				resolveData: entry => { },
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
		},
	},
	scope: {
		columns: {
			order: {
				type: "string",
				label: "Order",
				input: {
					type: "select",
					required: true,
					default: "",
				},
				reference: {
					name: "orders",
					service_query: {pagination: -1, },
					resolves: {
						value: "_id",
						display: {
							primary: ["reference", "date_made"],
							secondary: ["status"],
							avatar: false,
						},
					},
				},
			},

			fulfilment: {
				type: "string",
				label: "Fulfilment",
				input: {
					type: "select",
					default: "survey",
					required: true,
				},
				possibilities: {
					survey: "Survey(s)",
					response: "Response(s)",
					file: "File(s)",
				},
			},

			surveys: {
				type: ["string"],
				label: "Surveys",
				input: {
					type: "multiselect",
					required: (values, user) => {
						if (values) {
							return values.fulfilment === "survey";
						}
						return false;
					},
					disabled: (values, user) => {
						if (values) {
							return values.fulfilment !== "survey";
						}
						return false;
					},
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return !(user.isAdmin || user.isCustomer);
						}
						return true;
					},
					input: (values, user) => {
						if (values) {
							return !(values.fulfilment === "survey");
						}
						return true;
					},
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

			responses: {
				type: ["string"],
				label: "Responses",
				input: {
					type: "multiselect",
					default: [],
					required: (values, user) => {
						if (values) {
							return values.fulfilment === "response";
						}
						return false;
					},
					disabled: (values, user) => {
						if (values) {
							return values.fulfilment !== "response";
						}
						return false;
					},
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return !(user.isAdmin || user.isCustomer);
						}
						return true;
					},
					input: (values, user) => {
						if (values) {
							return !(values.fulfilment === "response");
						}
						return true;
					},
				},
				reference: {
					name: "responses",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["response_type"],
							secondary: ["response_date"],
							avatar: false,
						},
					},
				},
			},

			files: {
				type: ["string"],
				label: "Files",
				input: {
					type: "file",
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return !(user.isAdmin || user.isCustomer);
						}
						return true;
					},
					input: (values, user) => {
						if (values) {
							if (values.fulfilment === "file") {
								return false;
							}
						}
						return true;
					},
				},
				reference: {
					name: "attachments",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["readable_size"],
							avatar: false,
						},
					},
				},
			},

			notes: {
				type: "string",
				label: "Notes",
				input: {
					type: "textarea",
					default: "",
				},
			},

			fulfilment_date: {
				type: "string",
				label: "Fulfilment date",
				input: {
					type: "datetime",
					default: Date.now(),
				},
			},
		},
		identity: {
			primary: ["fulfilment_type", "date_made"],
			secondary: ["order"],
			avatar: false,
		},
		dependencies: [],
		dependants: [],
	},

	access: {
		restricted: user => user?.role !== "admin" || user?.role !== "customer",
		view: {
			summary: user => user?.role === "admin" || user?.role === "customer",
			all: user => user?.role === "admin" || user?.role === "customer",
			single: (user) => user?.role === "admin" || user?.role === "customer",
		},
		actions: {
			view: {
				restricted: user => user?.role !== "admin" || user?.role !== "customer",
				uri: entry => {
					return (
						"fulfilments/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "fulfilments/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"fulfilments/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("fulfilments/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
		
	},

	
};
