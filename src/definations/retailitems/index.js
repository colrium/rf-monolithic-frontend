import { IconButton } from '@material-ui/core';
import { Add as AddIcon, DeleteOutlined as DeleteIcon, EditOutlined as EditIcon, OpenInNewOutlined as OpenInNewIcon, ShopOutlined as DefinationContextIcon } from '@material-ui/icons';
import Button from 'components/Button';
import React from "react";
import { Link } from 'react-router-dom';



export default  {
	name: "retailitems",
	label: "Retail items",
	icon: <DefinationContextIcon />,
	color: "#40003e",
	model: 'RetailItem',
	endpoint: "/retail/items",
	views: {
		single: {
			default: "cardview",
			cardview: {
				avatar: false,
				title: ["name"],
				subtitle: ["currency", "cost"],
				tags: ["available"],
				body: ["description", "stock", "taxable", "discountable", "available", "variations"],
			}
		},
		listing: {
			default: "tableview",
			listview: {
				avatar: false,
				primary: ["name"],
				secondary: ["currency", "cost", "available"]
			},
			tableview: {
				avatar: false,
				title: ["name"],
			},
		},
	},
	scope:{
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
						return false
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}						
						return true;
					}					
				},
				possibilities : {
					"service": "Service",
					"product": "Product",
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
						return false
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}						
						return true;
					}					
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
						return false
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}						
						return true;
					}					
				},
			},

			

			featured_image: {
				type: "string",
				label: "Featured Image",
				input: {
					type: "file",
					props: {
						acceptedFiles : ['image/*'],
						filesLimit: 1,
						dropzoneText: "Click to select Featured Image \n or \n Drag and drop the Featured Image file here",
						dropzoneIcon: "image",
					}
				},
				reference: {
					name: "attachments",
					service_query: {},
					resolves:{
						value: "_id",
						display: {
							primary: ["name"],
							secondary: [],
							avatar: false,
						}							
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
							avatar: false
						}
					}
				},			
			},

			cost: {
				type: "integer",
				label: "Cost",
				icon: "folder",
				input: {
					type: "number",
					default: 1.00,
				},			
			},

			cost_with_tax: {
				type: "integer",
				label: "Cost with Tax",
				icon: "folder",
				input: {
					type: "number",
					default: 1.00,
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
										"amount": "Amount",
										"percentage": "Percentage",
									}
								},

								{
									name: "cost_effect", 
									label: "Cost Effect",
									valueDependent: true,
									input: {
										type: "number",
										defaultValue: 0.00,
										size: 6,
										inputProps: {
											step: "0.1"
										}
									},
								}
							],
						}
					},
					required: true,
				},
				restricted: {
					display: (entry, user) => {						
						return false
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}						
						return true;
					}					
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
						return false
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}						
						return true;
					}					
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
							if (values.item_type==="product") {
								return false;
							}
						}					
						return true
					},
					input: (values, user) => {
						if (values) {
							if (values.item_type==="product") {
								return false
							}
						}					
						return true;
					}					
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
						acceptedFiles : ['image/*'],
						filesLimit: 20,
						dropzoneText: "Click to select Image \n or \n Drag and drop an image file here",
						dropzoneIcon: "image",
					}
				},
				reference: {
					name: "attachments",
					service_query: {},
					resolves:{
						value: "_id",
						display: {
							primary: ["name"],
							secondary: [],
							avatar: false,
						}							
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
				query: {}
			},
			actionlogs: {
				column: "record",
				query: { context: "RetailItem" }
			},
		},
	},
	access:{
		restricted: (user) => {
			if (user) {
				return false;
			}
			return true;
		},
		view:{
			summary: (user) => {
				return false;
			},
			all: (user) => {
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
				restricted: (user) => {
					if (user) {
						return false;
					}
					return true;
				},
				uri: (id)=>{
					return "retailitems/view/"+id
				},
				link: {
					inline: {						
						default: (id, className) => {

						},
						listing: (id, className="grey_text") => {
							return (
								<Link to={ "retailitems/view/"+id } className={ className }>
									<IconButton color="inherit" aria-label="edit">
										<OpenInNewIcon fontSize="small"/>
									</IconButton>
								</Link>
							)
						},
					}					
				}
			},
			create: {
				restricted: (user) => {
					return user && user.role === 'admin'? false : true;
				},
				uri: "retailitems/add",
				link: {
					inline: {
						default: (props) => {
							return ( 
								<Link to={"retailitems/add/"} {...props}>
									<Button color="primary" outlined aria-label="add">
										<AddIcon className="float-left"/> New Item
									</Button>
								</Link>
							)
						},
						listing: (props) => {
							return ""
						},
					}					
				}
			},
			update: {
				restricted: (user) => {
					if (user) {
						return false;
					}
					return true;
				},
				uri: (id)=>{
					return "retailitems/edit/"+id
				},
				link: {
					inline: {
						default: (id, className="grey_text") => {

						},
						listing: (id, className="grey_text") => {
							return (
								<Link to={ "retailitems/edit/"+id } className={ className? className : ""}>
									<IconButton color="inherit" aria-label="edit">
										<EditIcon  fontSize="small"/>
									</IconButton>
								</Link>
							)
						},
					}					
				}
			},
			delete: {
				restricted: (user) => {
					if (user) {
						return false;
					}
					return true;
				},
				uri: (id)=>{
					return "retailitems/delete/"+id
				},
				link: {
					inline: {
						default: (id, className="error_text") => {

						},
						listing: (id, className="error_text", onClick) => {
							return (
								<IconButton color="inherit" className={ className? className : ""} aria-label="delete" onClick={onClick}>
									<DeleteIcon fontSize="small"/>
								</IconButton>
							)
						},
					}					
				}
			},
		}			
	},	
};