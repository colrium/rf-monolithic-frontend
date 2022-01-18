import { useContext } from 'react';
import ApiDataContext from './ApiDataContext';

export default function useApiData(target="") {
	const context = useContext(ApiDataContext);

	if (!JSON.isJSON(context)) {
		throw new Error( 'useApiData should be used within ApiDataProvider. \n Make sure you are rendering a ApiDataProvider at the top of your component hierarchy');
	}
	else if (!String.isEmpty(target) && !JSON.isJSON(context[target])) {
		throw new Error( 'useApiData unrecognized key', target);
	}
	else if (!String.isEmpty(target) && JSON.isJSON(context[target])) {
		return context[target]
	}

	return context;
}
