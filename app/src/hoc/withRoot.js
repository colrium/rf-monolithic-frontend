/** @format */

import React from "react";
/*import * as services from 'services';*/

function withRoot(Component) {
	function WithRoot(props) {
		return <Component {...props} />;
	}

	return WithRoot;
}

export default withRoot;
