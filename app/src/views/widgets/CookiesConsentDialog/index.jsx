import React from 'react';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import SnackbarContent from '@mui/material/SnackbarContent';
import { connect } from "react-redux";
import compose from "recompose/compose";
import { setOnboarded } from "state/actions";





const CookiesConsentDialog = (props) => {
	const { app, setOnboarded } = props;






	return (
		<Backdrop open={Boolean(!app.onboarded)} style={{ zIndex: 9999999999999 }}>
			<div className={"p-8 w-screen fixed bottom-0 left-0"}>
				<SnackbarContent
					message={app.settings.legal["cookies-consent"]}
					classes={{
						root: "p-4",
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
	connect(mapStateToProps, { setOnboarded }),
)(CookiesConsentDialog);