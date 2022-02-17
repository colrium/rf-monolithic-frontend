/**
 * /* eslint-disable react/display-name
 *
 * @format
 */

import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import Button from "components/Button";
import Avatar from "components/Avatar";
import {
	HistoryOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
	Add as AddIcon,
	EditOutlined as EditIcon,
	DeleteOutlined as DeleteIcon,
} from "@mui/icons-material";

import { UtilitiesHelper, FilesHelper } from "utils/Helpers";

import * as definations from "definations";

let resolve_context_possibilities = (values, user) => {
	let possibilies = {};
	if (user) {
		for (let [name, defination] of Object.entries(definations)) {
			if (name !== "actionlogs" && !defination.access.restricted(user)) {
				if (UtilitiesHelper.isOfType(defination.label, "function")) {
					possibilies[name] = defination.label(user);
				} else {
					possibilies[name] = defination.label;
				}
			}
		}
	}

	return possibilies;
};

export default {
	name: "actionlogs",
	label: "Activity Logs",
	icon: <DefinationContextIcon />,
	color: "#4a148c",
	model: "ActionTrail",
	endpoint: "/logs/actions",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {
				avatar: entry => {
					if (entry) {
						return FilesHelper.fileIcon(entry.name);
					}

					return FilesHelper.fileIcon("file.unknown");
				},
				resolveData: entry => {
					let view_data = {};
					if (UtilitiesHelper.isOfType(entry, "object")) {
						view_data = {
							color: "#4a148c",
							avatar: (
								<Avatar>
									{" "}
									<DefinationContextIcon />{" "}
								</Avatar>
							),
						};
					}

					return view_data;
				},
				title: ["action"],
				subtitle: ["context"],
				body: [
					"description",
					"catalyst",
					"generator",
					"record",
					"catalyst_ip",
					"action_timestamp",
				],
			},
		},
		listing: {
			default: "tableview",
			/*listview: {
				avatar: false,
				primary: ["action"],
				secondary: [
					"description",
					"catalyst",
					"catalyst",
					"action_timestamp",
				],
			},*/
			tableview: {
				title: ["name"],
			},
		},
	},
	scope: {
		columns: {
			action: {
				type: "string",
				label: "Action",
				input: {
					type: "select",
					default: "",
					required: false,
				},
				possibilities: {
					create: "Create",
					update: "Update",
					delete: "Delete",
					custom: "Custom",
				},
			},

			generator: {
				type: "string",
				label: "Generator",
				input: {
					type: "select",
					default: "user",
					required: true,
				},
				possibilities: {
					user: "User",
					system: "System",
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						return !(user && user?.role === "admin");
					},
				},
			},

			context: {
				type: "string",
				label: "Context",
				input: {
					type: "select",
					default: "",
					required: false,
				},
				possibilities: resolve_context_possibilities,
			},

			record: {
				type: "string",
				label: "Record",
				input: {
					type: "text",
					default: "",
					required: true,
				},
			},

			catalyst: {
				type: "string",
				label: "Catalyst",
				input: {
					type: "select",
					default: "",
					required: false,
				},
				reference: {
					name: "users",
					service_query: (values, user) => {
						if (user && user?.role !== "admin") {
							return { pagination: -1, sort: "first_name", fields: "first_name,last_name,email_address,avatar", _id: user?._id };
						}
						return { pagination: -1, sort: "first_name", fields: "first_name,last_name,email_address,avatar" };
					},
					resolves: {
						value: "_id",
						display: {
							primary: ["honorific", "first_name", "last_name"],
							secondary: ["email_address"],
							avatar: "avatar",
						},
					},
				},
				restricted: {
					display: () => {
						return false;
					},
					input: values => {
						return values ? !values.generator === "system" : true;
					},
				},
			},

			catalyst_ip: {
				type: "string",
				label: "Catalyst IP",
				input: {
					type: "text",
					default: "",
					required: false,
				},
				restricted: {
					display: () => {
						return false;
					},
					input: () => {
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
					required: false,
				},
				restricted: {
					display: () => {
						return false;
					},
					input: () => {
						return true;
					},
				},
			},

			action_timestamp: {
				type: "string",
				label: "Action timestamp",
				input: {
					type: "date",
					default: "",
					required: false,
				},
				restricted: {
					display: () => {
						return false;
					},
					input: values => {
						return values ? !values.generator === "system" : true;
					},
				},
			},
		},
		identity: {
			primary: ["action"],
			secondary: ["action_timestamp"],
			avatar: false,
		},
		dependencies: [],
		dependants: {},
	},
	access: {
		restricted: user => {
			if (user) {
				return false;
			}
			return true;
		},
		view: {
			summary: () => {
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
			view: {
				restricted: user => {
					if (user) {
						return false;
					}
					return true;
				},
				uri: entry => {
					return ("actionlogs/view/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => {
					return !(user && user?.role === "admin");
				},
				uri: "actionlogs/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => {
					if (user) {
						if (user?.role) {
						}
						return false;
					}
					return true;
				},
				uri: entry => {
					return ("actionlogs/edit/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
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
						"actionlogs/delete/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},
	},
};
