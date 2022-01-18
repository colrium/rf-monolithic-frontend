/**
 * /* eslint-disable react/display-name
 *
 * @format
 */

import { IconButton } from "@mui/material";
import Chip from "@mui/material/Chip";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	ReceiptOutlined as DefinationContextIcon,
} from "@mui/icons-material";
import Avatar from "components/Avatar";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import { formats } from "config/data";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Link } from "react-router-dom";
import ApiService from "services/Api";

export default {
	name: "orders",
	label: "Orders",
	icon: <DefinationContextIcon />,
	color: "#004038",
	model: "Order",
	endpoint: "/retail/orders",
	cache: true,
	views: {
		single: {
			default: "order",
			cardview: {
				title: ["reference"],
				subtitle: ["date_made"],
				tags: ["apply_coupon", "status"],
				body: ["customer", "items", "coupon"],
			},
			orderview: {
				variants: [
					"reference",
					"date_made",
					"items",
					"customer",
					"status",
				],
			},
		},
		listing: {
			default: "tableview",
			/*listview: {
				avatar: false,
				primary: ["reference"],
				secondary: ["date_made", "status"],
				tags: ["apply_coupon", "status"],
			},*/
			tableview: {
				avatar: false,
				title: ["reference"],
			},
			calendarview: {
				type: "date",
				date: ["date_made"],
				title: ["reference"],
				tags: ["apply_coupon", "status"],
				resolveData: async entries => {
					return entries.map(entry => {
						return {
							id: entry?._id,
							calendarId: "orders",
							title: entry.reference,
							body: ReactDOMServer.renderToStaticMarkup(
								<GridContainer>
									<GridItem xs={12}>
										{entry.status && (
											<Typography
												variant="body2"
												paragraph
											>
												{" "}
												<b> Status: </b>
												{entry.status}
											</Typography>
										)}
										{entry.customer && (
											<Typography
												variant="body2"
												paragraph
											>
												{" "}
												<b> Customer </b>
												<Chip
													size="small"
													avatar={
														entry.customer
															.avatar ? (
															<Avatar
																alt={
																	entry
																		.customer
																		.first_name
																}
																src={ApiService.getAttachmentFileUrl(
																	entry
																		.customer
																		.avatar
																)}
															/>
														) : null
													}
													label={
														entry.customer
															.first_name +
														" " +
														entry.customer.last_name
													}
												/>{" "}
											</Typography>
										)}
										{entry.date_made && (
											<Typography
												variant="body2"
												paragraph
											>
												{" "}
												<b> Date made: </b>
												{new Date(
													entry.date_made
												).format(
													formats.dateformats.datetime
												)}
											</Typography>
										)}
									</GridItem>
								</GridContainer>
							),
							category: "time",
							dueDateClass: "",
							start: entry.date_made,
						};
					});
				},
			},
		},
	},
	scope: {
		columns: {
			reference: {
				type: "string",
				label: "Reference",
				icon: false,
				input: {
					type: "text",
					default: "",
					required: true,
				},
			},
			customer: {
				type: "string",
				label: "Customer",
				icon: "person",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							if (user.role === "admin") {
								return false;
							}
						}
						return true;
					},
					input: (values, user) => {
						if (user) {
							if (user.role === "admin") {
								return false;
							}
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

			notes: {
				type: "string",
				label: "Notes",
				input: {
					type: "textarea",
					default: "",
					required: false,
				},
			},

			apply_coupon: {
				type: "boolean",
				label: "Apply Coupon",
				icon: "event",
				input: {
					type: "checkbox",
					default: "",
					required: false,
					size: 4,
				},
			},
			coupon: {
				type: "string",
				label: "Coupon",
				input: {
					type: (values, user) => {
						if (values) {
							return values.apply_coupon ? "select" : "hidden";
						}
						return true;
					},
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
				reference: {
					name: "coupons",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["code"],
							avatar: false,
						},
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
				possibilities: (entry, user) => {
					let all_possibilities = {
						drafted: "Drafted",
						pending: "Pending",
						awaiting_payment: "Awaiting Payment",
						awaiting_fulfillment: "Awaiting Fulfillment",
						awaiting_shipment: "Awaiting Shipment",
						awaiting_pickup: "Awaiting Pickup",
						cancelled: "Cancelled",
						declined: "Declined",
						refunded: "Refunded",
						disputed: "Disputed",
						patially_refunded: "Patially Refunded",
						awaiting_manual_verification:
							"Awaiting Manual Verification",
						completed: "Completed",
					};

					if (user) {
						if (user.role === "admin") {
							return all_possibilities;
						}
						if (entry) {
							if (entry.status in all_possibilities) {
								return {
									[entry.status]:
										all_possibilities[entry.status],
									drafted: "Drafted",
									pending: "Pending",
									cancelled: "Cancelled",
								};
							}
						}
					}
					return {
						drafted: "Drafted",
						pending: "Pending",
						cancelled: "Cancelled",
					};
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
			date_made: {
				type: "date",
				label: "Date Made",
				icon: "event",
				input: {
					type: "datetime",
					default: "",
					required: false,
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							if (user.role === "admin") {
								return false;
							}
						}
						return true;
					},
				},
			},
		},
		identity: {
			primary: ["reference"],
			secondary: ["status"],
			avatar: false,
		},
		dependencies: [
			{
				name: "users",
				column: "customer",
			},
		],
		dependants: {
			fulfilments: {
				column: "order",
				query: {},
			},
			orderitems: {
				column: "order",
				query: {},
			},
			payments: {
				column: "order",
				query: { context: "order" },
			},
			actionlogs: {
				column: "record",
				query: { context: "Order" },
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
						"orders/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "orders/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"orders/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("orders/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
		
	},
};
