import React from 'react';
import ApiDataContext from './ApiDataContext';


export default function ApiDataConsumer({ children }) {
	return (
		<ApiDataContext.Consumer>
			{context => {
				if (!context) {
					throw new Error( 'ApiDataConsumer components should be rendered within ApiDataProvider.Make sure you are rendering a ApiDataProvider at the top of your component hierarchy' );
				}
				return children(context);
			}}
		</ApiDataContext.Consumer>
	);
}
