/** @format */

import React, { useState, useEffect } from "react";
/*import * as services from 'services';*/

function withRoot(Component) {
	function WithRoot(props) {
		let [state, setState] = useState(props);
		useEffect(() => {
			setState(props);
		}, [props]);
		return <Component {...state} />;
	}

	return WithRoot;
}

export default withRoot;
