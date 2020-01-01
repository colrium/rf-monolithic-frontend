/* eslint-disable react/display-name */
import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import Button from "components/Button";
import Avatar from "components/Avatar";
import {
	HistoryOutlined as DefinationContextIcon,
	OpenInNewOutlined as OpenInNewIcon,
	Add as AddIcon,
	EditOutlined as EditIcon,
	DeleteOutlined as DeleteIcon
} from "@material-ui/icons";

import { UtilitiesHelper, FilesHelper } from "utils/Helpers";

import * as definations from "definations";

let resolve_context_possibilities = (values, user) => {
	let possibilies = {};
	if (user) {
		for (let [name, defination] of Object.entries(definations)) {
			if (name !== "actionlogs" && !defination.access.restricted(user)) {
				if (UtilitiesHelper.isOfType(defination.label, "function")) {
					possibilies[name] = defination.label(user);
				} else {
					possibilies[name] = defination.label;
				}
			}
		}
	}

	return possibilies;
};

export default {
	name: "actionlogs",
	label: "Activity Logs",
	icon: <DefinationContextIcon />,
	color: "#4a148c",
	model: "ActionTrail",
	views: {
		single: {
			default: "cardview",
			cardview: {
				avatar: entry => {
					if (entry) {
						return FilesHelper.fileIcon(entry.name);
					}

					return FilesHelper.fileIcon("file.unknown");
				},
				resolveData: entry => {
					let view_data = {};
					if (UtilitiesHelper.isOfType(entry, "object")) {
						view_data = {
							color: "#4a148c",
							avatar: (
								<Avatar>
									{" "}
									<DefinationContextIcon />{" "}
								</Avatar>
							)
						};
					}

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
					"action_timestamp"
				]
			}
		},
		listing: {
			default: "listview",
			listview: {
				avatar: false,
				primary: ["action"],
				secondary: ["description", "catalyst", "catalyst", "action_timestamp"]
			},
			tableview: {
				title: ["name"]
			}
		}
	},
	scope: {
		columns: {
			action: {
				type: "string",
				label: "Action",
				input: {
					type: "select",
					default: "",
					required: false
				},
				possibilities: {
					create: "Create",
					update: "Update",
					delete: "Delete",
					custom: "Custom"
				}
			},

			generator: {
				type: "string",
				label: "Generator",
				input: {
					type: "select",
					default: "user",
					required: true
				},
				possibilities: {
					user: "User",
					system: "System"
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						return !(user && user.role === "admin");
					}
				}
			},

			context: {
				type: "string",
				label: "Context",
				input: {
					type: "select",
					default: "",
					required: false
				},
				possibilities: resolve_context_possibilities
			},

			record: {
				type: "string",
				label: "Record",
				input: {
					type: "text",
					default: "",
					required: true
				}
			},

			catalyst: {
				type: "string",
				label: "Catalyst",
				input: {
					type: "select",
					default: "",
					required: false
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
							primary: ["honorific", "first_name", "last_name"],
							secondary: ["email_address"],
							avatar: "avatar"
						}
					}
				},
				restricted: {
					display: () => {
						return false;
					},
					input: values => {
						return values ? !values.generator === "system" : true;
					}
				}
			},

			catalyst_ip: {
				type: "string",
				label: "Catalyst IP",
				input: {
					type: "text",
					default: "",
					required: false
				},
				restricted: {
					display: () => {
						return false;
					},
					input: () => {
						return true;
					}
				}
			},

			description: {
				type: "string",
				label: "Description",
				input: {
					type: "textarea",
					default: "",
					required: false
				},
				restricted: {
					display: () => {
						return false;
					},
					input: () => {
						return true;
					}
				}
			},

			action_timestamp: {
				type: "string",
				label: "Action timestamp",
				input: {
					type: "date",
					default: "",
					required: false
				},
				restricted: {
					display: () => {
						return false;
					},
					input: values => {
						return values ? !values.generator === "system" : true;
					}
				}
			}
		},
		identity: {
			primary: ["action"],
			secondary: ["action_timestamp"],
			avatar: false
		},
		dependencies: [],
		dependants: {}
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
			}
		},
		actions: {
			view_single: {
				restricted: user => {
					if (user) {
						return false;
					}
					return true;
				},
				uri: id => {
					return ("actionlogs/view/" + id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (id, className) => {
							return (
								<Link
									to={("actionlogs/view/" + id).toUriWithDashboardPrefix()}
									className={className}
								>
									<IconButton color="inherit" aria-label="view">
										<OpenInNewIcon />
									</IconButton>
								</Link>
							);
						},
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={("actionlogs/view/" + id).toUriWithDashboardPrefix()}
									className={className}
								>
									<IconButton color="inherit" aria-label="view">
										<OpenInNewIcon fontSize="small" />
									</IconButton>
								</Link>
							);
						}
					}
				}
			},
			create: {
				restricted: user => {
					return !(user && user.role === "admin");
				},
				uri: "actionlogs/add".toUriWithDashboardPrefix(),
				link: {
					inline: {
						default: props => {
							return (
								<Link to={"actionlogs/add/".toUriWithDashboardPrefix()} {...props}>
									<Button color="primary" outlined aria-label="add">
										<AddIcon className="float-left" /> New Action Log
                  </Button>
								</Link>
							);
						},
						listing: () => {
							return "";
						}
					}
				}
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
				uri: id => {
					return ("actionlogs/edit/" + id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (id, className = "grey_text") => {
							return (
								<Link
									to={("actionlogs/edit/" + id).toUriWithDashboardPrefix()}
									className={className}
								>
									<IconButton color="inherit" aria-label="add">
										<AddIcon />
									</IconButton>
								</Link>
							);
						},
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={("actionlogs/edit/" + id).toUriWithDashboardPrefix()}
									className={className ? className : ""}
								>
									<IconButton color="inherit" aria-label="edit">
										<EditIcon fontSize="small" />
									</IconButton>
								</Link>
							);
						}
					}
				}
			},
			delete: {
				restricted: user => {
					if (user) {
						return false;
					}
					return true;
				},
				uri: id => {
					return ("actionlogs/delete/" + id).toUriWithDashboardPrefix();
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
						}
					}
				}
			}
		}
	}
};
