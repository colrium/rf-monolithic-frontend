/** @format */

import React, { useEffect, useState } from "react";

import DefaultStepper from "./Default";
import MobileStepper from "./Mobile";

function Stepper(props) {
	let [currentProps, setCurrentProps] = useState(props);
	let { type } = currentProps;
	let mobileProps = {
		...currentProps,
		steps: Object.size(currentProps.steps),
	};

	useEffect(() => {
		setCurrentProps(props);
	}, [props]);

	return (
		<div>
			{type === "mobile" && <MobileStepper {...mobileProps} />}
			{type === "default" && <DefaultStepper {...currentProps} />}
		</div>
	);
}

Stepper.defaultProps = {
	type: "default",
};
export default Stepper;
