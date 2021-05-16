/** @format */

import { IconButton } from "@material-ui/core";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	SupervisorAccountOutlined as DefinationContextIcon,
} from "@material-ui/icons";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "teams",
	label: "Teams",
	icon: <DefinationContextIcon />,
	color: "#400a00",
	model: "Team",
	endpoint: "/teams",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {
				avatar: "avatar",
				title: ["name"],
				subtitle: ["description"],
				tags: ["bias"],
				body: ["description", "lead", "members", "status"],
			},
		},
		listing: {
			default: "tableview",
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
						if (values) {
							if (["desolved"].includes(values.status)) {
								return true;
							}
						}
						if (user) {
							if (user.role === "admin") {
								return false;
							}
						}
						return true;
					},
				},
			},
			description: {
				type: "string",
				label: "Description",
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
						if (values) {
							if (["desolved"].includes(values.status)) {
								return true;
							}
						}
						if (user) {
							if (user.role === "admin") {
								return false;
							}
						}
						return true;
					},
				},
			},
			bias: {
				type: "string",
				label: "Bias",
				icon: "subject",
				input: {
					type: "radio",
					default: "",
					required: false,
				},
				possibilities: {
					"none": "No Bias",
					"all male": "All Male",
					"all female": "All Female",
					"mixed": "Mixed",
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return user.role === "collector";
						}
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (["desolved"].includes(values.status)) {
								return true;
							}
						}
						if (user) {
							if (user.role === "admin") {
								return false;
							} else {
								if (values && "lead" in values) {
									return typeof values.lead === "object" &&
										values.lead._id === user._id
										? false
										: values.lead === user._id
										? false
										: true;
								}
							}
						}
						return true;
					},
				},
			},
			lead: {
				type: "string",
				label: "Lead",
				icon: "person",
				input: {
					type: "select",
					default: "",
					required: true,
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
				restricted: {
					display: (entry, user) => {
						if (user) {
							return user.role !== "admin";
						}
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (["desolved"].includes(values.status)) {
								return true;
							}
						}
						if (user) {
							if (user.role === "admin") {
								return false;
							} else {
								if (values && "lead" in values) {
									return typeof values.lead === "object" &&
										values.lead._id === user._id
										? false
										: values.lead === user._id
										? false
										: true;
								}
							}
						}
						return true;
					},
				},
			},
			members: {
				type: ["string"],
				label: "Members",
				icon: "people_outline",
				input: {
					type: "multiselect",
					default: "",
					required: true,
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
				restricted: {
					display: (entry, user) => {
						if (user) {
							return user.role !== "admin";
						}
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (["desolved"].includes(values.status)) {
								return true;
							}
						}
						if (user) {
							if (user.role === "admin") {
								return false;
							} else {
								if (values && "lead" in values) {
									return typeof values.lead === "object" &&
										values.lead._id === user._id
										? false
										: values.lead === user._id
										? false
										: true;
								}
							}
						}
						return true;
					},
				},
			},
			avatar: {
				type: "string",
				label: "Avatar",
				icon: "image",
				input: {
					type: "file",
					accepts: ["image/*"],
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return user.role !== "admin";
						}
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (["desolved"].includes(values.status)) {
								return true;
							}
						}
						if (user) {
							if (user.role === "admin") {
								return false;
							} else {
								if (values && "lead" in values) {
									return typeof values.lead === "object" &&
										values.lead._id === user._id
										? false
										: values.lead === user._id
										? false
										: true;
								}
							}
						}
						return true;
					},
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
			status: {
				type: "string",
				label: "Status",
				icon: "folder",
				input: {
					type: "radio",
					default: "",
					required: true,
				},
				possibilities: {
					engaged: "Engaged",
					disengaged: "Disengaged",
					desolved: "Desolved",
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return user.role !== "admin";
						}
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (["desolved"].includes(values.status)) {
								return true;
							}
						}
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
			primary: ["title"],
			secondary: ["bias"],
			avatar: false,
		},
		dependencies: [
			{
				name: "users",
			},
		],
		dependants: {
			commissions: {
				column: "team",
				query: { involvement: "team" },
			},
			actionlogs: {
				column: "record",
				query: { context: "Team" },
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
					return "teams/view/" + entry?._id;
				},
				link: {
					inline: {
						default: (entry, className) => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"teams/view/" + entry?._id}
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
					return user && user.role === "admin" ? false : true;
				},
				uri: "teams/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link to={"teams/add/"} {...props}>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Team
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
					return "teams/edit/" + entry?._id;
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"teams/edit/" + entry?._id}
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
					return "teams/delete/" + entry?._id;
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
