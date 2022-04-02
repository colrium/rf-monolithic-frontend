import React from 'react';
import NetworkServicesContext from './NetworkServicesContext';


export default function NetworkServicesConsumer({ children }) {
	return (
		<NetworkServicesContext.Consumer>
			{context => {
				if (!context) {
					throw new Error( 'NetworkServicesConsumer components should be rendered within NetworkServicesProvider.Make sure you are rendering a NetworkServicesProvider at the top of your component hierarchy' );
				}
				return children(context);
			}}
		</NetworkServicesContext.Consumer>
	);
}
