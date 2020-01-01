import React from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import MarkerIcon from '@material-ui/icons/Room';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';

import Typography from 'components/Typography';

import withRoot from "utils/withRoot";

class LocationSearchInput extends React.Component {
	state={
		suggestionsMenuOpen: false,
		suggestionsMenuAnchorRef: null,
		shouldFetchSuggestions: true,
		value: '',
	};
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleLeftBtnClick = this.handleLeftBtnClick.bind(this);
		this.handleSuggestionsOpen = this.handleSuggestionsOpen.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.onError = this.onError.bind(this);

		this.suggestionsMenuAnchorRef = React.createRef();
		this.searchInputRef = React.createRef();
	}
 
	handleChange = value => {
		this.setState({ value: value });
	};

	handleInputChange = event => {
		let value = event.target.value;
		this.setState({ value: value });
	};
 
	handleSelect = value => {
		const { onSelect } = this.props
		this.setState({ value: ''});
		geocodeByAddress(value)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				if (Function.isFunction(onSelect)) {
					onSelect({address: value, coordinates: latLng});
				}
			})
			.catch(error => console.error('Error', error));

	};

	handleSuggestionsClose = () => {
		//this.setState({ suggestionsMenuOpen: false, suggestionsMenuAnchorRef: null });
	};

	handleSuggestionsOpen = () => {
		let value = '';
		if (this.searchInputRef.current != null) {
			value = this.searchInputRef.current.value;
		}
		this.setState({ value: value, suggestionsMenuOpen: true, suggestionsMenuAnchorRef: this.suggestionsMenuAnchorRef.current });
	};

	onError = (status, clearSuggestions) => {
		console.log('Google Maps API returned error with status: ', status)
		clearSuggestions();
	}

	handleLeftBtnClick  = event => {
		const { onLeftBtnClick } = this.props;
		if (Function.isFunction(onLeftBtnClick)) {
			onLeftBtnClick(event);
		}
	}
 
	render() {
		const { className } = this.props;
		return (
			<PlacesAutocomplete
				value={this.state.value}
				onChange={this.handleChange}
				onSelect={this.handleSelect}
				onError={this.onError}
				shouldFetchSuggestions={this.state.value.length > 2}
			>
				{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
					
					<div className={"py-1 px-2 sm:w-full md:w-5/6 lg:w-4/6 "+(className? className : "")}>					
						<Paper component="div" className="flex items-center w-full py-1 px-2" ref={this.suggestionsMenuAnchorRef}>
							<IconButton className="p-3 hover:text-blue-500" aria-label="menu" onClick={this.handleLeftBtnClick}>
								<MyLocationIcon />
							</IconButton>
							<InputBase
								className="ml-2 flex-grow"
								placeholder="Search Google Maps"
								inputProps ={{
									...getInputProps({ placeholder: 'Search Places ...', className: 'location-search-input', autoFocus: true }),
									ref: this.searchInputRef
								}}
							/>

							{loading && <CircularProgress size={24} thickness={4}/>}
							{!loading && <div className="p-3" aria-label="search">
								{suggestions.length === 0 && <SearchIcon />}
								{suggestions.length > 0 && <MarkerIcon />}
							</div>}
							
						</Paper>
						<Popper className="z-50 py-1 px-2 sm:w-full md:w-5/6 lg:w-4/6"  open={suggestions.length > 0} anchorEl={this.suggestionsMenuAnchorRef.current} role={undefined} transition disablePortal>
							{({ TransitionProps, placement }) => (
								<Grow
									{...TransitionProps}
									style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
								>
									<Paper>
											<MenuList id="location-search-suggestions-menu">
												<MenuItem><Typography variant="body2">Suggestions</Typography></MenuItem>
												{loading && <MenuItem>Loading... </MenuItem>}
												{!loading && suggestions.length === 0 && <MenuItem><Typography variant="body2">No suggestions available</Typography></MenuItem>}
												{suggestions.map(suggestion => {
													const className = suggestion.active ? 'suggestion-item--active truncate' : 'suggestion-item truncate';
													// inline style for demonstration purpose
													const style = suggestion.active? { backgroundColor: '#fafafa', cursor: 'pointer' } : { backgroundColor: '#ffffff', cursor: 'pointer' };
													return (
														<MenuItem
															{...getSuggestionItemProps(suggestion, {
																className,
																style,
															})}
														>
															<span className="text-base text-blue-700">{suggestion.formattedSuggestion.mainText}</span>
															<span className="text-xs ml-3">{suggestion.formattedSuggestion.secondaryText}</span>
														</MenuItem>
													);
												})}
											</MenuList>
									</Paper>
								</Grow>
							)}
						</Popper>
						
					</div>)					
				}
			</PlacesAutocomplete>
		);
	}
}

export default withRoot(LocationSearchInput);