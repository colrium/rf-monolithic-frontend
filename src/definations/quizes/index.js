import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import Button from "components/Button";
import {
	AssignmentOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
	Add as AddIcon,
	EditOutlined as EditIcon,
	DeleteOutlined as DeleteIcon,
} from "@mui/icons-material";

const currentDate = new Date();

export default {
	name: "quizes",
	label: "Quizes",
	icon: <DefinationContextIcon />,
	color: "#4a148c",
	model: "Quiz",
	endpoint: "/training/quizes",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {},
		},
		listing: {
			default: "tableview",
			tableview: {
				title: ["name"],
			},
		},
	},
	scope: {
		columns: {

			course: {
				type: "string",
				label: "Course",
				input: {
					type: "select",
					required: true,
				},
				reference: {
					name: "courses",
					service_query: { pagination: -1, active: 1 },
					resolves: {
						value: "_id",
						display: {
							primary: ["title"],
							secondary: [],
							avatar: false,
						},
					},
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin
						}
						return true;
					},
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
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin
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
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin
						}
						return true;
					},
				},

			},



			answers_submission_deadline: {
				type: "string",
				label: "Answers submission deadline",
				input: {
					type: "date",
					default: new Date().setFullYear(currentDate.getFullYear() + 1),
					required: true,
					props: {
						maxDate: new Date().setFullYear(currentDate.getFullYear() + 1),
						format: "DD/MM/YYYY",
						margin: "dense",
						/*InputProps: {
							classes : {
								root: "inverse",
							}
						}*/
					},
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return (user?.role !== "admin");
						}
						return true;
					},
				},
			},


		},
		identity: {
			primary: ["title"],
			secondary: [],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			questions: {
				column: "quiz",
				query: {},
			},
			results: {
				column: "quiz",
				query: {},
			}
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
						"/quizes/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "/quizes/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"/quizes/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("/quizes/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},

	},
};
