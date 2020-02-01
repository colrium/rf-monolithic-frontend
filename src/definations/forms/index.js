import { IconButton } from '@material-ui/core';
import { Add as AddIcon, DeleteOutlined as DeleteIcon, EditOutlined as EditIcon, NoteOutlined as DefinationContextIcon, OpenInNewOutlined as OpenInNewIcon } from '@material-ui/icons';
import Button from 'components/Button';
import * as definations from "definations";
import React from "react";
import { Link } from 'react-router-dom';
import { UtilitiesHelper } from "utils/Helpers";



let defaultContextModel = false;

let resolveContexModelPossibilities = (values, user)=>{
	let possibilies = {};
	if (user) {
		Object.entries(definations).map(([name, defination], index) => {
			if (defination.model !== undefined && name !== "forms" && name !== "formvalues" && !defination.access.restricted(user)) {
				if (UtilitiesHelper.isOfType(defination.label, "function")) {
					possibilies[defination.model] = defination.label(user);
				}
				else{
					possibilies[defination.model] = defination.label;
				}				
			}
		});
	}

	return possibilies;
}

export default  {
	name: "forms",
	label: "Forms",
	icon: <DefinationContextIcon />,
	color: "#001987",
	model: 'Form',
	endpoint: "/forms",
	cache: false,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["name"],
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

			name: {
				type: "string",
				label: "Name",
				input: {
					type: "hidden",
					required: true,
					default: "",
				},
				restricted: {
					display: (entry, user) => {				
						return true
					},
					input: (values, user) => {						
						return true;
					}					
				},
			},

			title: {
				type: "string",
				label: "Title",
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
				},
			},



			context: {
				type: "string",
				label: "Context",
				input: {
					type: "select",
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
				possibilities : (entry, user) => {
					let possibilies = {};
					if (user) {
						Object.entries(definations).map(([name, defination], index) => {
							if (defination.model !== undefined && name !== "forms" && name !== "formvalues" && !defination.access.restricted(user)) {
								if (UtilitiesHelper.isOfType(defination.label, "function")) {
									possibilies[defination.model] = defination.label(user);
								}
								else{
									possibilies[defination.model] = defination.label;
								}				
							}
						});
					}

					return possibilies;
				}
			},

			
			filter_by: {
				type: "string",
				label: "Filter By",
				input: {
					type: "select",
					size: 4,
					required: false,
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
				possibilities : (entry, user) => {
					let possibilies = {};
					Object.entries(definations).map(([name, defination], index) => {
						if (entry.context === defination.model ) {
							if (user && JSON.isJSON(defination)) {
								Object.entries(defination.scope.columns).map(([column_name, column], cursor) => {
									if (UtilitiesHelper.isOfType(column.label, "function")) {
										possibilies[column_name] = column.label(user);
									}
									else{
										possibilies[column_name] = column.label;
									}				
								});
							}
						}
					});
							

					return possibilies;
				}
			},
			filter: {
				type: "string",
				label: "Filter",
				input: {
					type: "select",
					size: 4,					
					default: "is",
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
					"is": "Is Equal To",
					"not": "Is Not Equal To",
					"lessthan": "Is Less than",
					"greaterthan": "Is Greater Than",
				}
			},
			filter_value: {
				type: "string",
				label: "Filter Value",
				input: {
					type: (entry, user) => {
						let type = undefined;
						Object.entries(definations).map(([name, defination], index) => {
							if (entry.context === defination.model ) {
								if (JSON.isJSON(defination.scope.columns[entry.filter_by])) {
									type = defination.scope.columns[entry.filter_by].input.type;
								}
								if (Function.isFunction(type)) {
									type = type(entry, user);
								}
							}
						});
						
						return type;
					},
					size: 4,					
					default: (entry, user) => {
						let default_value = undefined;
						Object.entries(definations).map(([name, defination], index) => {
							if (entry.context === defination.model ) {
								if (JSON.isJSON(defination.scope.columns[entry.filter_by])) {
									default_value = defination.scope.columns[entry.filter_by].input.default;
								}
								if (Function.isFunction(default_value)) {
									default_value = default_value(entry, user);
								}
							}
						});
						return default_value;
					},
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
				possibilities : (entry, user) => {
					let possibilities = undefined;
					Object.entries(definations).map(([name, defination], index) => {
						if (entry.context === defination.model ) {
							if (JSON.isJSON(defination.scope.columns[entry.filter_by])) {
								possibilities = defination.scope.columns[entry.filter_by].possibilities;
							}
							if (Function.isFunction(possibilities)) {
								possibilities = possibilities(entry, user);
							}
						}
					});
					return possibilities;
				},
				reference : (entry, user) => {
					let reference = undefined;
					Object.entries(definations).map(([name, defination], index) => {
						if (entry.context === defination.model ) {
							if (JSON.isJSON(defination.scope.columns[entry.filter_by])) {
								reference = defination.scope.columns[entry.filter_by].reference;
							}
							if (Function.isFunction(reference)) {
								reference = reference(entry, user);
							}
						}
					});
					return reference;
				},
			},

			blueprint: {
				type: "object",
				label: "Blueprint",
				input: {
					type: "dynamic",
					mode: "defination",
					default: {},
				},
				restricted: {
					display: (entry, user) => {				
						return false;
					},
					input: (values, user) => {						
						return false;
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
			},

		},
		identity: {
			primary: ["title"],
			secondary: ["context"],
			avatar: false,
		},		
		dependencies: [],
		dependants: {
			actionlogs: {
				column: "record",
				query: { context: "Form" }
			},
		},	
	},
	access:{
		restricted: (user) => {
			if (user) {
				return !user.isAdmin;
			}
			return true;
		},
		view:{
			summary: (user) => {
				return false;
			},
			all: (user) => {
				if (user) {
					return user.isAdmin;
				}
				return false;
			},
			single: (user, record) => {
				if (user && record) {
					return user.isAdmin;
				}
				return false;
			},
		},
		actions: {
			view_single: {
				restricted: (user) => {
					if (user) {
						return !user.isAdmin;
					}
					return true;
				},
				uri: (id)=>{
					return ("forms/view/"+id).toUriWithDashboardPrefix()
				},
				link: {
					inline: {						
						default: (id, className) => {

						},
						listing: (id, className="grey_text") => {
							return (
								<Link to={ ("forms/view/"+id).toUriWithDashboardPrefix() } className={ className }>
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
					return user? !user.isAdmin : true;
				},
				uri: "forms/add",
				link: {
					inline: {
						default: (props) => {
							return ( 
								<Link to={("forms/add/").toUriWithDashboardPrefix()} {...props}>
									<Button color="primary" outlined aria-label="add">
										<AddIcon className="float-left"/> New Form
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
						return !user.isAdmin;
					}
					return true;
				},
				uri: (id)=>{
					return ("forms/edit/"+id).toUriWithDashboardPrefix()
				},
				link: {
					inline: {
						default: (id, className="grey_text") => {

						},
						listing: (id, className="grey_text") => {
							return (
								<Link to={ ("forms/edit/"+id).toUriWithDashboardPrefix() } className={ className? className : ""}>
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
						return !user.isAdmin;
					}
					return true;
				},
				uri: (id)=>{
					return ("forms/delete/"+id).toUriWithDashboardPrefix()
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