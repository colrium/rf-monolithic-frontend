/** @format */

import { IconButton } from "@material-ui/core";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	ForumOutlined as DefinationContextIcon,
} from "@material-ui/icons";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";
export default {
	name: "emails",
	label: "Emails",
	icon: <DefinationContextIcon />,
	color: "#541400",
	model: "Email",
	endpoint: "/emails",
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
		},
		listing: {
			default: "tableview",
			listview: {
				avatar: false,
				primary: ["name"],
				secondary: ["code", "status", "expiration_date", "use"],
			},
			tableview: {
				avatar: false,
				title: ["name"],
			},
		},
	},
	scope: {
		columns: {
			
		},
		identity: {
			primary: ["recipient_address"],
			secondary: ["subject"],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			actionlogs: {
				column: "record",
				query: { context: "Email" },
			},
		},
	},
	access: {
		restricted: user => {
			if (user) {
				return !(user.isAdmin || user.isCustomer);
			}
			return true;
		},
		view: {
			summary: user => {
				return false;
			},
			all: user => {
				if (user) {
					return user.isAdmin || user.isCustomer;
				}
				return false;
			},
			single: (user, record) => {
				if (user) {
					return user.isAdmin || user.isCustomer;
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
					return ("coupons/view/" + id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (id, className) => {},
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={(
										"coupons/view/" + id
									).toUriWithDashboardPrefix()}
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
				uri: "coupons/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link
									to={"coupons/add/".toUriWithDashboardPrefix()}
									{...props}
								>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Coupon
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
				uri: id => {
					return ("coupons/edit/" + id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (id, className = "grey_text") => {},
						listing: (id, className = "grey_text") => {
							return (
								<Link
									to={(
										"coupons/edit/" + id
									).toUriWithDashboardPrefix()}
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
					return ("coupons/delete/" + id).toUriWithDashboardPrefix();
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
