import React, { Suspense, lazy } from "react";
import Typography from "components/Typography";

export default function asyncComponent(importComponent) {
	
	class AsyncComponent extends React.Component {
		constructor(props) {
			super(props);
			const component = lazy(() => importComponent());
			this.state = { component: component };
		}

		render() {
			const Component = this.state.component;
			return (
				<Suspense fallback={<Typography className="absolute center " variant="body2">Loading...</Typography>}>
					<Component {...this.props} />
				</Suspense>);
		}
	}

	return AsyncComponent;
}