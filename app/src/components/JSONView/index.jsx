/** @format */
import React, { useMemo, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ReactJson from "react-json-view";
import IconButton from '@mui/material/IconButton';
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ScrollBars from "components/ScrollBars";
import CopyToClipboardButton from "components/CopyToClipboardButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useSetState, useWillUnmount } from "hooks";

export const ReadableJSONViewEntry = React.memo(
	React.forwardRef((props, ref) => {
		const { src, name, humanize, ...rest } = props;
		const srcEntries = useMemo(() => {
			let srcEntriesArr = [];
			if (JSON.isJSON(src)) {
				srcEntriesArr = Object.entries(src);
			}
			return srcEntriesArr;
		}, [src]);
		console.log("src", src)
		return (
			<Stack {...rest} ref={ref}>
				<Grid container>
					<Grid item xs={12}>
						<Typography
							color="text.secondary"
							sx={{
								color: theme => theme.palette.text.secondary,
							}}
							className="break-normal">
							{name}
						</Typography>
					</Grid>
				</Grid>
				{JSON.isJSON(src) && Object.entries(src).map(([key, value], index) => (
					<Grid
						className="p-2 transition-all hover:bg-gray-600 hover:bg-opacity-5"
						container
						key={`${name}-${key}-${index}`}>
						<Grid item xs={5} sm={4}>
							<Typography
								className="break-normal"
								color="text.placeholder">
								{humanize ? key.humanize() : key}
							</Typography>
						</Grid>
						<Grid item xs={7} sm={8}>
							<Typography >
								{value}
							</Typography>
						</Grid>
					</Grid>
				))}
			</Stack>
		);
	})
);

export const ReadableJSONView = React.memo(
	React.forwardRef((props, ref) => {
		const { src, name, humanize, ...rest } = props;
		const srcEntries = useMemo(() => {
			let srcEntriesArr = [];
			if (JSON.isJSON(src)) {
				srcEntriesArr = Object.entries(src);
			}
			return srcEntriesArr;
		}, [src]);

		const renderJSONEntry = useCallback(
			obj => {
				let objEntriesArr = [];
				if (JSON.isJSON(src)) {
					objEntriesArr = Object.entries(obj);
				}
				return objEntriesArr.map(([key, value]) =>
					<ReadableJSONView
							humanize={humanize}
							src={value}
							name={key}
							title={key.humanize()}
							showTabs={false}
						/>
					
				);
			},
			[humanize]
		);

		const renderArrayEntry = useCallback(
			arr => {
				let objEntriesArr = arr || [];
				return objEntriesArr.map(value =>
					JSON.isJSON(value) ? (
						renderJSONEntry(value)
					) : (
						<Typography>{value}</Typography>
					)
				);
			},
			[humanize]
		);

		return (
			<Grid container spacing={2} {...rest} ref={ref}>
				{/* {!!name && (
					<Grid item xs={12} className="pb-4">
						<Typography
							variant="subtitle1"
							color="text.secondary"
							paragraph
							gutterBottom>
							{name}
						</Typography>
					</Grid>
				)} */}

				{srcEntries.map(([key, value], index) => (
					<Grid
						container
						className="p-2 transition-all hover:bg-gray-600 hover:bg-opacity-5"
						key={`${name}-${key}-${index}`}>
						<Grid item xs={5} sm={4}>
							<Typography
								className="truncate pr-4 break-normal"
								sx={{
									color: theme =>
										theme.palette.text.placeholder,
								}}
								color="text.placeholder">
								{humanize ? key.humanize() : key}
							</Typography>
						</Grid>
						<Grid item xs={7} sm={8} className="flex-wrap ">
								{JSON.isJSON(value)
									? <Grid
										container >
										<Grid item xs={12}>
											<JSONView
												humanize={humanize}
												src={value}
												name={key}
												title={key.humanize()}
											/>
										</Grid>
									</Grid>
									: Array.isArray(value)
									? <Grid
										container >
										<Grid item xs={12}>
											{renderArrayEntry(value)}
										</Grid>
									</Grid>
									: value}
						</Grid>
					</Grid>
				))}
			</Grid>
		);
	})
);

const JSONView = props => {
	const {
		src,
		enableClipboard,
		displayDataTypes,
		name,
		view = "prose",
		showTabs=true,
		className,
		humanize,
		...rest
	} = props;

	const [state, setState, getState] = useSetState({
		view: view,
	});
	

	const handleViewChange = (event, newValue) => {
		setState({ view: newValue });
	};
	return (
		<Box
			className={`bg-transparent relative ${className ? className : ""}`}
			{...rest}>
			<Grid
				container
				sx={{
					// height: "100%",
					// maxHeight: theme => theme.spacing(96),
					position: "relative",
				}}
				className=" h-full relative">
				{showTabs && <Grid item xs={12} className={"bg-transparent"}>
					<Tabs value={state.view} onChange={handleViewChange} centered>
					<Tab label="Prose" value="prose" />
					<Tab label="Decorated" value="decorated" />
					<Tab label="Raw" value="raw" />
				</Tabs>
				</Grid>}
				<Grid item xs={12} className={"px-4"} sx={{
					backgroundColor: theme =>
						state.view === "raw"
							? theme.palette.common.black
							: "transparent",
					color: theme =>
						state.view === "raw"
							? theme.palette.text.contrast
							: theme.palette.text.primary,
				}}>
					<ScrollBars className=" bg-transparent overflow-scroll ">
						<Box className={"bg-transparent w-full p-4"}>
							{state.view === "prose" && (
								<ReadableJSONView
									name={name}
									src={src}
									humanize={humanize}
								/>
							)}
							{state.view === "decorated" && (
								<ReactJson
									name={false}
									src={src}
									enableClipboard={enableClipboard}
									displayDataTypes={displayDataTypes}
									{...rest}
								/>
							)}

							{state.view === "raw" && (
								<pre className="w-full break-normal">
									{JSON.stringify(src, null, 4)}
								</pre>
							)}
						</Box>
					</ScrollBars>
				</Grid>
			</Grid>
		</Box>
	);
};

export const JSONViewDialog = props => {
	const {
		onClose,
		title,
		src,
		name,
		media,
		children,
		actions,
		humanize,
		fullScreen,
		open,
		view="prose",
		...rest
	} = props;
	const [state, setState] = useSetState({
		fullScreen: Boolean(fullScreen),
	})
	const handleClose = useCallback(() => {
		if (Function.isFunction(onClose)) {
			onClose();
		}
	}, [onClose]);
	
	return (
		<Dialog onClose={handleClose} fullScreen={state.fullScreen} open={open} {...rest}>
			<DialogTitle>
				{title && (
					<Typography variant="subtitle1" className="mb-4" paragraph>
						{title}
					</Typography>
				)}
				
			</DialogTitle>
			<DialogContent className="p-0">
				<JSONView
					src={src}
					name={name}
					view={view}
					humanize={humanize}
				/>
			</DialogContent>
			<DialogActions>
				{Array.isArray(actions) &&
					actions.map(({ content, ...action }, index) => (
						<Button {...action} key={`action-${index}`}>
							{content}
						</Button>
					))}
				<CopyToClipboardButton
					className={"mx-1"}
					color="accent"
					size="small"
					fontSize="inherit"
					value={JSON.stringify(src, null, 4)}
				/>
				<IconButton 
					color={"indigo"} 
					className={"mx-1"} 
					size="small" 
					onClick={() => setState(prevState => ({fullScreen: !prevState.fullScreen }))}
					aria-label={`${state.fullScreen? "Exit Fullscreen" : "Enter Fullscreen"}`}
					title={`${state.fullScreen? "Exit Fullscreen" : "Enter Fullscreen"}`}
				>
					{state.fullScreen? <FullscreenExitIcon fontSize="inherit" /> : <FullscreenIcon fontSize="inherit" />}
				</IconButton>
				<Button 
					color={"error"} 
					className={"mx-1"} 
					onClick={handleClose} 
					aria-label={`Close Dialog`}
					title={`Close Dialog`}
					autoFocus
				>
					Dismiss
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default React.memo(JSONView);
