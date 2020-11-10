/** @format */

import { IconButton } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import {
	Add as AddIcon,
	DeleteOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	OpenInNewOutlined as OpenInNewIcon,
} from "@material-ui/icons";
import DefinationContextIcon from "@material-ui/icons/WorkOutlineOutlined";
import { colors } from "assets/jss/app-theme";
import Avatar from "components/Avatar";
import Badge from "components/Badge";
import Button from "components/Button";
import GoogleMap from "components/GoogleMap";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Status from "components/Status";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from "components/Typography";
import { formats } from "config/data";
import React from "react";
import ReactHtmlParser from "react-html-parser";
import { Link } from "react-router-dom";
import { attachments as AttachmentsService } from "services";

let status_names = {
	scheduled: "Scheduled",
	ongoing: "Ongoing",
	complete: "Complete",
	cancelled: "Cancelled",
};

let status_colors = {
	scheduled: "#880e4f",
	ongoing: "#e65100",
	complete: "#4caf50",
	cancelled: "#b71c1c",
};
let distanceToMeters = (distance, unit = "meters") => {
	distance = distance ? Number.parseNumber(distance) : 1;
	unit = unit.toLowerCase();
	if (unit === "yards") {
		distance = distance * 0.9144;
	} else if (unit === "feet") {
		distance = distance * 0.3048;
	} else if (unit === "kilometers") {
		distance = distance * 1000;
	} else if (unit === "miles") {
		distance = distance * 1609.34;
	}
	return distance;
};

export default {
	name: "commissions",
	label: "Commissions",
	icon: <DefinationContextIcon />,
	color: "#4a148c",
	model: "Commission",
	endpoint: "/commissions",
	cache: true,
	views: {
		single: {
			default: "cardview",
			cardview: {
				avatar: false,
				resolveData: (entry, user = null, isPopulated = true) => {
					return {
						avatar:
							entry.involvement === "team" && entry.team ? (
								entry.team.avatar ? (
									<Avatar
										alt={entry.team.name}
										src={AttachmentsService.getAttachmentFileUrl(
											entry.team.avatar
										)}
									/>
								) : null
							) : entry.involvement === "individual" &&
							  entry.individual ? (
								entry.individual.avatar && (
									<Avatar
										alt={entry.individual.first_name}
										src={AttachmentsService.getAttachmentFileUrl(
											entry.individual.avatar
										)}
									/>
								)
							) : null,
						title: (
							<Typography variant="h4" gutterBottom>
								{entry.start_date
									? new Date(entry.start_date).format(
											formats.dateformats.date
									  ) + (entry.end_date ? " - " : "")
									: ""}
								{entry.end_date
									? new Date(entry.end_date).format(
											formats.dateformats.date
									  )
									: ""}
							</Typography>
						),
						subtitle: (
							<React.Fragment>
								{entry.status && (
									<Status
										color={status_colors[entry.status]}
										text={status_names[entry.status]}
									/>
								)}
							</React.Fragment>
						),
						body: (
							<GridContainer className="p-0 m-0">
								<GridItem className="p-0 m-0" xs={12}>
									<GoogleMap
										markers={[
											{
												position: entry.focus_center,
												title: entry.survey
													? entry.survey.title +
													  " Survey Commission"
													: "Commission",
												infoWindow: (
													<React.Fragment>
														<Typography
															component="h5"
															variant="subtitle2"
															color="primary"
															bold
														>
															Commission
														</Typography>
														{entry.survey ? (
															<Typography
																component="p"
																variant="body2"
																color="default"
															>
																{" "}
																Survey :{" "}
																{
																	entry.survey
																		.title
																}{" "}
																<br />
															</Typography>
														) : (
															""
														)}

														<Typography
															component="p"
															variant="body2"
															color="default"
															gutterBottom
														>
															{" "}
															From: 
															{new Date(
																entry.start_date
															).format(
																"d M Y H:i:s A"
															)}
														</Typography>
														<Typography
															component="p"
															variant="body2"
															color="default"
															gutterBottom
														>
															To:
															{new Date(
																entry.end_date
															).format(
																"d M Y H:i:s A"
															)}{" "}
														</Typography>
														<Typography
															component="p"
															variant="body2"
															color="default"
															gutterBottom
														>
															{" "}
															Involvement:{" "}
															{entry.involvement ===
															"team"
																? "Team"
																: "Individual"}{" "}
														</Typography>
														<Typography
															component="p"
															variant="body2"
															color="default"
															gutterBottom
														>
															{" "}
															Radius:{" "}
															{entry.focus_radius +
																" " +
																entry.focus_radius_metric}{" "}
														</Typography>
														<Typography
															component="p"
															variant="body2"
															color="default"
															gutterBottom
														>
															{entry.involvement ===
																"team" && (
																	<Chip
																		size="small"
																		label={
																			entry.status
																		}
																	/>
																) && (
																	<Chip
																		size="small"
																		avatar={
																			entry
																				.team
																				.avatar ? (
																				<Avatar
																					alt={
																						entry
																							.team
																							.name
																					}
																					src={AttachmentsService.getAttachmentFileUrl(
																						entry
																							.team
																							.avatar
																					)}
																				/>
																			) : null
																		}
																		label={
																			entry
																				.team
																				.name
																		}
																	/>
																)}
															{entry.involvement ===
																"individual" && (
																<Chip
																	size="small"
																	label="Individual"
																/>
															)}
															{entry.involvement ===
																"individual" &&
																entry.individual && (
																	<Chip
																		size="small"
																		avatar={
																			entry
																				.individual
																				.avatar ? (
																				<Avatar
																					alt={
																						entry
																							.individual
																							.first_name
																					}
																					src={AttachmentsService.getAttachmentFileUrl(
																						entry
																							.individual
																							.avatar
																					)}
																				/>
																			) : null
																		}
																		label={
																			entry
																				.individual
																				.first_name +
																			" " +
																			entry
																				.individual
																				.last_name
																		}
																	/>
																)}
															&nbsp;
														</Typography>
														<Typography
															component="p"
															variant="body2"
															color="default"
															gutterBottom
														>
															{" "}
															Status:{" "}
															{entry.status && (
																<Status
																	color={
																		status_colors[
																			entry
																				.status
																		]
																	}
																	text={
																		status_names[
																			entry
																				.status
																		]
																	}
																/>
															)}{" "}
														</Typography>
													</React.Fragment>
												),
												color: "#4a148c",
											},
										]}
										defaultZoom={12}
									/>
								</GridItem>

								<GridItem xs={12}>
									{entry.survey ? (
										<Typography
											component="div"
											variant="body2"
											color="default"
										>
											{" "}
											Survey : {entry.survey.title} <br />
										</Typography>
									) : (
										""
									)}

									<Typography
										component="div"
										variant="body2"
										color="default"
										gutterBottom
									>
										{" "}
										From:{" "}
										{new Date(entry.start_date).format(
											"d M Y H:i:s A"
										)}{" "}
									</Typography>
									<Typography
										component="div"
										variant="body2"
										color="default"
										gutterBottom
									>
										{" "}
										To:{" "}
										{new Date(entry.end_date).format(
											"d M Y H:i:s A"
										)}{" "}
									</Typography>
									<Typography
										component="div"
										variant="body2"
										color="default"
										gutterBottom
									>
										{" "}
										Involvement:{" "}
										{entry.involvement === "team"
											? "Team"
											: "Individual"}{" "}
									</Typography>
									<Typography
										component="div"
										variant="body2"
										color="default"
										gutterBottom
									>
										{" "}
										Radius:{" "}
										{entry.focus_radius +
											" " +
											entry.focus_radius_metric}{" "}
									</Typography>
									<Typography
										component="div"
										variant="body2"
										color="default"
										gutterBottom
									>
										{entry.involvement === "team" && (
												<Chip
													size="small"
													label={entry.status}
												/>
											) && (
												<Chip
													size="small"
													avatar={
														entry.team.avatar ? (
															<Avatar
																alt={
																	entry.team
																		.name
																}
																src={AttachmentsService.getAttachmentFileUrl(
																	entry.team
																		.avatar
																)}
															/>
														) : null
													}
													label={entry.team.name}
												/>
											)}
										{entry.involvement === "individual" && (
											<Chip
												size="small"
												label="Individual"
											/>
										)}
										{entry.involvement === "individual" &&
											entry.individual && (
												<Chip
													size="small"
													avatar={
														entry.individual
															.avatar ? (
															<Avatar
																alt={
																	entry
																		.individual
																		.first_name
																}
																src={AttachmentsService.getAttachmentFileUrl(
																	entry
																		.individual
																		.avatar
																)}
															/>
														) : null
													}
													label={
														entry.individual
															.first_name +
														" " +
														entry.individual
															.last_name
													}
												/>
											)}
										&nbsp;
									</Typography>
									<Typography
										component="div"
										variant="body2"
										color="default"
										gutterBottom
									>
										{" "}
										Status:{" "}
										{entry.status && (
											<Status
												color={
													status_colors[entry.status]
												}
												text={
													status_names[entry.status]
												}
											/>
										)}{" "}
									</Typography>
								</GridItem>
							</GridContainer>
						),
					};
				},
			},
			calendarview: {
				type: "period",
				period: ["start_date", "end_date"],
				title: ["survey", "status", "involvement"],
			},
			googlemapview: {
				type: "circle",
				coordinates: "focus_center",
				title: ["start_date", "end_date", "status", "involvement"],
			},
		},
		listing: {
			default: "googlemapview",
			listview: {
				avatar: false,
				resolveData: async (
					entries,
					user = null,
					isPopulated = true
				) => {
					let resolved_data = [];

					if (Array.isArray(entries)) {
						resolved_data = entries.map((entry, index) => {
							return {
								id: entry._id,
								icon:
									entry.involvement === "team" &&
									entry.team ? (
										entry.team.avatar ? null : (
											<DefinationContextIcon />
										)
									) : entry.involvement === "individual" &&
									  entry.individual ? (
										entry.individual.avatar ? null : (
											<DefinationContextIcon />
										)
									) : null,
								avatar:
									entry.involvement === "team" &&
									entry.team ? (
										entry.team.avatar ? (
											<Avatar
												alt={entry.team.name}
												src={AttachmentsService.getAttachmentFileUrl(
													entry.team.avatar
												)}
											/>
										) : null
									) : entry.involvement === "individual" &&
									  entry.individual ? (
										entry.individual.avatar ? (
											<Avatar
												alt={
													entry.individual.first_name
												}
												src={AttachmentsService.getAttachmentFileUrl(
													entry.individual.avatar
												)}
											/>
										) : null
									) : null,
								title:
									new Date(
										entry.start_date
									).toLocaleDateString() +
									" - " +
									entry.end_date,
								body: (
									<React.Fragment>
										{entry.survey ? (
											<Typography
												component="span"
												variant="body1"
												color="default"
											>
												{" "}
												Survey : {
													entry.survey.title
												}{" "}
												<br />
											</Typography>
										) : (
											""
										)}

										<Typography
											component="span"
											variant="body2"
											color="default"
										>
											{entry.involvement === "team" && (
												<Chip
													size="small"
													label="Team"
												/>
											)}
											&nbsp;
											{entry.involvement === "team" && (
													<Chip
														size="small"
														label={entry.status}
													/>
												) && (
													<Chip
														size="small"
														avatar={
															entry.team
																.avatar ? (
																<Avatar
																	alt={
																		entry
																			.team
																			.name
																	}
																	src={AttachmentsService.getAttachmentFileUrl(
																		entry
																			.team
																			.avatar
																	)}
																/>
															) : null
														}
														label={entry.team.name}
													/>
												)}
											{entry.involvement ===
												"individual" && (
												<Chip
													size="small"
													label="Individual"
												/>
											)}
											&nbsp;
											{entry.involvement ===
												"individual" &&
												entry.individual && (
													<Chip
														size="small"
														avatar={
															entry.individual
																.avatar ? (
																<Avatar
																	alt={
																		entry
																			.individual
																			.first_name
																	}
																	src={AttachmentsService.getAttachmentFileUrl(
																		entry
																			.individual
																			.avatar
																	)}
																/>
															) : null
														}
														label={
															entry.individual
																.first_name +
															" " +
															entry.individual
																.last_name
														}
													/>
												)}
											&nbsp;
										</Typography>
										{entry.status && (
											<Status
												color={
													status_colors[entry.status]
												}
												text={
													status_names[entry.status]
												}
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
				resolveData: async (entries, isPopulated = true) => {
					let resolvedData = entries.map((entry, index) => {
						return {
							_id: entry._id,
							survey: entry.survey ? entry.survey.title : "",
							queries:
								entry.queries &&
								Array.isArray(entry.queries) ? (
									<GridContainer>
										{entry.queries.map((query, cursor) => (
											<GridItem
												xs={12}
												key={"query-" + cursor}
											>
												<Badge
													badgeContent={
														query.sample_size
													}
													color="transparent"
													textColor={
														colors.hex.accent
													}
													position="top-right"
												>
													<Typography
														component="span"
														variant="body2"
														paragraph
													>
														{query.question}{" "}
													</Typography>
												</Badge>
											</GridItem>
										))}
									</GridContainer>
								) : (
									""
								),
							involvement: entry.involvement
								? entry.involvement === "individual"
									? "Individual"
									: "Team"
								: "",

							team: entry.involvement === "team" && (
									<Chip size="small" label={entry.status} />
								) && (
									<Chip
										size="small"
										avatar={
											entry.team.avatar ? (
												<Avatar
													alt={entry.team.name}
													src={AttachmentsService.getAttachmentFileUrl(
														entry.team.avatar
													)}
												/>
											) : null
										}
										label={entry.team.name}
									/>
								),

							lead: entry.lead && (
								<Chip
									size="small"
									avatar={
										entry.lead.avatar ? (
											<Avatar
												alt={entry.lead.first_name}
												src={AttachmentsService.getAttachmentFileUrl(
													entry.lead.avatar
												)}
											/>
										) : null
									}
									label={
										entry.lead.first_name +
										" " +
										entry.lead.last_name
									}
								/>
							),

							individual: entry.involvement === "individual" &&
								entry.individual && (
									<Chip
										size="small"
										avatar={
											entry.individual.avatar ? (
												<Avatar
													alt={
														entry.individual
															.first_name
													}
													src={AttachmentsService.getAttachmentFileUrl(
														entry.individual.avatar
													)}
												/>
											) : null
										}
										label={
											entry.individual.first_name +
											" " +
											entry.individual.last_name
										}
									/>
								),
							focus_center: entry.focus_center
								? ReactHtmlParser(
										JSON.prettyStringify(entry.focus_center)
								  )
								: "",
							focus_radius_metric: entry.focus_radius_metric
								? entry.focus_radius_metric
								: "",
							focus_radius: entry.focus_radius
								? entry.focus_radius
								: "",
							requirements: entry.survey
								? entry.requirements
								: "",
							start_date: entry.start_date
								? new Date(entry.start_date).format(
										formats.dateformats.date
								  )
								: "",
							end_date: entry.end_date
								? new Date(entry.end_date).format(
										formats.dateformats.date
								  )
								: "",
							files:
								entry.files && Array.isArray(entry.files) ? (
									<GridContainer> </GridContainer>
								) : (
									""
								),
							status: entry.status ? (
								<Status
									color={status_colors[entry.status]}
									text={status_names[entry.status]}
								/>
							) : (
								""
							),
						};
					});
					return resolvedData;
				},
			},
			calendarview: {
				type: "task",
				resolveData: async (
					entries,
					user = null,
					isPopulated = true
				) => {
					let resolved_data = [];

					if (Array.isArray(entries)) {
						resolved_data = entries.map((entry, index) => {
							return {
								id: entry._id,
								calendarId: "commissions",
								title: entry.survey
									? entry.survey.title
									: entry.involvement,
								body:
									(entry.survey
										? "<b>Survey :</b> : " +
										  entry.survey.title +
										  "<br /> "
										: "") +
									"<b>Involvement :</b> " +
									(entry.involvement === "team"
										? entry.team.name + "(Team)"
										: entry.individual
										? entry.individual.first_name +
										  " " +
										  entry.individual.last_name +
										  "(Individual)"
										: "") +
									"<br /> <b>Status :</b> " +
									entry.status,
								category: "time",
								dueDateClass: "",
								start: entry.start_date,
								end: entry.end_date,
							};
						});
					}
					return resolved_data;
				},
			},
			googlemapview: {
				type: "circle",
				resolveData: async (
					entries,
					user = null,
					isPopulated = true
				) => {
					let resolved_data = [];
					resolved_data = entries.map((entry, index) => {
						return {
							id: entry._id,
							center: entry.focus_center,
							//title: entry.survey? entry.survey.title+' Survey Commission' : 'Commission',
							infoWindow: (
								<React.Fragment>
									<Typography
										component="h5"
										variant="subtitle2"
										color="primary"
										bold
									>
										Commission
									</Typography>
									{entry.survey ? (
										<Typography
											component="p"
											variant="body2"
											color="default"
										>
											{" "}
											Survey : {entry.survey.title} <br />
										</Typography>
									) : (
										""
									)}

									<Typography
										component="p"
										variant="body2"
										color="default"
										gutterBottom
									>
										{" "}
										From:{" "}
										{new Date(entry.start_date).format(
											"d M Y H:i:s A"
										)}{" "}
									</Typography>
									<Typography
										component="p"
										variant="body2"
										color="default"
										gutterBottom
									>
										{" "}
										To:{" "}
										{new Date(entry.end_date).format(
											"d M Y H:i:s A"
										)}{" "}
									</Typography>
									<Typography
										component="p"
										variant="body2"
										color="default"
										gutterBottom
									>
										{" "}
										Involvement:{" "}
										{entry.involvement === "team"
											? "Team"
											: "Individual"}{" "}
									</Typography>
									<Typography
										component="p"
										variant="body2"
										color="default"
										gutterBottom
									>
										{" "}
										Radius:{" "}
										{entry.focus_radius +
											" " +
											entry.focus_radius_metric}{" "}
									</Typography>
									<Typography
										component="p"
										variant="body2"
										color="default"
										gutterBottom
									>
										{entry.involvement === "team" && (
												<Chip
													size="small"
													label={entry.status}
												/>
											) && (
												<Chip
													size="small"
													avatar={
														entry.team.avatar ? (
															<Avatar
																alt={
																	entry.team
																		.name
																}
																src={AttachmentsService.getAttachmentFileUrl(
																	entry.team
																		.avatar
																)}
															/>
														) : null
													}
													label={entry.team.name}
												/>
											)}
										{entry.involvement === "individual" && (
											<Chip
												size="small"
												label="Individual"
											/>
										)}
										{entry.involvement === "individual" &&
											entry.individual && (
												<Chip
													size="small"
													avatar={
														entry.individual
															.avatar ? (
															<Avatar
																alt={
																	entry
																		.individual
																		.first_name
																}
																src={AttachmentsService.getAttachmentFileUrl(
																	entry
																		.individual
																		.avatar
																)}
															/>
														) : null
													}
													label={
														entry.individual
															.first_name +
														" " +
														entry.individual
															.last_name
													}
												/>
											)}
										&nbsp;
									</Typography>
									<Badge color="primary" variant="dot">
										<Chip
											size="small"
											label={entry.status}
										/>{" "}
									</Badge>
								</React.Fragment>
							),
							//color: '#4a148c',
							radius: distanceToMeters(
								entry.focus_radius,
								entry.focus_radius_metric
							),
							options: {
								fillColor: "#4a148c",
								strokeColor: "#4a148c",
							},
						};
					});

					return resolved_data;
				},
			},
		},
	},
	scope: {
		columns: {
			survey: {
				type: "string",
				label: "Survey",
				icon: "label",
				input: {
					type: "select",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
				reference: {
					name: "surveys",
					service_query: {},
					resolves: {
						value: "_id",
						display: {
							primary: ["title"],
							secondary: ["status"],
							avatar: false,
						},
					},
				},
			},

			response_mode: {
				type: "string",
				label: "Response Mode",
				input: {
					type: "radio",
					default: "individual",
					required: true,
					size: 12,
				},
				possibilities: {
					queries: "Queries",
					odk_form: "ODK Form",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			queries: {
				type: ["string"],
				label: "Queries",
				icon: "label",
				input: {
					type: (values, user) => {
						if (values.response_mode === "queries") {
							return "multiselect";
						}
						return "hidden";
					},
					default: "",
					required: (values, user) => {
						if (values) {
							return values.response_mode === "queries";
						}
					},
				},
				restricted: {
					display: (entry, user) => {
						if (entry) {
							if (entry.response_mode === "queries") {
								return false;
							}
						}					
						return true;
					},
					input: (values, user) => {
						if (values) {
							if (values.response_mode === "queries") {
								return false;
							}
							
						}						
						return true;
					}
				},
				reference: {
					name: "queries",
					service_query: (values, user) => {
						if (values && values.survey) {
							return { survey: values.survey };
						}
						return {};
					},
					resolves: {
						value: "_id",
						display: {
							primary: ["question"],
							secondary: [],
							avatar: false,
						},
					},
				},
			},

			odk_form: {
				type: "string",
				label: "ODK Form",
				input: {
					type: (values, user) => {
						if (values.response_mode === "odk_form") {
							return "select";
						}
						return "hidden";
					},
					required: (values, user) => {
						if (values.response_mode === "odk_form") {
							return true;
						}
						return false;
					},
				},
				restricted: {
					display: (entry, user) => {
						if (entry) {
							if (entry.response_mode === "odk_form") {
								return false;
							}
						}					
						return true;
					},
					input: (values, user) => {
						if (values) {
							if (values.response_mode === "odk_form") {
								return false;
							}
							
						}						
						return true;
					}					
				},
			},

			involvement: {
				type: "string",
				label: "Involvement",
				icon: "subject",
				input: {
					type: "radio",
					default: "individual",
					required: true,
					size: 12,
				},
				possibilities: {
					team: "Team",
					individual: "Individual",
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},
			team: {
				type: "string",
				label: "Team",
				icon: "people",
				input: {
					type: (values, user) => {
						if (values.involvement === "team") {
							return "select";
						}
						return "hidden";
					},
					default: "",
					required: (values, user) => {
						if (values.involvement === "team") {
							return true;
						}
						return false;
					},
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (values.involvement !== "team") {
							return true;
						}
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
				reference: {
					name: "teams",
					service_query: { status: "disengaged" },
					resolves: {
						value: "_id",
						display: {
							primary: ["name"],
							secondary: ["bias"],
							avatar: false,
						},
					},
				},
			},
			lead: {
				type: "string",
				label: "Lead",
				input: {
					type: (values, user) => {
						if (values.involvement === "team") {
							return "select";
						}
						return "hidden";
					},
					default: "",
					required: true,
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
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
			individual: {
				type: "string",
				label: "Individual",
				input: {
					type: (values, user) => {
						if (values.involvement === "individual") {
							return "select";
						}
						return "hidden";
					},
					default: "",
					required: (values, user) => {
						if (values.involvement === "individual") {
							return true;
						}
						return false;
					},
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (values.involvement !== "individual") {
							return true;
						}
						if (user) {
							return !user.isAdmin;
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
			focus_center: {
				type: "object",
				label: "Focus center",
				input: {
					type: "coordinates",
					placeholderType: "formatted_address",
					required: true,

				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}

						return true;
					},
				},
			},

			focus_radius_metric: {
				type: "string",
				label: "Focus radius metric",
				icon: "trip_origin",
				input: {
					type: "select",
					default: "",
					required: true,
					size: 4,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
				possibilities: {
					yards: "Yards",
					feet: "Feet",
					meters: "Meters",
					kilometers: "Kilometers",
					miles: "Miles",
				},
			},

			focus_radius: {
				type: "float",
				label: "Focus radius",
				icon: "trip_origin",
				input: {
					type: "number",
					default: "",
					required: true,
					size: 8,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			requirements: {
				type: "string",
				label: "Requirements",
				icon: "subject",
				input: {
					type: "textarea",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return true;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			files: {
				type: ["string"],
				label: "Files",
				input: {
					type: "file",
					accepts: ["image/*", "video/*", "audio/*", "application/*"],
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

			start_date: {
				type: "date",
				label: "Start date",
				icon: "event",
				input: {
					type: "date",
					default: "",
					required: true,
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},
			end_date: {
				type: "date",
				label: "End date",
				icon: "event",
				input: {
					type: "date",
					default: "",
					required: true,
					size: 6,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
			},

			status: {
				type: "string",
				label: "Status",
				icon: "outlined_flag",
				input: {
					type: "radio",
					default: "",
					required: true,
				},
				restricted: {
					display: (entry, user) => {
						return false;
					},
					input: (values, user) => {
						if (user) {
							return !user.isAdmin;
						}
						return true;
					},
				},
				possibilities: status_names,
			},
		},
		identity: {
			primary: ["survey", "start_date"],
			secondary: ["status"],
			avatar: false,
		},
		dependencies: [],
		dependants: {
			responses: {
				column: "commission",
				query: {},
			},
			tracks: {
				column: "commission",
				query: {},
			},
			actionlogs: {
				column: "record",
				query: { context: "Commission" },
			},
		},
	},
	access: {
		restricted: user => {
			if (user) {
				return !(user.isAdmin || user.isCollector);
			}
			return true;
		},
		view: {
			summary: user => {				
				return true;
			},
			all: user => {
				if (user) {
					return user.isAdmin || user.isCollector;
				}
				return false;
			},
			single: (user, record) => {
				if (user) {
					return user.isAdmin || user.isCollector;
				}
				return false;
			},
		},
		actions: {
			view_single: {
				restricted: user => {
					if (user) {
						return !(user.isAdmin || user.isCollector);
					}
					return true;
				},
				uri: entry => {
					return (
						"commissions/view/" + entry._id
					).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className) => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"commissions/view/" + entry._id
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
				uri: "commissions/add".toUriWithDashboardPrefix(),
				link: {
					inline: {
						default: props => {
							return (
								<Link
									to={"commissions/add/".toUriWithDashboardPrefix()}
									{...props}
								>
									<Button
										color="primary"
										outlined
										aria-label="add"
									>
										<AddIcon className="float-left" /> New
										Commission
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
				uri: entry => {
					return (
						"commissions/edit/" + entry._id
					).toUriWithDashboardPrefix();
				},
				link: {
					inline: {
						default: (entry, className = "grey_text") => {},
						listing: (entry, className = "grey_text") => {
							return (
								<Link
									to={(
										"commissions/edit/" + entry._id
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
				uri: entry => {
					return (
						"commissions/delete/" + entry._id
					).toUriWithDashboardPrefix();
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
