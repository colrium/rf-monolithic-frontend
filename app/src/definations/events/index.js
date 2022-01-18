/** @format */

import { IconButton } from "@mui/material";
import Chip from "@mui/material/Chip";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	EventOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
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
	name: "events",
	label: "Events",
	icon: <DefinationContextIcon />,
	color: "#001987",
	model: "Event",
	endpoint: "/events",
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
			default: "calendarview",
			tableview: {
				avatar: false,
				title: ["name"],
			},
			calendarview: {
				type: "date",
				date: ["expiration_date"],
				title: ["name", "status"],
				resolveData: async (entries, isPopulated = true) => {
					return entries.map((entry, index) => {
						return {
							id: entry?._id,
							calendarId: "events",
							title: entry.title,
							body: ReactDOMServer.renderToStaticMarkup(
								<GridContainer>
									<GridItem xs={12}>
										{entry.image && (
											<Avatar
												alt={entry.title}
												src={ApiService.getAttachmentFileUrl(
													entry.image
												)}
											/>
										)}
										{!entry.image && (
											<Avatar
												alt={entry.title}
												color="#001987"
											>
												<DefinationContextIcon />
											</Avatar>
										)}
									</GridItem>
									<GridItem xs={12}>
										{entry.subject && (
											<Typography
												variant="body2"
												paragraph
											>
												{" "}
												<b> Subject: </b>
												{entry.subject}
											</Typography>
										)}
										{entry.description && (
											<Typography
												variant="body2"
												paragraph
											>
												{" "}
												<b> Description: </b>
												{entry.description}
											</Typography>
										)}
										{entry.context && (
											<Typography
												variant="body2"
												paragraph
											>
												{" "}
												<b> Context: </b>
												{entry.context}
											</Typography>
										)}
										{entry.user && (
											<Chip
												size="small"
												avatar={
													entry.user.avatar ? (
														<Avatar
															alt={
																entry.user
																	.first_name
															}
															src={ApiService.getAttachmentFileUrl(
																entry.user
																	.avatar
															)}
														/>
													) : null
												}
												label={
													entry.user.first_name +
													" " +
													entry.user.last_name
												}
											/>
										)}
										{entry.type && (
											<Typography
												variant="body2"
												paragraph
											>
												{" "}
												<b> Type: </b>
												{entry.type}
											</Typography>
										)}
										{entry.start && (
											<Typography
												variant="body2"
												paragraph
											>
												{" "}
												<b> Start: </b>
												{new Date(entry.start).format(
													formats.dateformats.datetime
												)}
											</Typography>
										)}
										{entry.end && (
											<Typography
												variant="body2"
												paragraph
											>
												{" "}
												<b> End: </b>
												{new Date(entry.end).format(
													formats.dateformats.datetime
												)}
											</Typography>
										)}
									</GridItem>
								</GridContainer>
							),
							category: "time",
							dueDateClass: "",
							start: entry.start,
							end: entry.end,
						};
					});
				},
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
					service_query: { pagination: -1, sort: "first_name", fields: "first_name,last_name,email_address,avatar", role: "collector" },
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
				label: "User",
				input: {
					type: "select",
					default: "",
				},
				reference: {
					name: "users",
					service_query: (values, user) => {
						if (user && user.role !== "admin") {
							return { pagination: -1, sort: "first_name", fields: "first_name,last_name,email_address,avatar", _id: user._id };
						}
						return { pagination: -1, sort: "first_name", fields: "first_name,last_name,email_address,avatar", };
					},
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
					service_query: {pagination: -1, },
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
					service_query: {pagination: -1, },
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
		restricted: user => user?.role !== "admin",
		view: {
			summary:  user => user?.role === "admin",
			all: user => user?.role === "admin",
			single: (user) => user?.role === "admin",
		},
		actions: {
			view: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"events/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "events/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"events/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("events/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
		
	},
};
