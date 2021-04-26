/** @format */

import { IconButton } from "@material-ui/core";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	ExploreOutlined as DefinationContextIcon,
} from "@material-ui/icons";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "quoterequests",
	label: "Quote Requests",
	icon: <DefinationContextIcon />,
	color: "#541400",
	model: "ProposalRequest",
	endpoint: "/quote-requests",
	cache: true,
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
			calendarview: {
				type: "date",
				date: ["expiration_date"],
				title: ["name", "status"],
			},
		},
	},
	scope: {
		columns: {
			requesting_email: {
				type: "string",
				label: "Email Address",
				input: {
					type: "text",
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
			institution: {
				type: "string",
				label: "Institution",
				input: {
					type: "text",
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

			requirements: {
				type: "string",
				label: "Requirements",
				input: {
					type: "wysiwyg",
					props: {
						rows: 20,
					},
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

			deadline: {
				type: "string",
				label: "Deadline",
				input: {
					type: "datetime",
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

			honored: {
				type: "string",
				label: "Honored",
				input: {
					type: "checkbox",
					default: false,
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

			date_honored: {
				type: "string",
				label: "Date honored",
				input: {
					type: "datetime",
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

			honored_by: {
				type: "string",
				label: "Honored by",
				input: {
					type: "select",
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
			},

			quote: {
				type: "string",
				label: "Quote",
				input: {
					type: "textarea",
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
			quote_files: {
				type: "string",
				label: "Files",
				input: {
					type: "file",
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
			primary: ["requesting_email"],
			secondary: [],
			avatar: false,
		},
		dependencies: [],
		dependants: {},
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
					return (
						"quoterequests/view/" + entry._id
					).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className) => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"quoterequests/view/" + entry._id
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
				uri: "quoterequests/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link
									to={"quoterequests/add/".toUriWithDashboardPrefix()}
									{...props}
								>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Quote Request
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
					return (
						"quoterequests/edit/" + entry._id
					).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"quoterequests/edit/" + entry._id
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
					return (
						"quoterequests/delete/" + entry._id
					).toUriWithDashboardPrefix();
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
