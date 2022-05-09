import { useContext } from 'react';
import NetworkServicesContext from './NetworkServicesContext';

export default function useNetworkServices() {
	const context = useContext(NetworkServicesContext);

	if (!context) {
		throw new Error( 'useNetworkServices should be used within NetworkServicesProvider. \n Make sure you are rendering a NetworkServicesProvider at the top of your component hierarchy');
	}

	return context;
}
