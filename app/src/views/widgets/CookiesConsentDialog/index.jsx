import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { setOnboarded } from "state/actions";
import { withErrorHandler } from "hoc/ErrorHandler";
import styles from "./styles";




const CookiesConsentDialog = (props) => {
	const {classes, app, setOnboarded } = props;

	const [ visible, setVisible ] = useState(!app.onboarded);

	useEffect(() => {	
		if (!visible  && !app.onboarded) {
			setOnboarded(true);
		}
		
	}, [visible]);

	const handleOnAcceptClick = async (event) => {
		setVisible(false);
		//
	}

	return (
		<Backdrop open={Boolean(!app.onboarded)} className={classes.backdrop}>
		<div className={classes.root}>
			<SnackbarContent
				message={app.settings.legal["cookies-consent"]}
				classes={{
					root: classes.snackbarContent,
				}}
				action={(
					<Button color="primary" size="small" onClick={() => setOnboarded(true)}>
						Accept
					</Button>
				)}
				elevation={0}
				square
			/>
		</div>
		</Backdrop>
	);
}

const mapStateToProps = (state) => {
	return {
		app: state.app,
	};
};

export default compose(
	withStyles(styles),
	connect(mapStateToProps, { setOnboarded }),
	withErrorHandler
)(CookiesConsentDialog);