/* eslint-disable react/display-name */
import { IconButton } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import { Add as AddIcon, DeleteOutlined as DeleteIcon, EditOutlined as EditIcon, OpenInNewOutlined as OpenInNewIcon, ReceiptOutlined as DefinationContextIcon } from "@material-ui/icons";
import Avatar from "components/Avatar";
import Button from "components/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Typography from "components/Typography";
import { formats } from "config/data";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Link } from "react-router-dom";
import { attachments as AttachmentsService } from "services";



export default {
	name: "orderitems",
	label: "Order Items",
	icon: <DefinationContextIcon />,
	color: "#004038",
	model: "OrderItem",
	endpoint: "/retail/order-items",
	views: {
		single: {
			default: "cardview",
			cardview: {
			},
			orderview: {
				
			}
		},
		listing: {
			default: "tableview",
			listview: {
			},
			tableview: {
			},
			
		}
	},
	scope: {
		columns: {
			order: {
				type: "string",
				label: "Order",
				input: {
					type: "select",
					required: true,
				},

				reference: {
					name: "orders",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["reference"],
							secondary: [],
							avatar: false
						}
					}
				},
				restricted: {
					display: (values, user) => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							return values.context !== "order";
						}
						if (user) {
							return !user.isAdmin;
						}
						return true;
					}
				}
			},
			item: {
				type: "string",
				label: "Retail Item",
				input: {
					type: "select",
					required: true
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							if (user.role === "admin") {
								return false;
							}
						}
						return true;
					},
					input: (values, user) => {
						if (user) {
							if (user.role === "admin") {
								return false;
							}
						}
						return true;
					}
				},
				reference: {
					name: "retailitems",
					service_query: { available: 1 },
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["sku"],
							avatar: false
						}
					}
				}
			},
			

			quantity: {
				type: "string",
				label: "Quantity",
				input: {
					type: "number",
					default: 1,
					required: false,

				},
			},

			currency: {
				type: "string",
				label: "Currency",
				input: {
					type: "select",
					required: true,
					size: 4
				},
				input: {
					type: "select",
					required: true
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							if (user.role === "admin") {
								return false;
							}
						}
						return true;
					},
					input: (values, user) => {
						if (user) {
							if (user.role === "admin") {
								return false;
							}
						}
						return true;
					}
				},
				reference: {
					name: "currencies",
					service_query: { actve: 1 },
					resolves: {
						value: "_id",
						display: {
							primary: ["symbol"],
							secondary: ["html_symbol"],
							avatar: false
						}
					}
				}
			},
			cost: {
				type: "string",
				label: "Cost",
				input: {
					type: "number",
					default: 1,
					required: false,
					size: 8
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							return values.apply_coupon ? false : true;
						}
						return true;
					}
				},
			},

			options: {
				type: "object",
				label: "Options",
				input: {
					type: "dynamic",
					default: 1,
					required: false,
					size: 8
				},
				restricted: {
					display: () => {
						return false;
					},
					input: (values, user) => {
						if (values) {
							return values.apply_coupon ? false : true;
						}
						return true;
					}
				},
			},


			options_cost: {
				type: "string",
				label: "Options cost",
				input: {
					type: "number",
					default: 0,
					required: true
				},
				restricted: {
					display: () => {
						return false;
					},
					input: () => {
						return false;
					}
				}
			},
		},
		identity: {
			primary: ["reference"],
			secondary: ["status"],
			avatar: false
		},
		dependencies: [],
		dependants: {			
		}
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
				if (user) {
					return true;
				}
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
					return "orderitems/view/" + id;
				},
				link: {
					inline: {
						default: () => { },
						listing: (id, className = "grey_text") => {
							return (
								<Link to={"orderitems/view/" + id} className={className}>
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
					return user && user.role === "admin" ? false : true;
				},
				uri: "orderitems/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link to={"orderitems/add/"} {...props}>
									<Button color="primary" outlined aria-label="add">
										<AddIcon className="float-left" /> New Order Item
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
						return false;
					}
					return true;
				},
				uri: id => {
					return "orderitems/edit/" + id;
				},
				link: {
					inline: {
						default: () => { },
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={"orderitems/edit/" + id}
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
					return "orderitems/delete/" + id;
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
