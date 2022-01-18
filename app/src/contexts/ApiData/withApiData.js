import React from 'react';
import useApiData from './useApiData';


const withApiData = BaseComponent => {
	const withContext = (BaseComponent) => React.memo((props) => {
		let context = useApiData();
		return <BaseComponent {...props} ApiData={context} />; 
	});
	return withContext(BaseComponent);
}

export default withApiData;