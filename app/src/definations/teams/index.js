/** @format */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	SupervisorAccountOutlined as DefinationContextIcon,
} from "@mui/icons-material";
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
		restricted: user => user?.role !== "admin" && user?.role !== "collector",
		view: {
			summary: user => user?.role === "admin" || user?.role === "collector",
			all: user => user?.role === "admin" || user?.role === "collector",
			single: (user) => user?.role === "admin" || user?.role === "collector",
		},
		actions: {
			view: {
				restricted: user => user?.role !== "admin" && user?.role !== "collector",
				uri: entry => {
					return (
						"/teams/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "/teams/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"/teams/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("/teams/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
		
	},
};
