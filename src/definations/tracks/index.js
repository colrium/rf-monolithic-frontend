/** @format */

import { IconButton } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
	PersonOutlined as UserIcon,
	PersonPinOutlined as DefinationContextIcon,
} from "@material-ui/icons";
import Avatar from "components/Avatar";
import Button from "components/Button";
import Status from "components/Status";
import Typography from "components/Typography";
import React from "react";
import { Link } from "react-router-dom";
import { attachments as AttachmentsService } from "services";

export default {
	name: "tracks",
	label: "Tracks",
	icon: <DefinationContextIcon />,
	color: "#880e4f",
	model: "Track",
	endpoint: "/tracks",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {
				title: ["user"],
				subtitle: ["start_time"],
				tags: ["time_type"],
				body: ["context", "record", "positions", "user"],
			},
			googlemapview: {
				type: "polyline",
				path: ["positions"],
				title: ["user", "time_type"],
			},
		},
		listing: {
			default: "googlemapview",
			listview: {
				resolveData: async (entries, user = null, isPopulated = true) => {

					let resolved_data = [];

					if (Array.isArray(entries)) {
						resolved_data = entries.map((entry, index) => {
							return {
								id: entry._id,
								icon: false,
								avatar: entry.user ? (
										entry.user.avatar ? (
											<Avatar
												alt={
													entry.user.first_name
												}
												src={AttachmentsService.getAttachmentFileUrl(
													entry.user.avatar
												)}
											/>
										) : (<Avatar className="twitter_text">
												<UserIcon />
											</Avatar>)
									) : <Avatar className="twitter_text ">
												<UserIcon />
										</Avatar>,
								title: new Date(entry.start_time).toString()+ " - " + new Date(entry.stop_time).toString(),
								body: (
									<React.Fragment>
										{entry.time_type ? (
											<Status
												color={
													entry.time_type === "live"
														? "#00AF41"
														: "#F38B00"
												}
												text={
													entry.time_type === "live"
														? "Live"
														: "Roam"
												}
											/>
										) : (
											""
										)}

										<Typography
											component="span"
											variant="body2"
											color="default"
										>
											
										</Typography>
										
										{entry.context && (
											<Status
												color={entry.context === "commission"? "#00bfa5" : "#CCCCCC"}
												text={entry.context === "commission"? "Commission": "Roam"}
											/>
										)}
									</React.Fragment>
								),
							};
						});
					}
					return resolved_data;
				},
			},
			tableview: {
				title: ["start_time"],
				resolveData: async (entries, isPopulated = true) => {
					let resolvedData = entries.map((entry, index) => {
						return {
							_id: entry._id,
							context: (
								<Status
									color={
										entry.context === "commission"
											? "#00bfa5"
											: "#CCCCCC"
									}
									text={
										entry.context === "commission"
											? "Commission"
											: "Roam"
									}
								/>
							),
							commision: entry.commision? entry.commision._id: "",
							positions: (
								<React.Fragment>
									{/*Array.isArray(entry.positions) &&
										entry.positions.map(
											(position, cursor) => (
												<div key={cursor}>
													<Typography
														component="span"
														variant="body2"
														paragraph
													>
														Coordinates
													</Typography>
													<br />
													{JSON.isJSON(position) && (
														<Typography
															component="span"
															variant="body2"
															paragraph
														>
															Lat:{" "}
															{position.latitude}{" "}
															Lng:{" "}
															{position.longitude}
														</Typography>
													)}
												</div>
											)
										)*/}
								</React.Fragment>
							),
							user: entry.user ? (
								<Chip
									size="small"
									avatar={
										entry.user.avatar ? (
											<Avatar
												alt={entry.user.first_name}
												src={AttachmentsService.getAttachmentFileUrl(
													entry.user.avatar
												)}
											/>
										) : (
											<Avatar className="twitter_text">
												<UserIcon />
											</Avatar>
										)
									}
									label={
										entry.user.first_name +
										" " +
										entry.user.last_name
									}
								/>
							) : (
								""
							),
							time_type: entry.time_type ? (
								<Status
									color={
										entry.time_type === "live"
											? "#00AF41"
											: "#F38B00"
									}
									text={
										entry.time_type === "live"
											? "Live"
											: "Roam"
									}
								/>
							) : (
								""
							),
							start_time: entry.start_time
								? new Date(entry.start_time).toLocaleTimeString()
								: "",
							stop_time: entry.stop_time
								? new Date(entry.stop_time).toLocaleTimeString()
								: "",
						};
					});
					return resolvedData;
				},
			},
			calendarview: {
				type: "task",
				resolveData: async (entries, isPopulated = true) => {
					let resolved_data = [];
					for (let entry of entries) {
						resolved_data.push({
							id: entry._id,
							calendarId: "tracks",
							title: entry.user
								? entry.user.first_name +
								  " " +
								  entry.user.last_name
								: entry.context,
							body:
								"<b>Type</b> <br />" +
								entry.time_type +
								" <br /><br /> <b>Context</b><br />" +
								entry.context,
							category: "time",
							dueDateClass: "",
							start: entry.start_time,
						});
					}
					return resolved_data;
				},
			},
			googlemapview: {
				type: "polyline",
				resolveData: async (entries, isPopulated = true) => {
					let resolved_data = [];
					for (let entry of entries) {
						resolved_data.push({
							id: entry._id,
							path: entry.positions.map((position, index) => {
								return {
									lat: position.latitude,
									lng: position.longitude,
								};
							}),
							titles: entry.positions.map((position, index) => {
								return (
									"Latitude: " +
									position.latitude +
									" Long:" +
									position.longitude +
									(position.timestamp
										? " (Timestamp: " +
										  position.timestamp +
										  ")"
										: "") +
									(entry.user
										? " (User: " +
										  entry.user.first_name +
										  " " +
										  entry.user.last_name +
										  ")"
										: "")
								);
							}),

							color: "#870036",
							title:
								(entry.start_time
									? " Start Time: " +
									  new Date(entry.start_time).format(
											"d M Y H:i:s A"
									  ) +
									  " <br/>"
									: "") +
								(entry.user
									? " (User: " +
									  entry.user.first_name +
									  " " +
									  entry.user.last_name +
									  ")"
									: ""),
							infoWindow: (
								<React.Fragment>
									<Typography
										component="h5"
										variant="subtitle2"
										color="primary"
										bold
									>
										Track -{" "}
										{entry.time_type === "live"
											? "Live"
											: "Roam"}
									</Typography>
									<Typography
										component="div"
										variant="body2"
										color="default"
									>
										{" "}
										{entry.user && (
											<Chip
												size="small"
												avatar={
													entry.user.avatar ? (
														<Avatar
															alt={
																entry.user
																	.first_name
															}
															src={AttachmentsService.getAttachmentFileUrl(
																entry.user
																	.avatar
															)}
														/>
													) : (
														<Avatar className="twitter_text">
															<UserIcon />{" "}
														</Avatar>
													)
												}
												label={
													entry.user.first_name +
													" " +
													entry.user.last_name
												}
											/>
										)}{" "}
									</Typography>

									{entry.start_time && (
										<Typography
											component="p"
											variant="body2"
											color="default"
										>
											{" "}
											Start Time:{" "}
											{new Date(entry.start_time).format(
												"d M Y H:i:s A"
											)}
										</Typography>
									)}
									
									{entry.context && (
										<Typography
											component="p"
											variant="body2"
											color="default"
										>
											{" "}
											Context : {entry.context}
										</Typography>
									)}
									{entry.context === "commission" &&
										entry.commission && (
											<Typography
												component="p"
												variant="body2"
												color="default"
											>
												{" "}
												Commission :{" "}
												{entry.commission._id}
											</Typography>
										)}
								</React.Fragment>
							),
						});
					}
					return resolved_data;
				},
			},
		},
	},
	scope: {
		columns: {
			context: {
				type: "string",
				label: "Context",
				input: {
					type: "radio",
					default: "commission",
					required: true,
				},
				possibilities: {
					commission: "Commission",
					roam: "Roam",
				},
			},
			commision: {
				type: "string",
				label: "Commission",
				input: {
					type: "select",
					default: "",
					required: false,
				},
				reference: {
					name: "commissions",
					service_query: { status: "ongoing", p: 1 },
					resolves: {
						value: "_id",
						display: {
							primary: ["start_date"],
							secondary: ["involvement"],
							avatar: false,
						},
					},
				},
			},

			/*test_input: {
				type: "object",
				label: "Test dynamic input",
				input: {
					type: "dynamic",
					props: {
						mode: "generation",
						blueprint: {
							title: {
								type: "field",
								name: "title",
								label: "Title",
								input: {
									type: "text",
									required: true,
								},
							},
							description: {
								type: "field",
								group: false,
								name: "description",
								label: "Description",
								input: {
									type: "textarea",
								},
							},
							questionare: {
								type: "field",
								name: "questionare",
								label: "Questionare",
								input: {
									type: "text",
								},
							},
							queries: {
								type: "group",
								value: [
									{
										type: "field",
										group: "queries",
										name: "question",
										label: "Question",
										input: {
											type: "textarea",
										},
									},
									{
										type: "field",
										group: "queries",
										name: "response_type",
										label: "Response Type",
										input: {
											type: "radio",
											size: 6,
										},
										possibilities: {
											image: "Image",
											text: "Text",
											audio: "Audio",
											video: "Video",
											file: "File",
										},
									},
								],
								name: "queries",
								label: "Queries",
							},
							sample_size: {
								type: "field",
								group: false,
								name: "sample_size",
								label: "Sample Size",
								input: {
									type: "number",
								},
							},
							mode: {
								type: "field",
								group: false,
								name: "mode",
								label: "Mode",
								input: {
									type: "radio",
									size: 6,
								},
								possibilities: {
									observance: "Observance",
									interview: "Interview",
									questionnaire: "Questionnaire",
									analysis: "Analysis",
								},
								value: {
									type: "text",
									size: 6,
								},
							},
							project_objectives: {
								type: "field",
								group: false,
								name: "project_objectives",
								label: "Project Objectives",
								input: {
									type: "textarea",
									required: true,
									size: 6,
								},
							},
							end_date: {
								type: "field",
								group: false,
								name: "end_date",
								label: "End Date",
								input: {
									type: "date",
									required: true,
								},
							},
							start_date: {
								type: "field",
								group: false,
								name: "start_date",
								label: "Start Date",
								input: {
									type: "date",
									required: true,
								},
							},
						},
					},
					required: true,
					default: {},
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							if (user.role === "admin") {
								return false;
							}
						}
						return true;
					},
				},
			},*/

			positions: {
				type: "object",
				label: "Positions",
				input: {
					type: "dynamic",
					props: {
						mode: "generation",
						blueprint: {
							positions: {
								type: "group",
								required: true,
								label: "Positions",
								value: [
									{
										type: "field",
										name: "type",
										group: "positions",
										label: "Position Type",
										size: 12,
										input: {
											type: "select",
											default: "coordinates",
											required: true,
										},
										possibilities: {
											coordinates: "Coordinates",
											address: "Address",
											vicinity: "Vicinity",
											google_place_id: "Google Place ID",
										},
									},
									{
										type: "field",
										name: "latitude",
										group: "positions",
										label: "Latitude",
										input: {
											type: "number",
											required: true,
											size: 6,
										},
									},
									{
										type: "field",
										name: "longitude",
										group: "positions",
										label: "Longitude",
										input: {
											type: "number",
											required: true,
											size: 6,
										},
									},
								],
							},
						},
					},
					required: true,
					default: {},
				},
				restricted: {
					display: (entry, user) => {
						return true;
					},
					input: (values, user) => {
						if (user) {
							if (user.role === "admin") {
								return false;
							}
						}
						return true;
					},
				},
			},
			user: {
				type: "string",
				label: "User",
				icon: "person_outline",
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
						if (user) {
							if (user.role === "admin") {
								return false;
							}
						}
						return true;
					},
				},
				reference: {
					name: "users",
					service_query: { role: "collector" },
					resolves: {
						value: "_id",
						display: {
							primary: ["first_name", "last_name"],
							secondary: ["email_address"],
							avatar: false,
						},
					},
				},
			},
			time_type: {
				type: "string",
				label: "Time Type",
				icon: "schedule",
				input: {
					type: "radio",
					default: "",
					required: true,
				},
				possibilities: {
					live: "Live",
					past: "Past",
				},
			},
			start_time: {
				type: "string",
				label: "Start time",
				input: {
					type: "datetime",
					default: "",
					required: true,
				},
			},
			stop_time: {
				type: "string",
				label: "Stop time",
				input: {
					type: "datetime",
					default: "",
					required: true,
				},
			},
		},
		identity: {
			primary: ["user"],
			secondary: ["start_time"],
			avatar: false,
		},
		dependencies: [
			{
				name: "commissions",
			},
		],
		dependants: {
			actionlogs: {
				column: "record",
				query: { context: "Track" },
			},
		},
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
			},
		},
		actions: {
			view_single: {
				restricted: user => {
					if (user) {
						return false;
					}
					return true;
				},
				uri: entry => {
					return "tracks/view/" + entry._id;
				},
				link: {
					inline: {
						default: (entry, className) => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"tracks/view/" + entry._id}
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
					return user && user.role === "admin" ? false : true;
				},
				uri: "tracks/add",
				link: {
					inline: {
						default: props => {
							return (
								<Link to={"tracks/add/"} {...props}>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Track
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
						return false;
					}
					return true;
				},
				uri: entry => {
					return "tracks/edit/" + entry._id;
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={"tracks/edit/" + entry._id}
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
						return false;
					}
					return true;
				},
				uri: entry => {
					return "tracks/delete/" + entry._id;
				},
				link: {
					inline: {
						default: (id, className = "error_text", onClick) => {},
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
