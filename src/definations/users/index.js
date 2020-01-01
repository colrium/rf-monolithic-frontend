import { IconButton } from '@material-ui/core';
import { Add as AddIcon, DeleteOutlined as DeleteIcon, EditOutlined as EditIcon, OpenInNewOutlined as OpenInNewIcon, PeopleOutlined as DefinationContextIcon } from '@material-ui/icons';
import Button from 'components/Button';
import React from "react";
import { Link } from 'react-router-dom';
import { CountriesHelper } from "utils/Helpers";


const presences = {
	online: {label: "Online", color: "#4caf50"},
	away: {label: "Away", color: "#ffab00"},
	offline: {label: "Offline", color: "#4caf50"},
}

export default  {
	name: "users",
	label: "Users",
	icon: <DefinationContextIcon />,
	color: "#01579b",
	model: 'User',
	views: {
		single: {
			default: "cardview",
			cardview: {
				avatar: "avatar",
				title: ["honorific", "first_name", "last_name"],
				subtitle: ["email_address"],
				tags: ["status", "presence"],
				body: ["phone_number", "address", "contacts", "user_sector", "company", "job_title", "country", "region", "city", "location_type", "location", "provider", "provider_account_id"],
			},
		},
		listing: {
			default: "listview",
			listview: {
				avatar: "avatar",
				primary: ["first_name", "last_name"],
				secondary: ["email_address", "role", "status"]
			},
			tableview: {
				avatar: (entry) => {
					return 
				},
				title: ["first_name", "last_name"],
			},
			
		},
	},
	scope:{
		columns: {
			honorific: {
				type: "string",
				label: "Honorific",
				input: {
					type: "text",
					default: "",
					required: false,
					size: 2
				},		
			},
			first_name: {
				type: "string",
				label: "First name",
				icon: "label",
				input: {
					type: "text",
					default: "",
					required: true,
					size: 5
				},		
			},
			last_name: {
				type: "string",
				label: "Last name",
				icon: "label",
				input: {
					type: "text",
					default: "",
					required: true,
					size: 5
				},			
			},
			email_address: {
				type: "string",
				label: "Email address",
				icon: "email",
				input: {
					type: "email",
					default: "",
					required: true,
				},
			},
			phone_number: {
				type: "string",
				label: "Phone number",
				icon: "label",
				input: {
					type: "phone",
					default: "",
					required: false,
				},			
			},
			presence: {
				type: "string",
				label: "Presence",
				input: {
					type: "radio",
					default: "online",
					required: false,
				},

				possibilities : {
					online: "Online",
					away: "Away",
					offline: "Offline",
				},

				colors:	{
					online: "#4caf50",
					away: "#ffab00",
					offline: "#f44336",
				}			
			},

			address: {
				type: "string",
				label: "address",
				input: {
					type: "textarea",
					default: "",
					required: false,
				},		
			},
			contacts: {
				type: "string",
				label: "Other contacts",
				input: {
					type: "textarea",
					default: "",
					required: false,
				},		
			},
			job_title: {
				type: "string",
				label: "Job title",
				icon: "work",
				input: {
					type: "text",
					default: "",
					required: false,
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
				possibilities : CountriesHelper.names(),		
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
			
			company: {
				type: "string",
				label: "Company",
				icon: "folder",
				input: {
					type: "text",
					default: "",
					required: false,
				},			
			},
			user_sector: {
				type: "string",
				label: "User sector",
				icon: "folder",
				input: {
					type: "select",
					default: "",
					required: true,
				},

				possibilities : {
					academic: "Academic",
					researcher: "Researcher",
					public_sector: "Public Sector",
					private_sector: "Private Sector",
					ngo: "NGO",
					individual: "Individual",
				},				
			},

			avatar: {
				type: "string",
				label: "Avatar",
				input: {
					type: "file",
					props: {
						acceptedFiles: ["image/*"],
						filesLimit: 1,
						dropzoneIcon: "person",
						dropzoneText: "Click to select or drag n drop image file here",
					},
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

			documents: {
				type: ["string"],
				label: "Documents",
				input: {
					type: "file",
					accepts: ['image/*', 'video/*', 'audio/*', 'application/*'],
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
						}
					},
				},
			},

			password: {
				type: "string",
				label: "Password",
				input: {
					type: "password",
					default: "",
				},
				restricted: {
					display: (entry, user) => {						
						return true;
					},
					input: (values, user) => {
						return false;
					}					
				},			
			},
			
			preferences: {
				type: "object",
				label: "Preferences",
				icon: "folder",
				input: {
					type: "group",
					default: "",
				},
				restricted: {
					display: (entry, user) => {						
						return true;
					},
					input: (values, user) => {
						return true;
					}					
				},				
			},
			login_attempts: {
				type: "integer",
				label: "Login attempts",
				icon: "folder",
				input: {
					type: "number",
					default: 0,
				},
				restricted: {
					display: (entry, user) => {						
						return false;
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}
						return true;
					}					
				},		
			},
			role: {
				type: "string",
				label: "Role",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {						
						return false;
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}
						return true;
					}					
				},
				possibilities : {
					"customer": "Customer",
					"collector": "Collector",
					"admin": "Administrator",
				},				
			},
			provider: {
				type: "string",
				label: "Provider",
				input: {
					type: "select",
					default: "local",
					required: true,
				},
				restricted: {
					display: (entry, user) => {						
						return false;
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}
						return true;
					}					
				},
				possibilities : {
					"local": "Local",
					"google": "Google",
					"facebook": "Facebook",
					"twitter": "Twitter",
					"linkedin": "Linkedin",
				},				
			},
			provider_account_id: {
				type: "string",
				label: "Provider account id",
				icon: "folder",
				input: {
					type: "text",
					default: "",
					required: true,
				},			
			},
			
			status: {
				type: "string",
				label: "Status",
				icon: "folder",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				restrictions: ["admin"],
				possibilities : {
					"pending": "Pending",
					"active": "Active",
					"inactive": "Inactive",
				},				
			},
			account_verified: {
				type: "string",
				label: "Account verified",
				icon: "folder",
				input: {
					type: "checkbox",
					default: "",
				},
				restricted: {
					display: (entry, user) => {						
						return false;
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}
						return true;
					}					
				},			
			},
			account_verifacation_code: {
				type: "string",
				label: "Account verifacation code",
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
						if (user && user.role==="admin") {
							return false;
						}
						return true;
					}					
				},				
			},
			account_verifacation_mode: {
				type: "string",
				label: "Account verifacation mode",
				input: {
					type: "select",
					default: "",
				},
				restricted: {
					display: (entry, user) => {						
						return false;
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}
						return true;
					}					
				},
				possibilities : {
					"none": "None",
					"admin": "Admin",
					"email": "Email",
					"sms": "SMS",
					"call": "Call",
				},				
			},
			password_reset_code: {
				type: "string",
				label: "Password reset code",
				icon: "folder",
				input: {
					type: "text",
					default: "",
				},
				restricted: {
					display: (entry, user) => {						
						return false;
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}
						return true;
					}					
				},			
			},
			password_reset_code_expiration: {
				type: "string",
				label: "Password reset code expiration",
				icon: "folder",
				input: {
					type: "date",
					default: "",
				},
				restricted: {
					display: (entry, user) => {						
						return false;
					},
					input: (values, user) => {
						if (user && user.role==="admin") {
							return false;
						}
						return true;
					}					
				},		
			},
		},
		identity: {
			primary: ["honorific", "first_name", "last_name"],
			secondary: ["email_address"],
			avatar: "avatar",
		},		
		dependencies: [],
		dependants: {
			commissions: {
				column: "individual",
				query: { involvement: "individual" }
			},
			teams: {
				column: "members",
				query: {}
			},
			tracks: {
				column: "user",
				query: {}
			},
			responses: {
				column: "submitter",
				query: {}
			},
			orders: {
				column: "customer",
				query: {}
			},
			invoices: {
				column: "owner",
				query: {}
			},
			payments: {
				column: "made_by",
				query: {}
			},
			events: {
				column: "user",
				query: {}
			},
			attachments: {
				column: "attached_by",
				query: {}
			},
			actionlogs: {
				column: "catalyst",
				query: {}
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
				if (user) {
					return true;
				}
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
					return "users/view/"+id
				},
				link: {
					inline: {						
						default: (id, className) => {

						},
						listing: (id, className="grey_text") => {
							return (
								<Link to={ "users/view/"+id } className={ className }>
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
				uri: "users/add",
				link: {
					inline: {
						default: (props) => {
							return ( 
								<Link to={"users/add/"} {...props}>
									<Button color="primary" outlined aria-label="add">
										<AddIcon className="float-left"/> New User
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
					return "users/edit/"+id
				},
				link: {
					inline: {
						default: (id, className="grey_text") => {

						},
						listing: (id, className="grey_text") => {
							return (
								<Link to={ "users/edit/"+id } className={ className? className : ""}>
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
					return "users/delete/"+id
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