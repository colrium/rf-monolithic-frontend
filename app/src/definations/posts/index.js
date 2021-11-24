/**
 * /* eslint-disable react/display-name
 *
 * @format
 */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	VerticalSplitOutlined as DefinationContextIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@mui/icons-material";
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
			subtitle: {
				type: "string",
				label: "Subtitle",
				input: {
					type: "text",
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

			status: {
				type: "string",
				label: "Status",
				input: {
					type: "select",
					default: "published",
					required: true,
				},
				possibilities: {
					'auto-draft': "Auto Draft",
					'draft': "Draft",
					'published': "Published",
					'trash': "trash"
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
						return true;
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
					service_query: { type: "category" },
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
					required: false,
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
					defaultValue: (values, user) => {
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
			featured_image: {
				type: "string",
				label: "Featured Image",
				input: {
					type: "file",
					props: {
						acceptedFiles: ["image/*"],
						filesLimit: 1,
						dropzoneText: "Click to select Featured Image \n or \n Drag and drop an image file here",
						dropzoneIcon: "image",
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

			attachments: {
				type: ["string"],
				label: "Attachments",
				input: {
					type: "file",
					props: {
						acceptedFiles: ["image/*", "video/*", "audio/*", "application/*"],
						filesLimit: 1,
						dropzoneText: "Click to select File(s)\n or \n Drag and drop an files here",
						dropzoneIcon: "attachment",
					}

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
					default: "authorized",
					required: true,
				},
				possibilities: {
					'open': "Open to public",
					'authorized': "Authorized users only",
					'author': "Author only",
					'admin': "Administrators only",
					'non-admin': "Non Administrators only",
					'customers': "Customers",
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
				uri: entry => {
					return "posts/view/" + entry?._id;
				},
				link: {
					inline: {
						default: () => { },
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"posts/view/" + entry?._id}
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
										variant="outlined"
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
				uri: entry => {
					return "posts/edit/" + entry?._id;
				},
				link: {
					inline: {
						default: () => { },
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"posts/edit/" + entry?._id}
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
				uri: entry => {
					return "posts/delete/" + entry?._id;
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
