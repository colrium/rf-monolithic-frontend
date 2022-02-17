/** @format */

import React, { Suspense, lazy } from "react";
import ProgressIndicator from "components/ProgressIndicator";
import { useLocation } from "react-router-dom";

const asyncComponent = (importComponent) => {
	const AsyncComponent = () => {
			const location = useLocation()
			const Component = lazy(() => importComponent())


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

	return React.memo(AsyncComponent);
}

export default asyncComponent;
