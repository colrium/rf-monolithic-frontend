/** @format */

import React from "react";
import { withNetworkServices } from "contexts/NetworkServices";
import { connect } from "react-redux";
import { setCurrentUser } from "state/actions";

import * as definations from "definations";
import { EventRegister } from "utils";
import compose from "recompose/compose";
import { withCacheDatabase } from "contexts/CacheDatabase"
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
	forms: "Form",
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
}

class ApiData extends React.PureComponent {
	constructor(props) {
		super(props)
		this._isMounted = false
		this.handleSocketsConnected = this.handleSocketsConnected.bind(this)
		this.handleSocketsReconnected = this.handleSocketsReconnected.bind(this)
		this.handleSocketsDisconnected = this.handleSocketsDisconnected.bind(this)
		this.getLocalStorageData = this.getLocalStorageData.bind(this)
		this.setLocalStorageData = this.setLocalStorageData.bind(this)
		this.persistToCache = this.persistToCache.bind(this)

		this.initializeData = this.initializeData.bind(this)
		this.getById = this.getById.bind(this)
		this.get = this.get.bind(this)
		this.post = this.post.bind(this)
		this.postMany = this.postMany.bind(this)
		this.update = this.update.bind(this)
		this.updateMany = this.updateMany.bind(this)
		this.delete = this.delete.bind(this)
		this.deleteMany = this.deleteMany.bind(this)
		this.getApiCacheData = this.getApiCacheData.bind(this)
		this.initializeScopeData = this.initializeScopeData.bind(this)
		this.cacheDatabase = props.cacheDatabase
		this.state = this.initializeData()
	}

	componentDidMount() {
		this._isMounted = true
		this.initializeSockets()
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	getLocalStorageData(scope = false) {
		let cacheState = String.isEmpty(scope) ? { data: [], pagination: { pages: 0, page: 0, count: 0 } } : {}
		try {
			let apiCache = localStorage.getItem("api-cache") ? JSON.parse(localStorage.getItem("api-cache")) : {}
			cacheState = String.isEmpty(scope) ? apiCache : { ...cacheState, ...apiCache[scope] }
		} catch (error) {
			console.log("getLocalStorageData error", error)
		}
		return cacheState
	}

	async getApiCacheData(scope = false) {
		let cacheState = { data: [], pagination: { pages: 0, page: 0, count: 0 } }
		if (!String.isEmpty(scope)) {
			let data = await this.cacheDatabase[scope]?.toArray()
			let apidatarequests = await this.cacheDatabase.apidatarequests?.where("scope").equalsIgnoreCase(scope).first()
			if (!Array.isArray(data)) {
				data = []
			}
			if (JSON.isEmpty(apidatarequests)) {
				this.cacheDatabase.apidatarequests?.add({ scope: scope, params: { pagination: { pages: 0, page: 0, count: 0 } } })
				apidatarequests = { scope: scope, params: { pagination: { pages: 0, page: 0, count: 0 } } }
			}
			cacheState = { data: data, ...apidatarequests.params }
		}

		// console.log("getApiCacheData cacheState", cacheState)
		return cacheState
	}

	getLocalStorageDataItemById(scope = false, id = "") {
		let cacheStateItem = null
		try {
			let apiCache = localStorage.getItem("api-cache") ? JSON.parse(localStorage.getItem("api-cache")) : {}
			let cacheState = String.isEmpty(scope) ? apiCache : { ...cacheState, ...apiCache[scope] }
			let indexIncacheState = -1
			if (Array.isArray(cacheState?.data)) {
				indexIncacheState = cacheState.data.findIndex(entry => entry?.uuid === id || entry?._id === id)
				cacheStateItem = cacheState[indexIncacheState]
			}
		} catch (error) {}
		return cacheStateItem
	}

	setLocalStorageData(scope = false, value = {}) {
		let allCacheState = this.getLocalStorageData(false)
		if (!String.isEmpty(scope)) {
			allCacheState[scope] = { ...allCacheState[scope], ...value }
		} else {
			allCacheState = { ...value }
		}
		try {
			localStorage.setItem("api-cache", JSON.stringify(allCacheState))
		} catch (error) {
			console.log("setLocalStorageData error", error)
		}
		return allCacheState
	}

	async persistToCache(scope, value = { data: [], pagination: { pages: 0, page: 0, count: 0 } }, action = "append") {
		const { data, pagination } = value
		const cacheValue = await this.getApiCacheData(scope)

		let cachedIds = []
		let newCachedData = []
		if (Array.isArray(cacheValue?.data)) {
			newCachedData = [...cacheValue?.data]
			cachedIds = cacheValue.data.reduce((currentCachedIds, cachedEntry) => {
				currentCachedIds.push(cachedEntry._id || cachedEntry.uuid)
				return currentCachedIds
			}, [])
		}
		if (Array.isArray(data)) {
			newCachedData = data.reduce(
				(currentNewCachedData, entry) => {
					let cacheIndex = cachedIds.indexOf(entry._id || entry.uuid)
					if (cacheIndex !== -1) {
						if (action === "delete") {
							currentNewCachedData.splice(cacheIndex, 1)
							if (!String.isEmpty(entry._id)) {
								this.cacheDatabase[scope].where("_id").equalsIgnoreCase(entry._id)?.delete()
							} else if (!String.isEmpty(entry.uuid)) {
								this.cacheDatabase[scope].where("uuid").equalsIgnoreCase(entry._id)?.delete()
							}
						} else {
							currentNewCachedData[cacheIndex] = JSON.merge(cacheValue.data[cacheIndex], entry)
							if (entry.id) {
								this.cacheDatabase[scope].update(entry.id, entry)
							} else {
								this.cacheDatabase[scope].add(entry)
							}
						}
					} else {
						if (action === "prepend") {
							currentNewCachedData.unshift(entry)
						} else if (action === "append") {
							currentNewCachedData.push(entry)
						}

						this.cacheDatabase[scope].add(entry)
					}
					return currentNewCachedData
				},
				Array.isArray(cacheValue?.data) ? cacheValue.data : []
			)
		}
		if (Array.isArray(cacheValue?.data)) {
			newCachedData = newCachedData.concat(cacheValue.data).sort((a, b) => a.id - b.id)
		}

		let nextState = {
			data: newCachedData,
			pagination: { ...cacheValue.pagination, ...pagination },
		}
		let apidatarequest = await this.cacheDatabase.apidatarequests?.where("scope").equalsIgnoreCase(scope).first()
		if (JSON.isEmpty(apidatarequest) && !!this.cacheDatabase.apidatarequests) {
			this.cacheDatabase.apidatarequests.add({ scope: scope, params: { pagination: nextState.pagination } })
		} else if (!!this.cacheDatabase.apidatarequests) {
			apidatarequest.params = { ...apidatarequest.params, pagination: { ...apidatarequest.pagination, ...nextState.pagination } }
			this.cacheDatabase.apidatarequests.put(apidatarequest)
		}
		if (this._isMounted) {
			this.setState(prevState => ({
				[scope]: {
					...prevState[scope],
					...nextState,
					loading: false,
					error: null,
				},
			}))
		}
		return nextState
	}

	getById =
		(scope = "") =>
		(id, options = {}) => {
			const { networkServices, auth, cache } = this.props
			const { SocketIO, Api } = networkServices || {}
			const { isAuthenticated, user } = auth || {}
			const { persist, ...reqConfig } = options || {}
			let uri = definations[scope]?.endpoint || scope
			return new Promise((resolve, reject) => {
				if (!String.isEmpty(uri) && !String.isEmpty(id)) {
					uri = uri.trim()
					if (!uri.endsWith("/")) {
						uri = `${uri}/${id.trim()}`
					} else {
						uri = `${uri}${id.trim()}`
					}
				}
				try {
					if (!String.isEmpty(uri)) {
						uri = uri.trim()
					}
					if (!String.isEmpty(uri)) {
						Api.get(uri, { ...reqConfig })
							.then(res => {
								const { data = {} } = res.body || {}
								// if (persist && !JSON.isEmpty(data)) {
								// 	this.persistToCache(scope, { data: [data] })
								// }
								resolve(res.body)
							})
							.catch(error => {
								if (this._isMounted) {
									this.setState(prevState => {
										return {
											[scope]: {
												...prevState[scope],
												error: error,
											},
										}
									})
								}
								reject({
									data: this.getLocalStorageDataItemById(scope, id),
									error,
								})
							})
					} else {
						reject({
							data: this.getLocalStorageDataItemById(scope, id),
							error: new Error("Missing required parameter uri"),
						})
					}
				} catch (error) {
					reject({
						data: this.getLocalStorageDataItemById(scope, id),
						error,
					})
				}
			})
		}
	get =
		(scope = "") =>
		(options = {}) => {
			const { networkServices, auth, cache } = this.props
			const { SocketIO, Api } = networkServices || {}
			const { isAuthenticated, user } = auth || {}
			const { persist = true, ...reqConfig } = options || {}
			let uri = definations[scope]?.endpoint || scope
			return new Promise((resolve, reject) => {
				try {
					if (!String.isEmpty(uri)) {
						uri = uri.trim()
					}
					if (!String.isEmpty(uri)) {
						this.setState(prevState => ({
							[scope]: {
								...prevState[scope],
								loading: true,
							},
						}))
						Api.get(uri, { ...reqConfig })
							.then(res => {
								const { data = [], pages = 0, page = 0, count = 0 } = res.body || {}
								if (persist) {
									this.persistToCache(scope, {
										data: data,
										pagination: { pages, page, count },
									})
								} else {
									if (this._isMounted) {
										this.setState(prevState => {
											return {
												[scope]: {
													...prevState[scope],
													loading: false,
													error: null,
												},
											}
										})
									}
								}
								resolve(res)
							})
							.catch(error => {
								if (this._isMounted) {
									this.setState(prevState => {
										return {
											[scope]: {
												...prevState[scope],
												loading: false,
												error: error,
											},
										}
									})
								}
								reject({
									...this.getLocalStorageData(scope),
									error,
								})
							})
					} else {
						reject({
							...this.getLocalStorageData(scope),
							error: new Error("Missing required parameter uri"),
						})
					}
				} catch (error) {
					reject({ ...this.getLocalStorageData(scope), error })
				}
			})
		}
	post =
		(scope = "") =>
		(data = {}, options = {}) => {
			const { networkServices, auth, cache } = this.props
			const { SocketIO, Api } = networkServices || {}
			const { isAuthenticated, user } = auth || {}
			const { persist = true, ...reqConfig } = options || {}
			let uri = definations[scope]?.endpoint || scope
			return new Promise((resolve, reject) => {
				try {
					if (!String.isEmpty(uri)) {
						uri = uri.trim()
					}
					if (!String.isEmpty(uri)) {
						Api.get(uri, data, { ...reqConfig })
							.then(res => {
								const { data = {} } = res.body || {}
								if (persist && !JSON.isEmpty(data)) {
									this.persistToCache(scope, { data: [data] })
								}
								resolve(res.body)
							})
							.catch(error => {
								if (this._isMounted) {
									this.setState(prevState => {
										return {
											[scope]: {
												...prevState[scope],
												error: error,
											},
										}
									})
								}
								reject({ error })
							})
					} else {
						reject({
							error: new Error("Missing required parameter uri"),
						})
					}
				} catch (error) {
					reject({ error })
				}
			})
		}
	postMany =
		(context = "") =>
		(data = [], options = {}) => {
			const { networkServices, auth, cache } = this.props
			const { SocketIO, Api } = networkServices || {}
			const { isAuthenticated, user } = auth || {}
			const apiRequest = this.post(context)
			return new Promise((resolve, reject) => {
				Promise.allSettled(data.map(entry => apiRequest(data, options))).then(res => {
					resolve(res)
				})
			})
		}

	update =
		(context = "") =>
		(id, data = {}, options = {}) => {
			const { networkServices, auth, cache } = this.props
			const { SocketIO, Api } = networkServices || {}
			const { isAuthenticated, user } = auth || {}
			const { persist = true, ...reqConfig } = options || {}
			let uri = definations[scope]?.endpoint || scope
			return new Promise((resolve, reject) => {
				if (!String.isEmpty(uri) && !String.isEmpty(id)) {
					uri = uri.trim()
					if (!uri.endsWith("/")) {
						uri = `${uri}/${id.trim()}`
					} else {
						uri = `${uri}${id.trim()}`
					}
				}
				try {
					if (!String.isEmpty(uri)) {
						uri = uri.trim()
					}
					if (!String.isEmpty(uri)) {
						Api.put(uri, data, { ...reqConfig })
							.then(res => {
								const { data = {} } = res.body || {}
								if (persist && !JSON.isEmpty(data)) {
									this.persistToCache(scope, { data: [data] })
								}
								resolve(res.body)
							})
							.catch(error => {
								if (this._isMounted) {
									this.setState(prevState => {
										return {
											[scope]: {
												...prevState[scope],
												error: error,
											},
										}
									})
								}
								reject({
									data: this.getLocalStorageDataItemById(scope, id),
									error,
								})
							})
					} else {
						reject({
							data: this.getLocalStorageDataItemById(scope, id),
							error: new Error("Missing required parameter uri"),
						})
					}
				} catch (error) {
					reject({
						data: this.getLocalStorageDataItemById(scope, id),
						error,
					})
				}
			})
		}
	updateMany =
		(context = "") =>
		(data = [], options = {}) => {
			const { networkServices, auth, cache } = this.props
			const { SocketIO, Api } = networkServices || {}
			const { isAuthenticated, user } = auth || {}
			const apiRequest = this.update(context)
			return new Promise((resolve, reject) => {
				Promise.allSettled(data.map(entry => apiRequest(data, options))).then(res => {
					resolve(res)
				})
			})
		}
	delete =
		endpoint =>
		(id = false, options = {}) => {
			const { networkServices, auth, cache } = this.props
			const { SocketIO, Api } = networkServices || {}
			const { isAuthenticated, user } = auth || {}
		}
	deleteMany =
		endpoint =>
		(ids = [], options = {}) => {
			const { networkServices, auth, cache } = this.props
			const { SocketIO, Api } = networkServices || {}
			const { isAuthenticated, user } = auth || {}
		}

	initializeScopeData = scope => () => {
		this.getApiCacheData(scope).then(res => {
			if (this._isMounted) {
				this.setState(prevState => ({
					[scope]: {
						...prevState[scope],
						...res,
					},
				}))
			} else {
				this.state = {
					...this.state,
					[scope]: {
						...this.state[scope],
						...res,
						loading: false,
						error: null,
					},
				}
			}
		})
	}

	initializeData() {
		const { networkServices, auth, cache } = this.props
		const { SocketIO, Api } = networkServices || {}
		const { isAuthenticated, user } = auth || {}
		// console.log("initializeData networkServices", networkServices)
		let initialData = {}
		initialData = Object.entries(definations).reduce((currentValue, [name, defination]) => {
			currentValue[name] = {
				data: [],
				pagination: { pages: 0, page: 0, count: 0 },
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
				initializeData: this.initializeScopeData(name),
			}

			return currentValue
		}, {})
		console.log("initializeData initialData", initialData)
		// if (isAuthenticated && !JSON.isEmpty(user) && SocketIO && SocketIO.connected) {

		// }

		return initialData
	}

	initializeSockets() {
		const { networkServices, auth, cache, setCurrentUser } = this.props
		const { SocketIO, Api } = networkServices || {}
		const { isAuthenticated, user } = auth || {}
		SocketIO.on("connect", this.handleSocketsConnected)
		SocketIO.on("reconnect", this.handleSocketsReconnected)
		SocketIO.on("disconnect", this.handleSocketsDisconnected)
		SocketIO.on("create", async ({ context, action }) => {
			let defination = definations[JSON.keyOf(models, context)]
			if (defination && isAuthenticated) {
				let cacheData = defination?.cache
				if (
					!["preferences", "settings"].includes(defination?.name) &&
					cacheData &&
					defination?.access?.view.single(user, action.result)
				) {
					this.persistToCache(defination?.name, { data: [action.result] }, "prepend")
				}
			}
		})

		SocketIO.on("update", async ({ context, action }) => {
			let defination = definations[JSON.keyOf(models, context)]

			if (defination && isAuthenticated) {
				if (defination.name === "users") {
					if (action.result._id === user?._id) {
						setCurrentUser({ ...auth.user, ...action.result })
					}
				}
				if (
					!["preferences", "settings"].includes(defination.name) &&
					defination?.cache &&
					defination?.access?.view.single(user, action.result)
				) {
					this.persistToCache(defination?.name, { data: [action.result] })
				}
			}
		})

		SocketIO.on("delete", async ({ context, action }) => {
			let defination = definations[JSON.keyOf(models, context)]
			if (defination && isAuthenticated) {
				if (defination.name === "users") {
					if (action.result._id === user?._id) {
						// setCurrentUser(action.result);
						//Logout
						// EventRegister.emit("logout")
					}
				}
				if (
					!["preferences", "settings"].includes(defination.name) &&
					defination?.cache &&
					defination?.access?.view.single(user, action.result)
				) {
					this.persistToCache(defination?.name, { data: [action.result] })
				}
			}
		})
	}

	handleSocketsConnected() {
		const {
			auth: { isAuthenticated, user },
		} = this.props
		if (isAuthenticated && !JSON.isEmpty(user)) {
		}
	}

	handleSocketsReconnected() {}

	handleSocketsDisconnected() {}
	render() {
		const { children } = this.props
		return children({ ...this.state, definations: definations })
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
	cache: state.cache,
})

export default compose(connect(mapStateToProps, { setCurrentUser }), withCacheDatabase, withNetworkServices)(ApiData)
