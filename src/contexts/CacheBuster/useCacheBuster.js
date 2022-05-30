import { useContext } from 'react';
import CacheBusterContext from './CacheBusterContext';

export default function useCacheBuster(name=null) {
	const context = useContext(CacheBusterContext);
	let state = {};
	if (!context) {
		throw new Error( 'useCacheBuster should be used within CacheBusterProvider. \n Make sure you are rendering a CacheBusterProvider at the top of your component hierarchy');
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
