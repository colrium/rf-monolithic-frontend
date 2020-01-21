import React, { useEffect, useState } from 'react';

import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Auth from "utils/Auth";
import { Route } from "react-router-dom";
import { setAuthenticated, setCurrentUser, setAccessToken, clearDataCache, clearBlobCache } from "state/actions";


const CustomRoute = (props) => {
	
	const [stateProps, setStateProps] = useState(props);
	useEffect(() => { setStateProps(props) }, [props, setStateProps]);

	const { component: Component, componentProps, authRestrict, auth, entry, setAuthenticated, setCurrentUser, setAccessToken, clearDataCache, clearBlobCache, ...rest } = stateProps;

	if (entry) {
		if (Auth.getInstance().authTokenSet() && auth.isAuthenticated && JSON.isJSON(auth.user) && Object.keys(auth.user).length > 0) {
			return <Redirect exact to={{ pathname: "/home".toUriWithDashboardPrefix() }} />;
		}
		else {
			return <Redirect exact to={{ pathname: "/recruitment".toUriWithLandingPagePrefix() }} />;
		}
	}
	else if (authRestrict) {
		if (Auth.getInstance().authTokenSet() && auth.isAuthenticated && JSON.isJSON(auth.user) && Object.keys(auth.user).length > 0) {		
			return <Route {...rest} render={props => ( <Component {...props} componentProps={componentProps ? componentProps : {}} /> )} />;
		}
		else {
			const { path } = rest;
			setAuthenticated(false);
			setCurrentUser({});
			setAccessToken(null);
			clearDataCache();
			clearBlobCache();
			if (path !== "login") {
				return <Redirect to={{ pathname: "/login" }} />;
			}
			else{
				return <Route/>
			}
			
		}
	}
	else {
		return <Route {...rest} render={props => (<Component {...props} componentProps={componentProps ? componentProps : {}} />)} />;
	}
		

};
const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { setAuthenticated, setCurrentUser, setAccessToken, clearDataCache, clearBlobCache })(CustomRoute);
