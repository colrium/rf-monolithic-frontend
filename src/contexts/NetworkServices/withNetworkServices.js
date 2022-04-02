import React from 'react';
import useNetworkServices from './useNetworkServices';


const withNetworkServices = BaseComponent => {
	const withContext = (BaseComponent) => React.memo((props) => {
		let context = useNetworkServices();
		return <BaseComponent {...props} networkServices={context} />; 
	});
	return withContext(BaseComponent);
}

export default withNetworkServices;