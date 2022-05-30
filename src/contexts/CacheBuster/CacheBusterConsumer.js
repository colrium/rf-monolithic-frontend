import React from 'react';
import CacheBusterContext from './CacheBusterContext';


export default function CacheBusterConsumer({ children }) {
	return (
		<CacheBusterContext.Consumer>
			{context => {
				if (!context) {
					throw new Error( 'CacheBusterConsumer components should be rendered within CacheBusterProvider. Make sure you are rendering a CacheBusterProvider at the top of your component hierarchy' );
				}
				return children(context);
			}}
		</CacheBusterContext.Consumer>
	);
}
