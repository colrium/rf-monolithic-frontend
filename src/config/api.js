/* eslint-disable */

import {baseUrls, environment} from "config"

const DEFAULT =  baseUrls[environment].endpoints.default.endsWith("/")? baseUrls[environment].endpoints.default : (baseUrls[environment].endpoints.default+"/");
const AUTH =  baseUrls[environment].endpoints.auth.endsWith("/")? baseUrls[environment].endpoints.auth : (baseUrls[environment].endpoints.auth+"/");

export {DEFAULT, AUTH}