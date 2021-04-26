import React, { useEffect, useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase';
import ClearIcon from '@material-ui/icons/Clear'
import SearchIcon from '@material-ui/icons/Search'
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import {withErrorHandler} from "hoc/ErrorHandler";
import { withTheme } from '@material-ui/core/styles';
import { connect } from "react-redux";
import compose from "recompose/compose";
import { apiCallRequest } from "state/actions";
import withStyles from '@material-ui/core/styles/withStyles'
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import styles from "./styles";


const SearchBar = (props) => {
	let debouncedOnChange;
	let inputBaseRef = React.useRef(null);
	let inputRef = React.createRef();
	let searchRef = React.useRef(null);
	const [state, setState] = useState(props);
	useEffect(() => {
		setState(props)
	}, [props]);
	
	const { cancelOnEscape, apiCallRequest, className, cache:{data:{ search_history }}, classes, closeIcon, disabled, value, defaultValue, results, loading, open, onCancelSearch, onRequestSearch, searchIcon, style, placeholder, onChange, ...inputProps } = state
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	const [searching, setSearching] = useState(loading);
	const [searchOpen, setSearchOpen] = useState(true);	
	const [suggetionsOpen, setSuggetionsOpen] = useState(true);
	const [inputTouched, setInputTouched] = useState(false);
	const [suggetions, setSuggetions] = useState(Array.isArray(search_history)? search_history : []);

	

	const search = (keyword) => {
		setSearching(true)
		apiCallRequest("search", {
			uri: false,
			type: "search",
			params: { query: keyword },
			data: {},
			cache: true,
		}).then(results => {
			setSearching(false);
		}).catch(e=>{
			setSearching(false);
		});	
		
	}



	

	/*useEffect(() => {
		let newSuggestions = search_history;
		if (inputValue && inputValue !== "") {
			newSuggestions = search_history.filter((entry, cursor)=>{
				return entry.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
			});
		}
		setSuggetions(newSuggestions);	
		setSuggetionsOpen(true);
		console.log("search_history", search_history);
		console.log("newSuggestions", newSuggestions);
	}, [inputValue]);*/

	


	return (
        <div className={classNames({[className]:true, "flex": true})}>
		<div className={classNames({[classes.search]: true, [classes.open]: searchOpen})} ref={searchRef}>
						{!searchOpen && <IconButton
							onClick={() => {
								setSearchOpen(true);														
							}}
							className={classes.searchIcon}
							disabled={disabled}
						>
							{searchIcon}
						</IconButton> }

						{searchOpen && <InputBase
							{...inputProps}
							onChange={event => {
								event.persist();
								if (!debouncedOnChange) {
									debouncedOnChange =  debounce(() => {			
										let new_value = event.target.value;		
										setInputValue(new_value);
										let newSuggestions = search_history;
										if (new_value && new_value !== "") {
											newSuggestions = search_history.filter((entry, cursor)=>{
												return entry.toLowerCase().indexOf(new_value.toLowerCase()) !== -1;
											});
										}
										setSuggetions(newSuggestions);	
										setSuggetionsOpen(true);
										if (!inputTouched) {
											setInputTouched(true);
										}
										if (inputRef.current) {
											inputRef.current.focus();
										}
										
									}, 300);
								}
					
								debouncedOnChange();
								
							}}
							placeholder={placeholder}
							classes={{
								root: classNames({[classes.inputRoot]: true }),
								input: classes.inputInput,
							}}
							inputProps={{ 'aria-label': 'search' }}
							disabled={disabled}
							defaultValue={inputValue}
							inputRef={inputRef}
							ref={inputBaseRef}
							autoFocus							
						/>}

						
						{(searchOpen && String.isString(inputValue) && inputValue.trim() !== "") && <IconButton
							onClick={() => {
                                if (inputRef.current) {
									inputRef.current.value="";
									inputRef.current.focus();
								}
                                setInputValue("");
                            }}
							className={classes.searchIcon}
							disabled={disabled}
						>
							{closeIcon}
						</IconButton>}

						
						{searching && <CircularProgress color="inherit" size={24} disableShrink />}

						{searchOpen && <IconButton
							onClick={() => {

								if (inputValue.trim().length > 0) {
									search(inputValue);
								}
								else if (inputRef.current) {
									//inputRef.current.value="";
									inputRef.current.focus();
								}											
							}}
							className={classes.searchIcon}
							disabled={disabled}
						>
							{searchIcon}
						</IconButton> }
			</div>
			{(searchOpen && searchRef.current && suggetions.length > 0) && <Popover
							className={classes.resultsMenu}
							anchorEl={searchRef.current}
							PopoverClasses={{
								root: classes.resultsMenuPopoverRoot,
								paper: classes.resultsMenuPopoverPaper,
							}}							
							open={suggetionsOpen}
							onClose={()=>{
								setSuggetionsOpen(false);
							}}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}

							disablePortal
							disableAutoFocus
						>
							{suggetions.map((keyword, index)=>(
								<MenuItem 
									onClick={()=>{										
										setSuggetionsOpen(false);
										if (inputRef.current) {
											inputRef.current.value=keyword;
											inputRef.current.focus();
										}
										setInputValue(keyword);
										search(keyword);
									}} 									
									key={"keyword-"+keyword+"-"+index}
								>
									{keyword}
								</MenuItem>
							))}
			</Popover>}
		</div>
    );
};

SearchBar.defaultProps = {
	className: '',
	closeIcon: <ClearIcon/>,
	disabled: false,
	placeholder: 'Search',
	searchIcon: <SearchIcon/>,
	style: null,
	value: ''
}

/*SearchBar.propTypes = {
	cancelOnEscape: PropTypes.bool,
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	closeIcon: PropTypes.node,
	disabled: PropTypes.bool,
	onCancelSearch: PropTypes.func,
	onChange: PropTypes.func,
	onRequestSearch: PropTypes.func,
	placeholder: PropTypes.string,
	searchIcon: PropTypes.node,
	style: PropTypes.object,
	value: PropTypes.string
}*/

const mapStateToProps = state => ({
	cache: state.cache,
});

export default compose(
		withStyles(styles),
		withTheme,
		connect(mapStateToProps, {apiCallRequest}),
		withErrorHandler
)(SearchBar);