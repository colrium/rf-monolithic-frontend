/**
 * /* eslint-disable
 *
 * @format
 */

import { baseUrls, environment } from "config";

const DEFAULT = baseUrls[environment].endpoint.endsWith("/")? baseUrls[environment].endpoint : (baseUrls[environment].endpoint + "/");


export { DEFAULT };
