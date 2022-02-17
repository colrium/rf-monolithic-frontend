/** @format */
import React from "react";
import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	NoteOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon
} from "@mui/icons-material";
import { UtilitiesHelper } from "utils/Helpers";
import * as definations from "definations";
import { Link } from "react-router-dom";
import Button from "components/Button";

export default {
	name: "forms",
	label: "Forms",
	icon: <DefinationContextIcon />,
	color: "#001987",
	model: 'Form',
	endpoint: "/forms",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["name"],
				subtitle: ["code"],
				body: ["status", "customer", "expiration_date", "value_type", "value", "use"],
			},
			calendarview: {
				title: ["name"],
				subtitle: ["code"],
				body: ["status", "customer", "expiration_date", "value_type", "value", "use"],
			}
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
				input: {
					type: "hidden",
					required: true,
					default: "",
				},
				restricted: {
					display: (entry, user) => {
						return true
					},
					input: (values, user) => {
						return true;
					}
				},
			},




			context: {
				type: "string",
				label: "Context",
				input: {
					type: "select",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					}
				},
				possibilities: (entry, user) => {
					let possibilies = {};
					if (user) {
						Object.entries(definations).map(([name, defination], index) => {
							if (defination.model !== undefined && name !== "forms" && name !== "formvalues" && !defination.access.restricted(user)) {
								if (UtilitiesHelper.isOfType(defination.label, "function")) {
									possibilies[defination.model] = defination.label(user);
								}
								else {
									possibilies[defination.model] = defination.label;
								}
							}
						});
					}

					return possibilies;
				}
			},

			provider: {
				type: "string",
				label: "Provider",
				input: {
					type: "select",
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					}
				},
				possibilities: {
					"local": "Local",
					"kobotoolbox": "Kobotoolbox",
				}
			},

			uid: {
				type: "string",
				label: "UID",
				input: {
					type: "text",
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					}
				},
			},

			filter_by: {
				type: "string",
				label: "Filter By",
				input: {
					type: "select",
					size: 4,
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						return false
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					}
				},
				possibilities: (entry, user) => {
					let possibilies = {};
					Object.entries(definations).map(([name, defination], index) => {
						if (entry.context === defination.model) {
							if (user && JSON.isJSON(defination)) {
								Object.entries(defination.scope.columns).map(([column_name, column], cursor) => {
									if (UtilitiesHelper.isOfType(column.label, "function")) {
										possibilies[column_name] = column.label(user);
									}
									else {
										possibilies[column_name] = column.label;
									}
								});
							}
						}
					});


					return possibilies;
				}
			},
			filter: {
				type: "string",
				label: "Filter",
				input: {
					type: "select",
					size: 4,
				},
				restricted: {
					display: (entry, user) => {
						return false
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					}
				},
				possibilities: {
					"is": "Is Equal To",
					"not": "Is Not Equal To",
					"lessthan": "Is Less than",
					"greaterthan": "Is Greater Than",
				}
			},
			filter_value: {
				type: "string",
				label: "Filter Value",
				input: {
					type: (entry, user) => {
						let type = undefined;
						Object.entries(definations).map(([name, defination], index) => {
							if (entry.context === defination.model) {
								if (JSON.isJSON(defination.scope.columns[entry.filter_by])) {
									type = defination.scope.columns[entry.filter_by].input.type;
								}
								if (Function.isFunction(type)) {
									type = type(entry, user);
								}
							}
						});

						return type;
					},
					size: 4,
					default: (entry, user) => {
						let default_value = undefined;
						Object.entries(definations).map(([name, defination], index) => {
							if (entry.context === defination.model) {
								if (JSON.isJSON(defination.scope.columns[entry.filter_by])) {
									default_value = defination.scope.columns[entry.filter_by].input.default;
								}
								if (Function.isFunction(default_value)) {
									default_value = default_value(entry, user);
								}
							}
						});
						return default_value;
					},
				},
				restricted: {
					display: (entry, user) => {
						return false
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					}
				},
				possibilities: (entry, user) => {
					let possibilities = undefined;
					Object.entries(definations).map(([name, defination], index) => {
						if (entry.context === defination.model) {
							if (JSON.isJSON(defination.scope.columns[entry.filter_by])) {
								possibilities = defination.scope.columns[entry.filter_by].possibilities;
							}
							if (Function.isFunction(possibilities)) {
								possibilities = possibilities(entry, user);
							}
						}
					});
					return possibilities;
				},
				reference: (entry, user) => {
					let reference = undefined;
					Object.entries(definations).map(([name, defination], index) => {
						if (entry.context === defination.model) {
							if (JSON.isJSON(defination.scope.columns[entry.filter_by])) {
								reference = defination.scope.columns[entry.filter_by].reference;
							}
							if (Function.isFunction(reference)) {
								reference = reference(entry, user);
							}
						}
					});
					return reference;
				},
			},

			blueprint: {
				type: "object",
				label: "Blueprint",
				input: {
					type: "dynamic",
					mode: "defination",
					default: {},
				},
				restricted: {
					display: (entry, user) => {
						return true;
					},
					input: (values, user) => {
						return false;
					}
				},
			},

			active: {
				type: "boolean",
				label: "Active",
				input: {
					type: "checkbox",
					default: true,
				},
			},

		},
		identity: {
			primary: ["title"],
			secondary: ["context"],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			actionlogs: {
				column: "record",
				query: { context: "Form" }
			},
		},
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
						"forms/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "forms/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"forms/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("forms/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},

	},

};
