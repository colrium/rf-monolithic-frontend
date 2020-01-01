import React, { useState, useEffect } from 'react';
import DefaultStepper from './Default';
import MobileStepper from './Mobile';
import withRoot from 'utils/withRoot';


function Stepper(props) {
	let [currentProps, setCurrentProps] = useState(props);
	let { type } = currentProps;
	let mobileProps = {...currentProps, steps: Object.size(currentProps.steps)};

	useEffect(() => {		
		setCurrentProps(props);
 	}, [props]);

	return (
		<div>
			{ type === "mobile" && <MobileStepper {...mobileProps} />}
			{ type === "default" && <DefaultStepper {...currentProps} />}
		</div>
	);
}


Stepper.defaultProps = {
	type: "default",
};
export default withRoot(Stepper);
