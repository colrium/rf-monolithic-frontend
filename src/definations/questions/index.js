import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import Button from "components/Button";
import Avatar from "components/Avatar";
import {
	LiveHelpOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
	Add as AddIcon,
	EditOutlined as EditIcon,
	DeleteOutlined as DeleteIcon,
} from "@material-ui/icons";

const currentDate = new Date();

export default {
	name: "questions",
	label: "Questions",
	icon: <DefinationContextIcon />,
	color: "#4a148c",
	model: "Question",
	endpoint: "/training/questions",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {				
				resolveData: entry => {
					let view_data = {};
					
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
			tableview: {
				title: ["name"],
			},
		},
	},
	scope: {
		columns: {
			quiz: {
				type: "string",
				label: "Quiz",
				input: {
					type: "select",
					required: true,
				},
				reference: {
					name: "quizes",
					service_query: (values, user) => {
						return {};
					},
					resolves: {
						value: "_id",
						display: {
							primary: ["title"],
							secondary: ["description"],
							avatar: "",
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

			value: {
				type: "string",
				label: "Question",
				input: {
					type: "textarea",
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


			type: {
				type: "string",
				label: "Type",
				input: {
					type: "select",
					default: "open",
					required: true,
				},
				possibilities: {
					'open': "Open", 
					'truth': "True or False", 
					'single_choice': "Single Choice", 
					'multiple_choice': "Multiple Choice"
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

			
			
		},
		identity: {
			primary: ["value"],
			secondary: [],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			answers: {
				column: "question",
				query: {},
			},
			actionlogs: {
				column: "record",
				query: { context: "Question" },
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
					return ("questions/view/" + entry._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className) => {
							return (
								<Link
									to={(
										"questions/view/" + entry._id
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
									to={("questions/view/" + entry._id).toUriWithDashboardPrefix()}
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
				uri: "questions/add".toUriWithDashboardPrefix(),
				link: {
					inline: {
						default: props => {
							return (
								<Link
									to={"questions/add/".toUriWithDashboardPrefix()}
									{...props}
								>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Question
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
					return ("questions/edit/" + entry._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {
							return (
								<Link
									to={("questions/edit/" + entry._id).toUriWithDashboardPrefix()}
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
									to={("questions/edit/" + entry._id).toUriWithDashboardPrefix()}
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
					return ("questions/delete/" + entry._id).toUriWithDashboardPrefix();
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