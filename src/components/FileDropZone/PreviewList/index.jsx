import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import {
	CloudDownloadOutlined as DownloadIcon,
	DeleteOutlined as DeleteIcon,
} from "@material-ui/icons";
import { colors } from "assets/jss/app-theme";
import Avatar from "components/Avatar";
import Typography from "components/Typography";
import React from "react";
import ApiService from "services/Api";
import { FilesHelper, UtilitiesHelper } from "hoc/Helpers";
import withRoot from "hoc/withRoot";

const styles = {
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
		"&:hover": {
			color: colors.hex.accent,
		},
	},
	uploadProgressBtn: {
		transition: ".5s ease",
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
};

function PreviewList(props) {
	const {
		fileObjects,
		handleCancelUpload,
		title,
		handleDownload,
		handleRemove,
		showFileNames,
		classes,
	} = props;
	const [dense, setDense] = React.useState(false);

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
												: () => {}
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

export default withRoot(withStyles(styles)(PreviewList));
