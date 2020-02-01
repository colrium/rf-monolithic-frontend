import React, { useState, useEffect } from "react";
import {settings as SettingsService} from 'services';
import {settings as settingsDefination} from 'definations';
import { useSelector } from 'react-redux';


let fetched = false;
let fetching = false;

let defaultValue = {		
	"general": {
		"site-title" : "Realfield",
		"site-tagline" : "Real data",
	},	
	"reading": {
		"enable-blog": true,
		"enable-press": true,
		"enable-faq": true,
	},
	"legal": {
		"terms-of-use": "Terms of use",
		"end-user-agreement": "End user agreement",
		"privacy-policy": "Privacy Policy",
		"cookies-consent": "Cookies Consent",
	},
	"social": {
		
	},
	"contact": {
		"phone": "",
		"email": "",
		"address": "",
	},
};


export const SettingsContext = React.createContext();

export const SettingsProvider = props => {
	let [state, setState ] = useState(props);
	let [value, setValue] = useState(defaultValue);
	useEffect(() => { setState(props); }, [props]);

	const sockets = useSelector(state => state.sockets);


	const initSocketsListeners = () => {
		if (sockets.default) {
			sockets.default.on("create", async ({ context, action }) => {
				if (context === settingsDefination.model) {
					setValue({...value, [action.result.slug]: action.result.value });
				}
			});

			sockets.default.on("update", async ({ context, action }) => {
				if (context === settingsDefination.model) {
					setValue({...value, [action.result.slug]: action.result.value });
				}
			});
		}
		if (sockets.auth) {
			sockets.auth.on("create", async ({ context, action }) => {
				if (context === settingsDefination.model) {
					setValue({...value, [action.result.slug]: action.result.value });
				}
			});

			sockets.auth.on("update", async ({ context, action }) => {
				if (context === settingsDefination.model) {
					setValue({...value, [action.result.slug]: action.result.value });
				}
			});
		}
	}

		

	const fetchSettings = ()=>{
		fetching = true;
		SettingsService.getRecords({}).then(res => {
			fetched = true;
			fetching = false;
			let fetchedSettings = {};
			res.body.data.map((setting, index)=>{
				fetchedSettings[setting.slug] = setting.value;
			});
			defaultValue = {...value, ...fetchedSettings, settingsFetched: true};
			setValue(defaultValue);
				
		}).catch(e => {
			fetched = false;
			fetching = false;
		});
			
	}

	const updateSettings = async (name, new_value)=>{
		let updatedValue = false;
		if (String.isString(name)) {
			let slug = name.toLowerCase().variablelize("-");
			if (new_value !== value[slug]) {
				let postData = {
					name: name,
					slug: slug,
					value: new_value,
				}
				return await SettingsService.update(slug, postData, {create: 1}).then(res => {

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
	useEffect(() => { initSocketsListeners(); }, [sockets]);	

	if (!fetched && !fetching) {
		fetchSettings();
	}

	return (
		<SettingsContext.Provider value={{settings: value, updateSettings: updateSettings} } {...state}>
			{ props.children }
		</SettingsContext.Provider>
	);
}


export default SettingsProvider

export const useSettingsContext = () => {
	const context = React.useContext(SettingsContext);
	if (context === undefined) {
		throw new Error('useSettingsContext must be used within a SettingsProvider');
	}
	return context;
}

export const withSettingsContext = (Component) => {
	function WithSettingsContext(props) {
		let context = React.useContext(SettingsContext);
		let [state, setState ] = useState(props);
		let [settingsContext, setSettingsContext ] = useState(context);
		useEffect(() => { setSettingsContext(context); }, [context]);
		useEffect(() => { setState(props); }, [props]);

		if (context === undefined) {
			throw new Error('withSettingsContext must be used within a SettingsProvider');
			return ;
		}
		else {
			return <Component {...state} settingsContext={settingsContext} />
		}
		
	}

	return WithSettingsContext;
}
