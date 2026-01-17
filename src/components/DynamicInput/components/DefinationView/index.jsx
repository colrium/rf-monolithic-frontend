/** @format */

import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import MoveDownIcon from "@mui/icons-material/ArrowDownward";
import MoveUpIcon from "@mui/icons-material/ArrowUpward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/MoreVert";
import classNames from "classnames";
import Button from "@mui/material/Button";
import { CheckboxInput, MapInput, RadioInput, SelectInput, TextInput } from "components/FormInputs";
import Grid from '@mui/material/Grid';
;
import Typography from '@mui/material/Typography';
import PropTypes from "prop-types";
import React from "react";







class DefinationView extends React.Component {
	state = {
		contextDialogOpen: false,
		expandedGroups: [],
		addContextMenuAnchor: null,
		inputMenuAnchor: null,
		context: {},
		active: false,
	};

	input_types = {
		text: "Text",
		date: "Date",
		datetime: "Date & Time",
		time: "Time",
		number: "Number",
		email: "Email",
		textarea: "Textarea",
		radio: "Radio",
		password: "Password",
		checkbox: "Checkbox",
		select: "Select",
		transferlist: "Transferlist",
		file: "File",
		wysiwyg: "WYSIWYG",
		map: "Map",
	};

	constructor(props) {
		super(props);
		const {
			value,
			onChange,
			name,
			readOnly,
			required,
			disabled,
			helperText,
			enableGrouping,
			appendProps,
		} = props;
		this.state = {
			...this.state,
			value: value,
			nextValue: value,
			value,
			onChange: onChange,
			name: name,
			readOnly: readOnly,
			required: required,
			disabled: disabled,
			helperText: helperText,
			enableGrouping: enableGrouping,
			appendProps: appendProps,
		};

		this.handleOnItemMove = this.handleOnItemMove.bind(this);
		this.handleOnAddContextClick = this.handleOnAddContextClick.bind(this);
		this.handleOnEditContextClick = this.handleOnEditContextClick.bind(
			this
		);
		this.handleContextSave = this.handleContextSave.bind(this);
		this.handleContextRemove = this.handleContextRemove.bind(this);
		this.handleAddContextDialogClose = this.handleAddContextDialogClose.bind(
			this
		);
		this.onContextParamsChange = this.onContextParamsChange.bind(this);
		this.handleOnAddMenuOpen = this.handleOnAddMenuOpen.bind(this);
		this.handleOnAddMenuClose = this.handleOnAddMenuClose.bind(this);
		this.handleOnInputMenuOpen = this.handleOnInputMenuOpen.bind(this);
		this.handleOnInputItemClick = this.handleOnInputItemClick.bind(this);
		this.handleOnInputMenuClose = this.handleOnInputMenuClose.bind(this);
		this.handleOnGroupContextExpand = this.handleOnGroupContextExpand.bind(
			this
		);
		this.handleOnGroupContextCollapse = this.handleOnGroupContextCollapse.bind(
			this
		);
	}

	getSnapshotBeforeUpdate(prevProps) {
		return { refreshRequired: !Object.areEqual(prevProps, this.props) };
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {
			value,
			onChange,
			name,
			readOnly,
			required,
			disabled,
			helperText,
			enableGrouping,
			appendProps,
		} = this.props;
		if (snapshot.refreshRequired) {
			this.setState(prevState => ({
				value: value,
				onChange: onChange,
				name: name,
				readOnly: readOnly,
				required: required,
				disabled: disabled,
				helperText: helperText,
				enableGrouping: enableGrouping,
				appendProps: appendProps,
			}));
		}
	}

	handleOnItemMove = (direction, item = false) => event => {
		const { onChange } = this.props;

		let entry = item ? item : this.state.context;
		if (JSON.isJSON(entry)) {
			let positionOfKey = JSON.positionOfKey(
				this.state.value,
				entry.name
			);
			if (["up", "prev", "minus"].includes(direction)) {
				if (positionOfKey > 0) {
					let repositionedValue = JSON.moveKey(
						this.state.value,
						entry.name,
						positionOfKey - 1
					);
					this.setState(
						{
							value: repositionedValue,
							addContextMenuAnchor: null,
							inputMenuAnchor: null,
						},
						() => {
							this.triggerOnChange(repositionedValue);
						}
					);
				}
			} else if (["down", "next", "plus"].includes(direction)) {
				if (positionOfKey < Object.size(this.state.value) - 1) {
					let repositionedValue = JSON.moveKey(
						this.state.value,
						entry.name,
						positionOfKey + 1
					);
					this.setState(
						{
							value: repositionedValue,
							addContextMenuAnchor: null,
							inputMenuAnchor: null,
						},
						() => {
							this.triggerOnChange(repositionedValue);
						}
					);
				}
			}
		}
	};

	handleOnAddMenuOpen = event => {
		const addContextMenuAnchor = event.currentTarget;
		this.setState({
			active: true,
			addContextMenuAnchor: addContextMenuAnchor,
		});
	};

	handleOnAddMenuClose() {
		this.setState({ active: false, addContextMenuAnchor: null });
	}

	handleOnInputMenuOpen = context => event => {
		const inputMenuAnchor = event.currentTarget;
		this.setState({
			active: true,
			inputMenuAnchor: inputMenuAnchor,
			context: context,
		});
	};

	handleOnInputItemClick = context => event => {
		this.setState({
			active: true,
			inputMenuAnchor: null,
			context: context,
			addContextMenuAnchor: null,
			inputMenuAnchor: null,
			contextDialogOpen: true,
		});
	};

	handleOnInputMenuClose() {
		this.setState({ active: false, inputMenuAnchor: null, context: {} });
	}

	handleOnGroupContextExpand = name => event => {
		//this.setState( prevState => ( { expandedGroups: prevState.expandedGroups.concat([name]), inputMenuAnchor: null, }) );
		this.setState(prevState => ({
			expandedGroups: [name],
			inputMenuAnchor: null,
		}));
	};

	handleOnGroupContextCollapse = name => event => {
		this.setState(prevState => ({
			expandedGroups: prevState.expandedGroups.removeItem(name),
			inputMenuAnchor: null,
		}));
	};

	handleOnAddContextClick = (type, group_name) => event => {
		if (
			type === "group" &&
			(this.state.enableGrouping || this.state.defination.enableGrouping)
		) {
			let context = {
				type: type,
				size: "12",
				multientries: true,
				joinedfields: false,
				fields: [],
			};

			this.setState({
				active: true,
				context: context,
				addContextMenuAnchor: null,
				inputMenuAnchor: null,
				contextDialogOpen: true,
			});
		} else {
			let context = {
				type: "field",
				group: false,
				input: {
					type: "text",
					size: 12,
					props: {},
					required: false,
					disabled: false,
				},
			};
			if (group_name) {
				context.group = group_name;
			}
			this.setState({
				active: true,
				context: context,
				addContextMenuAnchor: null,
				inputMenuAnchor: null,
				contextDialogOpen: true,
			});
		}
	};

	handleOnEditContextClick = event => {
		this.setState({
			active: true,
			addContextMenuAnchor: null,
			inputMenuAnchor: null,
			contextDialogOpen: true,
		});
	};

	handleContextSave = event => {
		let { context, value } = this.state;
		let prevState = this.state;
		if (Object.size(context) > 0) {
			if (context.type === "field") {
				if (!context.input) {
					context.input = {
						type: "text",
						size: "12",
						props: {},
						required: false,
						disabled: false,
						group: false,
					};
				}
				if (context.group && context.group in prevState.value) {
					if ("value" in context) {
						delete context.value;
					}

					/*this.setState({
							value: {
								...prevState.value,
								[context.group]: {
									...value[context.group],
									fields: Array.isArray( prevState.value[context.group].fields ) ? prevState.value[context.group].fields.concat([{ ...context }]) : [{ ...context }]
								}
							},
							context: {},
							addContextMenuAnchor: null,
							contextDialogOpen: false
						},
						() => {
							this.triggerOnChange();
						});*/
					this.setState(
						{
							value: prevState.nextValue,
							context: {},
							addContextMenuAnchor: null,
							contextDialogOpen: false,
						},
						() => {
							this.triggerOnChange();
						}
					);
				} else {
					/*this.setState({
							value: { ...prevState.value, [context.name]: { ...context } },
							context: {},
							addContextMenuAnchor: null,
							contextDialogOpen: false
						},
						() => {
							this.triggerOnChange();
						});*/
					this.setState(
						{
							value: prevState.nextValue,
							context: {},
							addContextMenuAnchor: null,
							contextDialogOpen: false,
						},
						() => {
							this.triggerOnChange();
						}
					);
				}
			} else {
				if (!context.fields) {
					context.fields = [];
				}
				if (!context.size) {
					context.size = "12";
				}
				//let new_value = {...this.state.value, [context.name]: { ...context }}
				let new_value = this.state.nextValue;
				this.setState({
					value: new_value,
					context: {},
					addContextMenuAnchor: null,
					contextDialogOpen: false,
				});
				this.triggerOnChange(new_value);
			}
		} else {
			this.setState({
				context: {},
				addContextMenuAnchor: null,
				contextDialogOpen: false,
			});
		}
	};

	triggerOnChange(value = false) {
		const { onChange } = this.props;
		if (Function.isFunction(onChange)) {
			if (!value) {
				value = this.state.value;
			}
			onChange(value);
		}
	}

	handleContextRemove = event => {
		let { value, context } = this.state;
		let { type, name, group } = context;
		if (type === "group") {
			delete value[name];
			this.setState({
				value: value,
				addContextMenuAnchor: null,
				inputMenuAnchor: null,
			});
			this.triggerOnChange(value);
		} else if (type === "field") {
			if (group) {
				value[group].value = value[group].fields.map((entry, index) => {
					if (entry.name !== name) {
						return entry;
					}
				});
			} else {
				delete value[name];
			}
			this.setState({
				value: value,
				addContextMenuAnchor: null,
				inputMenuAnchor: null,
			});
			this.triggerOnChange(value);
		}
	};

	onContextParamsChange(name, value) {
		let context = JSON.parse(JSON.stringify(this.state.context));
		let nextValue = JSON.parse(JSON.stringify(this.state.value));

		if (name == "name") {
			context.label = value;
			value = value.variablelize();
			context.name = value;
			let appendableProps = this.getAppendableProps(context);

			for (let appendableProp of appendableProps) {
				if (!(appendableProp.name in context)) {
					context[appendableProp.name] = JSON.isJSON(
						appendableProp.input
					)
						? appendableProp.input.value
							? appendableProp.input.value
							: appendableProp.input.defaultValue
						: undefined;
				}
			}

			if (value !== this.state.context.name) {
				if (this.state.context.group) {
					let parentGroup = nextValue[this.state.context.group];
					let newGroupFields = [context];
					if (parentGroup) {
						if (Array.isArray(parentGroup.fields)) {
							newGroupFields = parentGroup.fields.map(
								(field, index) => {
									if (
										field.name !== this.state.context.name
									) {
										return field;
									} else {
										return context;
									}
								}
							);
						}
						parentGroup.fields = newGroupFields;
					}
					nextValue[this.state.context.group] = parentGroup;
				} else {
					const positionOfKey = JSON.positionOfKey(
						nextValue,
						this.state.context.name
					);
					if (positionOfKey !== -1) {
						delete nextValue[this.state.context.name];
						nextValue[value] = context;
						nextValue = JSON.moveKey(
							nextValue,
							value,
							positionOfKey
						);
					} else {
						nextValue[value] = context;
					}
				}
			} else {
				if (this.state.context.group) {
					let parentGroup = nextValue[this.state.context.group];
					let newGroupFields = [context];
					if (parentGroup) {
						if (Array.isArray(parentGroup.fields)) {
							newGroupFields = parentGroup.fields.map(
								(field, index) => {
									if (
										field.name !== this.state.context.name
									) {
										return field;
									} else {
										return context;
									}
								}
							);
						}
						parentGroup.fields = newGroupFields;
					}
					nextValue[this.state.context.group] = parentGroup;
				} else {
					nextValue[value] = context;
				}
			}
		} else {
			context[name] = value;
			if (this.state.context.group) {
				let parentGroup = nextValue[this.state.context.group];
				let newGroupFields = [context];
				if (parentGroup) {
					if (Array.isArray(parentGroup.fields)) {
						newGroupFields = parentGroup.fields.map(
							(field, index) => {
								if (field.name !== this.state.context.name) {
									return field;
								} else {
									return context;
								}
							}
						);
					}
					parentGroup.fields = newGroupFields;
				}
				nextValue[this.state.context.group] = parentGroup;
			} else {
				nextValue[value] = context;
			}
		}
		this.setState(prevState => ({
			context: context,
			nextValue: nextValue,
		}));
	}

	handleAddContextDialogClose() {
		this.setState({ contextDialogOpen: false });
	}

	renderInputsDefination() {
		let {
			value,
			disabled,
			readOnly,
			context,
			inputMenuAnchor,
		} = this.state;
		return (
			<Grid container className="m-0 p-1">
				{Object.entries(value).map(([name, properties], cursor) => (
					<Grid item
						className="m-0 p-1 rounded hover:bg-gray-200"
						xs={12}
						md={
							properties.type === "field"
								? properties.input.size
									? Number.parseNumber(properties.input.size)
									: 12
								: properties.size
									? Number.parseNumber(properties.size)
									: 12
						}
						key={"field-" + cursor}
					>
						{properties.type === "field" && (
							<div >
								<div >
									<Grid container className="m-0">
										<Grid item  xs={12} className="m-0 p-0">
											<Typography
												variant="body1"
												className="cursor-pointer truncate hover:text-blue-600"
												onClick={this.handleOnInputItemClick(
													{
														name: name,
														...properties,
													}
												)}
											>
												{(properties.input
													? properties.input.multiple
														? "["
														: ""
													: "") +
													properties.label +
													(properties.input
														? properties.input
															.required
															? "*"
															: ""
														: "") +
													(properties.input
														? properties.input
															.multiple
															? "]"
															: ""
														: "")}
											</Typography>
										</Grid>
										<Grid item  xs={12} className="m-0 p-0">
											<Typography
												variant="body2"
												color="grey"
												className="w-full truncate"
											>
												{" "}
												{properties.input
													? properties.input.type in
														this.input_types
														? this.input_types[
														properties.input
															.type
														]
														: "Field"
													: "Field"}{" "}
											</Typography>
										</Grid>
									</Grid>
								</div>
								<div >
									{properties.type === "group" && (
										<IconButton
											fontSize="small"
											onClick={
												!this.state.expandedGroups.includes(
													name
												)
													? this.handleOnGroupContextExpand(
														name
													)
													: this.handleOnGroupContextCollapse(
														name
													)
											}
											aria-label="menu-icon"
										>
											<ExpandMoreIcon className="text-lg" />
										</IconButton>
									)}

									{JSON.positionOfKey(value, name) !== 0 && (
										<IconButton

											size="small"
											onClick={this.handleOnItemMove(
												"up",
												{ name: name, ...properties }
											)}
											aria-label="menu-icon"
										>
											<MoveUpIcon className="text-lg" />
										</IconButton>
									)}

									{JSON.positionOfKey(value, name) <
										Object.size(value) - 1 && (
											<IconButton

												size="small"
												onClick={this.handleOnItemMove(
													"down",
													{ name: name, ...properties }
												)}
												aria-label="menu-icon"
											>
												<MoveDownIcon className="text-lg" />
											</IconButton>
										)}

									<IconButton

										size="small"
										onClick={this.handleOnInputMenuOpen({
											name: name,
											...properties,
										})}
										aria-label="menu-icon"
									>
										<MenuIcon className="text-lg" />
									</IconButton>
								</div>
							</div>
						)}

						{properties.type === "group" && (
							<div className="w-full p-1">
								<div className={" m-0"}>
									<div >
										<Grid container className="m-0 p-0">
											<Grid item
												xs={12}
												className="m-0 p-0"
											>
												<Typography
													variant="body1"
													className="cursor-pointer truncate hover:text-blue-600"
													onClick={this.handleOnInputItemClick(
														{
															name: name,
															...properties,
														}
													)}
												>
													{properties.label}
												</Typography>
											</Grid>
											<Grid item
												xs={12}
												className="m-0 p-0"
											>
												<Typography
													variant="body2"
													color="grey"
													className="w-full truncate"
												>
													{" "}
													Group{" "}
												</Typography>
											</Grid>
										</Grid>
									</div>
									<div >
										<IconButton
											size="small"
											onClick={
												!this.state.expandedGroups.includes(
													name
												)
													? this.handleOnGroupContextExpand(
														name
													)
													: this.handleOnGroupContextCollapse(
														name
													)
											}
											aria-label="menu-icon"
										>
											<ExpandMoreIcon className="text-lg" />
										</IconButton>

										{JSON.positionOfKey(value, name) !==
											0 && (
												<IconButton

													size="small"
													onClick={this.handleOnItemMove(
														"up",
														{
															name: name,
															...properties,
														}
													)}
													aria-label="menu-icon"
												>
													<MoveUpIcon className="text-lg" />
												</IconButton>
											)}

										{JSON.positionOfKey(value, name) <
											Object.size(value) - 1 && (
												<IconButton
													size="small"
													onClick={this.handleOnItemMove(
														"down",
														{
															name: name,
															...properties,
														}
													)}
													aria-label="menu-icon"
												>
													<MoveDownIcon className="text-lg" />
												</IconButton>
											)}

										<IconButton
											size="small"
											onClick={this.handleOnInputMenuOpen(
												{ name: name, ...properties }
											)}
											aria-label="menu-icon"
										>
											<MenuIcon className="text-lg" />
										</IconButton>
									</div>
								</div>
								<Grid container
									className={
										"m-0 p-0" +
										(this.state.expandedGroups.includes(
											name
										)
											? ""
											: "hidden")
									}
								>
									<Grid item  xs={12} className="m-0 p-0 px-4">
										<Collapse
											in={this.state.expandedGroups.includes(
												name
											)}
											timeout="auto"
										>
											<Grid container>
												{Array.isArray(
													properties.fields
												) &&
													properties.fields.map(
														(entry, index) => (
															<Grid item
																xs={12}
																md={
																	entry.input
																		.size
																		? Number.parseNumber(
																			entry
																				.input
																				.size
																		)
																		: 12
																}
																className={"m-0 p-0"}
																key={
																	"group-field-" +
																	index
																}
															>
																<div>
																	<Grid container className="m-0">
																		<Grid item
																			xs={
																				12
																			}
																			className="m-0 p-0"
																		>
																			<Typography
																				variant="body1"
																				fullWidth
																			>
																				{(entry.input
																					? entry
																						.input
																						.multiple
																						? "["
																						: ""
																					: "") +
																					entry.label +
																					(entry.input
																						? entry
																							.input
																							.required
																							? "*"
																							: ""
																						: "") +
																					(entry.input
																						? entry
																							.input
																							.multiple
																							? "]"
																							: ""
																						: "")}
																			</Typography>
																		</Grid>
																		<Grid item
																			xs={
																				12
																			}
																			className="m-0 p-0"
																		>
																			<Typography
																				variant="body2"
																				color="grey"
																				fullWidth
																			>
																				{" "}
																				{entry.input
																					? entry
																						.input
																						.type in
																						this
																							.input_types
																						? this
																							.input_types[
																						entry
																							.input
																							.type
																						]
																						: "Field"
																					: "Field"}{" "}
																			</Typography>
																		</Grid>
																	</Grid>
																</div>
																<div
																>
																	<IconButton
																		size="small"
																		onClick={this.handleOnInputMenuOpen(
																			entry
																		)}
																		aria-label="menu-icon"
																	>
																		<MenuIcon className="text-lg" />
																	</IconButton>
																</div>
															</Grid>
														)
													)}
											</Grid>
										</Collapse>
									</Grid>
								</Grid>
							</div>
						)}
					</Grid>
				))}
				<Menu
					id="input-menu"
					anchorEl={inputMenuAnchor}
					keepMounted
					open={Boolean(inputMenuAnchor)}
					onClose={this.handleOnInputMenuClose}
				>
					{context.type === "group" && (
						<MenuItem
							onClick={this.handleOnAddContextClick(
								"field",
								context.name
							)}
						>
							{" "}
							New Field{" "}
						</MenuItem>
					)}
					{context.type === "group" && (
						<MenuItem
							onClick={
								!this.state.expandedGroups.includes(
									context.name
								)
									? this.handleOnGroupContextExpand(
										context.name
									)
									: this.handleOnGroupContextCollapse(
										context.name
									)
							}
						>
							{" "}
							{this.state.expandedGroups.includes(context.name)
								? "Collapse"
								: "Expand"}{" "}
						</MenuItem>
					)}
					<MenuItem onClick={this.handleOnEditContextClick}>
						{" "}
						Edit{" "}
					</MenuItem>
					{JSON.positionOfKey(value, context.name) !== 0 && (
						<MenuItem onClick={this.handleOnItemMove("up")}>
							{" "}
							Move Up{" "}
						</MenuItem>
					)}
					{JSON.positionOfKey(value, context.name) <
						Object.size(value) - 1 && (
							<MenuItem onClick={this.handleOnItemMove("down")}>
								{" "}
								Move Down{" "}
							</MenuItem>
						)}
					<MenuItem onClick={this.handleContextRemove}>
						{" "}
						Delete{" "}
					</MenuItem>
				</Menu>
			</Grid>
		);
	}

	renderInputs() {
		return (
			<Grid container className="p-0 m-0">
				{this.renderInputsDefination()}
			</Grid>
		);
	}

	renderGroupContextDefination() {
		const { context } = this.state;
		return (
			<Grid container className="p-0 m-0">
				<Grid item  xs={12}>
					<TextInput
						autoFocus
						variant="outlined"
						defaultValue={context.label}
						onChange={value => {
							if (String.isString(value)) {
								if (value.trim().length > 0) {
									this.onContextParamsChange("name", value);
								}
							}
						}}
						label="Group Name"
						type="text"
						fullWidth
						required
						validate
					/>
				</Grid>
				<Grid item  xs={12}>
					<SelectInput
						textFieldProps={{
							label: "Size",
							InputLabelProps: {
								shrink: true,
							},
							variant: "outlined",
							required: true,
						}}
						onChange={value => {
							if (String.isString(value)) {
								if (value.trim().length > 0) {
									this.onContextParamsChange("size", value);
								}
							}
						}}
						options={{
							"12": "100%",
							"10": "5/6",
							"8": "2/3",
							"6": "1/2",
							"4": "1/3",
							"3": "1/4",
							"2": "1/6",
						}}
						value={
							context.input
								? ["12", "10", "8", "6", "4", "2"].includes(
									context.input.size
								)
									? context.input.size
									: "12"
								: "12"
						}
						placeholder="Select Size"
					/>
				</Grid>
				<Grid item  xs={12}>
					<CheckboxInput
						label="Joined Fields"
						checked={context.joinedfields ? true : false}
						onChange={value => {
							this.onContextParamsChange("joinedfields", value);
						}}
						color="primary"
					/>
				</Grid>
				<Grid item  xs={12}>
					<CheckboxInput
						checked={context.multientries ? true : false}
						onChange={value => {
							this.onContextParamsChange("multientries", value);
						}}
						color="primary"
						label="Multi Entries"
					/>
				</Grid>
			</Grid>
		);
	}

	mapInputPropsDefinationHelper() {
		const { context } = this.state;
		let typeValue = context.input
			? context.input.props
				? context.input.props.type
					? context.input.props.type
					: undefined
				: undefined
			: undefined;
		return (
			<Grid container className="p-0 m-0">
				<Grid item  xs={12}>
					<SelectInput
						textFieldProps={{
							label: "Type",
							InputLabelProps: {
								shrink: true,
							},
							variant: "outlined",
							required: true,
						}}
						onChange={value => {
							if (String.isString(value)) {
								if (value.trim().length > 0) {
									this.onContextParamsChange(
										"input",
										context.input
											? {
												...context.input,
												props: context.input.props
													? {
														...context.input
															.props,
														type: value,
													}
													: { type: value },
											}
											: {
												type: "text",
												size: 12,
												props: { type: value },
												required: false,
												disabled: false,
											}
									);
								}
							}
						}}
						options={{
							coordinates: "Coordinates",
							address: "Address",
						}}
						value={
							["coordinates", "address"].includes(typeValue)
								? typeValue
								: "coordinates"
						}
						placeholder="Select Map data type"
					/>
				</Grid>
			</Grid>
		);
	}

	inputDefaultValueDefinationHelper() {
		const { context } = this.state;
		return (
			<Grid container className="p-0 m-0">
				<Grid item  xs={12}>
					<SelectInput
						textFieldProps={{
							label: "Type",
							InputLabelProps: {
								shrink: true,
							},
							variant: "outlined",
							required: true,
						}}
						onChange={value => {
							if (String.isString(value)) {
								if (value.trim().length > 0) {
									this.onContextParamsChange(
										"input",
										context.input
											? {
												...context.input,
												props: context.input.props
													? {
														...context.input
															.props,
														type: value,
													}
													: { type: value },
											}
											: {
												type: "text",
												size: 12,
												props: { type: value },
												required: false,
												disabled: false,
											}
									);
								}
							}
						}}
						options={{
							coordinates: "Coordinates",
							address: "Address",
						}}
						value={
							context.input
								? ["coordinates", "address"].includes(
									context.input.props.type
								)
									? context.input.props.type
									: "coordinates"
								: "coordinates"
						}
						placeholder="Select Map data type"
					/>
				</Grid>
			</Grid>
		);
	}

	inputPossibilitiesDefinationHelper() {
		const { context } = this.state;
		return (
			<Grid container className="p-0 m-0">
				{["select", "transferlist", "radio", "checkbox"].includes(
					context.input ? context.input.type : undefined
				) && (
						<Grid item  xs={12}>
							<TextInput
								variant="outlined"
								onChange={value => {
									let possibilities = {};
									value.split(",").map((possibility, index) => {
										if (possibility.length > 0) {
											possibilities[
												possibility.variablelize()
											] = possibility.trim();
										}
									});
									if (Object.keys(possibilities).length > 0) {
										this.onContextParamsChange(
											"possibilities",
											possibilities
										);
									}
								}}
								label="Options"
								defaultValue={
									context.possibilities
										? Object.values(context.possibilities).join(
											", "
										)
										: ""
								}
								type="text"
								multiline
								rows={3}
								helperText="Enter options each separated by a comma (,)"
								fullWidth
							/>
						</Grid>
					)}
			</Grid>
		);
	}

	getAppendableProps(context = false) {
		const { appendProps } = this.state;
		if (!context) {
			context = this.state.context;
		}
		let appendableProps = [];
		if (JSON.isJSON(appendProps)) {
			if (context.name in appendProps) {
				if (Array.isArray(appendProps[context.name])) {
					appendableProps = appendableProps.concat(
						appendProps[context.name]
					);
				} else if (JSON.isJSON(appendProps[context.name])) {
					appendableProps = appendableProps.concat([
						appendProps[context.name],
					]);
				}
			} else if (context.type in appendProps) {
				if (Array.isArray(appendProps[context.type])) {
					appendableProps = appendableProps.concat(
						appendProps[context.type]
					);
				} else if (JSON.isJSON(appendProps[context.type])) {
					appendableProps = appendableProps.concat([
						appendProps[context.type],
					]);
				}
			}
		}
		return appendableProps;
	}

	appendPropsDefinationHelper() {
		const { context, appendProps } = this.state;
		let appendableProps = this.getAppendableProps();

		return (
			<Grid container className="p-0 m-0">
				{appendableProps.map((appendableProp, cursor) => {
					const {
						name,
						label,
						input,
						size,
						possibilities,
					} = appendableProp;
					if (JSON.isJSON(appendableProp.input)) {
						const {
							type,
							size,
							value,
							defaultValue,
							...inputProps
						} = input;
						let inputValue = context[name]
							? context[name]
							: value
								? value
								: defaultValue;
						return (
							<Grid item
								xs={12}
								md={Number.parseNumber(size, 12)}
								key={"appendableProp-" + cursor}
							>
								{["text", "email", "phone", "number"].includes(
									type ? type : undefined
								) && (
										<TextInput
											onChange={value => {
												this.onContextParamsChange(
													name,
													value
												);
											}}
											name={name}
											label={label}
											type={type}
											defaultValue={inputValue}
											{...inputProps}
										/>
									)}

								{type == "select" && (
									<SelectInput
										textFieldProps={{
											label: { label },
											InputLabelProps: {
												shrink: true,
											},
											variant: "outlined",
											required: true,
										}}
										onChange={value => {
											this.onContextParamsChange(
												name,
												value
											);
										}}
										options={possibilities}
										value={inputValue}
										placeholder={"Select " + label}
									/>
								)}

								{type == "radio" && (
									<RadioInput
										onChange={value => {
											this.onContextParamsChange(
												name,
												value
											);
										}}
										options={possibilities}
										value={inputValue}
										name={name}
										label={label}
									/>
								)}
							</Grid>
						);
					} else {
						return (
							<Grid item
								xs={12}
								className="p-0 m-0"
								key={"appendableProp-" + cursor}
							>
								{" "}
								{label} render Error
							</Grid>
						);
					}
				})}
			</Grid>
		);
	}

	inputDefaultValueDefinationHelper() {
		const { context } = this.state;
		return (
			<Grid container className="p-0 m-0 mb-4">
				{["select", "transferlist", "radio", "checkbox"].includes(
					context.input ? context.input.type : undefined
				) && (
						<Grid item  xs={12} className="p-0 m-0">
							<SelectInput
								textFieldProps={{
									label: "Default Value",
									InputLabelProps: {
										shrink: true,
									},
									variant: "outlined",
									required: true,
								}}
								onChange={value => {
									this.onContextParamsChange(
										"input",
										context.input
											? { ...context.input, default: value }
											: { default: value }
									);
								}}
								options={context.possibilities}
								value={context.input ? (context.input.default ? context.input.default : undefined) : undefined}
								placeholder="Select Default"
							/>
						</Grid>
					)}

				{![
					"select",
					"transferlist",
					"multiselect",
					"radio",
					"checkbox",
					"map",
				].includes(context.input ? context.input.type : undefined) && (
						<Grid item  xs={12} className="p-0 m-0">
							<TextInput
								onChange={value => {
									if (value.trim().length > 0) {
										this.onContextParamsChange(
											"input",
											context.input
												? {
													...context.input,
													default: value,
												}
												: { default: value }
										);
									}
								}}
								label="Default"
								type="text"
								fullWidth
							/>
						</Grid>
					)}

				{["map"].includes(
					context.input ? context.input.type : undefined
				) &&
					(context.input
						? context.input.props
							? context.input.props.type
								? context.input.props.type
								: false
							: false
						: false) && (
						<Grid item  xs={12} className="p-0 m-0">
							<MapInput
								onChange={value => {
									if (value.trim().length > 0) {
										this.onContextParamsChange(
											"input",
											context.input
												? {
													...context.input,
													default: value,
												}
												: { default: value }
										);
									}
								}}
								label="Default"
								type={context.input.props.type}
								fullWidth
							/>
						</Grid>
					)}
			</Grid>
		);
	}

	renderFieldContextDefination() {
		const { context } = this.state;
		return (
			<Grid container className="p-0 m-0">
				<Grid item  xs={12}>
					<TextInput
						autoFocus
						variant="outlined"
						defaultValue={context.label ? context.label : ""}
						onChange={value => {
							if (String.isString(value)) {
								if (value.trim().length > 0) {
									this.onContextParamsChange("name", value);
								}
							}
						}}
						label="Name"
						type="text"
						required
						validate
					/>
				</Grid>

				<Grid item  xs={12} md={6}>
					<SelectInput
						textFieldProps={{
							label: "Field Type",
							InputLabelProps: {
								shrink: true,
							},
							variant: "outlined",
							required: true,
						}}
						onChange={value => {
							if (String.isString(value)) {
								if (value.trim().length > 0) {
									this.onContextParamsChange(
										"input",
										context.input
											? { ...context.input, type: value }
											: { type: value }
									);
								}
							}
						}}
						options={this.input_types}
						value={
							context.input
								? context.input.type in this.input_types
									? context.input.type
									: "text"
								: "text"
						}
						placeholder="Select Type"
					/>
				</Grid>

				<Grid item  xs={12} md={6}>
					<SelectInput
						textFieldProps={{
							label: "Input Size",
							InputLabelProps: {
								shrink: true,
							},
							variant: "outlined",
							required: true,
						}}
						onChange={type_value => {
							let value = type_value;
							if (String.isString(value)) {
								if (value.trim().length > 0) {
									this.onContextParamsChange(
										"input",
										context.input
											? {
												...context.input,
												size: Number.parseNumber(
													value
												),
											}
											: {
												size: Number.parseNumber(
													value
												),
											}
									);
								}
							}
						}}
						options={{
							"12": "100%",
							"10": "5/6",
							"8": "2/3",
							"6": "1/2",
							"4": "1/3",
							"3": "1/4",
							"2": "1/6",
						}}
						value={
							context.input
								? ["12", "10", "8", "6", "4", "2"].includes(
									context.input.size
										? context.input.size.toString()
										: "12"
								)
									? context.input.size.toString()
									: "12"
								: "12"
						}
						placeholder="Select Input Size"
					/>
				</Grid>

				<Grid item  xs={12}>
					{this.inputPossibilitiesDefinationHelper()}
				</Grid>

				<Grid item  xs={12}>
					{this.inputDefaultValueDefinationHelper()}
				</Grid>

				{(context.input ? context.input.type : undefined) === "map" && (
					<Grid item  xs={12}>
						{this.mapInputPropsDefinationHelper()}
					</Grid>
				)}

				{["select", "transferlist", "checkbox", "map"].includes(
					context.input ? context.input.type : undefined
				) && (
						<Grid item  xs={12}>
							<CheckboxInput
								checked={
									context.input
										? context.input.props
											? context.input.props.isMulti
												? context.input.props.isMulti
												: false
											: false
										: false
								}
								onChange={isMulti => {
									this.onContextParamsChange(
										"input",
										context.input
											? {
												...context.input,
												props: context.input.props
													? {
														...context.input
															.props,
														isMulti: isMulti,
													}
													: { isMulti: isMulti },
											}
											: {
												type: "text",
												size: 12,
												props: { isMulti: isMulti },
												required: false,
												disabled: false,
											}
									);
								}}
								color="primary"
								label="Multiple"
							/>
						</Grid>
					)}

				<Grid item  xs={12}>
					<CheckboxInput
						checked={
							context.input
								? context.input.required
									? context.input.required
									: false
								: false
						}
						onChange={required => {
							this.onContextParamsChange(
								"input",
								context.input
									? { ...context.input, required: required }
									: { required: required }
							);
						}}
						color="primary"
						label="Required"
					/>
				</Grid>

				<Grid item  xs={12}>
					<CheckboxInput
						checked={
							context.input
								? context.input.disabled
									? context.input.disabled
									: false
								: false
						}
						onChange={disabled => {
							this.onContextParamsChange(
								"input",
								context.input
									? { ...context.input, disabled: disabled }
									: { disabled: disabled }
							);
						}}
						color="primary"
						label="Disabled"
					/>
				</Grid>
				<Grid item  xs={12}>
					{this.appendPropsDefinationHelper()}
				</Grid>
			</Grid>
		);
	}

	renderContextDialog() {
		const { context, value, enableGrouping } = this.state;
		return (
			<Dialog
				open={this.state.contextDialogOpen}
				onClose={this.handleAddContextDialogClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="context-form-title">
					{context.type === "group"
						? "Grouped Input"
						: (context.group && context.group in value
							? value[context.group].label
							: "") + " Input"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Enter
						{context.type === "group" ? "Group" : "Field"}
						Details Below
					</DialogContentText>
					{context.type === "group"
						? this.renderGroupContextDefination()
						: this.renderFieldContextDefination()}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={this.handleAddContextDialogClose}
						color="error"
					>
						Cancel
					</Button>
					<Button
						onClick={this.handleContextSave}
						color="primary"
						disabled={context.name ? false : true}
					>
						Save {context.type === "group" ? "Group" : "Field"}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}

	render() {
		const {
			addContextMenuAnchor,
			context,
			value,
			onChange,
			name,
			readOnly,
			required,
			disabled,
			helperText,
			inputs,
			active,
			enableGrouping,
		} = this.state;
		return (
			<Grid container>
				<Grid container className="p-0 m-0">
					{this.renderInputs()}
					{this.renderContextDialog()}
				</Grid>

				<Grid container className="p-0 m-0">
					<Grid item  xs={12}>
						<Tooltip title="Add New">
							<IconButton
								aria-label="add-element-btn"
								onClick={this.handleOnAddMenuOpen}
								disabled={disabled || readOnly}
								className="float-right"
							>
								<AddIcon fontSize="small" />
							</IconButton>
						</Tooltip>
						<Menu
							id="simple-menu"
							anchorEl={addContextMenuAnchor}
							keepMounted
							open={Boolean(addContextMenuAnchor)}
							onClose={this.handleOnAddMenuClose}
						>
							{enableGrouping && (
								<MenuItem
									onClick={this.handleOnAddContextClick(
										"group",
										null
									)}
								>
									New Group
								</MenuItem>
							)}
							<MenuItem
								onClick={this.handleOnAddContextClick(
									"field",
									null
								)}
							>
								{" "}
								New Field{" "}
							</MenuItem>
						</Menu>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

DefinationView.propTypes = {

	className: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	onChange: PropTypes.func,
	name: PropTypes.string,
	readOnly: PropTypes.bool,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	helperTexts: PropTypes.object,
	errors: PropTypes.object,
	enableGrouping: PropTypes.bool,
	appendProps: PropTypes.object,
};

DefinationView.defaultProps = {
	value: {},
	name: "",
	readOnly: false,
	disabled: false,
	enableGrouping: true,
	appendProps: { field: [], group: [] },
};

export default (DefinationView);
