import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import Button from "components/Button";
import {
	SchoolOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
	Add as AddIcon,
	EditOutlined as EditIcon,
	DeleteOutlined as DeleteIcon,
} from "@material-ui/icons";

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
							return !user.isAdmin
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
							return !user.isAdmin
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
							return !user.isAdmin
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

			from: {
				type: "string",
				label: "From",
				input: {
					type: "date",
					default: new Date(),
					size: 6,
					props: {
						maxDate: new Date().setFullYear(currentDate.getFullYear()+5),
						format:"DD/MM/YYYY",
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
							return (user.role !== "admin");
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
					default: new Date().setFullYear(currentDate.getFullYear()+1),
					size: 6,
					props: {
						maxDate: new Date().setFullYear(currentDate.getFullYear()+10),
						format:"DD/MM/YYYY",
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
							return (user.role !== "admin");
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

			access: {
				type: "string",
				label: "Access",
				input: {
					type: "select",
					default: "authenticated_users",
					required: true,
				},
				possibilities: {
					'open' : "Open to public", 
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
							return !user.isAdmin
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
					service_query: {sort: "first_name", fields: "first_name,last_name,email_address,avatar", role: "admin"},
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
					service_query: {sort: "first_name", fields: "first_name,last_name,email_address,avatar", role: "collector"},
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
						return !(user && user.role === "admin");
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
			view_single: {
				restricted: user => {
					if (user) {
						return false;
					}
					return true;
				},
				uri: entry => {
					return ("courses/view/" + entry?._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className) => {
							return (
								<Link
									to={("courses/view/" + entry?._id).toUriWithDashboardPrefix()}
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
									to={("courses/view/" + entry?._id).toUriWithDashboardPrefix()}
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
					return !(user && user.role === "admin");
				},
				uri: "courses/add".toUriWithDashboardPrefix(),
				link: {
					inline: {
						default: props => {
							return (
								<Link
									to={"courses/add/".toUriWithDashboardPrefix()}
									{...props}
								>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New Course
									</Button>
								</Link>
							);
						},
						listing: () => {
							return "";
						},
					},
				},
			},
			update: {
				restricted: user => {
					if (user) {
						if (user.role) {
						}
						return false;
					}
					return true;
				},
				uri: entry => {
					return ("courses/edit/" + entry?._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {
							return (
								<Link
									to={("courses/edit/" + entry?._id).toUriWithDashboardPrefix()}
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
									to={("courses/edit/" + entry?._id).toUriWithDashboardPrefix()}
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
					return ("courses/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: () => {},
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