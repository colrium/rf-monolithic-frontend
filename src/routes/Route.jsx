/** @format */

import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Auth from "hoc/Auth";
import { Route } from "react-router-dom";
import {
	setAuthenticated,
	setCurrentUser,
	setAccessToken,
	clearDataCache,
	clearBlobCache,
} from "state/actions";

const CustomRoute = props => {
	const [state, setState] = useState(props);
	useEffect(() => {
		setState(props);
	}, [props]);

	const {
		component: Component,
		componentProps,
		authRestrict,
		auth,
		entry,
		setAuthenticated,
		setCurrentUser,
		setAccessToken,
		clearDataCache,
		clearBlobCache,
		entryPaths,
		...rest
	} = state;

	

	if (entry) {
		let {location} = rest;
		let current_path = location? location.pathname : false;
		console.log("CustomRoute current_path", current_path);
		if (
				Auth.getInstance().authTokenSet() &&
				auth.isAuthenticated &&
				JSON.isJSON(auth.user) &&
				Object.keys(auth.user).length > 0
			) {
				if (current_path != entryPaths.authenticated) {
					return (
						<Redirect
							exact
							to={{ pathname: entryPaths.authenticated }}
						/>
					);
				}
				return;
					
		} 
		else {
				if (current_path != entryPaths.unauthenticated) {
					return (
						<Redirect
							exact
							to={{ pathname: entryPaths.unauthenticated }}
						/>
					);
				}
				return;
		}
			
	} else if (authRestrict) {
		if (
			Auth.getInstance().authTokenSet() &&
			auth.isAuthenticated &&
			JSON.isJSON(auth.user) &&
			Object.keys(auth.user).length > 0
		) {
			return (
				<Route
					{...rest}
					render={props => (
						<Component
							{...props}
							componentProps={
								componentProps ? componentProps : {}
							}
						/>
					)}
				/>
			);
		} else {
			const { path } = rest;
			setAuthenticated(false);
			setCurrentUser({});
			setAccessToken(null);
			clearDataCache();
			clearBlobCache();
			if (path !== "login") {
				return <Redirect to={{ pathname: "/login" }} />;
			} else {
				return <Route />;
			}
		}
	} else {
		return (
			<Route
				{...rest}
				render={props => (
					<Component
						{...props}
						componentProps={componentProps ? componentProps : {}}
					/>
				)}
			/>
		);
	}
};
const mapStateToProps = state => ({
	auth: state.auth,
});

export default React.memo(connect(mapStateToProps, {
	setAuthenticated,
	setCurrentUser,
	setAccessToken,
	clearDataCache,
	clearBlobCache,
})(CustomRoute));
