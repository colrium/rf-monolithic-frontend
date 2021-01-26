import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import Button from "components/Button";
import Avatar from "components/Avatar";
import {
	AssignmentTurnedInOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
	Add as AddIcon,
	EditOutlined as EditIcon,
	DeleteOutlined as DeleteIcon,
} from "@material-ui/icons";

export default {
	name: "results",
	label: "Results",
	icon: <DefinationContextIcon />,
	color: "#4a148c",
	model: "Result",
	endpoint: "/training/results",
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

			user: {
				type: "string",
				label: "User",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				reference: {
					name: "users",
					service_query: (values, user) => {
						if (user && user.role !== "admin") {
							return { _id: user._id };
						}
						return {};
					},
					resolves: {
						value: "_id",
						display: {
							primary: ["first_name", "last_name"],
							secondary: ["email_address"],
							avatar: "avatar",
						},
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

			quiz: {
				type: "string",
				label: "Quiz",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				reference: {
					name: "quizzes",
					service_query: (values, user) => {
						return {};
					},
					resolves: {
						value: "_id",
						display: {
							primary: ["title"],
							secondary: [],
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

			evaluation: {
				type: "number",
				label: "Evaluation",
				input: {
					type: "number",
					default: 0,
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

			complete: {
				type: "boolean",
				label: "Complete",
				input: {
					type: "checkbox",
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

			sent: {
				type: "boolean",
				label: "Sent",
				input: {
					type: "checkbox",
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
			primary: ["user"],
			secondary: ["quiz"],
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
			view_single: {
				restricted: user => {
					if (user) {
						return false;
					}
					return true;
				},
				uri: entry => {
					return ("results/view/" + entry._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className) => {
							return (
								<Link
									to={(
										"results/view/" + entry._id
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
									to={(
										"results/view/" + entry._id
									).toUriWithDashboardPrefix()}
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
				uri: "results/add".toUriWithDashboardPrefix(),
				link: {
					inline: {
						default: props => {
							return (
								<Link
									to={"results/add/".toUriWithDashboardPrefix()}
									{...props}
								>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New Result
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
					return ("results/edit/" + entry._id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"results/edit/" + entry._id
									).toUriWithDashboardPrefix()}
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
									to={("results/edit/" + entry._id).toUriWithDashboardPrefix()}
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
					return ("results/delete/" + entry._id).toUriWithDashboardPrefix();
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