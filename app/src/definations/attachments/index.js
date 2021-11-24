/** @format */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	FolderOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@mui/icons-material";
import { colors } from "assets/jss/app-theme";
import Button from "components/Button";
import * as definations from "definations";
import React from "react";
import { Link } from "react-router-dom";
import { FilesHelper } from "hoc/Helpers";

export default {
	name: "attachments",
	label: "Files",
	icon: <DefinationContextIcon />,
	color: colors.hex.warning,
	model: "Attachment",
	endpoint: "/attachments",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {
				avatar: (entry, user) => {
					if (entry) {
						return FilesHelper.fileIcon(entry.name);
					}
					return FilesHelper.fileIcon("file.unknown");
				},
				title: ["name"],
				subtitle: ["size", "date_attached"],
				body: [
					"title",
					"caption",
					"alt_text",
					"description",
					"context",
					"record",
					"avatar",
					"mime",
					"location",
					"attached_by",
					"accessibility",
				],
			},
		},
		listing: {
			default: "listview",
			/*listview: {
				
				primary: ["name"],
				secondary: ["size", "description", "context"],
			},*/
			tableview: {
				avatar: (entry, user) => {
					if (entry) {
						return FilesHelper.fileIcon(entry.name);
					}
					return FilesHelper.fileIcon("file.unknown");
				},
				title: ["name"],
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
					required: false,
				},
			},

			caption: {
				type: "string",
				label: "Caption",
				input: {
					type: "text",
					default: "",
					required: false,
				},
			},

			alt_text: {
				type: "string",
				label: "Alternative text",
				input: {
					type: "text",
					default: "",
					required: false,
				},
			},

			description: {
				type: "string",
				label: "Description",
				input: {
					type: "textarea",
					default: "",
					required: false,
				},
			},

			name: {
				type: "string",
				label: "Name",
				input: {
					type: "text",
					default: "",
					required: false,
				},
			},

			local_name: {
				type: "string",
				label: "Local name",
				input: {
					type: "text",
					default: "",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return user.role !== "admin";
						}
						return false;
					},
					input: (values, user) => {
						return true;
					},
				},
			},

			context: {
				type: "string",
				label: "Context",
				input: {
					type: "text",
					default: "",
					required: false,
				},
			},

			record: {
				type: "string",
				label: "Record",
				input: {
					type: "select",
					default: "",
					required: false,
				},
				reference: {
					name: (values, user) => {
						let defination_name = "attachments";
						if (values.context) {
							for (let [name, defination] of Object.entries(
								definations
							)) {
								if (defination.model === values.context) {
									defination_name = name;
									break;
								}
							}
						}
						return defination_name;
					},
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: (values, user) => {
								let resolves = [];
								if (values.context) {
									for (let [
										name,
										defination,
									] of Object.entries(definations)) {
										if (
											defination.model === values.context
										) {
											resolves =
												defination.scope.identity
													.primary;
											break;
										}
									}
								}
								return resolves;
							},
							secondary: (values, user) => {
								let resolves = [];
								if (values.context) {
									for (let [
										name,
										defination,
									] of Object.entries(definations)) {
										if (
											defination.model === values.context
										) {
											resolves =
												defination.scope.identity
													.secondary;
											break;
										}
									}
								}
								return resolves;
							},
							avatar: (values, user) => {
								let resolves = [];
								if (values.context) {
									for (let [
										name,
										defination,
									] of Object.entries(definations)) {
										if (
											defination.model === values.context
										) {
											resolves =
												defination.scope.identity
													.avatar;
											break;
										}
									}
								}
								return resolves;
							},
						},
					},
				},
			},

			avatar: {
				type: "boolean",
				label: "Avatar",
				input: {
					type: "checkbox",
					default: "",
					required: false,
				},
			},

			size: {
				type: "number",
				label: "Size",
				input: {
					type: "number",
					default: "",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						return true;
					},
				},
			},

			mime: {
				type: "string",
				label: "Mime",
				input: {
					type: "text",
					default: "",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						return true;
					},
				},
			},

			properties: {
				type: "string",
				label: "Properties",
				input: {
					type: "textarea",
					default: "",
					required: false,
				},
			},

			location: {
				type: "string",
				label: "Location",
				input: {
					type: "radio",
					default: "local",
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
				possibilities: {
					local: "Local",
					web: "Web",
				},
			},

			path: {
				type: "string",
				label: "Path",
				input: {
					type: "text",
					default: "",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						return !(entry && entry.location !== "local");
					},
					input: (values, user) => {
						return !(values && values.location !== "local");
					},
				},
			},

			date_attached: {
				type: "string",
				label: "Date created",
				input: {
					type: "date",
					default: "",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						return true;
					},
				},
			},

			attached_by: {
				type: "string",
				label: "Created by",
				input: {
					type: "select",
					default: "",
					required: false,
				},
				reference: {
					name: "users",
					service_query: { sort: "first_name", fields: "first_name,last_name,email_address,avatar" },
					resolves: {
						value: "_id",
						display: {
							primary: ["first_name", "last_name"],
							secondary: ["email_address"],
							avatar: ["avatar"],
						},
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

			accessibility: {
				type: "string",
				label: "Accessibility",
				input: {
					type: "select",
					default: "anyone",
					required: false,
				},
				possibilities: {
					anyone: "Anyone",
					authorized: "Authorized users",
					admin: "Administrators",
					owner: "Owner",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						return !(user && user.role === "admin");
					},
				},
			},
		},
		identity: {
			primary: ["name"],
			secondary: ["date_attached"],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			actionlogs: {
				column: "record",
				query: { context: "Attachment" },
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
					return (
						"attachments/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className) => {
							return (
								<Link
									to={(
										"attachments/view/" + entry?._id
									).toUriWithDashboardPrefix()}
									className={className}
								>
									<IconButton
										color="inherit"
										aria-label="view"
									>
										<OpenInNewIcon />
									</IconButton>
								</Link>
							);
						},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"attachments/view/" + entry?._id
									).toUriWithDashboardPrefix()}
									className={className}
								>
									<IconButton
										color="inherit"
										aria-label="view"
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
					return true;
				},
				uri: "attachments/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link
									to={"attachments/add/".toUriWithDashboardPrefix()}
									{...props}
								>
									<Button
										color="primary"
										variant="outlined"
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Attachment
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
					return (
						"attachments/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"attachments/edit/" + entry?._id
									).toUriWithDashboardPrefix()}
									className={className}
								>
									<IconButton
										color="inherit"
										aria-label="add"
									>
										<AddIcon />
									</IconButton>
								</Link>
							);
						},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"attachments/edit/" + entry?._id
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
						"attachments/delete/" + entry?._id
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
