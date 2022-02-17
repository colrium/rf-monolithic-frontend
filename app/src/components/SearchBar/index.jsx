import React, { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase';
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { withTheme } from '@mui/styles';
import { connect } from "react-redux";
import compose from "recompose/compose";
import { apiCallRequest } from "state/actions";
import classNames from 'classnames';
import debounce from 'lodash/debounce';



const SearchBar = (props) => {
	let debouncedOnChange;
	let inputBaseRef = React.useRef(null);
	let inputRef = React.createRef();
	let searchRef = React.useRef(null);
	const [state, setState] = useState(props);
	useEffect(() => {
		setState(props)
	}, [props]);

	const { cancelOnEscape, apiCallRequest, className, cache: { data: { search_history } }, closeIcon, disabled, value, defaultValue, results, loading, open, onCancelSearch, onRequestSearch, searchIcon, style, placeholder, onChange, ...inputProps } = state
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	const [searching, setSearching] = useState(loading);
	const [searchOpen, setSearchOpen] = useState(true);
	const [suggetionsOpen, setSuggetionsOpen] = useState(true);
	const [inputTouched, setInputTouched] = useState(false);
	const [suggetions, setSuggetions] = useState(Array.isArray(search_history) ? search_history : []);



	const search = (keyword) => {
		setSearching(true)
		apiCallRequest("search", {
			uri: false,
			type: "search",
			params: { query: keyword },
			data: {},
			cache: true,
		}).then(res => {
			const { data } = res.body;
			setSearching(false);
		}).catch(e => {
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


	}, [inputValue]);*/




	return (
		<div className={classNames({ [className]: true, "flex": true })}>
			<div ref={searchRef}>
				{!searchOpen && <IconButton
					onClick={() => {
						setSearchOpen(true);
					}}
					disabled={disabled}
				>
					{searchIcon}
				</IconButton>}

				{searchOpen && <InputBase
					{...inputProps}
					onChange={event => {
						event.persist();
						if (!debouncedOnChange) {
							debouncedOnChange = debounce(() => {
								let new_value = event.target.value;
								setInputValue(new_value);
								let newSuggestions = search_history;
								if (new_value && new_value !== "") {
									newSuggestions = search_history.filter((entry, cursor) => {
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
							inputRef.current.value = "";
							inputRef.current.focus();
						}
						setInputValue("");
					}}
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
					disabled={disabled}
				>
					{searchIcon}
				</IconButton>}
			</div>
			{(searchOpen && searchRef.current && suggetions.length > 0) && <Popover
				anchorEl={searchRef.current}
				open={suggetionsOpen}
				onClose={() => {
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
				{suggetions.map((keyword, index) => (
					<MenuItem
						onClick={() => {
							setSuggetionsOpen(false);
							if (inputRef.current) {
								inputRef.current.value = keyword;
								inputRef.current.focus();
							}
							setInputValue(keyword);
							search(keyword);
						}}
						key={"keyword-" + keyword + "-" + index}
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
	closeIcon: <ClearIcon />,
	disabled: false,
	placeholder: 'Search',
	searchIcon: <SearchIcon />,
	style: null,
	value: ''
}

/*SearchBar.propTypes = {
	cancelOnEscape: PropTypes.bool,

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

	withTheme,
	connect(mapStateToProps, { apiCallRequest }),
)(SearchBar);
