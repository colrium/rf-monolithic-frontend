

import { CloudUploadOutlined as CloudUploadIcon } from "@mui/icons-material";
import { colors } from "assets/jss/app-theme";
import PropTypes from "prop-types";
import React, { memo, useMemo, useCallback, useEffect } from "react";
import Dropzone from "./DropZone";
import TextField from '@mui/material/TextField';



const FileDropZone = React.forwardRef((props, ref) => {
	const {
		className,
		readOnly,
		disabled,
		helperText,
		error,
		variant,
		label,
		required,
		...rest
	} = props;

	//

	return (
		<TextField
			InputProps={{
				inputComponent: Dropzone,
				inputProps: {
					...rest,
				},
			}}
			className={`${className ? className : ""} cursor-pointer`}
			variant={variant}
			readOnly={readOnly}
			disabled={disabled}
			helperText={helperText}
			error={error}
			label={label}
			required={required}
			fullWidth
			multiline
			inputRef={ref}
		/>
	)
})


FileDropZone.defaultProps = {
	acceptedFiles: ["image/*", "video/*", "audio/*", "application/*"],
	variant: "filled",
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
	onDelete: () => { },
};
// FileDropZone.propTypes = {

// 	className: PropTypes.string,
// 	type: PropTypes.string,
// 	name: PropTypes.string,
// 	label: PropTypes.string,
// 	readOnly: PropTypes.bool,
// 	required: PropTypes.bool,
// 	disabled: PropTypes.bool,
// 	error: PropTypes.bool,
// 	helperText: PropTypes.string,
// 	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
// 	upload: PropTypes.bool,
// 	uploadData: PropTypes.object,
// 	defaultColor: PropTypes.oneOf(colors.names),
// 	activeColor: PropTypes.oneOf(colors.names),
// 	acceptedFiles: PropTypes.array,
// 	filesLimit: PropTypes.number,
// 	maxFileSize: PropTypes.number,
// 	dropzoneText: PropTypes.string,
// 	dropzoneIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
// 	showPreviews: PropTypes.bool,
// 	showPreviewsInDropzone: PropTypes.bool,
// 	showFileNamesInPreview: PropTypes.bool,
// 	showAlerts: PropTypes.bool,
// 	clearOnUnmount: PropTypes.bool,
// 	onChange: PropTypes.func,
// 	onDrop: PropTypes.func,
// 	onDropRejected: PropTypes.func,
// 	onDelete: PropTypes.func,
// };
export default (memo(FileDropZone));
