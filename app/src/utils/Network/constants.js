import { baseUrls } from 'config';

export const CACHE_HEADER_VALUE = 'no-cache, no-store, must-revalidate';
export const DEFAULT_TIMEOUT = 10000;
export const DEFAULT_PING_SERVER_URL = baseUrls.api;
export const DEFAULT_HTTP_METHOD = 'HEAD';
export const DEFAULT_CUSTOM_HEADERS = {};
export const SEMAPHORE_COLOR = { RED: 'RED', GREEN: 'GREEN', };

export const DEFAULT_ARGS = {
  pingTimeout: DEFAULT_TIMEOUT,
  pingServerUrl: DEFAULT_PING_SERVER_URL,
  shouldPing: true,
  pingInterval: 0,
  pingOnlyIfOffline: false,
  pingInBackground: false,
  httpMethod: DEFAULT_HTTP_METHOD,
  customHeaders: DEFAULT_CUSTOM_HEADERS,
};
