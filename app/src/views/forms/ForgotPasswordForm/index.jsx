import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Grid from '@mui/material/Grid';
import CircularProgress from "@mui/material/CircularProgress";
import { colors } from "assets/jss/app-theme.jsx";
import classNames from "classnames";
import Button from "@mui/material/Button";
//
import { environment } from "config";
import { useNetworkServices } from "context/NetworkServices";
import { useDidUpdate, useDidMount, useSetState } from "hooks"

import { TextInput } from "components";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const ForgotPasswordForm = (props) => {
    const {username, ...rest} = props || {};

    const {Api} = useNetworkServices()

    const [state, setState, getState] = useSetState({
		email: username || (environment === "development" ? "colrium@gmail.com" : ""),
		loading: false,
		alert: false,
	});


    return (
        <Grid container {...rest}>
            <Grid item xs={12}>

            </Grid>
            <Grid item xs={12} className="flex justify-center items-center">
                <Button disabled={state.loading}>Send Reset Password</Button>
            </Grid>
        </Grid>
    )
}

export default React.memo(ForgotPasswordForm);