import React from 'react';
import ApiDataProvider from './ApiDataProvider';


const withApiDataProvider = BaseComponent => {
	const withProvider = (BaseComponent) => React.memo((props) => {
        return (
            <ApiDataProvider>
                <BaseComponent {...props}/>
            </ApiDataProvider>
        )
	});

	return withProvider(BaseComponent);
        
}

export default withApiDataProvider;