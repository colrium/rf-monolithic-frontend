/** @format */

import Box from "@mui/material/Box"
import { CloudUploadOutlined as CloudUploadIcon } from "@mui/icons-material"
import Icon from "@mui/material/Icon"
import { colors } from "assets/jss/app-theme"
import PreviewList from "components/FileDropZone/PreviewList"
import Grid from "@mui/material/Grid"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import FormHelperText from "@mui/material/FormHelperText"
import Typography from "@mui/material/Typography"
import PropTypes from "prop-types"
import React, { memo, useMemo, useCallback, useRef } from "react"
import { useNetworkServices, useNotificationsQueue } from "contexts"
import { useSetState, useDidUpdate, useDidMount, useForwardedRef, useDerivedState, useDeepCompareMemoize } from "hooks"
import { useDropArea } from "react-use"

const DropZone = React.forwardRef((props, ref) => {
	const {
		acceptedFiles,
		activeColor,
		className,
		readOnly,
		disabled,
		dropzoneIcon,
		defaultColor,
		containerStyle,
		helperText,
		error,
		variant,
		label,
		name,
		onChange,
		onDelete,
		onDrop,
		onDropRejected,
		value,
		defaultValue,
		upload,
		filesLimit,
		uploadData,
		maxFileSize,
		required,
		showPreviews,
		dropzoneParagraphClass,
		dropzoneText,
		showFileNamesInPreview,
		showPreviewsInDropzone,
		showFileNames,
		showAlerts,
		onFocus,
		onBlur,
		...rest
	} = props

	const { queueNotification } = useNotificationsQueue()
	const handleOnChange = useCallback(
		(newValue, files) => {
			if (Function.isFunction(onChange)) {
				Promise.all([onChange(newValue)])
			}
		},
		[onChange]
	)
	const isMultiple = useMemo(() => filesLimit > 1, [filesLimit])

	const { Api } = useNetworkServices()
	const inputRef = useForwardedRef(ref)

	const getAttachment = useCallback((attachment, params = { populate: 1 }) => {
		return new Promise((resolve, reject) => {
			Api.get("/attachments/" + (JSON.isJSON(attachment) && "_id" in attachment ? attachment._id : attachment), {
				populate: 1,
				...params,
			})
				.then(res => {
					res?.body?.data ? resolve(res?.body?.data) : reject(res?.body)
				})
				.catch(err => {
					reject(err)
				})
		})
	}, [])

	const [state, setState, getState] = useDerivedState(
		() =>
			new Promise(async (resolve, reject) => {
				let new_value = value
				let attachments = []
				let newFileObjects = []
				if (upload) {
					if (Array.isArray(value)) {
						attachments = value
					} else if (String.isString(value)) {
						if (isMultiple) {
							attachments = [...value]
						} else {
							attachments = [value]
						}
					}

					if (Array.isArray(attachments)) {
						for (var i = 0; i < attachments.length; i++) {
							const attachment = attachments[i]
							await getAttachment(attachments[i])
								.then(resAttachment => {
									newFileObjects = newFileObjects.concat([{ attachment: resAttachment }])
								})
								.catch(err => {
									if (isMultiple) {
										new_value = []
										if (Array.isArray(attachments)) {
											new_value = attachments.filter(entry => {
												return attachment !== entry
											})
										} else {
											new_value = []
										}
									}
								})
						}
					}
					resolve({ fileObjects: newFileObjects, value: new_value, loading: false })
				} else {
					resolve({ fileObjects: [], value: isMultiple ? [] : null, loading: false })
				}
			}),
		[value, upload, isMultiple],
		{ fileObjects: [], value: [], loading: true }
	)

	const showDragDrop = Array.isArray(state.value)
		? state.value.length < filesLimit
		: true &&
		  ((String.isString(state.value) ? state.value.trim().length > 0 && filesLimit === 1 : true) ||
				Array.isArray(state.value) ||
				!state.value)

	const handleFileUploadSuccess = useCallback(
		(fileObject, files, file, upload_res) => {
			var count = 0
			var message = ""
			let { fileObjects } = getState()
			let fileObjectIndex = fileObjects.indexOf(fileObject)
			if (fileObjectIndex !== -1) {
				fileObjects[fileObjectIndex].progress = false
				fileObjects[fileObjectIndex].attachment = upload_res.body.data

				if (isMultiple) {
					let value_arr = []
					if (Array.isArray(fileObjects)) {
						for (let j = 0; j < fileObjects.length; j++) {
							if (fileObjects[j].attachment) {
								value_arr.push(fileObjects[j].attachment._id)
							}
						}
					}
					handleOnChange(value_arr, fileObjects)
				} else {
					handleOnChange(upload_res?.body?.data?._id, fileObjects)
				}

				message += (message.length > 0 ? "<br />" : "") + `File ${file.name} successfully uploaded. `
				count++ //
				if (count === files.length) {
					// display message when the last one fires
					queueNotification({
						content: message,
						severity: "success",
						priority: 1,
						timeout: 3000,
					})
				}
			} else {
				if (isMultiple) {
					let value_arr = []
					if (Array.isArray(fileObjects)) {
						for (let j = 0; j < fileObjects.length; j++) {
							if (fileObjects[j].attachment) {
								value_arr.push(fileObjects[j].attachment._id)
							}
						}
					}
					setState({ fileObjects: fileObjects })
					handleOnChange(value_arr, fileObjects)
				} else {
					setState({ fileObjects: fileObjects })
					handleOnChange(upload_res?.body?.data?._id, fileObjects)
				}
			}
		},
		[isMultiple]
	)

	const handleFileUploadError = useCallback(
		(fileObject, file) => e => {
			var count = 0
			var message = ""
			const { fileObjects, value } = getState()
			let fileObjectIndex = fileObjects.indexOf(fileObject)
			let valueIndex = value.indexOf(fileObject?.attachment?._id)
			queueNotification({
				content: `File ${file.name} upload failed. `,
				severity: "error",
				priority: 1,
				timeout: 3000,
			})
			const nextValue = isMultiple ? (Array.isArray(value) ? value.filter((entry, index) => index !== valueIndex) : []) : null
			const nextFileObjects = isMultiple
				? Array.isArray(fileObjects)
					? fileObjects.filter((entry, index) => index !== fileObjectIndex)
					: []
				: null
			handleOnChange(nextValue, nextFileObjects)
		},
		[isMultiple]
	)

	const handleOnDrop = useCallback(
		files => {
			const { fileObjects } = getState()

			if (fileObjects.length + files.length > filesLimit) {
				queueNotification({
					content: `Maximum allowed number of files exceeded. Only ${filesLimit} allowed`,
					severity: "error",
					timeout: 3000,
				})
			} else {
				var count = 0
				var message = ""
				files.forEach(file => {
					const reader = new FileReader()
					reader.onload = event => {
						let prevFileObjects = fileObjects
						prevFileObjects = Array.isArray(prevFileObjects) ? prevFileObjects : []
						let should_act = true
						for (let i = 0; i < prevFileObjects.length; i++) {
							if (Object.is(file, prevFileObjects[i].file)) {
								should_act = false
								break
							}
						}

						if (should_act) {
							let fileObject = {
								file: file,
								data: event.target.result,
								progress: upload ? true : false,
							}
							if (onDrop) {
								onDrop(file)
							}
							setState({ fileObjects: prevFileObjects.concat([fileObject]) })
							if (upload && typeof fileObject.attachment !== "object") {
								const upload_data = new FormData()

								if (uploadData) {
									if (typeof uploadData === "object") {
										for (let [upload_data_key, upload_data_value] of Object.entries(uploadData)) {
											upload_data.append(upload_data_key, upload_data_value)
										}
									}
								}
								upload_data.append("attachment_file", file)
								Api.post("/attachments/upload", upload_data, {})
									.then(upload_res => handleFileUploadSuccess(fileObject, files, file, upload_res))
									.catch(handleFileUploadError(fileObject, file))
							} else {
								if (onChange) {
									handleOnChange(files)
								}
								message += `File ${file.name} successfully added. `
								count++ //
								if (count === files.length) {
									// display message when the last one fires
									queueNotification({
										content: message,
										severity: "success",
										priority: 1,
										timeout: 3000,
									})
								}
							}
						}
					}
					reader.readAsDataURL(file)
				})
			}
		},
		[filesLimit, upload, uploadData, onDrop]
	)

	const handleRemove = useCallback(
		fileIndex => event => {
			event.stopPropagation()

			const { fileObjects, value: stateValue } = getState()
			const fileObject = fileObjects.filter((file_object, i) => {
				return i === fileIndex
			})[0]

			if (fileObject.attachment) {
				let newfileObjects = []
				let newValue = []
				if (isMultiple) {
					newValue = []
				}
				if (Array.isArray(fileObjects)) {
					newfileObjects = fileObjects.removeAtIndex(fileIndex)
					if (!Array.isArray(newfileObjects)) {
						newfileObjects = []
					}
					if (isMultiple) {
						newValue = stateValue.removeAtIndex(fileIndex)
						if (!Array.isArray(newValue)) {
							newValue = []
						}
					} else {
						newValue = null
					}
				}
				queueNotification({
					content: `Attached file ${fileObject.attachment.name}  deleted`,
					severity: "warning",
					priority: 1,
					timeout: 3000,
				})
				handleOnChange(newValue, newfileObjects)
				Api.delete("/attachments/" + fileObject.attachment._id).catch(err => {})
			}
		},
		[isMultiple, onDelete]
	)

	const handleDropRejected = useCallback(
		(rejectedFiles, evt) => {
			var message = ""
			rejectedFiles.forEach(rejectedFile => {
				message = `File ${rejectedFile.name} was rejected. `
				if (!acceptedFiles.includes(rejectedFile.type)) {
					message += "File type not supported. "
				}
				if (rejectedFile.size > maxFileSize) {
					message += "File is too big. Size limit is " + maxFileSize + " bytes. "
				}
			})
			if (onDropRejected) {
				onDropRejected(rejectedFiles, evt)
			}
			queueNotification({
				content: message,
				severity: "error",
				priority: 1,
				timeout: 3000,
			})
		},
		[onDropRejected, acceptedFiles, maxFileSize]
	)

	const handleOnFocus = useCallback(
		(event, triggerClick = true) => {
			if (triggerClick && !!inputRef?.current) {
				inputRef.current.click()
			}
			if (Function.isFunction(onFocus)) {
				onFocus(event)
			}
		},
		[onFocus]
	)

	const handleOnBlur = useCallback(
		Function.debounce(event => {
			if (Function.isFunction(onBlur)) {
				onBlur(event)
			}
		}, 350),
		[onBlur]
	)

	const handleOnInputChange = useCallback(
		Function.debounce(event => {
			const fileList = event.target?.files || []
			if (fileList.length > 0) {
				let filesArray = []
				for (let i = 0; i < fileList.length; i++) {
					filesArray.push(fileList[i])
				}

				handleOnDrop(filesArray)
				event.target.value = ""
			}
		}, 350),
		[]
	)

	const [dropAreaBond, dropAreaState] = useDropArea({
		onFiles: handleOnDrop,
		onUri: uri => {},
		onText: text => {},
	})

	useDidUpdate(() => {
		if (dropAreaState?.over) {
			handleOnFocus(null, false)
		} else {
			handleOnBlur()
		}
	}, [dropAreaState.over])

	return (
		<ClickAwayListener onClickAway={handleOnBlur}>
			<Box className={`${className ? className : ""} cursor-pointer min-h-20 `}>
				{state.fileObjects?.length < filesLimit && (
					<Grid
						container
						className={"h-full w-full p-0 px-4 py-2"}
						{...dropAreaBond}
						onClick={event => handleOnFocus(event, true)}
					>
						<Grid item xs={12}>
							{showDragDrop && (
								<Grid container direction="column" justify="center" alignItems="center">
									<Typography
										className={"m-4 text-8xl"}
										color={dropAreaState?.over ? "primary" : "text.secondary"}
										fullWidth
										paragraph
									>
										{String.isString(dropzoneIcon) && <Icon> {dropzoneIcon} </Icon>}
										{React.isValidElement(dropzoneIcon) && dropzoneIcon}
									</Typography>

									<FormHelperText> {dropzoneText} </FormHelperText>
								</Grid>
							)}
						</Grid>
						<input
							{...rest}
							onChange={handleOnInputChange}
							type="file"
							accept={acceptedFiles.join(",")}
							className="hidden"
							ref={inputRef}
						/>
					</Grid>
				)}
				{showPreviews && state.fileObjects?.length > 0 && (
					<PreviewList
						className="p-0"
						fileObjects={state.fileObjects}
						handleRemove={handleRemove}
						showFileNames={showFileNamesInPreview}
						disabled={disabled}
						title={label}
					/>
				)}
				{/* <FormHelperText error={Boolean(error)}> {helperText} </FormHelperText> */}
			</Box>
		</ClickAwayListener>
	)
})

DropZone.defaultProps = {
	acceptedFiles: ["image/*", "video/*", "audio/*", "application/*"],
	variant: "filled",
	filesLimit: 3,
	type: "text",
	maxFileSize: 3000000,
	readOnly: false,
	disabled: false,
	dropzoneText: "Click to select file \n or \n Drag and drop a file here",
	dropzoneIcon: <CloudUploadIcon fontSize="inherit" />,
	showPreviews: true,
	showPreviewsInDropzone: false,
	showFileNamesInPreview: true,
	showAlerts: true,
	upload: true,
	uploadData: {},
	defaultColor: "grey",
	activeColor: "primarydark",
	onChange: () => {},
	onDrop: () => {},
	onDropRejected: () => {},
	onDelete: () => {},
}
DropZone.propTypes = {
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
	onChange: PropTypes.func,
	onDrop: PropTypes.func,
	onDropRejected: PropTypes.func,
	onDelete: PropTypes.func,
}
export default memo(DropZone)
