import React from 'react';
import PersistentFormsContext from './PersistentFormsContext';


export default function PersistentFormsConsumer({ children }) {
	return (
		<PersistentFormsContext.Consumer>
			{context => {
				if (!context) {
					throw new Error( 'PersistentFormsConsumer components should be rendered within PersistentFormsProvider. Make sure you are rendering a PersistentFormsProvider at the top of your component hierarchy' );
				}
				return children(context);
			}}
		</PersistentFormsContext.Consumer>
	);
}
