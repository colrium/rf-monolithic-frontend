import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { apiCallRequest, setDataCache, setSettings, setPreferences, setInitialized, setCurrentUser } from "state/actions";
import AuthHelper from 'hoc/Auth';


import { defaultSocket } from "hoc/Sockets";
import * as definations from "definations";
import * as services from "services";

let models = {};
for (let defination of Object.values(definations)) {
	models[defination.name] = defination.model;
}

let defaultValue = {
	models: models,
	definations: definations,
	services: services,
	sockets: {
		default: defaultSocket(),
		auth: null,
	},
	internet: {
		available: false,
		checked: false,
	},
};

export const GlobalsContext = React.createContext(defaultValue);

const GlobalsProvider = props => {

	let [value, setValue] = useState(defaultValue);	
	let [valueInitialized, setValueInitialized] = useState(false);	
	let [settingsChangeCallBacks, setSettingsChangeCallBacks] = useState([]);
	let [preferencesChangeCallBacks, setPreferencesChangeCallBacks] = useState([]);	

	let { auth, cache: { data: dataCache }, api, app, apiCallRequest, setDataCache, setSettings, setPreferences, setInitialized, setCurrentUser } = props;
	

	const handleOnInternetAvailabilityChange = () => {
		const condition = navigator.onLine ? 'online' : 'offline';
		if (condition === 'online') {
				const webPing = setInterval(() => {
						fetch('//google.com', { mode: 'no-cors', }).then(() => {							
							setValue({...value, internet: { available: true, checked: true } });
							return clearInterval(webPing)							
						}).catch(() => {
							console.log("internet", value.internet);
							if (value.internet.available) {
								setValue({...value, internet: { available: false, checked: true }});
							}
						});
					}, 10000);
				return;
		}


		return setValue({...value, internet: { available: false, checked: false }});
	}

	
	useEffect(()=> {	

		//value.sockets = { default: defaultSocket() };

		value.updateSettings = async (name, new_value, writeonly=false) => {
			if (String.isString(name)) {
				let slug = name.toLowerCase().variablelize("-");
				if (new_value !== value[slug]) {
					let postData = {
						name: name,
						slug: slug,
						value: new_value,
						private: writeonly,
					};
					return await services.settings.update(slug, postData, { create: 1, }).then(res => {
						let newSettings = { ...app.settings, [slug]: new_value };
						for (var i = 0; i < settingsChangeCallBacks.length; i++) {
							settingsChangeCallBacks[i](newSettings);
						}
						return newSettings;
					}).catch(e => {
						return false;
					});
				}
			} else {
				return false;
			}
		};
		value.onSettingsChange = (cb) => {
			if (Function.isFunction(cb)) {
				setSettingsChangeCallBacks(settingsChangeCallBacks.concat([cb]));
			}
		}

		value.updatePreferences = async (name, new_value) => {
			let updatedValue = false;
			if (String.isString(name)) {
				let slug = name.toLowerCase().variablelize("-");
				if (new_value !== value[slug]) {
					let postData = {
						name: name,
						slug: slug,
						value: new_value,
						user: auth.user._id,
					};
					return await services.preferences.update(slug, postData, { create: 1 }).then(res => {
							let newPreferences = { ...app.preferences, [slug]: new_value };
							for (var i = 0; i < preferencesChangeCallBacks.length; i++) {
								preferencesChangeCallBacks[i](newPreferences);
							}
							return newPreferences;
						}).catch(e => {
							return false;
						});
				}
			} else {
				return false;
			}
		}

		value.onPreferencesChange = (cb) => {
			if (Function.isFunction(cb)) {
				setPreferencesChangeCallBacks(preferencesChangeCallBacks.concat([cb]));
			}
		}

		if (window) {
			window.addEventListener('online', handleOnInternetAvailabilityChange);
			window.addEventListener('offline', handleOnInternetAvailabilityChange);
		}
			
		setInitialized(true);
		setValueInitialized(true);	
		return () => {
			window.removeEventListener('online', handleOnInternetAvailabilityChange);
			window.removeEventListener('offline', handleOnInternetAvailabilityChange);
			setInitialized(false);
		}
	},[]);
	


	

	return (
		<GlobalsContext.Provider value={value} >
			{valueInitialized && props.children}
		</GlobalsContext.Provider>
	);
};

const mapStateToProps = state => ({	
	api: state.api,
	app: state.app,
	auth: state.auth,
	cache: state.cache,
});

export default connect(mapStateToProps, { apiCallRequest, setDataCache, setSettings, setPreferences, setInitialized, setCurrentUser })(GlobalsProvider);

/*export const useGlobals = () => {
	const context = React.useContext(GlobalsContext);
	if (context === undefined) {
		throw new Error(
			"useGlobals must be used within a GlobalsProvider"
		);
	}
	return context;
};

export const withGlobals = Component => {
	function WithGlobals(props) {
		let context = React.useContext(GlobalsContext);
		
		if (context === undefined) {
			throw new Error("withGlobals must be used within a GlobalsProvider");
		}

		return <Component {...props} globals={context} />;
	}

	return WithGlobals;
};*/


export const useGlobals = () => {
	return React.useContext(GlobalsContext);
};


export const withGlobals = Component => {
	function WithGlobals(props) {
		let {...context} = useGlobals();

		if (context === undefined) {
			//throw new Error("withGlobals must be used within a GlobalsProvider");
			//context = defaultValue;
		}

		return <Component {...props} {...context} />;
	}

	return WithGlobals;
};