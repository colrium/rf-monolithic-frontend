/** @format */

import React, { Suspense, lazy } from "react";
import ProgressIndicator from "components/ProgressIndicator";
import compose from "recompose/compose";
import { withTheme } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";

const asyncComponent = (importComponent) => {
	class AsyncComponent extends React.Component {
		constructor(props) {
			super(props);
			const {location} = props;
			const component = lazy(() => importComponent());
			this.state = { component: component };
		}

		

		render() {
			const Component = this.state.component;
			return (
				<Suspense
					fallback={
						<ProgressIndicator
							className="absolute center "
							type="logo"
							size={30}
							thickness={4}
						/>
					}
				>
					<Component {...this.props} />
				</Suspense>
			);
		}
	}

	return withRouter(AsyncComponent);
}

export default asyncComponent;