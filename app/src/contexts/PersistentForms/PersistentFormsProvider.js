import React, { useEffect, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { setForm, removeForm } from "state/actions";
import { EventRegister } from "utils";


const PersistentFormsProvider = (props) => {
	const { children } = props;
	const dispatch = useDispatch();

	const persist = useCallback((changes) => {
		let { form } = changes;
		if (!!form) {
			form.persist_timestamp = new Date();
			dispatch(setForm(form))
		}

	}, [])

	useEffect(() => {
		const subscription = EventRegister.on("form-changed", persist)
		console.log("subscription", subscription);
		return () => {
			// EventRegister.off(subscription)
			subscription.remove();
		};
	}, [])

	return (
		<>
			{children}
		</>
	);
}



export default React.memo(PersistentFormsProvider);