/** @format */

import React, {useCallback, useRef} from "react";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TablePagination from "@mui/material/TablePagination";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import InputAdornment from "@mui/material/InputAdornment";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PortraitIcon from "@mui/icons-material/Portrait";
import SearchIcon from "@mui/icons-material/Search";
import MapIcon from "@mui/icons-material/Map";
import DoneIcon from "@mui/icons-material/Done";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BookIcon from "@mui/icons-material/Book";
import SchoolIcon from "@mui/icons-material/School";
import {useSetState, useGeojson, useDidUpdate} from "hooks";
import coursesTags from "../../../config/coursesTags.json";
import coursesGroups from "../../../config/coursesGroups.json";

// let coursesTags = [];
// let coursesGroups = []
// courses.map(course => {
//     coursesTags = coursesTags.concat(course.tags.split(","));
//     coursesGroups = coursesGroups.concat(course.group.split(","))
// });
// coursesTags = coursesTags.filter(entry => !String.isEmpty(entry)).map(entry => (entry.trim().length > 3? String.capitalize(entry.trim()) : entry.trim())).unique().sort((a, b) => (a > b ? 1 : -1));
// coursesGroups = coursesGroups.filter(entry => !String.isEmpty(entry)).map(entry => (entry.trim().length > 3? String.capitalize(entry.trim()) : entry.trim())).unique().sort((a, b) => (a > b ? 1 : -1));
// coursesTags.unshift("All");
// coursesGroups.unshift("All");
// console.log("coursesTags", coursesTags);
// console.log("coursesGroups", coursesGroups);

const StyledToggleButtonGroup=styled(ToggleButtonGroup)(({theme}) => ({
	"& .MuiToggleButtonGroup-grouped": {
		margin: theme.spacing(0.5),
		border: 0,
		"&.Mui-disabled": {
			border: 0,
		},
		"&:not(:first-of-type)": {
			borderRadius: theme.shape.borderRadius,
		},
		"&:first-of-type": {
			borderRadius: theme.shape.borderRadius,
		},
	},
}));

const listingModes={
	all: "All",
	"selected-only":
		"Selected only" /* , "non-selected-only": "Non-selected only" */,
};

const Header=props => {
	const {
		tags=coursesTags,
		groups=coursesGroups,
		regions,
		loading,
		onToggleSelectMode,
		onChangeListingMode,
		keyword="",
		selectMode="none",
		listingMode="all",
		pagination={page: 1, pages: 1, count: 0, rpp: 10},
		elevation=0,
		selectedRegions=[],
		onChangeSelectedRegions,
		autoSelect,
		onChangeAutoSelect,
		onChangeTags,
		onChangeGroups,
		onChangeKeyword,
		...rest
	}=props;
	const [state, setState]=useSetState({
		menuAnchorEl: null,
		popoverAnchorEl: null,
		filterView: "location",
		dialogOpen: false,
		selectedGeojsons: [],
		pagination: pagination,
		tags: [],
	});

	const {getAdminLevelName}=useGeojson();
	const keywordInputRef = useRef( null );

	useDidUpdate( () => {
		if( keywordInputRef.current ) {
			// console.log( "keywordInputRef.current", keywordInputRef.current, keyword)
			keywordInputRef.current.val = keyword;
		}
	}, [keyword])


	const handleOnOpenPopover=useCallback((event, filterView) => {
		setState({
			filterView: filterView,
			popoverAnchorEl: event.currentTarget,
		});
	}, []);

	const handleOnChangeAutoSelect=useCallback(
		event => {
			if(Function.isFunction(onChangeAutoSelect)) {
				onChangeAutoSelect(event.target.checked);
			}
		},
		[onChangeAutoSelect]
	);

	const handleOnToggleSelectMode=useCallback(() => {
		if(Function.isFunction(onToggleSelectMode)) {
			onToggleSelectMode(
				selectMode==="all"||selectMode==="some"? "none":"all"
			);
		}
	}, [onToggleSelectMode, selectMode]);

	const handleChangePage=useCallback((event, newPage) => {
		setState(prevState => ({
			pagination: {...prevState.pagination, page: newPage},
		}));
	}, []);

	const handleChangeRowsPerPage=useCallback(event => {
		setState(prevState => ({
			pagination: {
				...prevState.pagination,
				rpp: parseInt(event.target.value, 10),
			},
		}));
	}, []);

	const handleOnSearchFormSubmit=useCallback(
		event => {
			event.preventDefault();
			if(Function.isFunction(onChangeKeyword)) {
				onChangeKeyword();
			}
		},
		[onChangeKeyword]
	);

	const handleOnKeywordChange = useCallback(Function.debounce(event => {
		const keywordValue = event.target.value;
			if( Function.isFunction( onChangeKeyword ) ) {
				onChangeKeyword( keywordValue);
			}
	}, 500), [onChangeKeyword] );

	const handleOnListingModeChange=useCallback(
		event => {
			if(Function.isFunction(onChangeListingMode)) {
				onChangeListingMode(event.target.value);
			}
		},
		[onChangeListingMode, listingMode]
	);

	const handleOnTagsChange=useCallback(
		(event, newValue) => {
			if(Function.isFunction(onChangeTags)) {
				onChangeTags(Array.isArray(newValue)? newValue:[]);
			}
		},
		[onChangeTags]
	);

	const handleOnGroupsChange=useCallback(
		(event, newValue) => {
			if(Function.isFunction(onChangeGroups)) {
				onChangeGroups(Array.isArray(newValue)? newValue:[]);
			}
		},
		[onChangeGroups]
	);

	const handleOnToggleRegion=useCallback(
		regionIndex => event => {
			if(Function.isFunction(onChangeSelectedRegions)) {
				let nextSelections=Array.isArray(selectedRegions) ? [...selectedRegions] : [];
				const indexOfRegionInSelections= nextSelections.indexOf(regionIndex);

				if(indexOfRegionInSelections !==-1 ) {
					nextSelections.splice(indexOfRegionInSelections, 1);
				} else {
					nextSelections.push(regionIndex);
				}
				onChangeSelectedRegions(nextSelections);
			}
		},
		[onChangeSelectedRegions, selectedRegions]
	);

	return (
		<Grid container spacing={2} {...rest}>
			<Grid item xs={12} className={"flex flex-col"}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Paper
							elevation={elevation}
							sx={{
								border: theme => `1px solid ${theme.palette.divider}`,
								backgroundColor: theme => `${theme.palette.background.paper}`,
							}}
						>
							<FormControl
								sx={{m: 3}}
								component="fieldset"
								variant="standard"
							>
								<FormLabel component="legend">
									Workforce Selection
								</FormLabel>
								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox
												checked={autoSelect}
												onChange={
													handleOnChangeAutoSelect
												}
												name="autoselect"
											/>
										}
										label="Auto Select"
									/>
								</FormGroup>
								<FormHelperText>
									Realfield will create a workforce for you
									based on your project's parameters
								</FormHelperText>
							</FormControl>
						</Paper>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper
							elevation={elevation}
							className={"h-full w-full flex items-center justify-center"}
							sx={{
								border: theme => `1px solid ${theme.palette.divider}`,
								backgroundColor: theme => `${theme.palette.background.paper}`,
							}}
						>
							<FormControl
								className={
									"h-full w-full flex flex-col items-center justify-center"
								}
								sx={{m: 3}}
								component="fieldset"
								variant="standard"
							>
								<FormGroup>
									<Typography className="text-center">
										Options
									</Typography>
									<StyledToggleButtonGroup
										size="small"
										color="primary"
										value={state.filterView}
										exclusive
										onChange={handleOnOpenPopover}
										aria-label="open actions"
									>
										<ToggleButton
											value="tags"
											aria-label="Tags"
										>
											<Tooltip title={`Tags`}>
												<BookIcon />
											</Tooltip>
										</ToggleButton>

										<ToggleButton
											value="groups"
											aria-label="Groups"
										>
											<Tooltip title={`groups`}>
												<SchoolIcon />
											</Tooltip>
										</ToggleButton>

										{!autoSelect&&(
											<ToggleButton
												value="listingMode"
												aria-label="Listing Mode"
											>
												<Tooltip
													title={`Selection Mode`}
												>
													<PortraitIcon />
												</Tooltip>
											</ToggleButton>
										)}
										{/* !autoSelect && <ToggleButton value="displayMode" aria-label="Display Mode">
                                                    <Tooltip title={`Display Mode`}>
                                                        <PortraitIcon />
                                                    </Tooltip>
                                                </ToggleButton> */}
										{!autoSelect&&(
											<ToggleButton
												value="location"
												aria-label="Select Location"
											>
												<Tooltip
													title={`Select Boundary`}
												>
													<MapIcon />
												</Tooltip>
											</ToggleButton>
										)}
										{!autoSelect&&(
											<ToggleButton
												value="pagination"
												aria-label="Pagination"
											>
												<Tooltip title={`Pagination`}>
													<AutoStoriesIcon />
												</Tooltip>
											</ToggleButton>
										)}
									</StyledToggleButtonGroup>
								</FormGroup>
								<FormHelperText>
									Workforce selection options
								</FormHelperText>
							</FormControl>
						</Paper>
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12}>
				{!!state.filterView&&(
					<Paper
						elevation={elevation}
						className="p-4"
						sx={{
							display: "flex",
							// border: (theme) => `1px solid ${theme.palette.divider}`,
							backgroundColor: theme =>
								`${theme.palette.background.paper}`,
							flexWrap: "wrap",
						}}
					>
						{state.filterView==="tags"&&(
							<Box className="flex flex-row w-full items-center justify-center">
								<Autocomplete
									multiple
									limitTags={20}
									id="tags-autocomplete"
									className="w-full"
									onChange={handleOnTagsChange}
									options={coursesTags}
									value={tags}
									renderInput={params => (
										<TextField
											{...params}
											label="Tags"
											placeholder="Tags"
											variant="standard"
											fullWidth
										/>
									)}
								/>
							</Box>
						)}

						{state.filterView==="groups"&&(
							<Box className="flex flex-row w-full items-center justify-center">
								<Autocomplete
									multiple
									limitTags={20}
									id="groups-autocomplete"
									options={coursesGroups}
									value={groups}
									onChange={handleOnGroupsChange}
									renderInput={params => (
										<TextField
											{...params}
											label="Groups"
											placeholder="Groups"
											variant="standard"
											fullWidth
										/>
									)}
								/>
							</Box>
						)}

						{state.filterView==="pagination"&&(
							<Box className="flex flex-row w-full items-center justify-center">
								<Typography className="mx-4">{`Page ${pagination?.page||1
									} of  ${pagination?.pages||1}`}</Typography>
								<TablePagination
									component="div"
									count={pagination?.count||0}
									page={pagination?.page||1}
									onPageChange={handleChangePage}
									rowsPerPage={pagination?.rpp||10}
									onRowsPerPageChange={
										handleChangeRowsPerPage
									}
								/>
							</Box>
						)}

						{state.filterView==="listingMode"&&(
							<FormControl component="fieldset">
								<FormLabel component="legend">Show</FormLabel>
								<RadioGroup
									row
									aria-label="listing-mode"
									name="listing-mode-group"
									value={listingMode}
									onChange={handleOnListingModeChange}
								>
									<FormControlLabel
										value="all"
										control={<Radio />}
										label="All"
									/>
									<FormControlLabel
										value="selected-only"
										control={<Radio />}
										label="Selected only"
									/>
									<FormControlLabel
										value="non-selected-only"
										control={<Radio />}
										label="Non-selected only"
									/>
								</RadioGroup>
							</FormControl>
						)}

						{state.filterView==="location"&&(
							<FormControl component="fieldset">
								<FormLabel component="legend" className="px-4">
									Regions
								</FormLabel>
								<FormHelperText id="regions-helper-text">
									Click a region to select or deselect.
								</FormHelperText>
								<FormGroup className="flex flex-row flex-wrap">
									{Array.isArray(regions)&&
										regions.map((geojson, index) => (
											<Chip
												className="m-2 cursor-pointer"
												label={getAdminLevelName(
													geojson
												)}
												onClick={handleOnToggleRegion(
													index
												)}
												color={
													Array.isArray(
														selectedRegions
													)&&
														selectedRegions.includes(
															index
														)
														? "primary"
														:"default"
												}
												variant={
													Array.isArray(
														selectedRegions
													)&&
														selectedRegions.includes(
															index
														)
														? "filled"
														:"outlined"
												}
												key={`geojson-${index}`}
												icon={
													Array.isArray(
														selectedRegions
													)&&
														selectedRegions.includes(
															index
														)? (
														<DoneIcon />
													):undefined
												}
											/>
										))}
								</FormGroup>
							</FormControl>
						)}
					</Paper>
				)}
			</Grid>

			{!autoSelect&&(
				<Grid item xs={12}>
					<Paper
						component="div"
						sx={{
							p: "2px 4px",
							display: "flex",
							alignItems: "center",
							width: "100%",
							border: theme =>
								`1px solid ${theme.palette.divider}`,
						}}
						elevation={elevation}
					>
						<Tooltip
							title={
								selectMode==="all"||selectMode==="some"
									? "Clear selected"
									:"Select All"
							}
						>
							<Checkbox
								inputProps={{
									"aria-label": "Toggle Selection",
								}}
								checked={
									selectMode==="some"||
									selectMode==="all"
								}
								indeterminate={selectMode==="some"}
								onChange={handleOnToggleSelectMode}
								disabled={loading}
								sx={{"& .MuiSvgIcon-root": {fontSize: 28}}}
							/>
						</Tooltip>
						<form
							className="flex-grow flex flex-row m-0 p-0"
							onSubmit={handleOnSearchFormSubmit}
							noValidate
						>
							<InputBase
								sx={{ml: 1, flex: 1}}
								placeholder="Search"
								inputProps={{"aria-label": "Search..."}}
								inputRef={keywordInputRef}
								defaultValue={keyword}
								onChange={handleOnKeywordChange}
							/>
							<IconButton
								type="submit"
								sx={{p: "10px"}}
								aria-label="search"
								disabled={loading}
							>
								<SearchIcon />
							</IconButton>
						</form>
					</Paper>
				</Grid>
			)}
		</Grid>
	);
};

export default React.memo(Header);
