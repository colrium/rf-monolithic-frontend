/* eslint-disable react/display-name */
import { IconButton } from "@material-ui/core";
import { Add as AddIcon, AttachMoneyOutlined as DefinationContextIcon, DeleteOutlined as DeleteIcon, EditOutlined as EditIcon, OpenInNewOutlined as OpenInNewIcon } from "@material-ui/icons";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "payments",
	label: "Payments",
	icon: <DefinationContextIcon />,
	color: "#001f40",
	model: "Payment",
	endpoint: "/payments",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["currency", "amount"],
				subtitle: ["reference"],
				tags: ["context", "method", "status"],
				body: ["invoice", "order", "account_type", "account", "date_made"]
			}
		},
		listing: {
			default: "tableview",
			listview: {
				avatar: false,
				primary: ["currency", "amount"],
				secondary: ["context", "method", "date_made"]
			},
			tableview: {
				avatar: false,
				title: ["currency", "amount"]
			},
			calendarview: {
				type: "date",
				date: ["date_made"],
				title: ["currency", "amount"],
				tags: ["context", "method", "status"]
			}
		}
	},
	scope: {
		columns: {
			context: {
				type: "string",
				label: "Context",
				input: {
					type: "radio",
					default: "order",
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
				possibilities: {
					order: "Order",
					invoice: "Invoice",					
				}
			},
			invoice: {
				type: "string",
				label: "Invoice",
				input: {
					type: "select",
					required: (values, user) => {
						if (values) {
							return values.context === "invoice";
						}
						return false;
					}
				},

				reference: {
					name: "invoices",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["reference"],
							secondary: ["status"],
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
							return values.context !== "invoice";
						}

						if (user) {
							return !user.isAdmin;
						}
						return true;
					}
				}
			},
			order: {
				type: "string",
				label: "Order",
				input: {
					type: "select",
					required: (values, user) => {
						if (values) {
							return values.context === "order";
						}
						return false;
					}
				},

				reference: {
					name: "orders",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["reference"],
							secondary: ["date_made"],
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
			currency: {
				type: "string",
				label: "Currency",
				input: {
					type: "select",
					default: "",
					required: true,
					size: 4
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
				reference: {
					name: "currencies",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["html_symbol"],
							avatar: false
						}
					}
				},
			},
			amount: {
				type: "float",
				label: "Amount",
				input: {
					type: "number",
					default: "0",
					required: true,
					size: 8
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
				}
			},

			method: {
				type: "string",
				label: "Method",
				input: {
					type: "select",
					default: "",
					required: true,
					size: 6
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
				possibilities: {
					cash: "Cash",
					cheque: "Cheque",
					credit_card: "Credit card",
					debit_card: "Debit Card",
					bank_transfer: "Bank Transfer",
					mobile_money: "Mobile money",
					other: "Other",
				}
			},
			reference: {
				type: "string",
				label: "Reference",
				input: {
					type: "text",
					default: "",
					required: false,
					size: 6
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
				}
			},
			account_type: {
				type: "string",
				label: "Account type",
				input: {
					type: "text",
					default: "",
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
				}
			},
			account: {
				type: "string",
				label: "Account",
				input: {
					type: "text",
					default: "",
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
				}
			},
			date_made: {
				type: "string",
				label: "Date made",
				input: {
					type: "date",
					default: "",
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
				}
			},
			made_by: {
				type: "float",
				label: "Made by",
				input: {
					type: "select",
					default: "",
					required: false
				},
				reference: {
					name: "users",
					service_query: { role: "customer" },
					resolves: {
						value: "_id",
						display: {
							primary: ["first_name", "last_name"],
							secondary: ["email_address"],
							avatar: false
						}
					}
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
				}
			},
			status: {
				type: "string",
				label: "Status",
				input: {
					type: "select",
					default: "",
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
				possibilities: {
					complete: "Complete",
					incomplete: "Incomplete"
				}
			}
		},
		identity: {
			primary: ["currency", "amount"],
			secondary: [],
			avatar: false
		},
		dependencies: [],
		dependants: []
	},
	access: {
		restricted: user => {
			if (user) {
				return !(user.isAdmin || user.isCustomer);
			}
			return true;
		},
		view: {
			summary: (user) => {
				if (user) {
					return user.isAdmin || user.isCustomer;
				}
				return false;
			},
			all: (user) => {
				if (user) {
					return user.isAdmin || user.isCustomer;
				}
				return false;
			},
			single: (user, record) => {
				if (user && !record) {
					return user.isAdmin;
				}
				if (user && record) {
					return user.isAdmin || (user.isCustomer && record.made_by === user._id);
				}
				return false;
			},
		},
		actions: {
			view_single: {
				restricted: user => {
					if (user) {
						return !(user.isAdmin || user.isCustomer);
					}
					return true;
				},
				uri: id => {
					return "payments/view/" + id;
				},
				link: {
					inline: {
						default: () => { },
						listing: (id, className = "grey_text") => {
							return (
								<Link to={"payments/view/" + id} className={className}>
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
				uri: "payments/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link to={"payments/add/"} {...props}>
									<Button color="primary" outlined aria-label="add">
										<AddIcon className="float-left" /> New Payment
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
					return "payments/edit/" + id;
				},
				link: {
					inline: {
						default: () => { },
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={"payments/edit/" + id}
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
					return "payments/delete/" + id;
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
