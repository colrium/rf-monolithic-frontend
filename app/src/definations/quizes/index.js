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
					service_query: { active: 1 },
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
							return !user.isAdmin
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
							return (user.role !== "admin");
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
					return ("quizes/view/" + entry?._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className) => {
							return (
								<Link
									to={(
										"quizes/view/" + entry?._id
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
									to={("quizes/view/" + entry?._id).toUriWithDashboardPrefix()}
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
				uri: "quizes/add".toUriWithDashboardPrefix(),
				link: {
					inline: {
						default: props => {
							return (
								<Link
									to={"quizes/add/".toUriWithDashboardPrefix()}
									{...props}
								>
									<Button
										color="primary"
										variant="outlined"
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Quiz
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
					return ("quizes/edit/" + entry?._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {
							return (
								<Link
									to={("quizes/edit/" + entry?._id).toUriWithDashboardPrefix()}
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
									to={("quizes/edit/" + entry?._id).toUriWithDashboardPrefix()}
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
					return ("quizes/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: () => { },
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