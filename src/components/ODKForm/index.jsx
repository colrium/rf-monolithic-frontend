import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import { Form } from 'enketo-core';
import { apiCallRequest, closeDialog, openDialog } from "state/actions";

function ODKForm = (props) {
	let {className, uid, children, ...rest} = props;

	return (
		<form className={(className? className : "")+" odk-form-"+uid} {...rest}>
			{children}
		</form>
	);
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	cache: state.cache,
	api:state.api,
});

export default connect(mapStateToProps, {apiCallRequest, closeDialog, openDialog})(ODKForm);
