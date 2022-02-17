import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNetworkState, useCookie } from 'react-use';
import { firebase as firebaseConfig, baseUrls, client_id, client_secret, environment, authTokenLocation, authTokenName } from "config";
import NetworkServices from './NetworkServices';
import NetworkServicesContext from './NetworkServicesContext';
import { setAuthenticated, setCurrentUser, setToken, clearAppState, setPreferences } from "state/actions";
import { FirebaseAppProvider, FirestoreProvider } from 'reactfire';
import Api from "services/Api";
import { EventRegister } from "utils";

const NetworkServicesProvider = (props) => {
	const { children, notificationType, ...rest } = props;
	const [authCookie, updateAuthCookie, deleteAuthCookie] = useCookie(authTokenName);
	const [authTypeCookie, updateAuthTypeCookie, deleteAuthTypeCookie] = useCookie(`${authTokenName}_type`);
	const [authRefreshTokenCookie, updateRefreshTokenCookie, deleteRefreshTokenCookie] = useCookie(`${authTokenName}_refresh_token`);

	const dispatch = useDispatch();
	const preferences = useSelector(state => ({...state.app?.preferences}));
	const auth = useSelector(state => state.auth)

	const networkState = useNetworkState();

	const handleOnAccessTokenSet = useCallback(({detail:token}) => {
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

	const handleOnAccessTokenUnset = useCallback(event => {
		if (authTokenLocation === "redux") {
			dispatch(setToken({}))
		}
		deleteAuthCookie()
		deleteAuthTypeCookie()
		deleteRefreshTokenCookie()
	}, [])

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

	const updatePreferences = useCallback(
		async (name, new_value) => {
			let updatedValue = false
			if (
				String.isString(name) &&
				!String.isEmpty(name) &&
				auth?.isAuthenticated
			) {
				let slug = name.toLowerCase().variablelize("-")
				if (new_value !== preferences[slug]) {
					let postData = {
						name: name,
						slug: slug,
						value: new_value,
						user: auth?.user?._id,
					}
					return await Api.post(`/preferences`, postData, {
						params: { create: 1, placement: "slug" },
					})
				}
			} else {
				throw { msg: "missing name" }
			}
		},
		[preferences, auth]
	)

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
			onAccessTokenSetListener.remove();
			onAccessTokenUnsetListener.remove()
			onLoginListener.remove()
			onLogoutListener.remove()
		}

	}, [authCookie, authTypeCookie, authRefreshTokenCookie])

	useEffect(() => {

		const onChangeSettingSubscription = EventRegister.on(
			"change-preferences",
			event => {
				// console.log("change-preferences event.detail", event.detail)
				if (JSON.isJSON(event.detail)) {
					let eventPreferences = Object.entries(event.detail).reduce(
						(allPreferences, [key, value]) => {
							allPreferences[key] = value
							updatePreferences(key, value).catch(err => {
									console.error("updatePreferences err", err)
								})
							return allPreferences
						},
						{}
					)
					let newPreferences = JSON.deepMerge(
						preferences,
						eventPreferences
					)
					dispatch(setPreferences(newPreferences))
				}
			}
		)

		return () => {
			onChangeSettingSubscription.remove()
		}
	}, [preferences])

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
