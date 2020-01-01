/* eslint-disable react/display-name */
import { IconButton } from "@material-ui/core";
import { Add as AddIcon, AttachMoneyOutlined as DefinationContextIcon, DeleteOutlined as DeleteIcon, EditOutlined as EditIcon, OpenInNewOutlined as OpenInNewIcon } from "@material-ui/icons";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "currencies",
	label: "Currencies",
	icon: <DefinationContextIcon />,
	color: "#001f40",
	model: "Currency",
	views: {
		single: {
			default: "cardview",
			cardview: {}
		},
		listing: {
			default: "tableview",
			tableview: {},
			
		}
	},
	scope: {
		columns: {
			name: {
				type: "string",
				label: "Name",
				input: {
					type: "text",
					required: true
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
					}
				},
			},
			symbol: {
				type: "string",
				label: "Symbol",
				input: {
					type: "text",
					required: true,
					size: 6,
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
					}
				},
			},
			html_symbol: {
				type: "string",
				label: "HTML Symbol",
				input: {
					type: "text",
					required: true,
					size: 6,
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
					}
				},
			},
			exchange_rate: {
				type: "number",
				label: "Exchange Rate",
				input: {
					type: "number",
					default: 1,
					required: true,					
					size: 6,
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
					}
				},
			},
			exchange_rate_date: {
				type: "string",
				label: "Exchange Rate Date",
				input: {
					type: "datetime",
					required: false,
					size: 6,
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
					}
				},
			},
			active: {
				type: "boolean",
				label: "Active",
				input: {
					type: "checkbox",
					default: true,
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
					}
				},
			}
		},
		identity: {
			primary: ["symbol"],
			secondary: ["html_symbol"],
			avatar: false
		},
		dependencies: [],
		dependants: []
	},
	access: {
		restricted: user => {
			if (user) {
				return !user.isAdmin;
			}
			return true;
		},
		view: {
			summary: (user) => {
				if (user) {
					return user.isAdmin;
				}
				return false;
			},
			all: (user) => {
				if (user) {
					return user.isAdmin;
				}
				return false;
			},
			single: (user, record) => {
				if (user && !record) {
					return user.isAdmin;
				}
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
				uri: id => {
					return "currencies/view/" + id;
				},
				link: {
					inline: {
						default: () => { },
						listing: (id, className = "grey_text") => {
							return (
								<Link to={"currencies/view/" + id} className={className}>
									<IconButton color="inherit" aria-label="edit">
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
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: "currencies/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link to={"currencies/add/"} {...props}>
									<Button color="primary" outlined aria-label="add">
										<AddIcon className="float-left" /> New Currency
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
						return !user.isAdmin;
					}
					return true;
				},
				uri: id => {
					return "currencies/edit/" + id;
				},
				link: {
					inline: {
						default: () => { },
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={"currencies/edit/" + id}
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
						return !user.isAdmin;
					}
					return true;
				},
				uri: id => {
					return "currencies/delete/" + id;
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
