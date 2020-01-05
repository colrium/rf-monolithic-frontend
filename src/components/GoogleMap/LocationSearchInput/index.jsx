import React from 'react';
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import MarkerIcon from '@material-ui/icons/Room';
import SearchIcon from '@material-ui/icons/Search';

import withRoot from "utils/withRoot";

class LocationSearchInput extends React.Component {
	state={
		suggestionsMenuOpen: false,
		suggestionsMenuAnchorRef: null,
		shouldFetchSuggestions: true,
		value: '',
	};
	searchBoxRef = null;
	constructor(props) {
		super(props);
		
		this.handleLeftBtnClick = this.handleLeftBtnClick.bind(this);
		this.handleOnPlacesChanged = this.handleOnPlacesChanged.bind(this);

		this.suggestionsMenuAnchorRef = React.createRef();
		this.searchInputRef = React.createRef();
		this.searchBoxRef = React.createRef();
	}

 

	handleOnPlacesChanged = () => {
		const { onSelect } = this.props
		const places = this.searchBoxRef.getPlaces();
		const positions = places.map(place => ({
            coordinates: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
            address: place.formatted_address,
        }));

        console.log("positions[0]", positions[0]);

        if (Function.isFunction(onSelect)) {
        	this.setState({ value: ''});
			onSelect(positions[0]);
		}
	};


	handleLeftBtnClick  = event => {
		const { onLeftBtnClick } = this.props;
		if (Function.isFunction(onLeftBtnClick)) {
			onLeftBtnClick(event);
		}
	}
 
	render() {
		const { className, controlPosition } = this.props;

		return (
			<SearchBox
				ref={ref => (this.searchBoxRef = ref)}
				controlPosition={controlPosition}
				onPlacesChanged={this.handleOnPlacesChanged}
			>
				<div className={"py-1 px-2 sm:w-full md:w-5/6 lg:w-4/6 "+(className? className : "")}>
					<Paper component="div" className={"flex items-center w-full  py-1 px-2"} ref={this.suggestionsMenuAnchorRef}>
							<IconButton className="p-3 hover:text-blue-500" aria-label="menu" onClick={this.handleLeftBtnClick}>
								<MyLocationIcon />
							</IconButton>
							<InputBase
								className="ml-2 flex-grow"
								placeholder="Search places..."
								inputProps ={{
									ref: this.searchInputRef
								}}
							/>
							<div className="p-3" aria-label="search">
								<SearchIcon />
							</div>
							
					</Paper>
				</div>
			</SearchBox>

		);
	}
}

export default withRoot(LocationSearchInput);