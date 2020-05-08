/** @format */

import React from "react";

class DefaultComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidCatch(error) {
		this.error = error;
	}

	componentDidEnterViewPort() {}

	componentDidLeaveViewPort() {}
}

export default LazyModule;
