/** @format */

import React, { useEffect } from "react";

import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import ApiService from "services/Api";
import { Route } from "react-router-dom";
import { clearDataCache, clearBlobCache, } from "state/actions";

const CustomRoute = props => {
	/*const [state, setState] = useState(props);
	useEffect(() => {
		setState(props);
	}, [props]);*/

	const {
		component: Component,
		componentProps,
		authRestrict,
		auth,
		entry,
		clearDataCache,
		clearBlobCache,
		entryPaths,
		...rest
	} = props;

	

	

	if (entry) {
        let {location} = rest;
        let current_path = location? location.pathname : false;
        if (ApiService.isUserAuthenticated(true)) {
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
		if (ApiService.isUserAuthenticated(true)) {
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

export default React.memo(connect(mapStateToProps, { clearDataCache, clearBlobCache })(CustomRoute));
