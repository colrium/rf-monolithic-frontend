/** @format */

import { IconButton } from "@material-ui/core";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	NotificationsOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@material-ui/icons";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "notifications",
	label: "Notifications",
	icon: <DefinationContextIcon />,
	color: "#0e4000",
	model: "Notification",
	endpoint: "/notifications",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["title"],
				subtitle: ["context"],
				tags: ["priority", "read"],
				body: ["body"],
			},
		},
		listing: {
			default: "tableview",
			/*listview: {
				avatar: false,
				primary: ["title"],
				secondary: ["context", "priority", "read"],
			},*/
			tableview: {
				avatar: false,
				title: ["title"],
			},
		},
	},
	scope: {
		columns: {
			title: {
				type: "string",
				label: "Title",
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
						return false;
					},
				},
			},
			body: {
				type: "string",
				label: "Notification",
				icon: "subject",
				input: {
					type: "textarea",
					default: "",
					required: false,
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
			context: {
				type: "string",
				label: "Context",
				icon: "subject",
				input: {
					type: "select",
					default: "",
					required: false,
				},
				possibilities: {
					Commission: "Commission",
					Coupon: "Coupon",
					Invoice: "Invoice",
					Order: "Order",
				},
				restricted: {
					display: (entry, user) => {
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
			priority: {
				type: "string",
				label: "Priority",
				input: {
					type: "radio",
					default: "",
					required: true,
				},
				possibilities: {
					low: "Low",
					medium: "Medium",
					high: "High",
				},
				restricted: {
					display: (entry, user) => {
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
			notifier: {
				type: "string",
				label: "Notifier",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				reference: {
					name: "users",
					service_query: { sort: "first_name", fields: "first_name,last_name,email_address,avatar", role: "admin" },
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
			},
			notify: {
				type: "string",
				label: "Notify",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				reference: {
					name: "users",
					service_query: {sort: "first_name", fields: "first_name,last_name,email_address,avatar", },
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
			},
			notified: {
				type: "boolean",
				label: "Notified",
				input: {
					type: "checkbox",
					default: "",
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
			},
			read: {
				type: "boolean",
				label: "Read",
				input: {
					type: "checkbox",
					default: "",
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
			},
			channel: {
				type: "string",
				label: "Channel",
				icon: "folder",
				input: {
					type: "radio",
					default: "all",
				},
				possibilities: {
					app: "App",
					email: "Email",
					all: "all",
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			date_created: {
				type: "string",
				label: "Date",
				input: {
					type: "datetime",
					default: Date.now,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},
		},
		identity: {
			primary: ["title"],
			secondary: ["priority"],
			avatar: false,
		},
		dependencies: [
			{
				name: "users",
			},
		],
		dependants: {
			actionlogs: {
				column: "record",
				query: { context: "Notification" },
			},
		},
	},
	access: {
		restricted: user => {
			if (user) {
				return false;
			}
			return true;
		},
		view: {
			summary: user => {
				return false;
			},
			all: user => {
				if (user) {
					return true;
				}
				return false;
			},
			single: (user, record) => {
				if (user && record) {
					return true;
				}
				return false;
			},
		},
		actions: {
			view_single: {
				restricted: user => {
					if (user) {
						return false;
					}
					return true;
				},
				uri: entry => {
					return "notifications/view/" + entry._id;
				},
				link: {
					inline: {
						default: (entry, className) => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"notifications/view/" + entry._id}
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
				uri: "notifications/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link to={"notifications/add/"} {...props}>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Notification
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
					return "notifications/edit/" + entry._id;
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"notifications/edit/" + entry._id}
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
					return "notifications/delete/" + entry._id;
				},
				link: {
					inline: {
						default: (id, className = "error_text", onClick) => {},
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
