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
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "payments",
	label: "Payments",
	icon: <DefinationContextIcon />,
	color: "#001f40",
	model: "Payment",
	endpoint: "/payments",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["currency", "amount"],
				subtitle: ["reference"],
				tags: ["context", "method", "status"],
				body: [
					"invoice",
					"order",
					"account_type",
					"account",
					"date_made",
				],
			},
		},
		listing: {
			default: "tableview",
			/*listview: {
				avatar: false,
				primary: ["currency", "amount"],
				secondary: ["context", "method", "date_made"],
			},*/
			tableview: {
				avatar: false,
				title: ["currency", "amount"],
			},
			calendarview: {
				type: "date",
				date: ["date_made"],
				title: ["currency", "amount"],
				tags: ["context", "method", "status"],
			},
		},
	},
	scope: {
		columns: {
			context: {
				type: "string",
				label: "Context",
				input: {
					type: "radio",
					default: "order",
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
				possibilities: {
					order: "Order",
					invoice: "Invoice",
				},
			},
			invoice: {
				type: "string",
				label: "Invoice",
				input: {
					type: "select",
					required: (values, user) => {
						if (values) {
							return values.context === "invoice";
						}
						return false;
					},
				},

				reference: {
					name: "invoices",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["reference"],
							secondary: ["status"],
							avatar: false,
						},
					},
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							return values.context !== "invoice";
						}

						if (user) {
							return !user?.isAdmin;
						}
						return true;
					},
				},
			},
			order: {
				type: "string",
				label: "Order",
				input: {
					type: "select",
					required: (values, user) => {
						if (values) {
							return values.context === "order";
						}
						return false;
					},
				},

				reference: {
					name: "orders",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["reference"],
							secondary: ["date_made"],
							avatar: false,
						},
					},
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							return values.context !== "order";
						}
						if (user) {
							return !user?.isAdmin;
						}
						return true;
					},
				},
			},
			currency: {
				type: "string",
				label: "Currency",
				input: {
					type: "select",
					default: "",
					required: true,
					size: 4,
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
				reference: {
					name: "currencies",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["html_symbol"],
							avatar: false,
						},
					},
				},
			},
			amount: {
				type: "float",
				label: "Amount",
				input: {
					type: "number",
					default: "0",
					required: true,
					size: 8,
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

			method: {
				type: "string",
				label: "Method",
				input: {
					type: "select",
					default: "",
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
				possibilities: {
					cash: "Cash",
					cheque: "Cheque",
					credit_card: "Credit card",
					debit_card: "Debit Card",
					bank_transfer: "Bank Transfer",
					mobile_money: "Mobile money",
					other: "Other",
				},
			},
			reference: {
				type: "string",
				label: "Reference",
				input: {
					type: "text",
					default: "",
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
			account_type: {
				type: "string",
				label: "Account type",
				input: {
					type: "text",
					default: "",
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
			account: {
				type: "string",
				label: "Account",
				input: {
					type: "text",
					default: "",
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
			date_made: {
				type: "string",
				label: "Date made",
				input: {
					type: "date",
					default: "",
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
			made_by: {
				type: "float",
				label: "Made by",
				input: {
					type: "select",
					default: "",
					required: false,
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
			status: {
				type: "string",
				label: "Status",
				input: {
					type: "select",
					default: "",
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
				possibilities: {
					complete: "Complete",
					incomplete: "Incomplete",
				},
			},
		},
		identity: {
			primary: ["currency", "amount"],
			secondary: [],
			avatar: false,
		},
		dependencies: [],
		dependants: [],
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
						"payments/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "payments/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"payments/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("payments/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},

	},
};
