import React, { useState, useEffect } from "react";
import {preferences as preferencesService} from 'services';
import {preferences as preferencesDefination} from 'definations';
import { useSelector } from 'react-redux';


let fetched = false;
let fetching = false;

let defaultValue = {
	dashboard: {
		"quicklinks" : false,
		"static-aggregates": true,
		"static-map": true, 
		"compact-aggregates": false, 
		"compact-maps": false, 
		"calendar": true,
	}
};


export const PreferencesContext = React.createContext();

export const PreferencesProvider = props => {
	let [state, setState ] = useState(props);
	let [value, setValue] = useState(defaultValue);
	useEffect(() => { setState(props); }, [props]);

	const sockets = useSelector(redux_state => redux_state.sockets);
	let user = useSelector(redux_state => redux_state.auth.user);

	if (!JSON.isJSON(user)) {
		user = { _id: null };
	}

		

	const initSocketsListeners = ()=>{
		if (sockets.default) {
			sockets.default.on("create", async ({ context, action }) => {
				if (context === preferencesDefination.model && action.result.user._id === user._id) {
					setValue({...value, [action.result.slug]: action.result.value });
				}
			});

			sockets.default.on("update", async ({ context, action }) => {
				if (context === preferencesDefination.model && action.result.user._id === user._id) {
					setValue({...value, [action.result.slug]: action.result.value });
				}
			});
		}
		if (sockets.auth) {
			sockets.auth.on("create", async ({ context, action }) => {
				if (context === preferencesDefination.model && action.result.user._id === user._id) {
					setValue({...value, [action.result.slug]: action.result.value });
				}
			});

			sockets.auth.on("update", async ({ context, action }) => {
				if (context === preferencesDefination.model && action.result.user._id === user._id) {
					setValue({...value, [action.result.slug]: action.result.value });
				}
			});
		}			
	}

	const fetchPreferences = ()=>{
		fetching = true;
		preferencesService.getRecords({user: user._id}).then(res => {
			fetched = true;
			fetching = false;
			let fetchedPreferences = {};
			res.body.data.map((setting, index)=>{
				fetchedPreferences[setting.slug] = setting.value;
			});
			defaultValue = {...value, ...fetchedPreferences, preferencesFetched: true};
			setValue(defaultValue);
				
		}).catch(e => {
			fetched = false;
			fetching = false;
		});
			
	}

	const updatePreferences = async (name, new_value)=>{
		let updatedValue = false;
		if (String.isString(name)) {
			let slug = name.toLowerCase().variablelize("-");
			if (new_value !== value[slug]) {
				let postData = {
					name: name,
					slug: slug,
					value: new_value,
					user: user._id,
				}
				return await preferencesService.update(slug, postData, {create: 1}).then(res => {

					updatedValue = {...value, [slug]: new_value };
					setValue(updatedValue);
					return updatedValue
				}).catch(e=>{
					return false;
				});
			}
		}
		else{
			return false;
		}
			
	}

	initSocketsListeners();
	useEffect(() => { fetchPreferences(); }, [user]);
	useEffect(() => { initSocketsListeners(); }, [sockets]);
		

	if (!fetched && !fetching) {
		fetchPreferences();
	}

	return (
		<PreferencesContext.Provider value={{preferences: value, updatePreferences: updatePreferences} } {...state}>
			{ props.children }
		</PreferencesContext.Provider>
	);
}


export default PreferencesProvider

export const usePreferencesContext = () => {
	const context = React.useContext(PreferencesContext);
	if (context === undefined) {
		throw new Error('usePreferencesContext must be used within a PreferencesProvider');
	}
	return context;
}

export const withPreferencesContext = (Component) => {
	function WithPreferencesContext(props) {
		let context = React.useContext(PreferencesContext);
		let [state, setState ] = useState(props);
		let [preferencesContext, setPreferencesContext ] = useState(context);
		useEffect(() => { setPreferencesContext(context); }, [context]);
		useEffect(() => { setState(props); }, [props]);

		if (context === undefined) {
			throw new Error('withPreferencesContext must be used within a PreferencesProvider');
			return ;
		}
		else {
			return <Component {...state} preferencesContext={preferencesContext} />
		}
		
	}

	return WithPreferencesContext;
}
