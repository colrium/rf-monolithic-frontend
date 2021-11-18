import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { CloudUploadOutlined as CloudUploadIcon } from "@mui/icons-material";
import Icon from "@mui/material/Icon";
import Alert from '@mui/material/Alert';
import { colors } from "assets/jss/app-theme";
import PreviewList from "components/FileDropZone/PreviewList";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from "components/Typography";
import PropTypes from "prop-types";
import React, { memo, useMemo, useCallback, useRef } from "react";

import ApiService from "services/Api";
import { useSetState, useDidUpdate, useDidMount } from "hooks";
import {useDropArea} from 'react-use';


const MuiAlert = React.forwardRef((props, ref) => {
    return <Alert elevation = { 6 }
    variant = "filled" {...props }
    ref = { ref }
    />;
});

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
        onChange,
        onDelete,
        onDrop,
        onDropRejected,
        value,
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
    } = props;

    const [state, setState, getState] = useSetState({
        fileObjects: [],
    });

    const isMultiple = useMemo(() => filesLimit > 1, [filesLimit]);
    const showDragDrop = Array.isArray(state.value) ? state.value.length < filesLimit : filesLimit === 1 && ((String.isString(state.value) ? state.value.trim().length > 0 : false) || JSON.isJSON(state.value));

	const fileInputRef = useRef(null);

    const getAttachment = useCallback((attachment, params = { populate: 1 }) => {
        return new Promise((resolve, reject) => {
            ApiService.get(("/attachments/" + (JSON.isJSON(attachment) && "_id" in attachment ? attachment._id : attachment)), { populate: 1, ...params }).then(res => {
                res?.body?.data ? resolve(res?.body?.data) : reject(res?.body);
            }).catch(err => {
                reject(err)
            });
        });
    }, [])

    const getAttachments = useCallback(() => {
        return new Promise(async(resolve, reject) => {
            const { fileObjects } = getState();
            let new_value = value;
            let attachments = [];
            let newFileObjects = [];
            if (value && upload) {
                if (isMultiple) {
                    attachments = [...value];
                } else {
                    attachments = [value];
                }

                if (Array.isArray(fileObjects)) {
                    newFileObjects = fileObjects.map((fileObject, index) => {
                        if (fileObject.attachment) {
                            if (fileObject.progress) {
                                return fileObject;
                            } else if (fileObject.attachment._id != undefined && attachments.includes(fileObject.attachment._id)) {
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
                        await getAttachment(attachments[i]).then(resAttachment => {
                            newFileObjects = newFileObjects.concat([{ attachment: resAttachment }]);
                        }).catch(err => {
                            
                            if (isMultiple) {
                                new_value = [];
                                if (Array.isArray(attachments)) {
                                    new_value = attachments.filter((entry) => {
                                        return attachment !== entry;
                                    });
                                } else {
                                    new_value = [];
                                }
                            }
                        });

                    }
                }
                resolve({ fileObjects: newFileObjects, value: new_value, })
            }
        })

    }, [value, upload, isMultiple]);

    const handleFileUploadSuccess = useCallback((fileObject, files, file, upload_res) => {
        var count = 0;
        var message = "";
        let { fileObjects } = getState();
        let fileObjectIndex = fileObjects.indexOf(fileObject);
        if (fileObjectIndex !== -1) {
            fileObjects[fileObjectIndex].progress = false;
            fileObjects[fileObjectIndex].attachment = upload_res.body.data;

            if (isMultiple) {
                let value_arr = [];
                if (Array.isArray(fileObjects)) {
                    for (let j = 0; j < fileObjects.length; j++) {
                        if (fileObjects[j].attachment) {
                            value_arr.push(fileObjects[j].attachment._id);
                        }
                    }
                }
                setState({
                    fileObjects: fileObjects,
                    value: value_arr,
                });
            } else {
                setState({
                    value: upload_res.body.data._id,
                    fileObjects: fileObjects,
                });

            }

            message += (message.length > 0 ? "<br />" : "") + `File ${file.name} successfully uploaded. `;
            count++; // 
            if (count === files.length) {
                // display message when the last one fires
                // setState({
                // 	openSnackBar: true,
                // 	snackbarMessage: message,
                // 	snackbarColor:
                // 		"inverse",
                // });
            }
        }
    }, [isMultiple]);

    const handleFileUploadError = useCallback((fileObject, file) => (e) => {
        var count = 0;
        var message = "";
        const { fileObjects } = getState();
        let fileObjectIndex = fileObjects.indexOf(fileObject);

        

        setState(prevState => ({
            fileObjects: prevState.fileObjects.remove(fileObjectIndex),
            openSnackBar: true,
            snackbarMessage: `File ${file.name} upload failed. `,
            snackbarColor: "error",
        }));
    }, []);

    const handleOnDrop = useCallback((files) => {
        const { fileObjects } = getState();

        if (fileObjects.length + files.length > filesLimit) {
            setState({
                openSnackBar: true,
                snackbarMessage: `Maximum allowed number of files exceeded. Only ${filesLimit} allowed`,
                snackbarColor: "error",
            });
        } else {
            var count = 0;
            var message = "";
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = event => {
                    let prevFileObjects = fileObjects;
                    prevFileObjects = Array.isArray(prevFileObjects) ? prevFileObjects : [];
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
                            progress: upload ? true : false,
                        };
                        setState({ fileObjects: prevFileObjects.concat([fileObject]) });
                        if (onDrop) {
                            onDrop(file);
                        }

                        if (upload && typeof fileObject.attachment !== "object") {
                            const upload_data = new FormData();

                            if (uploadData) {
                                if (typeof uploadData === "object") {
                                    for (let [upload_data_key, upload_data_value, ] of Object.entries(uploadData)) {
                                        upload_data.append(
                                            upload_data_key,
                                            upload_data_value
                                        );
                                    }
                                }
                            }

                            upload_data.append("attachment_file", file);
                            ApiService.post("/attachments/upload", upload_data, {}).then(upload_res => handleFileUploadSuccess(fileObject, files, file, upload_res)).catch(handleFileUploadError(fileObject, file));
                        } else {
                            if (onChange) {
                                onChange(files);
                            }
                            message += `File ${file.name} successfully added. `;
                            count++; //
                            if (count === files.length) {
                                // display message when the last one fires
                                setState({
                                    openSnackBar: true,
                                    snackbarMessage: message,
                                    snackbarColor: "inverse",
                                });
                            }
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    }, [filesLimit, upload, uploadData, onDrop]);

    const handleRemove = useCallback(fileIndex => event => {
        event.stopPropagation();

        const { fileObjects, value: stateValue } = getState();
        const fileObject = fileObjects.filter((file_object, i) => {
            return i === fileIndex;
        })[0];

        if (fileObject.attachment) {
            //fileObjects[fileIndex].progress = true;
            //setState({ fileObjects: fileObjects });
            let newfileObjects = [];
            let newValue = [];
            if (isMultiple) {
                newValue = [];
            }
            if (Array.isArray(fileObjects)) {
                newfileObjects = fileObjects.removeAtIndex(fileIndex);
                if (!Array.isArray(newfileObjects)) {
                    newfileObjects = [];
                }
                if (isMultiple) {
                    newValue = stateValue.removeAtIndex(fileIndex);
                    if (!Array.isArray(newValue)) {
                        newValue = [];
                    }
                } else {
                    newValue = null;
                }
            }

            setState({
                fileObjects: newfileObjects,
                value: newValue,
                openSnackBar: true,
                snackbarMessage: "Attached file " + fileObject.attachment.name + " deleted",
                snackbarColor: "secondary",
            });
            ApiService.delete(("/attachments/" + fileObject.attachment._id)).catch(err => {});
        } else {
            setState(prevState => ({ fileObjects: prevState.fileObjects.remove(fileIndex) }));
        }
    }, [isMultiple, onDelete]);

    const handleDropRejected = useCallback((rejectedFiles, evt) => {
        var message = "";
        rejectedFiles.forEach(rejectedFile => {
            message = `File ${rejectedFile.name} was rejected. `;
            if (!acceptedFiles.includes(rejectedFile.type)) {
                message += "File type not supported. ";
            }
            if (rejectedFile.size > maxFileSize) {
                message += "File is too big. Size limit is " + maxFileSize + " bytes. ";
            }
        });
        if (onDropRejected) {
            onDropRejected(rejectedFiles, evt);
        }
        setState({
            openSnackBar: true,
            snackbarMessage: message,
            snackbarColor: "error",
        });
    }, [onDropRejected, acceptedFiles, maxFileSize])

    const onCloseSnackbar = useCallback(() => {
        setState({
            openSnackBar: false,
        });
    }, []);

    const triggerOnChange = useCallback((newValue) => {
        if (Function.isFunction(onChange)) {
            Promise.all([onChange(newValue)]).then(result => {
                //
            }).catch(error => {
                
            });
        }
	}, [onChange]);
	
	const handleOnFocus = useCallback((triggerClick=true) => {
		if (triggerClick && !!fileInputRef.current) {
			fileInputRef.current.click()
        }
        onFocus();
	}, [onFocus]);
	
	const handleOnBlur = useCallback(Function.debounce((event) => {
		if (Function.isFunction(onBlur)) {
			onBlur(event);
        }
    }, 350), [onBlur]);

    const handleOnInputChange = useCallback(Function.debounce((event) => {
        
        const fileList = event.target?.files || [];
        if (fileList.length > 0) {
            let filesArray = [];
            for (let i = 0; i < fileList.length; i++) {
                filesArray.push(fileList[i]);
            }
            
            handleOnDrop(filesArray);
            event.target.value = "";
        }
        
    }, 350), []);

    useDidUpdate(() => {
        triggerOnChange(state.value);
    }, [state.value])

    useDidMount(() => {
        getAttachments().then(res => {
            setState(res)
        }).catch({

        })
	}, [])
	
	const [dropAreaBond, dropAreaState] = useDropArea({
    	onFiles: handleOnDrop,
    	onUri: uri => console.log('dropArea uri', uri),
    	onText: text => console.log('dropArea text', text),
    });
    
    useDidUpdate(() => {
        if (dropAreaState?.over) {
            handleOnFocus(false);
        }
        else {
            handleOnBlur();
        }
    }, [dropAreaState.over]);


	
    return (
        <ClickAwayListener onClickAway={handleOnBlur}>
            <Box
                className={`${className ? className : ""}`}
                {...dropAreaBond}
                onClick={handleOnFocus}
            >
			<GridContainer className = { "h-full w-full p-0 px-4 py-2" } >

				<GridItem xs={12} >
					{ showDragDrop && <GridContainer
                    	direction="column"
                    	justify="center"
                    	alignItems="center"
                    >
                    <Typography
                    	className={ "m-4 text-8xl" }
                    	color = { dropAreaState?.over? "primary" : "text.secondary" }
                    	fullWidth
						paragraph
					>
							{String.isString(dropzoneIcon) && (<Icon > {dropzoneIcon} </Icon>)}
							{React.isValidElement(dropzoneIcon) && dropzoneIcon}
					</Typography>

                    <FormHelperText > { dropzoneText } </FormHelperText>

                    </GridContainer>}

					{showPreviews && (
						<PreviewList className="p-0"
                            fileObjects = { state.fileObjects }
                            handleRemove = { handleRemove }
                            showFileNames = { showFileNamesInPreview }
                            disabled = { disabled }
                            title = { label }
                        />
                    )}
				</GridItem>
                    <input {...rest} onChange={handleOnInputChange} type="file" className="hidden" ref={fileInputRef}/>
            </GridContainer>

			{/* <FormHelperText error={Boolean(error)}> {helperText} </FormHelperText> */}
			{showAlerts && (
				<Snackbar
					anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    open = { state.openSnackBar }
                    autoHideDuration = { 6000 }
					onClose={onCloseSnackbar}
				>
					<MuiAlert
						onClose={onCloseSnackbar}
                        color = { state.snackbarColor || "secondary" }
						sx={{ width: '100%' }}
					>
						{state.snackbarMessage || ""} </MuiAlert>
                </Snackbar>
            )}
                
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
    dropzoneIcon: < CloudUploadIcon / > ,
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
};
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
};
export default (memo(DropZone));