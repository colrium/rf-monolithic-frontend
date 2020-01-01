import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import { CloudUploadOutlined as CloudUploadIcon } from "@material-ui/icons";
import Icon from '@material-ui/core/Icon';
import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
import PreviewList from "components/FileDropZone/PreviewList";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import Typography from "components/Typography";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { attachments as AttachmentsService } from "services";
import { UtilitiesHelper } from "utils/Helpers";
import withRoot from "utils/withRoot";
import styles from "./styles";

function setNativeValue(element, value) {
	const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
	const prototype = Object.getPrototypeOf(element);
	const prototypeValueSetter = Object.getOwnPropertyDescriptor(
		prototype,
		"value"
	).set;

	if (valueSetter && valueSetter !== prototypeValueSetter) {
		prototypeValueSetter.call(element, value);
	} else {
		valueSetter.call(element, value);
	}
}

class FileDropZone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fileObjects: []
		};
		this.handleRemove = this.handleRemove.bind(this);
	}

	getSnapshotBeforeUpdate(prevProps) {
		return {
			reloadRequired: !Object.areEqual(prevProps, this.props),
			reloadValueRequired: !Object.areEqual(prevProps.value, this.props.value)
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot.reloadValueRequired) {
			this.loadInputState();
		}
	}

	componentDidMount() {
		this.loadInputState();
	}

	loadInputState() {
		const {
			value,
			label,
			dropzoneText,
			defaultColor,
			activeColor,
			error,
			helperText,
			filesLimit
		} = this.props;

		let isMultiple = filesLimit > 1;
		let new_value = value;
		if (String.isString(value) && isMultiple) {
			try {
				new_value = JSON.parse(value);
			} catch (e) {
				new_value = [];
			}
		}
		let prevState = this.state;
		this.setState(
			{
				...this.props,
				...prevState,
				dropzoneText: dropzoneText,
				label: label,
				value: new_value ? new_value : (isMultiple? [] : null),
				isMultiple: isMultiple,
				helperText: helperText,
				error: error,
				defaultColor: defaultColor,
				activeColor: activeColor
			},
			() => {
				this.getAttachments();
			}
		);
	}

	getAttachments() {
		let { upload } = this.props;
		let attachments = [];
		if (this.state.value && upload) {
			if (this.state.isMultiple) {
				attachments = this.state.value;
			} else {
				attachments = [this.state.value];
			}
			let newFileObjects = [];
			if (Array.isArray(this.state.fileObjects)) {
				newFileObjects = this.state.fileObjects.map((fileObject, index) => {
					if (fileObject.attachment) {
						if (fileObject.progress) {
							return fileObject;
						} else if (
							fileObject.attachment._id != undefined &&
							attachments.includes(fileObject.attachment._id)
						) {
							attachments.removeItem(fileObject.attachment._id);
							return fileObject;
						}
					} else if (fileObject.progress) {
						return fileObject;
					}
				});
			}
			if (Array.isArray(attachments)) {
				for (var i = 0; i < attachments.length; i++) {
					const attachment = attachments[i];
					if (String.isString(attachments[i])) {
						
						AttachmentsService.getRecordById(attachments[i], { p: 1 })
							.then(res => {
								newFileObjects = newFileObjects.concat([
									{ attachment: res.body.data }
								]);
								this.setState(state => ({ fileObjects: newFileObjects }));
							})
							.catch(e => {
								let new_value = null;
								if (this.state.isMultiple) {
									new_value = [];
									if (Array.isArray(attachments)) {
										new_value = attachments.filter(function(entry){
											return attachment !== entry;
										});
									}
									else{
										new_value = [];
									}
								}
								
								this.setState({ fileObjects: newFileObjects, value: new_value }, () => this.triggerOnChange(new_value));
							});
					}
				}
			}
		}
	}

	triggerOnChange(value) {
		const { onChange } = this.props;
		if (onChange) {
			onChange(value);
		}
	}

	onDrop(files) {
		const _this = this;
		if (this.state.fileObjects.length + files.length > this.props.filesLimit) {
			this.setState({
				openSnackBar: true,
				snackbarMessage: `Maximum allowed number of files exceeded. Only ${this.props.filesLimit} allowed`,
				snackbarColor: "error"
			});
		} else {
			var count = 0;
			var message = "";
			files.forEach(file => {
				const reader = new FileReader();
				reader.onload = event => {
					let prevFileObjects = _this.state.fileObjects;
					prevFileObjects = Array.isArray(prevFileObjects)
						? prevFileObjects
						: [];
					let should_act = true;
					for (let i = 0; i < prevFileObjects.length; i++) {
						if (Object.is(file, prevFileObjects[i].file)) {
							should_act = false;

							break;
						}
					}

					if (should_act) {
						let fileObject = {
							file: file,
							data: event.target.result,
							progress: _this.props.upload ? true : false
						};
						_this.setState(
							{ fileObjects: prevFileObjects.concat([fileObject]) },
							() => {
								if (this.props.onDrop) {
									this.props.onDrop(file);
								}

								if (
									this.props.upload &&
									typeof fileObject.attachment !== "object"
								) {
									const upload_data = new FormData();

									if (_this.props.uploadData) {
										if (
											UtilitiesHelper.isOfType(_this.props.uploadData, "object")
										) {
											for (let [
												upload_data_key,
												upload_data_value
											] of Object.entries(_this.props.uploadData)) {
												upload_data.append(upload_data_key, upload_data_value);
											}
										}
									}

									upload_data.append("attachment_file", file);

									AttachmentsService.upload(upload_data, {})
										.then(upload_res => {
											let fileObjects = _this.state.fileObjects;
											let fileObjectIndex = fileObjects.indexOf(fileObject);
											if (fileObjectIndex !== -1) {
												fileObjects[fileObjectIndex].progress = false;
												fileObjects[fileObjectIndex].attachment =
													upload_res.body.data;
												fileObjects = fileObjects;

												_this.setState(state => ({ fileObjects: fileObjects }));

												if (this.state.isMultiple) {
													let value_arr = [];
													if (Array.isArray(fileObjects)) {
														for (let j = 0; j < fileObjects.length; j++) {
															if (fileObjects[j].attachment) {
																value_arr.push(fileObjects[j].attachment._id);
															}
														}
													}
													_this.setState({ value: value_arr });
													if (this.props.onChange) {
														this.props.onChange(value_arr);
													}
												} else {
													_this.setState({ value: upload_res.body.data._id });
													if (this.props.onChange) {
														this.props.onChange(upload_res.body.data._id);
													}
												}

												message +=
													(message.length > 0 ? "<br />" : "") +
													`File ${file.name} successfully uploaded. `;
												count++; // we cannot rely on the index because this is asynchronous
												if (count === files.length) {
													// display message when the last one fires
													this.setState({
														openSnackBar: true,
														snackbarMessage: message,
														snackbarColor: "inverse"
													});
												}
											}
										})
										.catch(e => {
											let fileObjectIndex = _this.state.fileObjects.indexOf(
												fileObject
											);

											this.setState(prevState => ({
												fileObjects: prevState.fileObjects.remove(
													fileObjectIndex
												),
												openSnackBar: true,
												snackbarMessage: `File ${file.name} upload failed. `,
												snackbarColor: "error"
											}));
										});
								} else {
									if (this.props.onChange) {
										this.props.onChange(
											_this.state.fileObjects.map(fileObject => fileObject.file)
										);
									}
									message += `File ${file.name} successfully added. `;
									count++; // we cannot rely on the index because this is asynchronous
									if (count === files.length) {
										// display message when the last one fires
										this.setState({
											openSnackBar: true,
											snackbarMessage: message,
											snackbarColor: "inverse"
										});
									}
								}
							}
						);
					}
				};
				reader.readAsDataURL(file);
			});
		}
	}
	handleRemove = fileIndex => event => {
		event.stopPropagation();

		let fileObjects = this.state.fileObjects;
		const fileObject = fileObjects.filter((file_object, i) => {
			return i === fileIndex;
		})[0];

		if (fileObject.attachment) {
			fileObjects[fileIndex].progress = true;
			this.setState({ fileObjects: fileObjects });
			AttachmentsService.delete(fileObject.attachment._id)
				.then(res => {
					let newfileObjects = [];
					let newValue = [];
					if (this.state.isMultiple) {
						newValue = [];
					}
					if (Array.isArray(fileObjects)) {
						newfileObjects = fileObjects.removeAtIndex(fileIndex);
						if (!Array.isArray(newfileObjects)) {
							newfileObjects = [];
						}
						if (this.state.isMultiple) {
							newValue = this.state.value.removeAtIndex(fileIndex);
							if (!Array.isArray(newValue)) {
								newValue = [];
							}
						}
						else{
							newValue = null;
						}
					} 
					
					this.triggerOnChange(newValue);
					
					this.setState({
						fileObjects: newfileObjects, 
						value: newValue, 
						openSnackBar: true,
						snackbarMessage: "Attached file " + fileObject.attachment.name + " deleted",
						snackbarColor: "info" });
				})
				.catch(err => {
					console.log("err", err);
					/* if (err.code === 404) {
						fileObjects.remove(fileIndex);
						fileObjects = fileObjects;
						this.setState({ fileObjects: fileObjects }, () => {
							if (this.props.onDelete) {
								this.props.onDelete(fileObject);
							}
							if (this.state.isMultiple && this.props.upload) {
								let value_arr = [];

								if (Array.isArray(fileObjects)) {
									for (let j = 0; j < fileObjects.length; j++) {
										if (fileObjects[j].attachment) {
											value_arr.push(fileObjects[j].attachment._id);
										}
									}
								}
								this.setState({ value: value_arr });

								if (this.props.onChange) {
									this.props.onChange(value_arr);
								}
							} else {								
								if (this.props.onChange) {
									this.props.onChange(null);
								}
								this.setState({ value: null });
							}
							this.setState({
								openSnackBar: true,
								snackbarMessage: "File " + fileObject.file.name + " removed",
								snackbarColor: "inverse"
							});
						});
					} */
				});
		} else {
			fileObjects.remove(fileIndex);
			fileObjects = fileObjects;
			this.setState({ fileObjects: fileObjects }, () => {
				if (this.props.onDelete) {
					this.props.onDelete(fileObject);
				}
				if (this.props.onChange) {
					this.props.onChange(this.state.fileObjects);
				}
				this.setState({
					openSnackBar: true,
					snackbarMessage: "File " + fileObject.file.name + " removed",
					snackbarColor: "inverse"
				});
			});
		}
	};

	handleDropRejected(rejectedFiles, evt) {
		var message = "";
		rejectedFiles.forEach(rejectedFile => {
			message = `File ${rejectedFile.name} was rejected. `;
			if (!this.props.acceptedFiles.includes(rejectedFile.type)) {
				message += "File type not supported. ";
			}
			if (rejectedFile.size > this.props.maxFileSize) {
				message +=
					"File is too big. Size limit is " +
					UtilitiesHelper.convertBytesToMbsOrKbs(this.props.maxFileSize) +
					". ";
			}
		});
		if (this.props.onDropRejected) {
			this.props.onDropRejected(rejectedFiles, evt);
		}
		this.setState({
			openSnackBar: true,
			snackbarMessage: message,
			snackbarColor: "error"
		});
	}
	onCloseSnackbar = () => {
		this.setState({
			openSnackBar: false
		});
	};
	render() {
		const { classes, className, readOnly, disabled, dropzoneIcon } = this.props;
		const showPreviews = this.props.showPreviews && this.state.fileObjects.length > 0;
		const showPreviewsInDropzone = this.props.showPreviewsInDropzone && this.state.fileObjects.length > 0;
		const showDragDrop = Array.isArray(this.state.value)? (this.state.value.length < this.props.filesLimit) : (this.props.filesLimit === 1 && (( String.isString(this.state.value) ? this.state.value.trim().length > 0 : false ) || JSON.isJSON(this.state.value)) ? false : true) ;
		return (
			<Box>
				{!showDragDrop && this.state.label && <GridContainer className={classes.labelContainer}>
					<Typography
						variant="body1"
						color={this.props.defaultColor }
					>
						{this.state.label + (this.props.required? "*" : "")}
					</Typography>
				</GridContainer>}
				{showDragDrop && <Dropzone
					accept={this.props.acceptedFiles.join(",")}
					onDrop={this.onDrop.bind(this)}
					onDropRejected={this.handleDropRejected.bind(this)}
					acceptClassName={classes.stripes}
					rejectClassName={classes.rejectStripes}
					maxSize={this.props.maxFileSize}
				>
					{({ getRootProps, getInputProps, isDragActive, inputRef }) => {
						//let { getRootProps, getInputProps, isDragActive, inputRef } = dropZoneParams
						this.fileInputElement = inputRef.current;
						return (
							<GridContainer className={classes.dropZoneContainer}>
								{ this.state.label &&  <GridContainer className={classes.labelContainer}>
										<Typography
											variant="body1"
											color={
												isDragActive
													? this.props.activeColor
													: this.props.defaultColor
											}
										>
										{this.state.label + (this.props.required ? "*" : "")}
										</Typography>
									</GridContainer> }

								<div
									{...getRootProps()}
									className={classes.dropZone}
									style={{
										border:
											"1px " +
											(isDragActive
												? "solid " + colors.hex[this.state.activeColor]
												: "dashed " + colors.hex[this.state.defaultColor])
									}}
								>
									<GridContainer
										direction="row"
										justify="center"
										alignItems="center"
										className={classes.dropZoneInner}
									>
										<GridItem xs={12}>
											<GridContainer
												direction="column"
												justify="center"
												alignItems="center"
											>
												{ !readOnly && !disabled &&  <input {...getInputProps()} /> }
												<GridContainer className={classes.dropzoneTextStyle}>
													<Typography
														className={classes.uploadIcon}
														color={
															isDragActive
																? this.state.activeColor
																: this.state.defaultColor
														}
														fullWidth
														center
														paragraph
													>
														{String.isString(dropzoneIcon) && <Icon>{ dropzoneIcon }</Icon> }
														{ React.isValidElement(dropzoneIcon) && dropzoneIcon } 
													</Typography>

													<Typography
														variant="body2"
														color={
															isDragActive
																? this.state.activeColor
																: this.state.defaultColor
														}
														className={classNames(
															classes.dropzoneParagraph,
															this.props.dropzoneParagraphClass
														)}
														fullWidth
														center
														paragraph
													>
														{this.props.dropzoneText}
													</Typography>
												</GridContainer>
											</GridContainer>

											{/* <GridContainer>
													{showPreviewsInDropzone && (
														<PreviewList
															fileObjects={this.state.fileObjects}
															handleRemove={this.handleRemove}
															showFileNames={this.props.showFileNames}
															title={this.props.label}
														/>
													)}
												</GridContainer> */}
											
										</GridItem>
									</GridContainer>
								</div>

								{this.props.helperText && (
									<GridContainer>
										<Typography
											variant="body2"
											color={ this.props.error ? "error" : this.props.defaultColor }
										>
											{this.props.helperText}
										</Typography>
									</GridContainer>
								)}
							</GridContainer>
						);
					}}
				</Dropzone> }
				{showPreviews && !disabled && (
					<GridContainer className="p-0">
							<PreviewList
								className="p-0"
								fileObjects={this.state.fileObjects}
								handleRemove={this.handleRemove}
								showFileNames={this.props.showFileNamesInPreview}
								title={this.props.label}
							/>
					</GridContainer>
				)}
				{this.props.showAlerts && (
					<Snackbar
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "right"
						}}
						open={this.state.openSnackBar}
						autoHideDuration={6000}
						onClose={this.onCloseSnackbar}
					>
						<SnackbarContent
							onClose={this.onCloseSnackbar}
							color={this.state.snackbarColor}
							message={this.state.snackbarMessage}
						/>
					</Snackbar>
				)}
			</Box>
		);
	}
}

FileDropZone.defaultProps = {
	acceptedFiles: ["image/*", "video/*", "audio/*", "application/*"],
	filesLimit: 3,
	type: "text",
	maxFileSize: 3000000,
	readOnly: false,
	disabled: false,
	dropzoneText: "Click to select file \n or \n Drag and drop a file here",
	dropzoneIcon: <CloudUploadIcon />,
	showPreviews: true,
	showPreviewsInDropzone: false,
	showFileNamesInPreview: true,
	showAlerts: true,
	upload: true,
	uploadData: {},
	defaultColor: "grey",
	activeColor: "primarydark",
	clearOnUnmount: true,
	onChange: () => { },
	onDrop: () => { },
	onDropRejected: () => { },
	onDelete: () => { }
};
FileDropZone.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	type: PropTypes.string,
	name: PropTypes.string,
	label: PropTypes.string,
	readOnly: PropTypes.bool,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	error: PropTypes.bool,
	helperText: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	upload: PropTypes.bool,
	uploadData: PropTypes.object,
	defaultColor: PropTypes.oneOf(colors.names),
	activeColor: PropTypes.oneOf(colors.names),
	acceptedFiles: PropTypes.array,
	filesLimit: PropTypes.number,
	maxFileSize: PropTypes.number,
	dropzoneText: PropTypes.string,
	dropzoneIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	showPreviews: PropTypes.bool,
	showPreviewsInDropzone: PropTypes.bool,
	showFileNamesInPreview: PropTypes.bool,
	showAlerts: PropTypes.bool,
	clearOnUnmount: PropTypes.bool,
	onChange: PropTypes.func,
	onDrop: PropTypes.func,
	onDropRejected: PropTypes.func,
	onDelete: PropTypes.func
};
export default withRoot(withStyles(styles)(FileDropZone));
