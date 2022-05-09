/** @format */

import { IconButton } from "@mui/material";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	ShopOutlined as DefinationContextIcon,
} from "@mui/icons-material";
import Button from "components/Button";
import React from "react";
import { Link } from "react-router-dom";

export default {
	name: "retailitems",
	label: "Retail items",
	icon: <DefinationContextIcon />,
	color: "#40003e",
	model: "RetailItem",
	endpoint: "/retail/items",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {
				avatar: false,
				title: ["name"],
				subtitle: ["currency", "cost"],
				tags: ["available"],
				body: [
					"description",
					"stock",
					"taxable",
					"discountable",
					"available",
					"variations",
				],
			},
		},
		listing: {
			default: "tableview",
			/*listview: {
				avatar: false,
				primary: ["name"],
				secondary: ["currency", "cost", "available"],
			},*/
			tableview: {
				avatar: false,
				title: ["name"],
			},
		},
	},
	scope: {
		columns: {
			item_type: {
				type: "string",
				label: "Type",
				input: {
					type: "radio",
					default: "service",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
				possibilities: {
					service: "Service",
					product: "Product",
				},
			},
			name: {
				type: "string",
				label: "Name",
				input: {
					type: "text",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
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
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
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
						dropzoneText:
							"Click to select Featured Image \n or \n Drag and drop the Featured Image file here",
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

			currency: {
				type: "string",
				label: "Currency",
				input: {
					type: "select",
					required: true,
				},
				reference: {
					name: "currencies",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["html_symbol"],
							avatar: false,
						},
					},
				},
			},

			cost: {
				type: "integer",
				label: "Cost",
				icon: "folder",
				input: {
					type: "number",
					default: 1.0,
				},
			},

			cost_with_tax: {
				type: "integer",
				label: "Cost with Tax",
				icon: "folder",
				input: {
					type: "number",
					default: 1.0,
				},
			},

			variants: {
				type: "object",
				label: "Variants",
				icon: "label",
				input: {
					type: "dynamic",
					default: {},
					props: {
						mode: "defination",
						appendProps: {
							field: [
								{
									name: "cost_effect_type",
									label: "Cost Effect Type",
									input: {
										type: "radio",
										defaultValue: "amount",
										size: 12,
									},
									possibilities: {
										amount: "Amount",
										percentage: "Percentage",
									},
								},

								{
									name: "cost_effect",
									label: "Cost Effect",
									valueDependent: true,
									input: {
										type: "number",
										defaultValue: 0.0,
										size: 6,
										inputProps: {
											step: "0.1",
										},
									},
								},
							],
						},
					},
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},

			sku: {
				type: "string",
				label: "SKU",
				input: {
					type: "text",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user && user?.role === "admin") {
							return false;
						}
						return true;
					},
				},
			},

			quantity: {
				type: "integer",
				label: "Quantity",
				icon: "folder",
				input: {
					type: "number",
					default: 1,
				},
				restricted: {
					display: (values, user) => {
						if (values) {
							if (values.item_type === "product") {
								return false;
							}
						}
						return true;
					},
					input: (values, user) => {
						if (values) {
							if (values.item_type === "product") {
								return false;
							}
						}
						return true;
					},
				},
			},

			taxable: {
				type: "boolean",
				label: "Taxable",
				icon: "folder",
				input: {
					type: "checkbox",
					default: false,
				},
			},

			discountable: {
				type: "boolean",
				label: "Discountable",
				icon: "folder",
				input: {
					type: "checkbox",
					default: false,
				},
			},

			available: {
				type: "boolean",
				label: "Available",
				icon: "folder",
				input: {
					type: "checkbox",
					default: true,
				},
			},
			images: {
				type: ["string"],
				label: "Images",
				input: {
					type: "file",
					props: {
						acceptedFiles: ["image/*"],
						filesLimit: 20,
						dropzoneText:
							"Click to select Image \n or \n Drag and drop an image file here",
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
		},
		identity: {
			primary: ["name"],
			secondary: [],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			orders: {
				column: "items",
				query: {},
			},
			actionlogs: {
				column: "record",
				query: { context: "RetailItem" },
			},
		},
	},
	access: {
		restricted: user => user?.role !== "admin" && user?.role !== "customer",
		view: {
			summary: user => user?.role === "admin" || user?.role === "customer",
			all: user => user?.role === "admin" || user?.role === "customer",
			single: (user) => user?.role === "admin" || user?.role === "customer",
		},
		actions: {
			view: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"/retailitems/view/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: OpenInNewIcon,
				label: "View",
				className: "text-green-500",
			},
			create: {
				restricted: user => user?.role !== "admin",
				uri: "/retailitems/add".toUriWithDashboardPrefix(),
				Icon: AddIcon,
				label: "Add new",
				className: "text-green-500",
				isFreeAction: true,
			},
			update: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return (
						"/retailitems/edit/" + entry?._id
					).toUriWithDashboardPrefix();
				},
				Icon: EditIcon,
				label: "Edit",
				className: "text-blue-500",
			},
			delete: {
				restricted: user => user?.role !== "admin",
				uri: entry => {
					return ("/retailitems/delete/" + entry?._id).toUriWithDashboardPrefix();
				},
				Icon: DeleteIcon,
				className: "text-red-500",
				label: "Delete",
				confirmationRequired: true
			},
		},

	},
};
