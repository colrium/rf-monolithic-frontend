import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNetworkState, useCookie } from 'react-use';
import { firebase as firebaseConfig, baseUrls, client_id, client_secret, environment, authTokenLocation, authTokenName } from "config";
import NetworkServices from './NetworkServices';
import NetworkServicesContext from './NetworkServicesContext';
import { setAuthenticated, setCurrentUser, setToken, clearAppState } from "state/actions";
import { FirebaseAppProvider, FirestoreProvider } from 'reactfire';
import Api from "services/Api";
import { EventRegister } from "utils";

const NetworkServicesProvider = (props) => {
	const { children, notificationType, ...rest } = props;
	const [authCookie, updateAuthCookie, deleteAuthCookie] = useCookie(authTokenName);
	const [authTypeCookie, updateAuthTypeCookie, deleteAuthTypeCookie] = useCookie(`${authTokenName}_type`);
	const [authRefreshTokenCookie, updateRefreshTokenCookie, deleteRefreshTokenCookie] = useCookie(`${authTokenName}_refresh_token`);

	const dispatch = useDispatch();
	const storeState = useSelector(state => (state));
	const networkState = useNetworkState();

	const handleOnAccessTokenSet = useCallback((token) => {
		const { access_token, token_type, refresh_token } = token || {};
		if (authTokenLocation === "redux") {
			dispatch(setToken((token || {})))
		}
		else {
			updateAuthCookie(access_token);
			updateAuthTypeCookie(token_type);
			updateRefreshTokenCookie(refresh_token);
		}
	}, []);

	const handleOnAccessTokenUnset = useCallback((token) => {
		if (authTokenLocation === "redux") {
			dispatch(setToken(({})));
		}
		deleteAuthCookie();
		deleteAuthTypeCookie();
		deleteRefreshTokenCookie();
	}, []);

	const handleOnLogin = useCallback((params = {}) => {
		const { profile } = params || {};

		dispatch(setAuthenticated(true));
		if (JSON.isJSON(profile)) {
			dispatch(setCurrentUser(profile));
		}
	}, []);

	const handleOnLogout = useCallback(() => {
		dispatch(setAuthenticated(false));
		dispatch(setCurrentUser(null));
		dispatch(clearAppState());
	}, []);

	useEffect(() => {
		//Api.logout();
		if (!String.isEmpty(authCookie) && !String.isEmpty(authTypeCookie)) {
			Api.setAccessToken({
				access_token: authCookie,
				token_type: authTypeCookie,
				refresh_token: authRefreshTokenCookie,
			});
		}
		const onAccessTokenSetListener = EventRegister.on('access-token-set', handleOnAccessTokenSet);
		const onAccessTokenUnsetListener = EventRegister.on('access-token-unset', handleOnAccessTokenUnset);
		const onLoginListener = EventRegister.on('login', handleOnLogin);
		const onLogoutListener = EventRegister.on('logout', handleOnLogout);
		return () => {
			EventRegister.off(onAccessTokenSetListener);
			EventRegister.off(onAccessTokenUnsetListener);
			EventRegister.off(onLoginListener);
			EventRegister.off(onLogoutListener);
		}

	}, [authCookie, authTypeCookie, authRefreshTokenCookie])

	return (
		<NetworkServices>
			{networkServicesState => (
				<NetworkServicesContext.Provider value={networkServicesState} {...rest}>
					<FirebaseAppProvider firebaseConfig={firebaseConfig}>
						{children}
					</FirebaseAppProvider>
				</NetworkServicesContext.Provider>
			)}
		</NetworkServices>
	);
}



export default React.memo(NetworkServicesProvider);