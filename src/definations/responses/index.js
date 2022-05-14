/** @format */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	AssignmentTurnedInOutlined as DefinationContextIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { context_country_data } from "config/data";
import Grid from '@mui/material/Grid';
;
import ApiService from "services/Api";
import compose from "recompose/compose";
import { connect } from "react-redux";
import { withTheme } from '@mui/styles';
import { Bar } from "react-chartjs-2";
import { UtilitiesHelper } from "utils/Helpers";

const getRegions = () => {
	let regions = {};

	context_country_data.regions.map(region => {
		regions[region.name] = region.name;
	});

	return regions;
}

const mapStateToProps = state => ({
	auth: state.auth,
	cache: state.cache,
});

const CountSummaryGraph = (props) => {
	const { auth: { isAuthenticated } } = props;

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [report, setReport] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {

			ApiService.get("/responses/reports/date-count-summary").then(res => {
				const { body: { data } } = res;
				let labels = [];
				let entries = [];
				if (Array.isArray(data)) {
					data.map(entry => {
						labels.push(entry?._id.submission_date);
						entries.push(entry.count);
					})
				}
				setReport({ labels: labels, data: entries });
				setLoading(false);
				setError(false);
			}).catch(err => {
				setLoading(false);
				setReport(false);
				setError(err);
			});
		}

	}, [isAuthenticated]);

	return (
		<Grid container className="w-full">
			<Grid item xs={12}>
				{report && <Bar data={{ labels: report.labels, datasets: [{ label: "Responses count by date", data: report.data, backgroundColor: "#00AF41", hoverBackgroundColor: "#76C4D5", }] }} />}
			</Grid>
		</Grid>
	)
}
const DashboardCountGraph = compose(
	connect(mapStateToProps, {}),
	withTheme,
)(CountSummaryGraph);

export default {
	name: "responses",
	label: "Responses",
	icon: <DefinationContextIcon />,
	color: "#8C189B",
	model: "Response",
	endpoint: "/responses",
	cache: true,
	views: {
		dashboard: {
			counts: DashboardCountGraph
		},
		single: {
			default: "cardview",
			cardview: {
				title: ["response_date"],
				subtitle: ["submitter"],
				tags: ["response_type", "status"],
				body: [
					"commission",
					"text_response",
					"response_file",
					"submission_date",
					"comments",
				],
			},
		},
		listing: {
			default: "tableview",
			/*listview: {
				avatar: false,
				primary: ["response_date"],
				secondary: ["commission", "response_type", "submitter"],
			},*/
			tableview: {
				avatar: false,
				title: ["response_date"],
			},
			calendarview: {
				type: "task",
				resolveData: async (entries, isPopulated = true) => {
					let resolved_data = [];
					for (let entry of entries) {
						resolved_data.push({
							id: entry?._id,
							calendarId: "responses",
							title: entry.response_type,
							body:
								entry.response_type === "text"
									? entry.text_response
									: entry.response_file.name,
							customStyle: { color: "#FFFFFF" },
							category: "time",
							dueDateClass: "",
							start: entry.response_date,
						});
					}
					return resolved_data;
				},
			},
		},
	},
	scope: {
		columns: {
			commission: {
				type: "string",
				label: "Commission",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (
								["accepted", "disputed"].includes(values.status)
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
					name: "commissions",
					service_query: { pagination: -1, p: 1 },
					resolves: {
						value: "_id",
						display: {
							primary: ["requirements"],
							secondary: [],
							avatar: false,
						},
					},
				},
			},
			child_commission: {
				type: "string",
				label: "Child Commission",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (
								["accepted", "disputed"].includes(values.status)
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
					name: "commissions",
					service_query: { pagination: -1, p: 1 },
					resolves: {
						value: "_id",
						display: {
							primary: ["requirements"],
							secondary: ["involvement", "start_date"],
							avatar: false,
						},
					},
				},
			},
			query: {
				type: "string",
				label: "Query",
				input: {
					type: "select",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (
								["accepted", "disputed"].includes(values.status)
							) {
								return true;
							}
							if (String.isString(values.commission)) {
								if (values.commission.trim().length !== 0) {
									return false;
								}
							}
						}
						return true;
					},
				},
				reference: {
					name: "commissions",
					service_query: (values, user) => {
						if (values) {
							if (String.isString(values.commission)) {
								if (values.commission.trim().length !== 0) {
									return {
										_id: values.commission,
										fields: "queries",
										p: 1,
									};
								}
							}
						}
						return false;
					},
					resolves: {
						value: "_id",
						display: {
							primary: ["question"],
							secondary: ["response_type"],
						},
						emulation: { key: "queries", defination: "responses" },
					},
				},
			},
			region: {
				type: "string",
				label: context_country_data.regions_type.humanize(),
				input: {
					type: "administrative_area_level_1",
					placeholderType: "administrative_area_level_1",
					value: "Kiambu County",
					required: true,
				},
				possibilities: getRegions(),
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (["accepted", "disputed"].includes(values.status)) {
								return true;
							}
						}

						if (user) {
							return !user?.isAdmin;
						}

						return false;
					},
				},
			},
			response_type: {
				type: "string",
				label: "Response type",
				input: {
					type: "radio",
					default: "text",
					required: true,
				},
				possibilities: {
					text: "Text",
					image: "Image",
					audio: "Audio",
					video: "Video",
					file: "File",
					form: "Form",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (
								["accepted", "disputed"].includes(values.status)
							) {
								return true;
							}
						}
						if (user) {
							return !user?.isAdmin;
						}
						return true;
					},
				},
			},

			text_response: {
				type: "string",
				label: "Text response",
				input: {
					type: (values, user) => {
						if (values) {
							if (values.response_type === "text") {
								return "textarea";
							}
						}
						return "hidden";
					},
					required: (values, user) => {
						if (values) {
							if (values.response_type === "text") {
								return true;
							}
						}
						return false;
					},
				},
				restricted: {
					display: (entry, user) => {
						if (entry) {
							return entry.response_type !== "text";
						}
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (values.response_type !== "text") {
								return true;
							}
							if (
								["accepted", "disputed"].includes(values.status)
							) {
								return true;
							}
						}
						if (user) {
							return !user?.isAdmin;
						}
						return true;
					},
				},
			},
			response_file: {
				type: "string",
				label: "Response file",
				isAttachment: true,
				input: {
					type: (values, user) => {
						if (values) {
							if (
								["image", "audio", "video", "file"].includes(
									values.response_type
								)
							) {
								return "file";
							}
						}
						return "hidden";
					},
					required: (values, user) => {
						if (values) {
							if (
								["image", "audio", "video", "file"].includes(
									values.response_type
								)
							) {
								return true;
							}
						}
						return false;
					},
					props: (values, user) => {
						if (values) {
							if (values.response_type === "image") {
								return {
									acceptedFiles: ["image/*"],
									filesLimit: 1,
									dropzoneText:
										"Click to select Image \n or \n Drag and drop an image file here",
									dropzoneIcon: "image",
								};
							} else if (values.response_type === "audio") {
								return {
									acceptedFiles: ["audio/*"],
									filesLimit: 1,
									dropzoneText:
										"Click to select \n or \n Drag and drop an audio file here",
									dropzoneIcon: "music_video",
								};
							} else if (values.response_type === "video") {
								return {
									acceptedFiles: ["video/*"],
									filesLimit: 1,
									dropzoneText:
										"Click to select \n or \n Drag and drop an video file here",
									dropzoneIcon: "movie",
								};
							} else {
								return {
									acceptedFiles: [
										"image/*",
										"video/*",
										"audio/*",
										"application/*",
									],
									filesLimit: 1,
									dropzoneText:
										"Click to select \n or \n Drag and drop an file here",
									dropzoneIcon: "attachment",
								};
							}
						}
						return {
							acceptedFiles: [
								"image/*",
								"video/*",
								"audio/*",
								"application/*",
							],
							filesLimit: 1,
							dropzoneText:
								"Click to select \n or \n Drag and drop an file here",
							dropzoneIcon: "attachment",
						};
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
				restricted: {
					display: (entry, user) => {
						if (entry) {
							return entry.response_type === "text";
						}
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (values.response_type === "text") {
								return true;
							}
						}
						if (user) {
							return !user?.isAdmin;
						}
						return true;
					},
				},
			},
			response_form_value: {
				type: "object",
				label: "Form value",
				input: {
					type: "object",
					placeholder: "Response form value",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin;
						}

						return true;
					},
				},

			},
			coordinates: {
				type: "object",
				label: "Location",
				input: {
					type: "coordinates",
					placeholderType: "formatted_address",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin;
						}

						return true;
					},
				},
			},
			submitter: {
				type: "string",
				label: "Submitter",
				input: {
					type: "select",
					default: (values, user) => {
						if (user) {
							return user?._id;
						}
						return false;
					},
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin;
						}

						return true;
					},
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
			response_date: {
				type: "datetime",
				label: "Response date",
				input: {
					type: "date",
					default: new Date(),
					required: true,
					props: (values, user) => {
						if (user) {
							return user?.isAdmin
								? { maxDate: new Date() }
								: { maxDate: new Date() };
						}
						return { maxDate: new Date() };
					},
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						if (entry) {
							return entry.response_type === "text";
						}
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin;
						}
						return true;
					},
				},
			},
			submission_date: {
				type: "datetime",
				label: "Submission date",
				icon: "event",
				input: {
					type: "date",
					default: new Date(),
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin;
						}
					},
				},
			},
			comments: {
				type: "string",
				label: "Comments",
				icon: "subject",
				input: {
					type: "textarea",
					default: "",
					required: false,
				},
				restricted: {
					display: (entry, user) => {
						if (entry) {
							return entry.response_type === "text";
						}
						return false;
					},
					input: (values, user) => {
						if (values) {
							if (
								["accepted", "disputed"].includes(values.status)
							) {
								return true;
							}
						}
						if (user) {
							return user?.role !== "admin";
						}
						return true;
					},
				},
			},
			status: {
				type: "string",
				label: "Status",
				icon: "folder",
				input: {
					type: "select",
					default: "pending",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						if (entry) {
							return entry.response_type === "text";
						}
						return false;
					},
					input: (values, user) => {
						if (user) {
							return user?.role !== "admin";
						}
						return true;
					},
				},
				possibilities: {
					pending: "Pending",
					acknowledged: "Acknowledged",
					accepted: "Accepted",
					disputed: "Disputed",
					rejected: "Rejected",
				},
			},
		},
		identity: {
			primary: ["response_type"],
			secondary: ["response_date"],
			avatar: false,
		},
		dependencies: [
			{
				name: "commissions",
			},
		],
		dependants: {
			actionlogs: {
				column: "record",
				query: { context: "Response" },
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
						"/responses/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "/responses/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"/responses/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("/responses/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},

	},
};
