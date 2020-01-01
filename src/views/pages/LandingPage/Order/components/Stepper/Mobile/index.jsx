import React from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Button from 'components/Button';
import withRoot from 'utils/withRoot';

function MobileSteps(props) {
	const {direction, steps, step, backText, nextText } = props;
	const [activeStep, setActiveStep] = React.useState(step);

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	return (
		<MobileStepper
			variant="dots"
			steps={steps}
			position="static"
			activeStep={activeStep}
			className="flex-grow min-w-full"
			nextButton={
				<Button color={activeStep === steps? "grey" : "primary"} onClick={handleNext} disabled={activeStep === steps} simple>
					{nextText}
					{direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
				</Button>
			}
			backButton={
				<Button color={activeStep === 0? "grey" : "primary"} onClick={handleBack} disabled={activeStep === 0} simple>
					{direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
					{backText}
				</Button>
			}
		/>
	);
}

MobileSteps.defaultProps = {
	direction: "ltr",
	backText: "Back",
	nextText: "Next",
	steps: 1,
	step: 0,
};

export default withRoot(MobileSteps);