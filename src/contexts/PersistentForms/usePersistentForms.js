import { useContext } from 'react';
import PersistentFormsContext from './PersistentFormsContext';

export default function usePersistentForms(name=null) {
	const context = useContext(PersistentFormsContext);
	let state = {};
	if (!context) {
		throw new Error( 'usePersistentForms should be used within PersistentFormsProvider. \n Make sure you are rendering a PersistentFormsProvider at the top of your component hierarchy');
	}
	else {
		if (name) {
			state = context[name];
		}
		else {
			state = context;
		}
	}

	return state;
}
