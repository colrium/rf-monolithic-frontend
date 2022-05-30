import React from 'react';
import useCacheBuster from './useCacheBuster';


const withCacheBuster = name => BaseComponent => {
	const withContext = (BaseComponent) => React.memo((props) => {
		let context = useCacheBuster(name);
		return <BaseComponent {...props} CacheBuster={context} />;
	});
	return withContext(BaseComponent);
}

export default withCacheBuster;
