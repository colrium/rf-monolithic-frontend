/** @format */

import React, { useMemo } from "react";

import { connect } from "react-redux";
import { Route, useLocation, useNavigate } from "react-router-dom"
import ApiService from "services/Api";
import { clearDataCache, clearBlobCache, } from "state/actions";
import {useDidMount, useDidUpdate} from "hooks"
import {withProps} from "hoc"
import { app } from "assets/jss/app-theme"

const CustomRoute = React.forwardRef((props, ref) => {

	const {
		component,
		element,
		componentProps,
		authRestrict,
		auth,
		entry,
		clearDataCache,
		clearBlobCache,
		entryPaths,
		title,
		path,
		pathname,
		...rest
	} = props

	const location = useLocation()
	const navigate = useNavigate()
	const routeElement = useMemo(() => {
		let elem = React.isValidElement(element)? element : null
		if (!elem && !!Component) {
			let Component = withProps({...componentProps})(Element)
			elem = <Component {...componentProps} />
		}
		if (!React.isValidElement(elem)) {
			console.error("Invalid route element", elem)
		}
		return elem;
	}, [Component, element])


	useDidMount(()=>{
		if (entry) {
			let { location } = rest
			let current_path = location ? location.pathname : false
			if (ApiService.isUserAuthenticated(true)) {
				if (current_path != entryPaths.authenticated) {
					navigate(entryPaths.authenticated)
				}

			} else {
				if (current_path != entryPaths.unauthenticated) {
					navigate(entryPaths.unauthenticated)
				}

			}
		} else if (!auth.isAuthenticated || String.isEmpty(auth.user?._id)) {
			const { path } = rest
			clearDataCache()
			clearBlobCache()
			if (path !== "/auth/login") {
				navigate("/auth/login")
			}
		}
		else if (
			!String.isEmpty(title) &&
			((!String.isEmpty(path) &&
				location.pathname.replaceAll("/", "") ===
					path.replaceAll("/", "")) ||
				(!String.isEmpty(pathname) &&
					location.pathname.replaceAll("/", "") ===
						pathname.replaceAll("/", "")))
		) {
			document.title = app.title(title)
		}
	})

	console.log("routeElement", routeElement)
	return <Route {...rest} element={routeElement} />
});
const mapStateToProps = state => ({
	auth: state.auth,
});

export default React.memo(connect(mapStateToProps, { clearDataCache, clearBlobCache })(CustomRoute));
