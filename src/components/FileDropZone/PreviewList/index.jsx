import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";

import {
	CloudDownloadOutlined as DownloadIcon,
	DeleteOutlined as DeleteIcon,
} from "@mui/icons-material";
import { colors } from "assets/jss/app-theme";
import Avatar from "components/Avatar";
import Typography from '@mui/material/Typography';
import React from "react";
import ApiService from "services/Api";
import { FilesHelper, UtilitiesHelper } from "utils/Helpers";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	actionBtn: {},
	fileAvatar: {
		background: "rgba(" + colors.rgb.default + ", 0.05)",
		color: colors.hex.default,
		transition: ".5s ease",
		"&:hover": {
			background: "rgba(" + colors.rgb.default + ", 0.3)",
		},
	},
	listItem: {
		display: "flex",
	},
	listItemAvatar: {
		flex: "1",
		flexGrow: "1",
		maxWidth: "8%",
	},
	listItemText: {
		flex: "7",
		flexGrow: "7",
		maxWidth: "50%",
		overflow: "hidden",
	},
	listItemSecondaryAction: {
		flex: "4",
		flexGrow: "4",
	},
	fileName: {
		display: "inline-block",
		//whiteSpace: "nowrap",
		textOverflow: "ellipsis",
		overflow: "hidden",
	},
	downloadBtn: {
		transition: ".5s ease",
		margin: "1rem 0",
		"&:hover": {
			color: colors.hex.accent,
		},
	},
	uploadProgressBtn: {
		transition: ".5s ease",
		margin: "0 1rem",
		"&:hover": {
			color: colors.hex.accent,
		},
	},
	deleteBtn: {
		transition: ".5s ease",
		"&:hover": {
			color: colors.hex.error,
		},
	},
}));

function PreviewList(props) {
	const {
		fileObjects,
		handleCancelUpload,
		title,
		handleDownload,
		handleRemove,
		showFileNames,
		disabled,
	} = props;
	const [dense, setDense] = React.useState(false);
	const classes = useStyles()
	return (
		<List
			dense={dense}
			aria-labelledby="files-preview-list-subheader"
			className={classes.root}
		>
			{fileObjects.map((fileObject, i) => {
				if (
					fileObject !== undefined &&
					(UtilitiesHelper.isOfType(
						fileObject.attachment,
						"object"
					) ||
						UtilitiesHelper.isOfType(fileObject.file, "object"))
				) {
					return (
						<ListItem
							className="p-0"
							key={"file-preview-list-item-" + i}
						>
							<ListItemAvatar className={classes.listItemAvatar}>
								{FilesHelper.isImage(
									fileObject.attachment
										? fileObject.attachment.name
										: fileObject.file.name
								) ? (
									<Avatar
										className={classes.fileAvatar}
										alt={
											fileObject.attachment
												? fileObject.attachment.name
												: fileObject.file.name
										}
										src={
											fileObject.attachment
												? ApiService.getAttachmentFileUrl(
													fileObject.attachment
												)
												: fileObject.data
										}
									/>
								) : (
									<Avatar className={classes.fileAvatar}>
										{FilesHelper.fileIcon(
											fileObject.attachment
												? fileObject.attachment.name
												: fileObject.file.name
										)}
									</Avatar>
								)}
							</ListItemAvatar>

							<ListItemText
								className={classes.listItemText}
								primary={
									<Typography
										className="truncate"
										component="span"
										variant="body1"
										color="grey"
									>
										{fileObject.progress
											? fileObject.attachment
												? fileObject.attachment.name
												: fileObject.file.name
											: fileObject.attachment
												? fileObject.attachment.name
												: fileObject.file.name}
									</Typography>
								}
								secondary={UtilitiesHelper.readableFileSize(
									fileObject.attachment
										? fileObject.attachment.size
										: fileObject.file.size
								)}
							/>

							<ListItemSecondaryAction
								className={classes.listItemSecondaryAction}
							>
								{fileObject.progress ? (
									<IconButton
										className={classes.uploadProgressBtn}
										edge="end"
										onClick={
											UtilitiesHelper.isOfType(
												handleCancelUpload,
												"function"
											)
												? handleCancelUpload(i)
												: () => { }
										}
										aria-label="upload"
									>
										<CircularProgress
											className={classes.progress}
											size={20}
											thickness={3}
										/>
									</IconButton>
								) : (
									fileObject.attachment && (
										<IconButton
											className={classes.downloadBtn}
											edge="end"
											onClick={e => {
												e.preventDefault();
												let win = window.open(
													ApiService.getAttachmentFileUrl(
														fileObject.attachment
													),
													"_blank"
												);
												win.focus();
											}}
											aria-label="download"
										>
											{" "}
											<DownloadIcon />
										</IconButton>
									)
								)}

								<IconButton
									className={classes.deleteBtn}
									edge="end"
									onClick={handleRemove(i)}
									aria-label="delete"
								>
									<DeleteIcon />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					);
				}
			})}
		</List>
	);
}

export default (PreviewList);
