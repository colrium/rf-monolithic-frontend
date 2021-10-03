/** @format */

import { IconButton } from "@material-ui/core";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	ForumOutlined as DefinationContextIcon,
} from "@material-ui/icons";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "conversations",
	label: "Conversations",
	icon: <DefinationContextIcon />,
	color: "#541400",
	model: "Conversation",
	endpoint: "/conversations",
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
				label: "Name",
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
			code: {
				type: "string",
				label: "Code",
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
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
				},
				reference: {
					name: "users",
					service_query: { sort: "first_name", fields: "first_name,last_name,email_address,avatar", role: "customer" },
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
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
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
						if (user && user.role === "admin") {
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
		restricted: user => {
			if (user) {
				return !(user.isAdmin || user.isCustomer);
			}
			return true;
		},
		view: {
			summary: user => {
				return false;
			},
			all: user => {
				if (user) {
					return user.isAdmin || user.isCustomer;
				}
				return false;
			},
			single: (user, record) => {
				if (user) {
					return user.isAdmin || user.isCustomer;
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
				uri: entry => {
					return ("coupons/view/" + entry?._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className) => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"coupons/view/" + entry?._id
									).toUriWithDashboardPrefix()}
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
				uri: "coupons/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link
									to={"coupons/add/".toUriWithDashboardPrefix()}
									{...props}
								>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Coupon
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
				uri: entry => {
					return ("coupons/edit/" + entry?._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"coupons/edit/" + entry?._id
									).toUriWithDashboardPrefix()}
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
				uri: entry => {
					return ("coupons/delete/" + entry?._id).toUriWithDashboardPrefix();
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
