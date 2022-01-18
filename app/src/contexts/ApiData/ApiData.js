import React from 'react';
import {withNetworkServices} from "contexts/NetworkServices";
import { connect } from "react-redux";
import { setCurrentUser } from "state/actions";

import * as definations from "definations";
import { EventRegister } from "utils";
import compose from "recompose/compose";
let models = {
	actionlogs: "ActionTrail",
	answers: "Answer",
	applications: "Application",
	attachments: "Attachment",
	commissions: "Commission",
	conversations: "Conversation",
	coupons: "Coupon",
	courses: "Course",
	currencies: "Currency",
	demorequests: "DemoRequest",
	emails: "Email",
	events: "Event",
	forms: 'Form',
	formvalues: "FormValue",
	fulfilments: "Fulfilment",
	invoices: "Invoice",
	messages: "Message",
	notifications: "Notification",
	orderitems: "OrderItem",
	orders: "Order",
	payments: "Payment",
	posts: "Post",
	preferences: "Preference",
	queries: "SurveyQuery",
	questions: "Question",
	quizes: "Quiz",
	quoterequests: "ProposalRequest",
	responses: "Response",
	results: "Result",
	retailitems: "RetailItem",
	settings: "Setting",
	surveys: "Survey",
	teams: "Team",
	tracks: "Track",
	users: "User",
	vacancies: "Vacancy",
};

class ApiData extends React.PureComponent {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.handleSocketsConnected = this.handleSocketsConnected.bind(this);
		this.handleSocketsReconnected = this.handleSocketsReconnected.bind(this);
		this.handleSocketsDisconnected = this.handleSocketsDisconnected.bind(this);
		this.getLocalStorageData = this.getLocalStorageData.bind(this);
		this.setLocalStorageData = this.setLocalStorageData.bind(this);
		this.persistToCache = this.persistToCache.bind(this);
		
		this.initializeData = this.initializeData.bind(this);
		this.getById = this.getById.bind(this);
		this.get = this.get.bind(this);
		this.post = this.post.bind(this);
		this.postMany = this.postMany.bind(this);
		this.update = this.update.bind(this);
		this.updateMany = this.updateMany.bind(this);
		this.delete = this.delete.bind(this);
		this.deleteMany = this.deleteMany.bind(this);
		
		

		//const {auth} = this.props;
		
		////
		this.state = this.initializeData();
	}

	componentDidMount() {
		this._isMounted = true;
		this.initializeSockets();
	}

	componentWillUnmount() {
		this._isMounted = false;

	}

	getLocalStorageData(scope=false){
		let cacheState = String.isEmpty(scope)? {data: [], pagination: {pages: 0, page: 0, count: 0 }} : {};
		try {
			let apiCache = localStorage.getItem("api-cache") ? JSON.parse(localStorage.getItem("api-cache")) : {};
			cacheState = String.isEmpty(scope)? apiCache : {...cacheState, ...apiCache[scope]}
		} catch (error) {
			console.log("getLocalStorageData error", error)
		}
		return cacheState;
	}

	getLocalStorageDataItemById(scope=false, id=""){
		let cacheStateItem = null;
		try {
			let apiCache = localStorage.getItem("api-cache") ? JSON.parse(localStorage.getItem("api-cache")) : {};
			let cacheState = String.isEmpty(scope)? apiCache : {...cacheState, ...apiCache[scope]}
			let indexIncacheState = -1
			if (Array.isArray(cacheState?.data)) {
				indexIncacheState = cacheState.data.findIndex(entry => (entry?.uuid === id || entry?._id === id ));
				cacheStateItem = cacheState[indexIncacheState]
			}

		} catch (error) {
			console.log("getLocalStorageData error", error)
		}
		return cacheStateItem;
	}

	setLocalStorageData(scope=false, value={}){
		let allCacheState = this.getLocalStorageData(false);
		if (!String.isEmpty(scope)) {
			allCacheState[scope] = {...allCacheState[scope], ...value}
		}
		else {
			allCacheState = {...value}
		}
		try {
			localStorage.setItem("api-cache", JSON.stringify(allCacheState));
		} catch (error) {
			console.log("setLocalStorageData error", error)
		}
		return allCacheState;
	}

	persistToCache(scope, value={data: [], pagination: {pages: 0, page: 0, count: 0}}, action="append"){
		const {data, pagination} = value
		const cacheValue = this.getLocalStorageData(scope)
		let cachedIds = [];
		let newCachedData = [];
		if (Array.isArray(cacheValue?.data)) {
			cachedIds = cacheValue.data.reduce((currentCachedIds, cachedEntry) => {
				currentCachedIds.push(cachedEntry._id);
				return currentCachedIds;
			}, [])
		}
		if (Array.isArray(data)) {
			newCachedData = data.reduce((currentNewCachedData, entry) => {
				let cacheIndex = cachedIds.indexOf(entry._id);
				if (cacheIndex !== -1) {
					if (action === "delete") {
						currentNewCachedData.splice(cacheIndex, 1)
					}
					else {
						currentNewCachedData[cacheIndex] = (JSON.merge(cacheValue.data[cacheIndex], entry))
					}
				}
				else {
					if (action === "prepend") {
						currentNewCachedData.unshift(entry)
					}
					else if (action === "append") {
						currentNewCachedData.push(entry)
					}
				}
				return currentNewCachedData;
			}, Array.isArray(cacheValue?.data)? cacheValue.data : [])
		}

		let localcache = this.setLocalStorageData(scope, {data: newCachedData, pagination:{...cacheValue.pagination, ...pagination}})
		if (this._isMounted) {
			this.setState(prevState => ({
				[scope]: {
					...prevState[scope],
					data: localcache[scope].data,
					pagination: localcache[scope].pagination
				}								
			}))
		}
		return localcache[scope];				
		
	}

	

	getById = (scope="") => (id, options={}) => {
		const { networkServices, auth, cache } = this.props;
		const { Sockets, Api } = networkServices || {}
		const {isAuthenticated, user} = auth || {};
		const { persist=true, ...reqConfig} = options || {}
		let uri = definations[scope]?.endpoint || scope;
		return new	Promise((resolve, reject) => {
			if (!String.isEmpty(uri) && !String.isEmpty(id)) {
				uri = uri.trim();
				if (!uri.endsWith("/")) {
					uri = `${uri}/${id.trim()}`;
				}
				else{
					uri = `${uri}${id.trim()}`;
				}
			}
			try {
				if (!String.isEmpty(uri)) {
					uri = uri.trim();
				}
				if (!String.isEmpty(uri) ) {				
					Api.get(uri, {...reqConfig}).then(res => {
						const { data={} } = res.body || {};
						if (persist && !JSON.isEmpty(data)) {
							let cachedData =this.persistToCache(scope, {data: [data]})
						}
						resolve(res.body);
					}).catch(error => {
						if (this._isMounted) {
							this.setState(prevState => {
								return {
										[scope]: {
											...prevState[scope],
											error: error,
										}
								}
							})
						}
						reject({data: this.getLocalStorageDataItemById(scope, id), error})
					})
				}
				else{
					reject({data: this.getLocalStorageDataItemById(scope, id), error: new Error("Missing required parameter uri")});
				}
			} catch (error) {
				reject({data: this.getLocalStorageDataItemById(scope, id), error})
			}
			
		})
			

	}
	get = (scope="") => (options={})  => {
		const { networkServices, auth, cache } = this.props;
		const { Sockets, Api } = networkServices || {}
		const {isAuthenticated, user} = auth || {}
		const { persist=true, ...reqConfig } = options || {}
		let uri = definations[scope]?.endpoint || scope;
		return new	Promise((resolve, reject) => {
			try {
				if (!String.isEmpty(uri)) {
					uri = uri.trim();
				}
				if (!String.isEmpty(uri) ) {				
					Api.get(uri, {...reqConfig}).then(res => {
						const { data=[], pages=0, page=0, count=0 } = res.body || {};
						if (persist) {
							let cachedData =this.persistToCache(scope, {data: data, pagination:{pages, page, count}})
						}
						resolve(res.body);
					}).catch(error => {
						if (this._isMounted) {
							this.setState(prevState => {
								return {
										[scope]: {
											...prevState[scope],
											error: error,
										}
								}
							})
						}
						reject({...this.getLocalStorageData(scope), error})
					})
				}
				else{
					reject({...this.getLocalStorageData(scope), error: new Error("Missing required parameter uri")});
				}
			} catch (error) {
				reject({...this.getLocalStorageData(scope), error})
			}
				
		})
	}
	post = (scope="") => ( data={}, options={})  => {
		const { networkServices, auth, cache } = this.props;
		const { Sockets, Api } = networkServices || {}
		const {isAuthenticated, user} = auth || {}
		const { persist=true, ...reqConfig } = options || {}
		let uri = definations[scope]?.endpoint || scope;
		return new	Promise((resolve, reject) => {
			try {
				if (!String.isEmpty(uri)) {
					uri = uri.trim();
				}
				if (!String.isEmpty(uri) ) {				
					Api.get(uri, data, {...reqConfig}).then(res => {
						const { data={} } = res.body || {};
						if (persist && !JSON.isEmpty(data)) {
							let cachedData =this.persistToCache(scope, {data: [data]})
						}
						resolve(res.body);
					}).catch(error => {
						if (this._isMounted) {
							this.setState(prevState => {
								return {
										[scope]: {
											...prevState[scope],
											error: error,
										}
								}
							})
						}
						reject({ error})
					})
				}
				else{
					reject({ error: new Error("Missing required parameter uri")});
				}
			} catch (error) {
				reject({ error})
			}
				
		})
			
	}
	postMany = (context="") => (data=[], options={})  => {
		const { networkServices, auth, cache } = this.props;
		const { Sockets, Api } = networkServices || {}
		const {isAuthenticated, user} = auth || {};
		const apiRequest = this.post(context);
		return new	Promise((resolve, reject) => {
			Promise.allSettled(data.map(entry => apiRequest(data, options))).then(res => {
				resolve(res)
			});
		});
	}
	// put = (context="") => ( id, data={}, options={})  => {
	// 	const { networkServices, auth, cache } = this.props;
	// 	const { Sockets, Api } = networkServices || {}
	// 	const {isAuthenticated, user} = auth || {};
	// 	const { persist=true, ...reqConfig} = options || {}
	// 	let uri = definations[scope]?.endpoint || scope;
	// 	return new	Promise((resolve, reject) => {
	// 		if (!String.isEmpty(uri) && !String.isEmpty(id)) {
	// 			uri = uri.trim();
	// 			if (!uri.endsWith("/")) {
	// 				uri = `${uri}/${id.trim()}`;
	// 			}
	// 			else{
	// 				uri = `${uri}${id.trim()}`;
	// 			}
	// 		}
	// 		try {
	// 			if (!String.isEmpty(uri)) {
	// 				uri = uri.trim();
	// 			}
	// 			if (!String.isEmpty(uri) ) {				
	// 				Api.put(uri, data, {...reqConfig}).then(res => {
	// 					const { data={} } = res.body || {};
	// 					if (persist && !JSON.isEmpty(data)) {
	// 						let cachedData =this.persistToCache(scope, {data: [data]})
	// 					}
	// 					resolve(res.body);
	// 				}).catch(error => {
	// 					if (this._isMounted) {
	// 						this.setState(prevState => {
	// 							return {
	// 									[scope]: {
	// 										...prevState[scope],
	// 										error: error,
	// 									}
	// 							}
	// 						})
	// 					}
	// 					reject({data: this.getLocalStorageDataItemById(scope, id), error})
	// 				})
	// 			}
	// 			else{
	// 				reject({data: this.getLocalStorageDataItemById(scope, id), error: new Error("Missing required parameter uri")});
	// 			}
	// 		} catch (error) {
	// 			reject({data: this.getLocalStorageDataItemById(scope, id), error})
	// 		}
			
	// 	})
	// }
	update = (context="") => ( id, data={}, options={})  => {
		const { networkServices, auth, cache } = this.props;
		const { Sockets, Api } = networkServices || {}
		const {isAuthenticated, user} = auth || {};
		const { persist=true, ...reqConfig} = options || {}
		let uri = definations[scope]?.endpoint || scope;
		return new	Promise((resolve, reject) => {
			if (!String.isEmpty(uri) && !String.isEmpty(id)) {
				uri = uri.trim();
				if (!uri.endsWith("/")) {
					uri = `${uri}/${id.trim()}`;
				}
				else{
					uri = `${uri}${id.trim()}`;
				}
			}
			try {
				if (!String.isEmpty(uri)) {
					uri = uri.trim();
				}
				if (!String.isEmpty(uri) ) {				
					Api.put(uri, data, {...reqConfig}).then(res => {
						const { data={} } = res.body || {};
						if (persist && !JSON.isEmpty(data)) {
							let cachedData =this.persistToCache(scope, {data: [data]})
						}
						resolve(res.body);
					}).catch(error => {
						if (this._isMounted) {
							this.setState(prevState => {
								return {
										[scope]: {
											...prevState[scope],
											error: error,
										}
								}
							})
						}
						reject({data: this.getLocalStorageDataItemById(scope, id), error})
					})
				}
				else{
					reject({data: this.getLocalStorageDataItemById(scope, id), error: new Error("Missing required parameter uri")});
				}
			} catch (error) {
				reject({data: this.getLocalStorageDataItemById(scope, id), error})
			}
			
		})
	}
	updateMany = (context="") => (data=[], options={})  => {
		const { networkServices, auth, cache } = this.props;
		const { Sockets, Api } = networkServices || {}
		const {isAuthenticated, user} = auth || {}
		const apiRequest = this.update(context);
		return new	Promise((resolve, reject) => {
			Promise.allSettled(data.map(entry => apiRequest(data, options))).then(res => {
				resolve(res)
			});
		});
	}
	delete = (endpoint) => (id=false, options={})  => {
		const { networkServices, auth, cache } = this.props;
		const { Sockets, Api } = networkServices || {}
		const {isAuthenticated, user} = auth || {}
	}
	deleteMany = (endpoint) => (ids=[], options={})  => {
		const { networkServices, auth, cache } = this.props;
		const { Sockets, Api } = networkServices || {}
		const {isAuthenticated, user} = auth || {}

	}

	search = (name) => (keyword="", options={})  => {
		const { networkServices, auth, cache } = this.props;
		const { Sockets, Api } = networkServices || {}
		const {isAuthenticated, user} = auth || {}

	}
	

	initializeData() {
		const { networkServices, auth, cache } = this.props;
		const { Sockets, Api } = networkServices || {}
		const {isAuthenticated, user} = auth || {}
		// console.log("initializeData networkServices", networkServices)
		let initialData = {};
		initialData = Object.entries(definations).reduce((currentValue, [name, defination]) => {
			currentValue[name] = {
				data: [],
				pagination: {pages: 0, page: 0, count: 0 },				
				endpoint: defination.endpoint,
				loading: false,				
				error: false,
				getById: this.getById(name),
				get: this.get(name),
				post: this.post(name),
				postMany: this.postMany(name),
				// put: this.put(name),
				update: this.update(name),
				updateMany: this.updateMany(name),
				delete: this.delete(name),
				deleteMany: this.deleteMany(name),
				...this.getLocalStorageData(name)
			}
			return currentValue
		}, {})
		// console.log("initializeData initialData", initialData)
		// if (isAuthenticated && !JSON.isEmpty(user) && Sockets && Sockets.connected) {

		// }

		return initialData



	}

	initializeSockets() {
		const { networkServices, auth, cache, setCurrentUser } = this.props;
		const { Sockets, Api } = networkServices || {}
		const {isAuthenticated, user} = auth || {}
		Sockets.on("connect", this.handleSocketsConnected);
		Sockets.on("reconnect", this.handleSocketsReconnected);
		Sockets.on("disconnect", this.handleSocketsDisconnected);
		Sockets.on("create", async ({ context, action }) => {
			let defination = definations[JSON.keyOf(models, context)];
			if (defination && isAuthenticated) {
				let cacheData = defination?.cache;
				if (!["preferences", "settings"].includes(defination?.name) && cacheData && defination?.access?.view.single(user, action.result)) {
					persistToCache(defination?.name, {data: [action.result]}, "prepend")
				}
			}
		});

		Sockets.on("update", async ({ context, action }) => {
			let defination = definations[JSON.keyOf(models, context)];


			if (defination && isAuthenticated) {
				if (defination.name === "users") {
					if (action.result._id === user._id) {
						setCurrentUser(action.result);
					}
				}
				if (!["preferences", "settings"].includes(defination.name) && defination?.cache && defination?.access?.view.single(user, action.result)) {
					persistToCache(defination?.name, {data: [action.result]})
				}
			}
		});

		Sockets.on("delete", async ({ context, action }) => {
			let defination = definations[JSON.keyOf(models, context)];
			if (defination && isAuthenticated) {
				if (defination.name === "users") {
					if (action.result._id === user._id) {
						// setCurrentUser(action.result);

						//Logout
						EventRegister.emit("logout")
					}
				}
				if (!["preferences", "settings"].includes(defination.name) && defination?.cache && defination?.access?.view.single(user, action.result)) {
					persistToCache(defination?.name, {data: [action.result]})
				}
			}
		});
	}

	handleSocketsConnected() {
		const { auth: { isAuthenticated, user } } = this.props;
		if (isAuthenticated && !JSON.isEmpty(user)) {

		}
	}



	handleSocketsReconnected() {

	}

	handleSocketsDisconnected() {

	}
	render() {
		const { children } = this.props;
		return children({ ...this.state, definations: definations });
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
	cache: state.cache,
});



export default compose(connect(mapStateToProps, { setCurrentUser }), withNetworkServices)(ApiData);