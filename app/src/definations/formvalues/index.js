/** @format */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	EventOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@mui/icons-material";
import Button from "components/Button";
import { formats } from "config/data";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "formvalues",
	label: "Form Values",
	icon: <DefinationContextIcon />,
	color: "#001987",
	model: "FormValue",
	endpoint: "/forms-values",
	cache: false,
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
			default: "calendarview",
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
			start: {
				type: "string",
				label: "Start",
				input: {
					type: "datetime",
					required: true,
					default: new Date().format(formats.dateformats.datetime),
				},
			},

			end: {
				type: "string",
				label: "End",
				input: {
					type: "datetime",
					default: new Date()
						.addDays(1)
						.format(formats.dateformats.datetime),
				},
			},
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
						if (user && user.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},
			description: {
				type: "string",
				label: "Description",
				input: {
					type: "textarea",
					default: "",
				},
			},

			subject: {
				type: "string",
				label: "Subject",
				input: {
					type: "text",
					default: "",
				},
			},

			context: {
				type: "string",
				label: "Context",
				input: {
					type: "text",
					default: "",
				},
			},

			record: {
				type: "string",
				label: "Record",
				input: {
					type: "text",
					default: "",
				},
			},

			involved_users: {
				type: ["string"],
				label: "Involved users",
				input: {
					type: "multiselect",
					default: "",
				},
				reference: {
					name: "users",
					service_query: { sort: "first_name", fields: "first_name,last_name,email_address,avatar", role: "collector" },
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

			user: {
				type: "string",
				label: "Involved users",
				input: {
					type: "select",
					default: "",
				},
				reference: {
					name: "users",
					service_query: { sort: "first_name", fields: "first_name,last_name,email_address,avatar", },
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

			image: {
				type: "string",
				label: "Image",
				input: {
					type: "file",
					accepts: ["image/*"],
				},
				reference: {
					name: "attachments",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: [],
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
					default: "",
				},
				input: {
					type: "file",
					accepts: ["image/*", "video/*", "audio/*", "application/*"],
				},
				reference: {
					name: "attachments",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: [],
							avatar: false,
						},
					},
				},
			},

			occured: {
				type: "boolean",
				label: "Occured",
				input: {
					type: "checkbox",
					default: false,
				},
			},

			type: {
				type: "string",
				label: "Type",
				input: {
					type: "radio",
					default: "event",
				},
				possibilities: {
					event: "Event",
					task: "Task",
					schedule: "Schedule",
				},
			},

			all_day: {
				type: "boolean",
				label: "All Day",
				input: {
					type: "checkbox",
					default: true,
				},
			},
		},
		identity: {
			primary: ["title"],
			secondary: ["start"],
			avatar: false,
		},
		dependencies: [],
		dependants: [],
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
					return ("formvalues/view/" + entry?._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className) => { },
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"formvalues/view/" + entry?._id}
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
					return user ? false : true;
				},
				uri: "formvalues/add".toUriWithDashboardPrefix(),
				link: {
					inline: {
						default: props => {
							return (
								<Link
									to={"formvalues/add/".toUriWithDashboardPrefix()}
									{...props}
								>
									<Button
										color="primary"
										variant="outlined"
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Event
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
						return false;
					}
					return true;
				},
				uri: entry => {
					return ("formvalues/edit/" + entry?._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => { },
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"formvalues/edit/" + entry?._id
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
						return false;
					}
					return true;
				},
				uri: entry => {
					return (
						"formvalues/delete/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (id, className = "error_text") => { },
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
