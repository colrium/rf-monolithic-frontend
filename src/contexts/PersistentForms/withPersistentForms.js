import React from 'react';
import usePersistentForms from './usePersistentForms';


const withPersistentForms = name => BaseComponent => {
	const withContext = (BaseComponent) => React.memo((props) => {
		let context = usePersistentForms(name);
		return <BaseComponent {...props} persistentForms={context} />;
	});
	return withContext(BaseComponent);
}

export default withPersistentForms;
