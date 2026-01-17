/** @format */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	ClassOutlined as DefinationContextIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "invoices",
	label: "Invoices",
	icon: <DefinationContextIcon />,
	color: "#545000",
	model: "Invoice",
	endpoint: "/invoices",
	cache: true,
	views: {
		single: {
			default: "invoiceview",
			cardview: {
				title: ["ref_no"],
				subtitle: ["status"],
				body: [
					"order",
					"owner",
					"direction",
					"discount_type",
					"discount",
					"apply_tax",
					"tax_type",
					"tax",
					"due_date",
					"status",
					"date_generated",
				],
			},
			invoiceview: {
				variants: [
					"ref_no",
					"status",
					"order",
					"owner",
					"direction",
					"discount_type",
					"discount",
					"apply_tax",
					"tax_type",
					"tax",
					"due_date",
					"status",
					"date_generated",
				],
			},
		},
		listing: {
			default: "tableview",
			/*listview: {
				avatar: false,
				primary: ["ref_no"],
				secondary: ["order", "due_date", "status"],
			},*/
			tableview: {
				avatar: false,
				title: ["ref_no"],
			},
			calendarview: {
				type: "date",
				date: ["due_date"],
				title: ["ref_no", "status"],
			},
		},
	},
	scope: {
		columns: {
			ref_no: {
				type: "string",
				label: "Reference Number",
				icon: "label",
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
			order: {
				type: "string",
				label: "Order",
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
					name: "orders",
					service_query: {},
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

			owner: {
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

			direction: {
				type: "string",
				label: "Direction",
				icon: "label",
				input: {
					type: "select",
					default: "outgoing",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
				possibilities: {
					outgoing: "Outgoing",
					incoming: "Incoming",
				},
			},

			discount_type: {
				type: ["string"],
				label: "Discount type",
				icon: "label",
				input: {
					type: "select",
					default: "none",
					required: false,
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
					none: "None",
					amount: "Amount",
					percentage: "Percentage",
					coupon: "Coupon",
				},
			},
			discount: {
				type: "string",
				label: "Discount",
				icon: "label",
				input: {
					type: "number",
					default: "0",
					required: false,
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
			apply_tax: {
				type: "boolean",
				label: "Apply Tax",
				icon: "label",
				input: {
					type: "checkbox",
					default: "",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},
			tax_type: {
				type: "string",
				label: "Tax type",
				icon: "label",
				input: {
					type: "radio",
					default: "outgoing",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
				possibilities: {
					none: "None",
					amount: "Amount",
					percentage: "Percentage",
				},
			},
			tax: {
				type: "float",
				label: "Tax",
				icon: "label",
				input: {
					type: "number",
					default: "0",
					required: false,
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
			due_date: {
				type: "string",
				label: "Due date",
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
			status: {
				type: "string",
				label: "Status",
				icon: "label",
				input: {
					type: "select",
					default: "unpaid",
					required: false,
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
					paid: "Paid",
					unpaid: "Unpaid",
					partially_paid: "Partially paid",
				},
			},
			date_generated: {
				type: "string",
				label: "Date Generated",
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
		},
		identity: {
			primary: ["reference"],
			secondary: ["date_generated"],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			payments: {
				column: "invoice",
				query: { context: "invoice" },
			},
			actionlogs: {
				column: "record",
				query: { context: "Invoice" },
			},
		},
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
						"invoices/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "invoices/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"invoices/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("invoices/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},

	},
};
