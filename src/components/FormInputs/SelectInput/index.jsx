/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


const SelectInput = (props) => {
	const { options, variant, label, placeholder, ...rest } = props;
	const [inputValue, setInputValue] = useState(value ? value : defaultValue);
	const [inputDisabled, setInputDisabled] = useState(disabled);
	const [inputError, setInputError] = useState(error);
	const [isInvalid, setIsInvalid] = useState(invalid);
	const [inputTouched, setInputTouched] = useState(touched);

	return (
		<Autocomplete
				multiple
				limitTags={2}
				options={top100Films}
				getOptionLabel={(option) => option.title}
				defaultValue={[top100Films[1], top100Films[0]]}
				renderInput={(params) => (
					<TextField {...params} variant={multiple} label={label} placeholder={placeholder} />
				)}
				{...rest}
		/>
	);
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
	{ title: 'The Shawshank Redemption', year: 1994 },
	{ title: 'The Godfather', year: 1972 },
];


export default SelectInput;