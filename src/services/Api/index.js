import axios from 'axios';
import Cookies from "universal-cookie";
import { setupCache } from 'axios-cache-adapter';
import { baseUrls, client_id, client_secret, environment } from "config";
import store from "state/store";
import watch from 'redux-watch';
import decode from "jwt-decode";
import { authTokenLocation, authTokenName } from "config";
import { setAuthenticated, setCurrentUser, setToken, clearAppState } from "state/actions";

const DEFAULT = baseUrls.api.endsWith("/")? baseUrls.api : (baseUrls.api + "/");
const HOST = baseUrls.host;



// Create `axios-cache-adapter` instance
const axios_cache = setupCache({
	maxAge: 24 * 60 * 60 * 1000, //24 hours
	readHeaders: true,
});


	

const ApiSingleton = (function () {
	var instance;
	var instance_initialized = false;
	var instance_authenticated = false;
	var instance_user = false;
	var default_options = {
		cache: true,
		baseURL: DEFAULT,
		withCredentials: false,
		headers: {
			"x-client-id": client_id,
			"x-client-secret": client_secret,
			Authorization: "",
		}
	};
	// To mitigate mutation of default_options as an effect of instance_options mutation and not wanting to use Object.freeze()
	var instance_options = Object.toJSON(default_options);


	function endpoint(uri="/"){
		let endpoint_url = DEFAULT;
		if (!String.isEmpty(uri)) {
			uri = uri.trim();
			uri = uri.startsWith(DEFAULT)? uri.replace(DEFAULT, "") : ((uri.startsWith("/")? uri.substring(1) : uri));
		}
		return endpoint_url+uri;
	};

	function getAuthCookies() {
		let cookies = new Cookies();
		let access_token = cookies.get(authTokenName);
		let token_type = cookies.get(authTokenName + "_type");
		let refresh_token = cookies.get(authTokenName + "_refresh_token");
		if (access_token && token_type) {
			return {
				access_token: access_token,
				token_type: token_type,
				refresh_token: refresh_token,
			};
		}
		return null;
	}

	function getAccessToken() {
		if (authTokenLocation === "cookie") {
			return getAuthCookies();
		}
		else {
			//ToDo:- Get Redux state access_token
		}
		return null;
	}

	function getAuthorizationHeader(token) {
		//console.log("getAuthorizationHeader token", token)
		if (JSON.isJSON(token)) {
			return {
				Authorization: ("token_type" in token ? token.token_type + " " : "") +("access_token" in token ? token.access_token : ""),
			};
		}
		return {Authorization: ""};
	}

	function decodeAccessToken(access_token) {
		let token = access_token;
		if (JSON.isJSON(access_token) && access_token.access_token) {
			token = access_token.access_token;
		}
		if (String.isString(token)) {
			try {
				const payload = decode(token);
				return payload;
			} catch (e) {
				return null;
			}
		}
		return null;
	}

	function isAccessTokenValid(token) {
		let isValid = false;
		if ((JSON.isJSON(token) && !String.isEmpty(token.access_token)) || (String.isString(token) && !String.isEmpty(token))) {
			let token_value = JSON.isJSON(token)? token.access_token : token;
			//try to decode token
			try {
				const decodedToken = decode(token_value);
				isValid = Boolean(decodedToken);
			} catch (e) {}
		}

		return isValid;
	}

	function setAccessToken(access_token){
        if (authTokenLocation === "cookie") {
			const cookies = new Cookies();
			if (JSON.isJSON(access_token) && !JSON.isEmpty(access_token)) {
				
				let expires_date = new Date().addDays(365);
				let maxAge = 60 * 60 * 24 * 365;

				let options = {
					path: '/',
					expires: expires_date.addMilliSeconds(maxAge).toUTCString(),
					domain: baseUrls.domain,
					secure: environment === "production",
					httpOnly: false
				};

				const payload = decodeAccessToken(access_token.access_token);
				options.expires = expires_date;
				cookies.set(authTokenName, access_token.access_token, options);
				cookies.set(authTokenName+"_type", access_token.token_type, options);
				cookies.set(authTokenName+"_refresh_token", access_token.refresh_token, options);
				store.dispatch(setAuthenticated(true));
			}
			else {
				//Else Remove Browser cookie. Clear auth cookies clearance Intensions assummed here because lazy

				cookies.remove(authTokenName);
				cookies.remove(authTokenName + "_type");
				cookies.remove(authTokenName + "_refresh_token");
				store.dispatch(setAuthenticated(false));
				instance_options = JSON.merge(instance_options, {headers: {Authorization: ""}});
			}
		}
		else {
			//
			if (JSON.isJSON(access_token) && !JSON.isEmpty(access_token)) {
				store.dispatch(setToken(access_token));
				store.dispatch(setAuthenticated(true));
			}
			else {
				store.dispatch(setToken(false));
				store.dispatch(setAuthenticated(false));
			}
		}
    }

	function accessTokenSetAndValid() {
		let access_token = getAccessToken();
		return isAccessTokenValid(access_token);
	}

	function onErrorHandler(error) {
        let errobj = {
			...error,
			msg: "Request Failed",
			message: "Request Failed",
			body: null,
			code: 400,
		};
        if (error.response) {
			errobj = {
				headers: error.response.headers,
				...error.response,
				code: error.response.status,
				msg: error.response.statusText,
				message: error.response.statusText,
				body: error.response.data,
				
			};
			if (error.response.data) {
				if (error.response.data.message || error.response.data.msg || error.response.data.error) {
					errobj.msg = error.response.data.message || error.response.data.msg || error.response.data.error;
					errobj.message = error.response.data.message || error.response.data.msg || error.response.data.error;
				}
			}
		} else if (error.request) {
			errobj = {
				...error,
				code: 400,
				msg: "Request Error: " + error.message,
				message: "Request Error: " + error.message,
				body: null,
				
			};
		}

        //console.warn("onErrorHandler errobj", errobj);
        return Promise.reject(errobj);
    }

	function onSuccessHandler(response) {
		const {data:{message, msg, ...body}, status, headers, ...rest} = response;
		let res_message = message || msg || "Success";
		
		let res = {
			...rest,
			message: res_message,
			body: body,
			code: status,
			status: status,
			headers: headers,
		};
		
		return Promise.resolve(res);
	}
	
	function isUserAuthenticated(validUser=true) {
    	return accessTokenSetAndValid() && instance_authenticated && ((validUser && !JSON.isEmpty(instance_user)) || !validUser );
    }

    function login(data, get_profile=true) {
    	return new Promise((resolve, reject) => {
    		if (instance) {
    			if (isUserAuthenticated(get_profile) || isUserAuthenticated(!get_profile)) {    				
    				let resObj = {
						access_token: getAccessToken(),
						profile: instance_user,
					};
					if (get_profile && isUserAuthenticated(false)) {
		        		instance.get("profile").then(profile_res => {
							let profile = profile_res.body.data;
							store.dispatch(setCurrentUser(profile));
							resObj.profile = profile;
							resolve(resObj);								
						}).catch(err => {
			                reject(err);
			        	});
					}
					else{
						resolve(resObj);
					}
					
    			}
    			else {
    				const {device} = store.getState();
	    			instance.post("login", JSON.merge(data, {client_id: client_id, client_secret: client_secret, grant_type: "password", agent: device})).then(async res => {
		    			const res_access_token = Object.toJSON(res.body.data);
						let resObj = {
							access_token: res_access_token,
							profile: false,
						};
						setAccessToken(res_access_token);					
						if (get_profile) {
							let profile = await instance.get("profile").then(profile_res => {
								return profile_res.body.data;
							}).catch(err => {
			                    reject(err);
			                });
							if (JSON.isJSON(profile)) {
								store.dispatch(setCurrentUser(profile));
								resObj.profile = profile;
							}
						}
						resolve(resObj);
					}).catch(err => {
			            reject(err);
			        });
	    		
    			}
    		}
    		else {
    			let errObj = {
					msg: "Login Request Failed. Invalid Request service instance",
					message: "Login Request Failed. Invalid Request service instance",
					body: null,
					code: 400,
				};
				reject(errObj);
    		}
    			
	    		
    	});
    }

    function logout() {
    	return new Promise((resolve, reject) => {
            let current_access_token = getAccessToken();
            setAccessToken(null);
            store.dispatch(clearAppState());
            if (instance && current_access_token) {
    			instance.get("logout", { params: {access_token: current_access_token} }).then(res => {
    				resolve(res)
    			}).catch(err => {
    				//resolve any way
    				resolve({...err, error: true});
    			})
    		}
    		else{
    			resolve({});
    		}
        });
	    	
    }

    function logoutAll() {
    	return new Promise((resolve, reject) => {
            let current_access_token = getAccessToken();
            setAccessToken(null);
            store.dispatch(clearAppState());

            if (instance && current_access_token) {
    			instance.get("logout/all", { params: {access_token: current_access_token} }).then(res => {
    				resolve(res);
    			}).catch(err => {
    				//resolve any way
    				resolve({...err, error: true});
    			})
    		}

            resolve({});
        });
	    	
    }

    function logoutOthers() {
    	return new Promise((resolve, reject) => {
            let current_access_token = getAccessToken();
            setAccessToken(null);
            store.dispatch(clearAppState());

            if (instance && current_access_token) {
    			instance.get("logout/others", { params: {access_token: current_access_token} }).then(res => {
    				resolve(res);
    			}).catch(err => {
    				//resolve any way
    				resolve({...err, error: true});
    			})
    		}

            resolve({});
        });
	    	
    }

    function getContextRequests(service_uri="/", scope_instance = false) {
    	scope_instance = scope_instance || instance;
    	let context_uri = String.isString(service_uri)? (service_uri.trim().endsWith("/")? service_uri.trim().substring(0, service_uri.trim().length) : service_uri.trim()) : undefined;
    	if (scope_instance && !String.isEmpty(context_uri)) {
    		return {
    			getRecords: (params={})=> scope_instance.get(context_uri, { params: params }),
    			getRecordsCount: (params={})=> scope_instance.get((context_uri+"/count"), { params: params }),
    			getAggregatesCount: (params={})=> scope_instance.get((context_uri+"/count/aggregates"), { params: params }),
    			getRecordById: (id, params={})=> scope_instance.get((context_uri+"/"+id), { params: params }),
    			create: (data, params={})=> scope_instance.post((context_uri), data, { params: params }),
    			update: (id, data, params={})=> scope_instance.post((context_uri+ "/" + id), data, { params: params }),
    			deleteRecordById: (id, params={})=> scope_instance.delete((context_uri+ "/" + id), { params: params }),
    		}
    	}
    	return {};
    }

    function createIsolatedInstance(config = {}) {    	
        const {cache, ...options} = JSON.merge(default_options, instance_options, config);
        let isolatedInstance = axios.create((cache? (Boolean.isBoolean(cache)? {...options, adapter: axios_cache.adapter} : (cache.adapter? {...options, ...cache} : {...options})) : {...options}));        
		//Do not apply interceptors here unless you know. They make the other ins
		
        return isolatedInstance;
    }

    function getAttachmentFileUrl(attachment) {
		return endpoint("/attachments/download/" + (JSON.isJSON(attachment) && "_id" in attachment ? attachment._id : attachment));
	}

	

    function createInstance(config = {}) {
		if (!instance_initialized) {
			const {auth: {isAuthenticated, user}} = store.getState();
			instance_authenticated = isAuthenticated;
			instance_user = user;
			//console.log("api createInstance isAuthenticated", isAuthenticated);
			if (isAuthenticated) {
				var access_token = getAccessToken();
				//console.log("api createInstance access_token", access_token);
				if (access_token) {
					if (isAccessTokenValid(access_token)) {
						instance_options = JSON.merge(instance_options, {headers: { ...getAuthorizationHeader(access_token)}});
					}
					else {
						//Refresh 
						instance_options = JSON.merge(instance_options, {headers: { ...getAuthorizationHeader(null)}});
					}
				}
				else {
					instance_options = JSON.merge(instance_options, {headers: { ...getAuthorizationHeader(null)}});
				}
			}
			else{
				instance_options = JSON.merge(instance_options, {headers: { ...getAuthorizationHeader(null)}});
			}
				
			let watchAuthenticatedState = watch(store.getState, 'auth.isAuthenticated', Object.areEqual);
			store.subscribe(watchAuthenticatedState((newVal, oldVal, objectPath) => {
				instance_authenticated = newVal;
				if (newVal) {
					var access_token = getAccessToken();
					if (isAccessTokenValid(access_token)) {
						instance_options = JSON.merge(instance_options, {headers: { ...getAuthorizationHeader(access_token)}});		
					}
				}
				else{
					instance_options = JSON.merge(instance_options, {headers: { ...getAuthorizationHeader(null)}});
				}
				//console.log(objectPath, 'changed from', oldVal, 'to', newVal)
			}));

			let watchUserState = watch(store.getState, 'auth.user', Object.areEqual);

			store.subscribe(watchUserState((newVal, oldVal, objectPath) => {
				instance_user = newVal;
				//console.log(objectPath, 'changed from', oldVal, 'to', newVal)
			}));
			instance_initialized = true;
		}		
			
        const {cache, interceptors, ...options} = JSON.merge(default_options, config, instance_options);

        let newInstance = axios.create((cache? (Boolean.isBoolean(cache)? {...options, adapter: axios_cache.adapter} : (cache.adapter? {...options, ...cache} : {...options})) : {...options})); 
        //Custom interceptors to ensure authorization is kept and responses are formatted accordingly. PS: NO DUPLICATES HERE. One's for request. One's for Response.        
        newInstance.interceptors.request.use(function (config) {        	
        	config.headers = {...config.headers, ...getAuthorizationHeader(getAccessToken())}
			return config;
		}, function (error) {
    		return onErrorHandler(error);
		});

        newInstance.interceptors.response.use(function (response){
        	return onSuccessHandler(response)
        }, function(error) {
        	return onErrorHandler(error)
        });
        newInstance.getAttachmentFileUrl = getAttachmentFileUrl;
        
        newInstance.upload = (data, params = {}) => newInstance.post("/attachments/upload", data, params);
        newInstance.isolated = (config = {}) => createIsolatedInstance(config);
        newInstance.endpoint = (uri="/") => endpoint(uri);
        newInstance.isAccessTokenValid = (token) => isAccessTokenValid(token);
        newInstance.getAuthCookies = () => getAuthCookies();
        newInstance.getAccessToken = () => getAccessToken();
        newInstance.setAccessToken = (token) => setAccessToken(token);
        newInstance.accessTokenSetAndValid = () => accessTokenSetAndValid();
        newInstance.getAuthorizationHeader = () => getAuthorizationHeader();
        newInstance.getContextRequests = (service_uri="/", scope_instance = false) => getContextRequests(service_uri, scope_instance);
        newInstance.isUserAuthenticated = () => isUserAuthenticated();
        newInstance.login = (data, get_profile=true) => login(data, get_profile);
        newInstance.logout = () =>logout();
        newInstance.logoutAll = () =>logoutAll();
        newInstance.logoutOthers = () =>logoutOthers();
        newInstance.profile = (params)=>newInstance.get("profile", { params: params });
        newInstance.update_profile = (data)=>newInstance.post("profile", data);
        newInstance.signup = (data)=>newInstance.post("signup", data);        
        newInstance.forgotPassword = (data)=>newInstance.post("forgot-password", data);
        newInstance.forgot_password = (data)=>newInstance.post("forgot-password", data);
        newInstance.resetPassword = (data)=>newInstance.post("reset-password", data);
        newInstance.reset_password = (data)=>newInstance.post("reset-password", data);
        newInstance.verifyAccount = (data)=>newInstance.post("verify-account", data);
        newInstance.verify_account = (data)=>newInstance.post("verify-account", data);
        newInstance.getAccessToken = (params)=>newInstance.get("token", { params: params });
        newInstance.get_access_token = (params)=>newInstance.get("token", { params: params });
        newInstance.refreshAuthToken = (data)=>newInstance.post("refresh-token", data);
        newInstance.refresh_auth_token = (data)=>newInstance.post("refresh-token", data);
        

        
		
        return newInstance;
    }

    
   
    
    return {
        getInstance: function (options={}) {
            if (!instance || !instance_initialized) {
                instance = createInstance(options);
                instance.login({email: "colrium@gmail.com", password: "WI5HINd8"}).then(data => {});

				instance_initialized = true;
            }
            return instance;
        },
        destroyInstance: function() {	
			instance = undefined;
			instance_initialized = false;
			return instance;
		},
		isolated: createIsolatedInstance,
		endpoint: endpoint,
		isolated: createIsolatedInstance,
		isAccessTokenValid: isAccessTokenValid,
		accessTokenSetAndValid: accessTokenSetAndValid,
		getAuthCookies: getAuthCookies,
		getAccessToken: getAccessToken,
		setAccessToken: setAccessToken,
		getAuthorizationHeader: getAuthorizationHeader,
		getContextRequests: getContextRequests
    };

})();

export const api = ApiSingleton;

export default ApiSingleton.getInstance();
