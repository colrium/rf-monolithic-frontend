/**
 * /* eslint-disable react/display-name
 *
 * @format
 */

import { IconButton } from "@material-ui/core";
import {
	Add as AddIcon,
	VerticalSplitOutlined as DefinationContextIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@material-ui/icons";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "posts",
	label: "Posts",
	icon: <DefinationContextIcon />,
	color: "#001f40",
	model: "Post",
	endpoint: "/posts",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {},
		},
		listing: {
			default: "tableview",
			tableview: {},
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
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
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
					required: true,
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
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
					default: "blog",
					required: true,
					position: "sidebar",
				},
				possibilities: {
					blog: "Blog",
					category: "Category",
					press: "Press",
					faq: "FAQ",					
					"knowledge-base": "Knowledge Base",
					newsletter: "Newsletter",
					anouncement: "Anouncement",
					notice: "Notice",
					policy: "Policy",
					agreement: "Agreement",
					note: "Note",
					scrumboard: "Scrumboard",
					academy: "Academy",
				},
			},

			content: {
				type: "string",
				label: "Content",
				input: {
					type: "textarea",
					required: true,
					props: {
						rows: 30,
					},
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			category: {
				type: "string",
				label: "Category",
				input: {
					type: "select",
				},

				reference: {
					name: "posts",
					service_query: { status: "publish" },
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
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							return values.context === "category";
						}
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			slug: {
				type: "string",
				label: "Slug",
				input: {
					type: "text",
					required: true,
					value: (values, user) => {
						if (values) {
							if (String.isString(values.title)) {
								if (values.type.length > 0) {
									return values.title
										.variablelize()
										.replaceAll("_", "-")
										.replaceAll("-", " ")
										.replace(/[^\w\s]/, "")
										.replaceAll(" ", "-");
								}
							}
						}
						return "";
					},
					/*defaultValue: (values, user) => {
						if (values) {
							if (String.isString(values.title)) {
								if (values.type.length > 0) {
									return values.title
										.variablelize()
										.replaceAll("_", "-")
										.replaceAll("-", " ")
										.replace(/[^\w\s]/, "")
										.replaceAll(" ", "-");
								}
							}
						}
						return "";
					},*/
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
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
		dependants: [],
	},
	access: {
		restricted: user => {
			if (user) {
				return !user.isAdmin;
			}
			return true;
		},
		view: {
			summary: user => {
				return false;
			},
			all: user => {
				if (user) {
					return user.isAdmin;
				}
				return false;
			},
			single: (user, record) => {
				if (user) {
					return user.isAdmin;
				}
				return false;
			},
		},
		actions: {
			view_single: {
				restricted: user => {
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: id => {
					return "posts/view/" + id;
				},
				link: {
					inline: {
						default: () => {},
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={"posts/view/" + id}
									className={className}
								>
									<IconButton
										color="inherit"
										aria-label="edit"
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
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: "posts/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link to={"posts/add/"} {...props}>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Post
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
						return !user.isAdmin;
					}
					return true;
				},
				uri: id => {
					return "posts/edit/" + id;
				},
				link: {
					inline: {
						default: () => {},
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={"posts/edit/" + id}
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
						return !user.isAdmin;
					}
					return true;
				},
				uri: id => {
					return "posts/delete/" + id;
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
