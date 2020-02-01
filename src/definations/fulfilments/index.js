import { IconButton } from '@material-ui/core';
import { Add as AddIcon, DeleteOutlined as DeleteIcon, EditOutlined as EditIcon, LocalOfferOutlined as DefinationContextIcon, OpenInNewOutlined as OpenInNewIcon } from '@material-ui/icons';
import Button from 'components/Button';
import React from "react";
import { Link } from 'react-router-dom';



export default  {
	name: "fulfilments",
	label: "Fulfilments",
	icon: <DefinationContextIcon />,
	color: "#001987",
	model: 'Fulfilment',
	endpoint: "/retail/fulfilments",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["name"],
				resolveData: (entry) => {

				},
				subtitle: ["code"],
				body: ["status", "customer", "expiration_date", "value_type", "value", "use"],
			},
			calendarview: {
				title: ["name"],
				subtitle: ["code"],
				body: ["status", "customer", "expiration_date", "value_type", "value", "use"],
			}
		},
		listing: {
			default: "tableview",
			tableview: {
				avatar: false,
				title: ["name"],
			},
		},
	},
	scope:{
		columns: {

			order: {
				type: "string",
				label: "Order",
				input: {
					type: "select",
					required: true,
					default: "",
				},
				reference: {
					name: "orders",
					service_query: {},
					resolves:{
						value: "_id",
						display: {
							primary: ["reference", "date_made"],
							secondary: ["status"],
							avatar: false,
						}							
					},
				},
			},

			fulfilment: {
				type: "string",
				label: "Fulfilment",
				input: {
					type: "select",
					default: "survey",
					required: true,
				},
				possibilities : {
					"survey" : "Survey(s)",
					"response" : "Response(s)",
					"file" : "File(s)",
				}
			},

			surveys: {
				type: ["string"],
				label: "Surveys",
				input: {
					type: "multiselect",
					required: (values, user) => {
						if (values) {
							 return values.fulfilment === "survey";
						}
						return false;
					},
					disabled: (values, user) => {
						if (values) {
							return values.fulfilment !== "survey";
						}
						return false;
					}
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return !(user.isAdmin || user.isCustomer);
						}					
						return true;
					},
					input: (values, user) => {
						if (values) {
							return !(values.fulfilment === "survey");
						}
						return true;
					}					
				},
				reference: {
					name: "surveys",
					service_query: {},
					resolves:{
						value: "_id",
						display: {
							primary: ["title"],
							secondary: ["status"],
							avatar: false,
						}							
					},
				},		
			},

			responses: {
				type: ["string"],
				label: "Responses",
				input: {
					type: "multiselect",
					default: [],
					required: (values, user) => {
						if (values) {
							return values.fulfilment === "response";
						}
						return false;
					},
					disabled: (values, user) => {
						if (values) {
							return values.fulfilment !== "response";
						}
						return false;
					}
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return !(user.isAdmin || user.isCustomer);
						}					
						return true;
					},
					input: (values, user) => {
						if (values) {
							return !(values.fulfilment === "response");
						}
						return true;
					}					
				},
				reference: {
					name: "responses",
					service_query: {},
					resolves:{
						value: "_id",
						display: {
							primary: ["response_type"],
							secondary: ["response_date"],
							avatar: false,
						}							
					},
				},		
			},

			files: {
				type: ["string"],
				label: "Files",
				input: {
					type: "file",
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return !(user.isAdmin || user.isCustomer);
						}					
						return true;
					},
					input: (values, user) => {
						if (values) {
							if (values.fulfilment === "file") {
								return false;
							}
						}
						return true;
					}					
				},
				reference: {
					name: "attachments",
					service_query: {},
					resolves:{
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["readable_size"],
							avatar: false,
						}							
					},
				},		
			},


			notes: {
				type: "string",
				label: "Notes",
				input: {
					type: "textarea",
					default: "",
				},
			},

			fulfilment_date: {
				type: "string",
				label: "Fulfilment date",
				input: {
					type: "datetime",
					default: Date.now(),
				},
			},

		},
		identity: {
			primary: ["fulfilment_type", "date_made"],
			secondary: ["order"],
			avatar: false,
		},		
		dependencies: [],
		dependants: [],		
	},
	access:{
		restricted: (user) => {
			if (user) {
				return !(user.isCustomer || user.isAdmin);
			}
			return true;
		},
		view:{
			summary: (user) => {
				if (user) {
					return user.isCustomer || user.isAdmin;
				}
				return false;
			},
			all: (user) => {
				if (user) {
					return user.isCustomer || user.isAdmin;
				}
				return false;
			},
			single: (user, record) => {
				if (user && record) {
					return user.isCustomer || user.isAdmin;
				}
				return false;
			},
		},
		actions: {
			view_single: {
				restricted: (user) => {
					if (user) {
						return !(user.isCustomer || user.isAdmin);
					}
					return true;
				},
				uri: (id)=>{
					return ("fulfilments/view/"+id).toUriWithDashboardPrefix()
				},
				link: {
					inline: {						
						default: (id, className) => {

						},
						listing: (id, className="grey_text") => {
							return (
								<Link to={ ("fulfilments/view/"+id).toUriWithDashboardPrefix() } className={ className }>
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
					return !(user.isAdmin);
				},
				uri: ("fulfilments/add".toUriWithDashboardPrefix()),
				link: {
					inline: {
						default: (props) => {
							return ( 
								<Link to={("fulfilments/add/").toUriWithDashboardPrefix()} {...props}>
									<Button color="primary" outlined aria-label="add">
										<AddIcon className="float-left"/> New Fulfilment
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
						return !(user.isAdmin);
					}
					return true;
				},
				uri: (id)=>{
					return ("fulfilments/edit/"+id).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (id, className="grey_text") => {

						},
						listing: (id, className="grey_text") => {
							return (
								<Link to={ ("fulfilments/edit/"+id).toUriWithDashboardPrefix() } className={ className? className : ""}>
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
						return !(user.isAdmin);
					}
					return true;
				},
				uri: (id)=>{
					return ("fulfilments/delete/"+id).toUriWithDashboardPrefix()
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