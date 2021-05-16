/** @format */

import { IconButton } from "@material-ui/core";
import {
	Add as AddIcon,
	BallotOutlined as DefinationContextIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@material-ui/icons";
import ImageIcon from "@material-ui/icons/ImageOutlined";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";
import { CountriesHelper } from "hoc/Helpers";

export default {
	name: "vacancies",
	label: "Vacancies",
	icon: <DefinationContextIcon />,
	color: "#00bcd4",
	model: "Vacancy",
	endpoint: "/recruitment/vacancies",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["name"],
				subtitle: ["code"],
				body: [
					"status",
					"customer",
					"expiration_date",
					"value_type",
					"value",
					"use",
				],
			},
			calendarview: {
				title: ["title"],
				subtitle: ["code"],
				body: [
					"status",
					"customer",
					"expiration_date",
					"value_type",
					"value",
					"use",
				],
			},
		},
		listing: {
			default: "tableview",
			tableview: {
				avatar: false,
				title: ["title"],
			},
		},
	},
	scope: {
		columns: {
			position: {
				type: "string",
				label: "Position Name",
				input: {
					type: "text",
					required: true,
					default: "",
				},
				restricted: {
					display: (entry, user) => {
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

			description: {
				type: "string",
				label: "Description",
				input: {
					type: "textarea",
					default: "",
				},
				restricted: {
					display: (entry, user) => {
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

			banner: {
				type: "string",
				label: "Banner",
				input: {
					type: "file",
					accepts: ["image/*"],
					props: {
						acceptedFiles: ["image/*"],
						dropzoneText: "Drag & drop vacancy banner image here",
						dropzoneIcon: <ImageIcon />,
					},
				},
				reference: {
					name: "attachments",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["size"],
							avatar: false,
						},
					},
				},
			},

			qualifications: {
				type: "string",
				label: "Qualifications",
				input: {
					type: "textarea",
					default: "",
					required: true,
					rich: true,
				},
				restricted: {
					display: (entry, user) => {
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

			requirements: {
				type: "string",
				label: "Requirements",
				input: {
					type: "textarea",
					default: "",
					required: true,
					rich: true,
				},
				restricted: {
					display: (entry, user) => {
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

			responsibilitiea: {
				type: "string",
				label: "Responsibilitiea",
				input: {
					type: "textarea",
					default: "",
					rich: true,
				},
				restricted: {
					display: (entry, user) => {
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

			country: {
				type: "string",
				label: "Country",
				icon: "folder",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				possibilities: CountriesHelper.names(),
			},

			region: {
				type: "string",
				label: "State/Province/Region/County",
				input: {
					type: "text",
					default: "",
					required: false,
				},
			},

			city: {
				type: "string",
				label: "City/Town",
				input: {
					type: "text",
					default: "",
					required: false,
				},
			},

			notes: {
				type: "string",
				label: "Notes",
				input: {
					type: "textarea",
					default: "",
					rich: true,
				},
				restricted: {
					display: (entry, user) => {
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

			maximum_applications: {
				type: "string",
				label: "Maximum No of applications",
				input: {
					type: "number",
					default: "1",
				},
				restricted: {
					display: (entry, user) => {
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

			bias: {
				type: "string",
				label: "Bias",
				input: {
					type: "text",
					default: "",
				},
				restricted: {
					display: (entry, user) => {
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

			application_deadline: {
				type: "string",
				label: "Application Deadline",
				input: {
					type: "datetime",
					default: new Date().addDays(30).toString(),
				},
				restricted: {
					display: (entry, user) => {
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

			active: {
				type: "boolean",
				label: "Active",
				input: {
					type: "checkbox",
					default: true,
				},
			},
		},
		identity: {
			primary: ["position"],
			secondary: ["application_deadline"],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			applications: {
				column: "vacancy",
				query: {},
			},
			actionlogs: {
				column: "record",
				query: { context: "Vacancy" },
			},
		},
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
				if (user && record) {
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
					return "vacancies/view/" + entry?._id;
				},
				link: {
					inline: {
						default: (entry, className) => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"vacancies/view/" + entry?._id}
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
					return user ? !user.isAdmin : true;
				},
				uri: "vacancies/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link to={"vacancies/add/"} {...props}>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Vacancy
									</Button>
								</Link>
							);
						},
						listing: props => {
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
					return "vacancies/edit/" + entry?._id;
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"vacancies/edit/" + entry?._id}
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
					return "vacancies/delete/" + entry?._id;
				},
				link: {
					inline: {
						default: (id, className = "error_text") => {},
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
