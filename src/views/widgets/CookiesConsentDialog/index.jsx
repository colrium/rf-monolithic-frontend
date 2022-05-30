import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import SnackbarContent from '@mui/material/SnackbarContent';
import { connect } from "react-redux";
import compose from "recompose/compose";
import { setOnboarded } from "state/actions";





const CookiesConsentDialog = (props) => {
	const { app, setOnboarded } = props;






	return (
		!app.onboarded && <Backdrop open={true} style={{ zIndex: 9999999999999 }}>
			<div className={"p-8 w-half-screen fixed bottom-0 left-0"}>
				<SnackbarContent
					message={<Grid container spacing={4}>
						<Grid item xs={12} className={`flex flex-row items-center justify-center`}>
							<img src={`${process.env.PUBLIC_URL}/img/cookie.png`} alt={`${process.env.REACT_APP_NAME} cookies`} className={`w-32`} />
						</Grid>
						<Grid item xs={12} className={`flex flex-row items-center justify-center`}>
							<Typography variant="body1" color="textSecondary">{app.settings.legal["cookies-consent"]}</Typography>
						</Grid>
					</Grid>}
					classes={{
						root: "p-4 bg-white text-black",
					}}
					action={(
						<Button color="primary" size="small" onClick={() => setOnboarded(true)}>
							Got it
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
