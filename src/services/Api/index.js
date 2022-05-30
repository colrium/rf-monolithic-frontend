/** @format */

import axios from "axios"
import store from "state/store"
import watch from "redux-watch"
import decode from "jwt-decode"
import { baseUrls, client_id, client_secret, environment, authTokenLocation, authTokenName } from "config"
import { setAuthenticated, setCurrentUser, setToken, clearAppState } from "state/actions"
import { EventRegister } from "utils"
const DEFAULT = baseUrls.api.endsWith("/") ? baseUrls.api : baseUrls.api + "/"
const HOST = baseUrls.host

const ApiSingleton = (function () {
	var instance
	var instance_initialized = false
	var instance_authenticated = false
	var instance_user = false
	var default_options = {
		cache: true,
		baseURL: DEFAULT,
		withCredentials: false,
		headers: {
			// "x-client-id": client_id,
			// "x-client-secret": client_secret,
		},
	}
	var access_token = {}
	// To mitigate mutation of default_options as an effect of instance_options mutation and not wanting to use Object.freeze()
	var instance_options = Object.toJSON(default_options)

	function endpoint(uri = "/") {
		let endpoint_url = DEFAULT
		if (!String.isEmpty(uri)) {
			uri = uri.trim()
			uri = uri.startsWith(DEFAULT) ? uri.replace(DEFAULT, "") : uri.startsWith("/") ? uri.substring(1) : uri
		}
		return endpoint_url + uri
	}

	function setCookie(name, value, days) {
		var expires = ""
		if (days) {
			var date = new Date()
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
			expires = "; expires=" + date.toUTCString()
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/"
	}

	function getCookie(name) {
		const value = `; ${document.cookie}`
		const parts = value.split(`; ${name}=`)
		if (parts.length === 2) return parts.pop().split(";").shift()
	}

	function getAuthCookies() {
		let access_token = getCookie(authTokenName)
		let token_type = getCookie(authTokenName + "_type")
		let refresh_token = getCookie(authTokenName + "_refresh_token")
		if (access_token && token_type) {
			return {
				access_token: access_token,
				token_type: token_type,
				refresh_token: refresh_token,
			}
		}
		return {
			access_token: "",
			token_type: "",
			refresh_token: "",
		}
	}

	function getAccessToken() {
		return getAuthCookies()
	}

	function getAuthorizationHeader(token) {
		//
		let authCookies = getAuthCookies()
		return {
			Authorization: `${authCookies?.token_type || ""} ${authCookies?.access_token || ""}`.trim(),
		}
	}

	function decodeAccessToken(access_token) {
		let token = access_token
		if (JSON.isJSON(access_token) && access_token.access_token) {
			token = access_token.access_token
		}
		if (String.isString(token)) {
			try {
				const payload = decode(token)
				return payload
			} catch (e) {
				return null
			}
		}
		return null
	}

	function isAccessTokenValid(token) {
		let isValid = false
		if ((JSON.isJSON(token) && !String.isEmpty(token.access_token)) || (String.isString(token) && !String.isEmpty(token))) {
			let token_value = JSON.isJSON(token) ? token.access_token : token
			//try to decode token
			try {
				const decodedToken = decode(token_value)
				isValid = Boolean(decodedToken)
			} catch (e) {}
		}

		return isValid
	}

	function setAccessToken(value) {
		if (isAccessTokenValid(value)) {
			access_token = value
			setCookie(authTokenName, value.access_token || value.token, 365)
			setCookie(`${authTokenName}_type`, value.token_type, 365)
			setCookie(`${authTokenName}_refresh_token`, value.refresh_token, 365)
			// instance_options = JSON.merge(instance_options, { headers: { Authorization: `${value.token_type} ${value.access_token}` } });
			// axios.defaults.headers.common['Authorization'] = `${value.token_type} ${value.access_token}`;
			// if (instance) {
			// 	instance.defaults.headers.common["Authorization"] = `${value.token_type} ${value.access_token}`
			// 	instance.interceptors.request.use(function (config) {
			// 		config.headers.Authorization = `${value.token_type} ${value.access_token}`
			// 		return config
			// 	})

			// }

			EventRegister.emit("access-token-set", value)
		} else {
			setCookie(authTokenName, "", 365)
			setCookie(`${authTokenName}_type`, "", 365)
			setCookie(`${authTokenName}_refresh_token`, "", 365)

			EventRegister.emit("access-token-unset", value)
		}
	}

	function accessTokenSetAndValid() {
		let access_token = getAccessToken()
		return isAccessTokenValid(access_token)
	}

	function isUserAuthenticated(validUser = true) {
		return accessTokenSetAndValid()
	}

	function proceedWithGoogleOneTap(data) {
		return new Promise((resolve, reject) => {
			if (instance) {
				instance
					.post("/auth/google-one-tap", { ...data, client_id: client_id, client_secret: client_secret, grant_type: "password" })
					.then(async res => {
						const { profile, token, ...rest } = res.body?.data || res.data?.data || {}
						let resObj = {
							token: token,
							profile: profile,
						}
						setAccessToken(token)
						if (JSON.isJSON(profile) && JSON.isEmpty(profile)) {
							resObj.profile = await axios
								.get(endpoint("/profile"), { headers: { ...getAuthorizationHeader(token) } })
								.then(profile_res => {
									return profile_res.body?.data || profile_res.data?.data
								})
								.catch(err => {
									console.error(err)
								})
						}
						if (!JSON.isEmpty(resObj.profile) && !JSON.isEmpty(resObj.token)) {
							EventRegister.emit("login", resObj)
							resolve(resObj)
						} else {
							reject({ message: "Incomplete result", ...resObj })
						}
					})
					.catch(err => {
						console.error(err)
						reject(err)
					})
			} else {
				let errObj = {
					msg: "Authenticate with google Request Failed. Invalid Request service instance",
					message: "Authenticate with google  Request Failed. Invalid Request service instance",
					body: null,
					code: 400,
				}
				reject(errObj)
			}
		})
	}

	function proceedWithGoogle(data) {
		return new Promise((resolve, reject) => {
			if (instance) {
				instance
					.post("/auth/google", { ...data, client_id: client_id, client_secret: client_secret, grant_type: "password" })
					.then(async res => {
						const { profile, token, ...rest } = res.body?.data || res.data?.data || {}
						let resObj = {
							token: token,
							profile: profile,
						}
						setAccessToken(token)
						if (JSON.isJSON(profile) && JSON.isEmpty(profile)) {
							resObj.profile = await axios
								.get(endpoint("/profile"), { headers: { ...getAuthorizationHeader(token) } })
								.then(profile_res => {
									return profile_res.body?.data || profile_res.data?.data
								})
								.catch(err => {
									console.error(err)
								})
						}
						if (!JSON.isEmpty(resObj.profile) && !JSON.isEmpty(resObj.token)) {
							EventRegister.emit("login", resObj)
							resolve(resObj)
						} else {
							reject({ message: "Incomplete result", ...resObj })
						}
					})
					.catch(err => {
						console.error(err)
						reject(err)
					})
			} else {
				let errObj = {
					msg: "Authenticate with google Request Failed. Invalid Request service instance",
					message: "Authenticate with google  Request Failed. Invalid Request service instance",
					body: null,
					code: 400,
				}
				reject(errObj)
			}
		})
	}

	function login(data, get_profile = true) {
		return new Promise((resolve, reject) => {
			if (instance) {
				instance
					.post("login", JSON.merge(data, { client_id: client_id, client_secret: client_secret, grant_type: "password" }))
					.then(async res => {
						const { profile, token, ...rest } = res.body?.data || res.data?.data || {}
						let resObj = {
							token: token || rest,
							profile: profile,
						}
						setAccessToken(token)

						if (!JSON.isEmpty(resObj.profile) && !JSON.isEmpty(resObj.token)) {
							EventRegister.emit("login", resObj)
							resolve(resObj)
						} else {
							reject({ message: "Incomplete result", ...resObj })
						}
					})
					.catch(err => {
						console.error(err)
						reject(err)
					})
			} else {
				let errObj = {
					msg: "Login Request Failed. Invalid Request service instance",
					message: "Login Request Failed. Invalid Request service instance",
					body: null,
					code: 400,
				}
				reject(errObj)
			}
		})
	}

	function logout() {
		return new Promise((resolve, reject) => {
			let current_access_token = getAccessToken()
			setAccessToken(null)

			EventRegister.emit("logout", { token: current_access_token, user: null })
			resolve({})
		})
	}

	function logoutAll() {
		return new Promise((resolve, reject) => {
			let current_access_token = getAccessToken()
			setAccessToken(null)
			EventRegister.emit("logout", { token: current_access_token, user: null })

			resolve({})
		})
	}

	function logoutOthers() {
		return new Promise((resolve, reject) => {
			if (instance && current_access_token) {
				instance
					.get("logout/others", { params: { access_token: current_access_token } })
					.then(res => {
						resolve(res)
					})
					.catch(err => {
						//resolve any way
						resolve({ ...err, error: true })
					})
			}

			resolve({})
		})
	}

	function getContextRequests(service_uri = "/", scope_instance = false) {
		scope_instance = scope_instance || instance
		let context_uri = String.isString(service_uri)
			? service_uri.trim().endsWith("/")
				? service_uri.trim().substring(0, service_uri.trim().length)
				: service_uri.trim()
			: undefined
		if (scope_instance && !String.isEmpty(context_uri)) {
			return {
				getRecords: (params = {}) => scope_instance.get(context_uri, { params: params }),
				getRecordsCount: (params = {}) => scope_instance.get(context_uri + "/count", { params: params }),
				getAggregatesCount: (params = {}) => scope_instance.get(context_uri + "/count/aggregates", { params: params }),
				getRecordById: (id, params = {}) => scope_instance.get(context_uri + "/" + id, { params: params }),
				create: (data, params = {}) => scope_instance.post(context_uri, data, { params: params }),
				update: (id, data, params = {}) => scope_instance.post(context_uri + "/" + id, data, { params: params }),
				deleteRecordById: (id, params = {}) => scope_instance.delete(context_uri + "/" + id, { params: params }),
			}
		}
		return {}
	}

	function createIsolatedInstance(config = {}) {
		const { cache, ...options } = JSON.merge(default_options, instance_options, config)
		let isolatedInstance = axios.create({ ...options })

		return isolatedInstance
	}

	function getAttachmentFileUrl(attachment) {
		return endpoint("/attachments/download/" + (JSON.isJSON(attachment) && "_id" in attachment ? attachment._id : attachment))
		// return (
		// 	"https://api.realfield.io/attachments/download/" +
		// 	(JSON.isJSON(attachment) && "_id" in attachment ? attachment._id : attachment)
		// )
	}

	function createInstance(config = {}) {
		const { cache, interceptors, ...options } = JSON.merge(default_options, config, instance_options)

		let newInstance = axios.create({ ...options })

		EventRegister.on("api-request-attempt", ({ detail: config }) => {
			const { cancelOnTimeout, cancelUUID, cancelToken, cancelTokenSource, timeout } = config
			let timeoutAction = undefined
			//
			let cancellableOnTimeout = cancelOnTimeout > 0 && Function.isFunction(cancelTokenSource?.cancel)
			if (cancellableOnTimeout) {
				const timeoutMs = Number.parseNumber(timeout, 30000)
				let onRequestError = null
				let onRequestComplete = null

				const removeRequestListeners = () => {
					if (!!onRequestError) {
						onRequestError.remove()
					}
					if (!!onRequestComplete) {
						onRequestComplete.remove()
					}
				}
				onRequestError = EventRegister.on("api-request-error", ({ detail: error }) => {
					//
					if (cancelUUID === data?.config?.cancelUUID) {
						clearTimeout(timeoutAction)
						removeRequestListeners()
					}
				})
				onRequestComplete = EventRegister.on("api-request-complete", ({ detail: data }) => {
					//
					if (cancelUUID === data?.config?.cancelUUID) {
						clearTimeout(timeoutAction)
						removeRequestListeners()
					}
				})

				timeoutAction = setTimeout(() => {
					EventRegister.emit("api-request-timeout", config)
					cancelTokenSource.cancel()
					removeRequestListeners()
				}, timeoutMs)
			}
		})
		//Custom interceptors to ensure authorization is kept and responses are formatted accordingly. PS: NO DUPLICATES HERE. One's for request. One's for Response.
		function onErrorHandler(error) {
			//console.warn("onErrorHandler error", error);
			let errobj = {
				...error,
				msg: "Request Failed",
				message: "Request Failed",
				body: null,
				code: 400,
			}
			if (error.response) {
				errobj = {
					...error,
					...error.response,
					code: error.response.status,
					msg: error.response.statusText,
					message: error.response.statusText,
					body: error.response.data,
				}
				if (error.response.data) {
					if (error.response.data.message || error.response.data.msg || error.response.data.error) {
						errobj.msg = error.response.data.message || error.response.data.msg || error.response.data.error
						errobj.message = error.response.data.message || error.response.data.msg || error.response.data.error
					}
				}
			} else if (error.request) {
				errobj = {
					...error,
					code: 400,
					msg: "Request Failed. " + error.message,
					message: "Request Failed. " + error.message,
					body: null,
				}
			}
			EventRegister.emit("api-request-error", errobj)
			if (errobj?.code === 401) {
				// EventRegister.emit("logout", errobj)
			}
			return Promise.reject(errobj)
		}

		function onSuccessHandler(response) {
			const {
				data: { message, msg, ...body },
				status,
				headers,
				...rest
			} = response
			let res_message = message || msg || "Success"

			let res = {
				...rest,
				message: res_message,
				body: body,
				code: status,
				status: status,
				headers: headers,
			}
			EventRegister.emit("api-request-complete", res)
			return Promise.resolve(res)
		}

		function onRequestAttemptHandler(request) {
			let cancelToken = axios.CancelToken
			let cancelOnTimeout = request?.timeout ?? 0 > 0
			if (!!request.cancelToken) {
				cancelToken = request.cancelToken
			}
			if (cancelOnTimeout) {
				request.cancelOnTimeout = cancelOnTimeout
				request.cancelToken = cancelToken?.source()?.token
				request.cancelUUID = String.uuid()
				request.cancelTokenSource = cancelToken?.source()
			}

			const authHeader = getAuthorizationHeader()
			request.headers = {
				...request.headers,
				...authHeader,
			}
			EventRegister.emit("api-request-attempt", request)
			return request
		}
		newInstance.interceptors.request.use(function (request) {
			return onRequestAttemptHandler(request)
		})
		newInstance.interceptors.response.use(
			function (res) {
				return onSuccessHandler(res)
			},
			function (error) {
				return onErrorHandler(error)
			}
		)

		newInstance.getAttachmentFileUrl = getAttachmentFileUrl
		newInstance.upload = (data, params = {}) => newInstance.post("/attachments/upload", data, params)
		newInstance.isolated = (config = {}) => createIsolatedInstance(config)
		newInstance.endpoint = (uri = "/") => endpoint(uri)
		newInstance.isAccessTokenValid = token => isAccessTokenValid(token)
		newInstance.getAuthCookies = () => getAuthCookies()
		newInstance.getAccessToken = () => getAccessToken()
		newInstance.setAccessToken = token => setAccessToken(token)
		newInstance.accessTokenSetAndValid = () => accessTokenSetAndValid()
		newInstance.getAuthorizationHeader = () => getAuthorizationHeader()
		newInstance.getContextRequests = (service_uri = "/", scope_instance = false) => getContextRequests(service_uri, scope_instance)
		newInstance.isUserAuthenticated = () => isUserAuthenticated()
		newInstance.login = (data, get_profile = true) => login(data, get_profile)
		newInstance.proceedWithGoogleOneTap = proceedWithGoogleOneTap
		newInstance.proceedWithGoogle = proceedWithGoogle
		newInstance.logout = () => logout()
		newInstance.logoutAll = () => logoutAll()
		newInstance.logoutOthers = () => logoutOthers()
		newInstance.profile = params => newInstance.get("profile", { params: params })
		newInstance.update_profile = data => newInstance.post("profile", data)
		newInstance.signup = data => newInstance.post("signup", data)
		newInstance.forgotPassword = data => newInstance.post("forgot-password", data)
		newInstance.forgot_password = data => newInstance.post("forgot-password", data)
		newInstance.resetPassword = data => newInstance.post("reset-password", data)
		newInstance.reset_password = data => newInstance.post("reset-password", data)
		newInstance.verifyAccount = data => newInstance.post("verify-account", data)
		newInstance.verify_account = data => newInstance.post("verify-account", data)
		newInstance.get_access_token = params => newInstance.get("token", { params: params })
		newInstance.refreshAuthToken = data => newInstance.post("refresh-token", data)
		newInstance.refresh_auth_token = data => newInstance.post("refresh-token", data)

		instance = newInstance

		return newInstance
	}

	return {
		getInstance: function (options = {}) {
			if (!instance || !instance_initialized) {
				createInstance(options)
				// instance.login({ email: "colrium@gmail.com", password: "WI5HINd8" }).then(data => { });

				instance_initialized = true
			}
			return instance
		},
		destroyInstance: function () {
			instance = undefined
			instance_initialized = false
			return instance
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
		getContextRequests: getContextRequests,
	}
})()

export const api = ApiSingleton

export default ApiSingleton.getInstance()
