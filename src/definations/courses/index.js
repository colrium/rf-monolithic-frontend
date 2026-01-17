import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import {
	SchoolOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
	Add as AddIcon,
	EditOutlined as EditIcon,
	DeleteOutlined as DeleteIcon,
} from "@mui/icons-material";

const currentDate = new Date();

export default {
	name: "courses",
	label: "Courses",
	icon: <DefinationContextIcon />,
	color: "#4a148c",
	model: "Course",
	endpoint: "/training/courses",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {
				resolveData: entry => {
					let view_data = {};

					return view_data;
				},
			},
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

			instructions: {
				type: "string",
				label: "Instructions",
				input: {
					type: "textarea",
					default: "",
				},
				restricted: {
					display: () => {
						return true;
					},
					input: (values, user) => {
						if (user) {
							return !user?.isAdmin
						}
						return true;
					},
				},

			},



			banner: {
				type: "string",
				label: "banner",
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

			from: {
				type: "string",
				label: "From",
				input: {
					type: "date",
					default: new Date(),
					size: 6,
					props: {
						maxDate: new Date().setFullYear(currentDate.getFullYear() + 5),
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

			to: {
				type: "string",
				label: "To",
				input: {
					type: "date",
					default: new Date().setFullYear(currentDate.getFullYear() + 1),
					size: 6,
					props: {
						maxDate: new Date().setFullYear(currentDate.getFullYear() + 10),
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


			materials: {
				type: ["string"],
				label: "Materials",
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

			access: {
				type: "string",
				label: "Access",
				input: {
					type: "select",
					default: "authenticated_users",
					required: true,
				},
				possibilities: {
					'open': "Open to public",
					'authorized_users': "Authorized users only",
					'author': "Author",
					'trainers': "Trainers only",
					'trainees': "Trainees only",
					'trainers_and_trainees': "Trainers and Trainees only",
					'administrators': "Administrators only",
					'user_role': "Specific User role",
					'user_roles': "Specific User roles",
					'non_adminitrators': "Non administrators only",
					'authenticated_users': "Authenticated users only",
					'password': "Password"
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

			trainers: {
				type: ["string"],
				label: "Trainers",
				input: {
					type: "select",
				},
				reference: {
					name: "users",
					service_query: { pagination: -1, sort: "first_name", fields: "first_name,last_name,email_address,avatar", role: "admin" },
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

			trainees: {
				type: ["string"],
				label: "Trainees",
				input: {
					type: "select",
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

			active: {
				type: "boolean",
				label: "Active",
				input: {
					type: "checkbox",
					default: true,
					required: false,
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


		},
		identity: {
			primary: ["title"],
			secondary: ["from", "to"],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			quizes: {
				column: "course",
				query: {},
			}
		},
	},
	access: {
		restricted: user => user?.role !== "admin" && user?.role !== "collector",
		view: {
			summary:  user => user?.role === "admin" || user?.role === "collector",
			all: user => user?.role === "admin" || user?.role === "collector",
			single: (user) => user?.role === "admin" || user?.role === "collector",
		},
		actions: {
			view: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"courses/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "courses/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"courses/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("courses/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},

	},
};
