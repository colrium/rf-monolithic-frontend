import React from 'react';
import ApiData from './ApiData';
import ApiDataContext from './ApiDataContext';

const ApiDataProvider = (props) => {
	const { children } = props;
	
	return (
		<ApiData>
			{ApiDataState => (
				<ApiDataContext.Provider value={ApiDataState} >
					{children}
				</ApiDataContext.Provider>
			)}
		</ApiData>
	);
}



export default React.memo(ApiDataProvider);