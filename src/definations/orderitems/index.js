/**
 * /* eslint-disable react/display-name
 *
 * @format
 */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	ReceiptOutlined as DefinationContextIcon,
} from "@mui/icons-material";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "orderitems",
	label: "Order Items",
	icon: <DefinationContextIcon />,
	color: "#004038",
	model: "OrderItem",
	endpoint: "/retail/order-items",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {},
			orderview: {},
		},
		listing: {
			default: "tableview",
			/*listview: {},*/
			tableview: {},
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
				},

				reference: {
					name: "orders",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["reference"],
							secondary: [],
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
			item: {
				type: "string",
				label: "Retail Item",
				input: {
					type: "select",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							if (user?.role === "admin") {
								return false;
							}
						}
						return true;
					},
					input: (values, user) => {
						if (user) {
							if (user?.role === "admin") {
								return false;
							}
						}
						return true;
					},
				},
				reference: {
					name: "retailitems",
					service_query: { pagination: -1, available: 1 },
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["sku"],
							avatar: false,
						},
					},
				},
			},

			quantity: {
				type: "string",
				label: "Quantity",
				input: {
					type: "number",
					default: 1,
					required: false,
				},
			},

			currency: {
				type: "string",
				label: "Currency",
				input: {
					type: "select",
					required: true,
					size: 4,
				},
				input: {
					type: "select",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							if (user?.role === "admin") {
								return false;
							}
						}
						return true;
					},
					input: (values, user) => {
						if (user) {
							if (user?.role === "admin") {
								return false;
							}
						}
						return true;
					},
				},
				reference: {
					name: "currencies",
					service_query: { actve: 1 },
					resolves: {
						value: "_id",
						display: {
							primary: ["symbol"],
							secondary: ["html_symbol"],
							avatar: false,
						},
					},
				},
			},
			cost: {
				type: "string",
				label: "Cost",
				input: {
					type: "number",
					default: 1,
					required: false,
					size: 8,
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							return values.apply_coupon ? false : true;
						}
						return true;
					},
				},
			},

			options: {
				type: "object",
				label: "Options",
				input: {
					type: "dynamic",
					default: 1,
					required: false,
					size: 8,
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							return values.apply_coupon ? false : true;
						}
						return true;
					},
				},
			},

			options_cost: {
				type: "string",
				label: "Options cost",
				input: {
					type: "number",
					default: 0,
					required: true,
				},
				restricted: {
					display: () => {
						return false;
					},
					input: () => {
						return false;
					},
				},
			},
		},
		identity: {
			primary: ["reference"],
			secondary: ["status"],
			avatar: false,
		},
		dependencies: [],
		dependants: {},
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
						"orderitems/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "orderitems/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"orderitems/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("orderitems/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},

	},
};
