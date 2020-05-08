/** @format */

import { IconButton } from "@material-ui/core";
import {
	Add as AddIcon,
	ClassOutlined as DefinationContextIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@material-ui/icons";
import Button from "components/Button";
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
			listview: {
				avatar: false,
				primary: ["ref_no"],
				secondary: ["order", "due_date", "status"],
			},
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
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
				},
				reference: {
					name: "users",
					service_query: { role: "customer" },
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
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
					input: (values, user) => {
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
					input: (values, user) => {
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
					input: (values, user) => {
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
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
		restricted: user => {
			if (user) {
				return !(user.isAdmin || user.isCustomer);
			}
			return true;
		},
		view: {
			summary: user => {
				if (user) {
					return user.isAdmin || user.isCustomer;
				}
				return false;
			},
			all: user => {
				if (user) {
					return user.isAdmin || user.isCustomer;
				}
				return false;
			},
			single: (user, record) => {
				if (user && !record) {
					return user.isAdmin;
				}
				if (user && record) {
					return (
						user.isAdmin ||
						(user.isCustomer && record.owner === user._id)
					);
				}
				return false;
			},
		},
		actions: {
			view_single: {
				restricted: user => {
					if (user) {
						return !(user.isAdmin || user.isCustomer);
					}
					return true;
				},
				uri: id => {
					return "invoices/view/" + id;
				},
				link: {
					inline: {
						default: (id, className) => {},
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={"invoices/view/" + id}
									className={className}
								>
									<IconButton
										color="inherit"
										aria-label="edit"
									>
										<OpenInNewIcon fontSize="small" />
									</IconButton>
								</Link>
							);
						},
					},
				},
			},
			create: {
				restricted: user => {
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: "invoices/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link to={"invoices/add/"} {...props}>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Invoice
									</Button>
								</Link>
							);
						},
						listing: props => {
							return "";
						},
					},
				},
			},
			update: {
				restricted: user => {
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: id => {
					return "invoices/edit/" + id;
				},
				link: {
					inline: {
						default: (id, className = "grey_text") => {},
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={"invoices/edit/" + id}
									className={className ? className : ""}
								>
									<IconButton
										color="inherit"
										aria-label="edit"
									>
										<EditIcon fontSize="small" />
									</IconButton>
								</Link>
							);
						},
					},
				},
			},
			delete: {
				restricted: user => {
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: id => {
					return "invoices/delete/" + id;
				},
				link: {
					inline: {
						default: (id, className = "error_text") => {},
						listing: (id, className = "error_text", onClick) => {
							return (
								<IconButton
									color="inherit"
									className={className ? className : ""}
									aria-label="delete"
									onClick={onClick}
								>
									<DeleteIcon fontSize="small" />
								</IconButton>
							);
						},
					},
				},
			},
		},
	},
};
