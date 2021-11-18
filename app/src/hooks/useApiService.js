import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Cookies from "universal-cookie";
import { setupCache } from 'axios-cache-adapter';
import { baseUrls, client_id, client_secret, environment } from "config";
import store from "state/store";
import watch from 'redux-watch';
import decode from "jwt-decode";
import { useSelector, useDispatch } from 'react-redux';
import { authTokenLocation, authTokenName } from "config";
import { setAuthenticated, setCurrentUser, setToken, clearAppState } from "state/actions";


import { useCookie } from "react-use";
import ApiService from "services/Api";

const DEFAULT = baseUrls.api.endsWith("/") ? baseUrls.api : (baseUrls.api + "/");
const HOST = baseUrls.host;

var default_options = {
    cache: true,
    baseURL: DEFAULT,
    withCredentials: false,
    headers: {
        "x-client-id": client_id,
        "x-client-secret": client_secret,
        Authorization: "",
    }
};

// Hook
const useApiService = (config = {}) => {
    const [authCookie, updateAuthCookie, deleteAuthCookie] = useCookie("rf-auth");
    const [authTypeCookie, updateAuthTypeCookie, deleteAuthTypeCookie] = useCookie("rf_auth_type");
    const [authRefreshTokenCookie, updateRefreshTokenCookie, deleteRefreshTokenCookie] = useCookie("rf_auth_type");

    const dispatch = useDispatch();
    const storeState = useSelector(state => (state));

    useEffect(() => {
        ApiService.setAccessToken(authCookie)

        return () => {

        }
    }, [])
    return ApiService;
}

export default useApiService;