/**
 * /* eslint-disable react/display-name
 *
 * @format
 */

import { IconButton } from "@material-ui/core";
import {
	Add as AddIcon,
	ContactSupportOutlined as DefinationContextIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@material-ui/icons";
import { colors } from "assets/jss/app-theme";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";
import { CountriesHelper } from "hoc/Helpers";

export default {
	name: "queries",
	label: "Queries",
	icon: <DefinationContextIcon />,
	color: colors.hex.accent,
	model: "SurveyQuery",
	endpoint: "/queries",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["question"],
				subtitle: ["survey"],
				tags: ["response_type", "status"],
				body: ["sample_size", "country", "locality"],
			},
		},
		listing: {
			default: "tableview",
			/*listview: {
				avatar: false,
				primary: ["question"],
				secondary: ["survey", "response_type", "status"],
			},*/
			tableview: {
				avatar: false,
				title: ["question"],
			},
		},
	},
	scope: {
		columns: {
			survey: {
				type: "string",
				label: "survey",
				icon: "label",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				reference: {
					name: "surveys",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["title"],
							secondary: ["status"],
							avatar: false,
						},
					},
				},
			},
			question: {
				type: "string",
				label: "Question",
				icon: "label",
				input: {
					type: "textarea",
					default: "",
					required: true,
				},
			},
			sample_size: {
				type: "integer",
				label: "Sample size",
				icon: "subject",
				input: {
					type: "number",
					default: 1,
					props: {
						min: 1,
					},
				},
			},
			country: {
				type: "string",
				label: "Country",
				icon: "map",
				input: {
					type: "select",
					default: "",
					required: false,
				},
				possibilities: CountriesHelper.names(),
			},
			locality: {
				type: "string",
				label: "Locality",
				input: {
					type: "text",
					default: "",
					required: false,
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
				},
			},
		},
		identity: {
			primary: ["question"],
			secondary: [],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			responses: {
				column: "query",
				query: {},
			},
			commissions: {
				column: "queries",
				query: {},
			},
			actionlogs: {
				column: "record",
				query: { context: "SurveyQuery" },
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
			summary: user => {
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
					return "queries/view/" + entry?._id;
				},
				link: {
					inline: {
						default: () => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"queries/view/" + entry?._id}
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
					return user && user.role === "admin" ? false : true;
				},
				uri: "queries/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link to={"queries/add/"} {...props}>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Query
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
						return false;
					}
					return true;
				},
				uri: entry => {
					return "queries/edit/" + entry?._id;
				},
				link: {
					inline: {
						default: () => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"queries/edit/" + entry?._id}
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
					return "queries/delete/" + entry?._id;
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
