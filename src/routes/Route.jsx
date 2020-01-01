import React, { Component, Suspense } from 'react';
import LazyLoad from 'react-lazyload';

import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Auth from "utils/Auth";
import { Route } from "react-router-dom";
import ProgressIndicator from "components/ProgressIndicator";


const CustomRoute = ({ component: Component, componentProps, authRestrict, auth, entry, ...rest }) => {
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
			return <Redirect to={{ pathname: "/login" }} />;
		}
	}
	else {
		return <Route {...rest} render={props => (<Component {...props} componentProps={componentProps ? componentProps : {}} />)} />;
	}
		

};
const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {})(CustomRoute);
