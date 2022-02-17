/** @format */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	PollOutlined as DefinationContextIcon,
} from "@mui/icons-material";
import { colors } from "assets/jss/app-theme";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";
import { CountriesHelper } from "utils/Helpers";

export default {
	name: "surveys",
	label: "Surveys",
	icon: <DefinationContextIcon />,
	color: colors.hex.primarydark,
	model: "Survey",
	endpoint: "/surveys",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {
				avatar: false,
				title: ["title"],
				subtitle: ["order"],
				tags: ["mode", "status", "type"],
				body: [
					"description",
					"focus_region",
					"locality",
					"country",
					"requested_start_date",
					"requested_due_date",
					"project_objectives",
					"confidence_level",
					"error_margin",
					"sample_size",
					"files",
				],
			},
		},
		listing: {
			default: "tableview",
			tableview: {
				avatar: false,
				title: ["title"],
			},
			calendarview: {
				type: "task",
				resolveData: async (entries, isPopulated = true) => {
					let resolved_data = [];
					for (let entry of entries) {
						resolved_data.push({
							id: entry?._id,
							calendarId: "surveys",
							title: entry.title,
							body:
								"<b>Project objectives</b> <br />" +
								entry.project_objectives +
								" <br /><br /> <b>Description</b><br />" +
								entry.description,
							category: "time",
							dueDateClass: "",
							start: entry.requested_start_date,
							end: entry.requested_due_date,
						});
					}
					return resolved_data;
				},
			},
		},
	},
	scope: {
		columns: {
			title: {
				type: "string",
				label: "Title",
				icon: false,
				input: {
					type: "text",
					default: "",
					required: true,
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
			},
			mode: {
				type: "string",
				label: "Mode",
				icon: "label_important",
				input: {
					type: "radio",
					default: "questionnaire",
					required: true,
				},
				possibilities: {
					questionnaire: "Questionnaire",
					observance: "Observance",
					interview: "Interview",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						//Cannot change customer if status is
						if (values) {
							if (
								[
									"approved",
									"commissioned",
									"completed",
								].includes(values.status)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.role === "admin") {
								return false;
							} else {
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},
			project_objectives: {
				type: "string",
				label: "Project Objectives",
				icon: "subject",
				input: {
					type: "textarea",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						//Cannot change customer if status is
						if (values) {
							if (
								[
									"approved",
									"commissioned",
									"completed",
								].includes(values.status)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.role === "admin") {
								return false;
							} else {
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},
			/*order: {
				type: "string",
				label: "Order",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							if (user?.role === "admin") {
								return false;
							}
						}
						return true;
					},
					input: (values, user) => {
						//Cannot change customer if status is
						if (values) {
							if (
								[
									"approved",
									"commissioned",
									"completed",
								].includes(values.status)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.role === "admin") {
								return false;
							}
						}
						return true;
					},
				},
				reference: {
					name: "orders",
					service_query: { pagination: -1, status: "pending" },
					resolves: {
						value: "_id",
						display: {
							primary: ["reference", "date_made"],
							secondary: [],
							avatar: false,
						},
					},
				},
			},*/

			country: {
				type: "string",
				label: "Country",
				icon: "map",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				possibilities: CountriesHelper.names(),
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						//Cannot change customer if status is
						if (values) {
							if (
								[
									"approved",
									"commissioned",
									"completed",
								].includes(values.status)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.isAdmin) {
								return false;
							} else {
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},
			focus_region: {
				type: "string",
				label: "Focus Region",
				input: {
					type: "text",
					default: "",
					required: true,
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						//Cannot change customer if status is
						if (values) {
							if (
								[
									"approved",
									"commissioned",
									"completed",
								].includes(values.status)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.role === "admin") {
								return false;
							} else {
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},
			locality: {
				type: "string",
				label: "Locality",
				input: {
					type: "text",
					default: "",
					required: true,
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						//Cannot change customer if status is
						if (values) {
							if (
								[
									"approved",
									"commissioned",
									"completed",
								].includes(values.status)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.role === "admin") {
								return false;
							} else {
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},
			type: {
				type: "string",
				label: "Type",
				icon: "label",
				input: {
					type: "select",
					default: "qualitative",
					required: true,
				},
				possibilities: {
					qualitative: "Qualitative",
					quantitative: "Quantitative",
					mixed: "Mixed",
					male_bias: "Male bias",
					female_bias: "Female bias",
					focus_group: "Focus group",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						//Cannot change if status is
						if (values) {
							if (
								[
									"approved",
									"commissioned",
									"completed",
								].includes(values.status)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.role === "admin") {
								return false;
							} else {
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},
			requested_start_date: {
				type: "date",
				label: "Requested Start Date",
				icon: "event",
				input: {
					type: "date",
					default: "",
					required: true,
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						//Cannot change if status is
						if (values) {
							if (
								["commissioned", "completed"].includes(
									values.status
								)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.role === "admin") {
								return false;
							} else {
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},
			requested_due_date: {
				type: "date",
				label: "Requested end date",
				icon: "event",
				input: {
					type: "date",
					default: "",
					required: true,
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						//Cannot change if status is
						if (values) {
							if (
								[
									"commissioned",
									"cancelled",
									"completed",
								].includes(values.status)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.role === "admin") {
								return false;
							} else {
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},
			sample_size: {
				type: "integer",
				label: "Sample size",
				icon: "subject",
				input: {
					type: "number",
					default: 100,
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						//Cannot change if status is
						if (values) {
							if (
								["cancelled", "completed"].includes(
									values.status
								)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.role === "admin") {
								return false;
							} else {
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},
			confidence_level: {
				type: "integer",
				label: "Confidence level",
				icon: "label",
				input: {
					type: "slider",
					default: "85",
					required: true,
					size: 6,
				},
				possibilities: {
					80: "80%",
					85: "85%",
					90: "90%",
					95: "95%",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						//Cannot change if status is
						if (values) {
							if (
								["cancelled", "completed"].includes(
									values.status
								)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.role === "admin") {
								return false;
							} else {
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},
			error_margin: {
				type: "integer",
				label: "Error margin",
				icon: "subject",
				input: {
					type: "slider",
					default: "15",
					required: true,
					size: 6,
				},
				possibilities: {
					5: "5%",
					10: "10%",
					15: "15%",
					20: "20%",
					25: "25%",
					30: "30%",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						//Cannot change if status is
						if (values) {
							if (
								["cancelled", "completed"].includes(
									values.status
								)
							) {
								return true;
							}
						}
						if (user) {
							if (user?.isAdmin) {
								return false;
							} else {
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},

			files: {
				type: ["string"],
				label: "Files",
				input: {
					type: "file",
					props: {
						acceptedFiles: [
							"image/*",
							"video/*",
							"audio/*",
							"application/*",
						],
						filesLimit: 3,
						helperText: "Max of 3 filse",
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
				icon: "label",
				input: {
					type: "select",
					default: "requested",
					required: true,
				},
				possibilities: (values, user) => {
					let default_possibilities = {
						requested: "Requested",
						approved: "Approved",
						commissioned: "Commissioned",
						cancelled: "Cancelled",
						completed: "Completed",
					};

					if (user) {
						if (user?.isAdmin) {
							return default_possibilities;
						} else {
							let possibilities = {
								requested: "Requested",
								cancelled: "Cancelled",
							};
							if (typeof values === "object" && values.status) {
								if (values.status in default_possibilities) {
									possibilities[values.status] =
										default_possibilities[values.status];
								}
							}

							return possibilities;
						}
					}

					return default_possibilities;
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							if (user?.role === "admin") {
								return false;
							} else {
								//Cannot change if status is
								if (values) {
									if (
										["commissioned", "completed"].includes(
											values.status
										)
									) {
										return true;
									}
								}
								if (values && "customer" in values) {
									return typeof values.customer ===
										"object" &&
										values.customer._id === user?._id
										? false
										: values.customer === user?._id
											? false
											: true;
								}
							}
						}
						return true;
					},
				},
			},
		},
		identity: {
			primary: ["title"],
			secondary: ["status"],
			avatar: false,
		},
		dependencies: [
			{
				name: "users",
				column: "customer",
			},
		],
		dependants: {
			queries: {
				column: "survey",
				query: {},
			},
			commissions: {
				column: "survey",
				query: {},
			},
			actionlogs: {
				column: "record",
				query: { context: "Survey" },
			},
		},
	},
	access: {
		restricted: user => user?.role !== "admin" && user?.role !== "customer",
		view: {
			summary: user => user?.role === "admin" || user?.role === "customer",
			all: user => user?.role === "admin" || user?.role === "customer",
			single: (user) => user?.role === "admin" || user?.role === "customer",
		},
		actions: {
			view: {
				restricted: user => user?.role !== "admin" && user?.role !== "customer",
				uri: entry => {
					return (
						"/surveys/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "/surveys/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"/surveys/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("/surveys/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},

	},
};
