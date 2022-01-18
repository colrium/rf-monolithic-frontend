/** @format */

import lodash, { debounce, throttle, isEqual, get } from "lodash";
import lodash_inflection from "lodash-inflection";
import { dashboardBaseUri, landingPageBaseUri, baseUrls, surpressed_logs } from "config";

lodash.mixin(lodash_inflection);


/*const console_warn = console.warn;
console.warn = function surpressWarnings(msg) {
	const supressedLogs = Array.isArray(surpressed_logs)? surpressed_logs : [];

	if (!supressedLogs.some(entry => msg.includes(entry))) {
		console_warn.apply(console, arguments);
	}
};
const console_error = console.error;
console.error = function surpressErrors(msg) {
	const supressedLogs = Array.isArray(surpressed_logs)? surpressed_logs : [];

	if (!supressedLogs.some(entry => msg.includes(entry))) {
		console_error.apply(console, arguments);
	}
};
const console_log = console.log;
console.log = function surpressLogs(msg) {
	const supressedLogs = Array.isArray(surpressed_logs)? surpressed_logs : [];

	if (!supressedLogs.some(entry => msg.includes(entry))) {
		console_log.apply(console, arguments);
	}
};*/

//Type Extensions
// Warn if overriding existing method

String.isString = function (input) {
	return input !== undefined && input !== null
		? input.constructor === String
		: false;
};



String.capitalize = (targetStr) => {
	//let targetStr = this;
	const words = targetStr.trim().toLowerCase().split(" ");

	const result = words.map((word) => {
		if (word.length > 1) {
			return word[0].toUpperCase() + word.substring(1);
		}
		return word.toUpperCase()

	}).join(" ");
	return result;
}


String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, "g"), replacement);
};

String.toDate = function (input) {

	try {
		let ms = Date.parse(input);
		return new Date(ms);
	} catch (e) {
		return null;
	}
	return null;
};

String.uid = function (len, numeric, all_caps) {
	let buf = [];
	let chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let charlen = chars.length;
	if (numeric) {
		chars = "0123456789";
		charlen = chars.length;
	} else if (all_caps) {
		chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		charlen = chars.length;
	}

	for (var i = 0; i < len; ++i) {
		buf.push(chars[Number.getRandomInt(0, charlen - 1)]);
	}

	return buf.join("");
};



String.prototype.truncate = function (size, ellipsis = "...") {
	let target = this;
	if (target.length > size) {
		return target.substring(0, size) + ellipsis;
	}
	return target;
};

String.prototype.shorten = String.prototype.truncate;


String.prototype.toUriWithDashboardPrefix = function () {
	let target = this;
	let uriWithBaseRoute = dashboardBaseUri.startsWith("/")
		? dashboardBaseUri
		: "/" + dashboardBaseUri;
	uriWithBaseRoute += dashboardBaseUri.endsWith("/")
		? dashboardBaseUri.substring(0, dashboardBaseUri.length - 2)
		: "";
	uriWithBaseRoute += target.startsWith("/") ? target : "/" + target;
	return uriWithBaseRoute;
};

String.prototype.toUriWithLandingPagePrefix = function () {
	let target = this;
	let uriWithBaseRoute = landingPageBaseUri.startsWith("/")
		? landingPageBaseUri
		: "/" + landingPageBaseUri;
	uriWithBaseRoute += landingPageBaseUri.endsWith("/")
		? landingPageBaseUri.substring(0, landingPageBaseUri.length - 2)
		: "";
	uriWithBaseRoute += target.startsWith("/") ? target : "/" + target;
	return uriWithBaseRoute;
};

String.prototype.toUriApiPrefix = function () {
	let target = this;
	let apiBaseUrl = baseUrls.api
	let uriWithBaseRoute = apiBaseUrl;
	uriWithBaseRoute += apiBaseUrl.endsWith("/")
		? apiBaseUrl.substring(0, apiBaseUrl.length - 2)
		: "";
	uriWithBaseRoute += target.startsWith("/") ? target : "/" + target;
	return uriWithBaseRoute;
};

String.prototype.singularize = function () {
	var target = this;
	return lodash.singularize(target);
};

String.prototype.translate = function (lang = "en") {
	var target = this;
	if (lang = "en") {
		return target;
	}
	return "";
};

String.prototype.pluralize = function () {
	var target = this;
	return lodash.pluralize(target);
};

String.prototype.variablelize = function (connector = "_") {
	//
	var target = this;
	target = target.replaceAll(/([A-Z])/g, " $1");
	target = target.trim();
	target = target.replaceAll(/\s\s+/g, " ");
	target = target.replaceAll(" ", connector);
	return target.toLowerCase();
};

String.prototype.humanize = function () {
	var target = this;
	return target
		.replace(/([A-Z])/g, " $1")
		.trim()
		.replace(/^[\s_]+|[\s_]+$/g, "")
		.replace(/[_\s]+/g, " ")
		.replace(/^[a-z]/, function (m) {
			return m.toUpperCase();
		});
};

String.prototype.hasHTML = function () {
	var target = this;
	return /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(target);
};

String.isUrl = function (target, protocol = true) {
	if (String.isString(target)) {
		if (protocol) {
			return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(
				target
			);
		} else {
			return /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi.test(
				target
			);
		}
	}
	return false;
};

String.isEmpty = function (target) {
	if (String.isString(target)) {
		return target.trim().length > 0 ? false : true;
	}
	return true;
};



Boolean.isBoolean = function (input) {
	return input !== undefined && input !== null
		? input.constructor === Boolean
		: false;
};

Function.isFunction = function (input) {
	return input !== undefined && input !== null
		? input.constructor === Function || typeof input === "function"
		: false;
};

Function.sleep = function (milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
};
// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.

if (Function.throttle) {}
//Function.throttle = throttle;
Function.throttle = (func, wait, options) => {
	var context, args, result;
	var timeout = null;
	var previous = 0;
	if (!options) options = { leading: false, trailing: true };
	var later = function () {
		previous = options.leading === false ? 0 : Date.now();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};
	return function () {
		var now = Date.now();
		if (!previous && options.leading === false) previous = now;
		var remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
};

Function.debounce = debounce;

Function.createThrottle = function (max) {
	if (typeof max !== 'number') {
		throw new TypeError('`createThrottle` expects a valid Number')
	}

	let cur = 0
	const queue = []
	function throttle (fn) {
		return new Promise((resolve, reject) => {
			function handleFn () {
				if (cur < max) {
					throttle.current = ++cur
					let resolveFn = Function.isFunction(fn) ? fn() : fn;
					Promise.all([resolveFn]).then(resolveArr => {
						resolve(resolveArr[0]);
					}).catch(err => {
						reject(err)
					}).finally(() => {
						//
						throttle.current = --cur
						if (queue.length > 0) {
							queue.shift()()
						}
					});
				} else {
					queue.push(handleFn)
				}
			}

			handleFn()
		})
	}

	// keep copies of the "state" for retrospection
	throttle.current = cur
	throttle.queue = queue

	return throttle
}


if (Number.isNumber) {}
Number.isNumber = function (input) {
	return input !== undefined && input !== null
		? input.constructor === Number && input !== NaN
		: false;
};

if (Error.isError) {}
Error.isError = function (input) {
	return input !== undefined && input !== null
		? input instanceof Error
		: false;
};

if (RegExp.isRegExp) {}
RegExp.isRegExp = function (input) {
	return input !== undefined && input !== null
		? input.constructor === RegExp
		: false;
};

//Number Extensions
if (Number.isFloat) {}
Number.isFloat = function (input) {
	return input !== undefined && input !== null && input !== NaN
		? /[-+]?(?:\d*\.\d+\.?\d*)(?:[eE][-+]?\d+)?/gim.test(input)
		: false;
};

if (Number.isInt) {}
Number.isInt = function (input) {
	return input !== undefined && input !== null && input !== NaN
		? /^[-+]?(\d*)?\d+$/gim.test(input)
		: false;
};

if (Number.parseNumber) {}
Number.parseNumber = function (input, fallback = null) {
	if (Number.isFloat(input)) {
		return parseFloat(input);
	} else if (Number.isInt(input)) {
		return parseInt(input);
	} else {
		return fallback;
	}
};

//String Extensions
if (Number.parseNumber) {}
Number.getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
if (Array.prototype.remove) {}
Array.prototype.remove = function (from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	this.push.apply(this, rest);
	//return this.push.apply(this, rest);
	return this;
};

Array.isEmpty = function (target) {
	if (Array.isArray(target)) {
		return target.length === 0;
	}
	return true;
};

Array.prototype.shuffle = function () {
	var i = this.length, j, temp;
	if (i == 0) {
		return this;
	}
	while (--i) {
		j = Math.floor(Math.random() * (i + 1));
		temp = this[i]
		this[i] = this[j];
		this[j] = temp;
	}
	return this;
};

Array.prototype.removeAtIndex = function (index) {
	var target = this;
	target.splice(index, 1);
	return target;
};

Array.prototype.removeItem = function () {
	var what,
		a = arguments,
		L = a.length,
		ax;
	var target = this;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			target = target.filter(item => item !== what);
		}
	}
	return target;
};



Array.prototype.unique = function () {
	var prims = { "boolean": {}, "number": {}, "string": {} }, objs = [];
	return this.filter(function (item) {
		var type = typeof item;
		if (type in prims) {
			return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
		}
		else {
			return objs.indexOf(item) >= 0 ? false : objs.push(item);
		}
	});
};

//Most frequent element
Array.prototype.mode = function () {
	var target = this;
	return target.sort((a, b) =>
		target.filter(v => v === a).length
		- target.filter(v => v === b).length
	).pop();
};

//Chunks
Array.prototype.chunks = function (chunk = 1) {
	var target = this;
	var i, j;
	var chunked = [];
	for (i = 0, j = target.length; i < j; i += chunk) {
		chunked.push(target.slice(i, i + chunk));
	}
	return chunked;
};

Array.prototype.toCSV = function (filename = String.uid(25), columns = false) {
	var target = this;
	filename = filename.endsWith(".csv") ? filename : (filename + ".csv");


	var processRow = function (row) {
		var finalVal = '';
		if (JSON.isJSON(row)) {
			if (!columns && JSON.isJSON(target[0])) {
				let headerKeys = Object.keys(target[0]);
				let newRow = {};
				headerKeys.map(headerKey => {
					newRow[headerKey] = row[headerKey];
				});
				row = Object.values(newRow);
			}
			else {
				row = Object.values(row);
			}

		}

		for (var j = 0; j < row.length; j++) {
			var innerValue = row[j] === null || row[j] === undefined ? '' : JSON.stringify(row[j]);
			if (row[j] instanceof Date) {
				innerValue = row[j].toLocaleString();
			}
			else if (row[j] instanceof Object) {
				innerValue = JSON.stringify(row[j]);
			};
			//var result = innerValue.replace(/"/g, '""');
			var result = innerValue;

			if (result.search(/(,|\n)/g) >= 0) {
				//result = '"' + result + '"';
				result = '"' + result + '"';
			}
			if (j > 0) {
				finalVal += ',';
			}
			finalVal += result;

		}

		return finalVal + '\n';
	};

	var csvFile = '';
	for (var i = 0; i < target.length; i++) {
		csvFile += processRow(target[i]);
	}

	var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
	if (navigator.msSaveBlob) { // IE 10+
		navigator.msSaveBlob(blob, filename);
	}
	else {
		var link = document.createElement("a");
		if (link.download !== undefined) { // feature detection
			// Browsers that support HTML5 download attribute
			var url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
};


Array.prototype.equals = function (array) {
	// if the other array is a falsy value, return
	if (!array) return false;

	// compare lengths - can save a lot of time
	if (this.length != array.length) return false;

	for (var i = 0, l = this.length; i < l; i++) {
		// Check if we have nested arrays
		if (this[i] instanceof Array && array[i] instanceof Array) {
			// recurse into the nested arrays
			if (!this[i].equals(array[i])) return false;
		} else if (this[i] != array[i]) {
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;
		}
	}
	return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

Object.size = function (obj) {
	var size = 0,
		key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

Object.difference = function (a, b, comprehensive = true) {
	var result = {
		differences: [],
		missing_from_first: [],
		missing_from_second: [],
	};
	if (JSON.isJSON(a) && JSON.isJSON(b)) {
		lodash.reduce(
			a,
			function (result, value, key) {
				if (b.hasOwnProperty(key)) {
					if (lodash.isEqual(value, b[key])) {
						return result;
					} else {
						if (
							typeof a[key] != typeof {} ||
							typeof b[key] != typeof {}
						) {
							//dead end.
							result.differences.push(key);
							return result;
						} else {
							var deeper = Object.difference(a[key], b[key]);
							result.differences = result.differences.concat(
								lodash.map(deeper.differences, sub_path => {
									return key + "." + sub_path;
								})
							);
							if (comprehensive) {
								result.missing_from_second = result.missing_from_second.concat(
									lodash.map(
										deeper.missing_from_second,
										sub_path => {
											return key + "." + sub_path;
										}
									)
								);

								result.missing_from_first = result.missing_from_first.concat(
									lodash.map(
										deeper.missing_from_first,
										sub_path => {
											return key + "." + sub_path;
										}
									)
								);
							}

							return result;
						}
					}
				} else {
					if (comprehensive) {
						result.missing_from_second.push(key);
					}
					return result;
				}
			},
			result
		);

		lodash.reduce(
			b,
			function (result, value, key) {
				if (JSON.isJSON(a)) {
					if (a.hasOwnProperty(key)) {
						return result;
					} else {
						if (comprehensive) {
							result.missing_from_first.push(key);
						}
						return result;
					}
				} else {
					return result;
				}
			},
			result
		);
		if (comprehensive) {
			return result;
		} else {
			return result.differences;
		}
	} else if (JSON.isJSON(a) && !JSON.isJSON(b)) {
		let differences = Object.keys(a);
		result.differences = differences;
		result.missing_from_second = differences;
		if (comprehensive) {
			return result;
		} else {
			return result.differences;
		}
	} else if (!JSON.isJSON(a) && JSON.isJSON(b)) {
		let differences = Object.keys(b);
		result.differences = differences;
		result.missing_from_first = differences;
		if (comprehensive) {
			return result;
		} else {
			return result.differences;
		}
	} else {
		if (comprehensive) {
			return result;
		} else {
			return result.differences;
		}
	}
};
Object.areEqual = isEqual;


Object.isFunctionalComponent = Component => {
	return (
		Function.isFunction(Component) &&
		!(Component.prototype && Component.prototype.render)
	);
};

Object.isReactComponent = Component => {
	return (Component.prototype && Component.prototype.render) || Object.isFunctionalComponent(Component);
};

Object.isObject = function (input) {
	return !!input && typeof input === "object";
};

//This is to ensure equating objects doesnt change original
function parseToJSON (input) {
	let newObject = {};
	try {
		newObject = JSON.parse(JSON.stringify(input));
	} catch (err) {
		newObject = {};
	}
	return newObject;
};

Object.toJSON = parseToJSON;
JSON.fromJSON = parseToJSON;
JSON.parseJSON = parseToJSON;

JSON.isJSON = function (input) {
	return input !== undefined && input !== null
		? input.constructor === {}.constructor
		: false;
};


JSON.areEqual = isEqual;
JSON.isEqual = isEqual;

JSON.prettyStringify = function (input, spaces = 4) {
	let spacing = "";
	for (var i = 0; i < spaces; i++) {
		spacing = spacing + " ";
	}
	function syntaxHighlight (json) {
		json = json
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		return json.replace(
			/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
			function (match) {
				var cls = "text-gray-700";
				if (/^"/.test(match)) {
					if (/:$/.test(match)) {
						cls = "text-red-700";
					} else {
						cls = "text-green-700";
					}
				} else if (/true|false/.test(match)) {
					cls = "text-blue-600";
				} else if (/null/.test(match)) {
					cls = "text-gray-500";
				}
				//return '<span class="' + cls + '">' + match + "</span>";
				return match;
			}
		);
	}
	let str = "";
	if (typeof input === "object") {
		//str = syntaxHighlight(JSON.stringify(input, undefined, spaces));
		str = JSON.stringify(input);
		//str = str.replaceAll(spacing, " \t \t ");
	}
	return str;
};
JSON.readable = function (
	input,
	highLightSytax = true,
	linebreaker = "\n",
	spacer = "\t"
) {
	let str = "";
	if (JSON.isJSON(input)) {
		str = str + "Object(" + linebreaker + " " + spacer;
		for (let [key, value] of Object.entries(input)) {
			str =
				str +
				" " +
				linebreaker +
				" " +
				spacer +
				" " +
				key.humanize() +
				" = ";
			if (JSON.isJSON(value)) {
				str = str + JSON.readable(value);
			} else if (Array.isArray(value)) {
				str = str + "Array(";
				const last_index = value.length > 0 ? value.length - 1 : 0;
				for (var i = 0; i <= last_index; i++) {
					if (JSON.isJSON(value[i])) {
						str =
							str +
							JSON.readable(value[i]) +
							(i < last_index ? ", " : "");
					} else {
						str =
							str +
							new String(value) +
							(i < last_index ? ", " : "");
					}
				}
				str = str + ")";
			} else if (Boolean.isBoolean(value)) {
				str = str + (value ? "Yes" : "No");
			} else {
				str = str + new String(value);
			}
			str = str + linebreaker;
		}
		str = str + linebreaker + ")";
	}
	return str;
};

if (JSON.indexOf) {}

JSON.positionOfKey = function (object, key) {
	let position = -1;
	if (JSON.isJSON(object)) {
		let keys = Object.keys(object);
		position = keys.indexOf(key);
	}
	return position;
};

JSON.keyOf = function (object, value) {
	let key = null;
	if (JSON.isJSON(object)) {
		let values = Object.values(object);
		let position = values.indexOf(value);
		key = position !== -1 ? Object.keys(object)[position] : null;
	}
	return key;
};

if (JSON.moveKey) {}
JSON.moveKey = function (object, key, position = 0) {
	let newObject = {};
	if (JSON.isJSON(object)) {
		newObject = {};
		let object_keys_arr = Object.keys(object);
		let current_position = object_keys_arr.indexOf(key);
		if (current_position !== -1) {
			if (current_position === position) {
				newObject = object;
			} else {
				let cutOut = object_keys_arr.splice(current_position, 1)[0]; // cut the element at index 'current_position'
				object_keys_arr.splice(position, 0, cutOut);

				newObject = {};
				for (let i = 0; i < object_keys_arr.length; i++) {
					newObject[object_keys_arr[i]] = object[object_keys_arr[i]];
				}
			}
		} else {
			newObject = object;
		}
	}

	return newObject;
};





/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
const deepMerge = function (target, ...sources) {
	if (!sources.length) return target;
	/*
	sources = JSON.parse(sources);
	const source = sources.shift(sources);

	if (JSON.isJSON(target) && JSON.isJSON(source)) {
		for (const key in source) {
			if (JSON.isJSON(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				deepMerge(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return deepMerge(target, ...sources);*/
	if (JSON.isJSON(target)) {
		return lodash.merge(target, ...sources);
	}
	return {};
}
JSON.merge = deepMerge;
JSON.deepMerge = deepMerge;

JSON.updateJSON = function (original = {}, updater = {}) {
	let newObject = {};
	if (JSON.isJSON(original) && JSON.isJSON(updater)) {
		newObject = JSON.fromJSON(original);

		for (let [key, value] of Object.entries(original)) {
			if (key in updater) {
				newObject[key] = updater[key];
			}
		}
	}
	return newObject;
};
JSON.removeProperty = function (input, key) {
	let newObject = {};
	if (JSON.isJSON(input)) {
		newObject = JSON.fromJSON(input);
		delete newObject[key];
	}
	return newObject;
};

JSON.isEmpty = function (target) {
	if (JSON.isJSON(target)) {
		return Object.keys(target).length > 0 ? false : true;
	}
	return true;
};

JSON.getDeepPropertyValue = function (deepKey, target, defaultValue=undefined) {
	var value = undefined;
	if (String.isString(deepKey) && !String.isEmpty(deepKey) && !JSON.isEmpty(target)) {
		var deepKeyArr = deepKey.trim().split(".");
		var obj = target;
		var lastIndex = deepKeyArr.length - 1;
		for (var i = 0; i <= lastIndex; i++) {

			if (i < lastIndex) {
				obj = obj[deepKeyArr[i]]
				let nextDeepKey = deepKeyArr.slice((i + 1)).join(".");
				if (!JSON.isJSON(obj)) {
					obj = {}
				}
				value = JSON.getDeepPropertyValue(nextDeepKey, obj);
			}
			else {
				value = obj[deepKeyArr[i]] || defaultValue;
			}

		}
	}

	return value;
};

JSON.setDeepPropertyValue = (deepKey, value, target = {}) => {
	const [head, ...rest] = deepKey.trim().split('.');
	let newObj = JSON.fromJSON(target);
	if (!JSON.isJSON(newObj)) {
		newObj = {};
	}
	if (rest.length > 0) {
		if (!JSON.isJSON(newObj[head])) {
			newObj[head] = {}
		}
		newObj[head] = JSON.setDeepPropertyValue(rest.join('.'), value, newObj[head])
	}
	else {
		newObj[head] = value;
	}

	return newObj
};


if (JSON.get) {
	console.warn("Overrinding existing property JSON.get")
}
JSON.get = get;

Date.prototype.format = function (format) {
	//PHP's date format function Javascript emulation
	/*
	d	Day of the month, 2 digits with leading zeros	01 to 31
	D	A textual representation of a day, three letters	Mon through Sun
	j	Day of the month without leading zeros	1 to 31
	l	A full textual representation of the day of the week	Sunday through Saturday
	N	ISO-8601 numeric representation of the day of the week (added in PHP 5.1.0)	1 (for Monday) through 7 (for Sunday)
	S	English ordinal suffix for the day of the month, 2 characters	st, nd, rd or th. Works well with j
	w	Numeric representation of the day of the week	0 (for Sunday) through 6 (for Saturday)
	z	The day of the year (starting from 0)	0 through 365
	Week
	W	ISO-8601 week number of year, weeks starting on Monday (added in PHP 4.1.0)	Example: 42 (the 42nd week in the year)
	Month
	F	A full textual representation of a month, such as January or March	January through December
	m	Numeric representation of a month, with leading zeros	01 through 12
	M	A short textual representation of a month, three letters	Jan through Dec
	n	Numeric representation of a month, without leading zeros	1 through 12
	t	Number of days in the given month	28 through 31
	Year
	L	Whether it’s a leap year	1 if it is a leap year, 0 otherwise.
	o	ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead. (added in PHP 5.1.0)	Examples: 1999 or 2003
	Y	A full numeric representation of a year, 4 digits	Examples: 1999 or 2003
	y	A two digit representation of a year	Examples: 99 or 03
	Time
	a	Lowercase Ante meridiem and Post meridiem	am or pm
	A	Uppercase Ante meridiem and Post meridiem	AM or PM
	B	Swatch Internet time	000 through 999
	g	12-hour format of an hour without leading zeros	1 through 12
	G	24-hour format of an hour without leading zeros	0 through 23
	h	12-hour format of an hour with leading zeros	01 through 12
	H	24-hour format of an hour with leading zeros	00 through 23
	i	Minutes with leading zeros	00 to 59
	s	Seconds, with leading zeros	00 through 59
	Timezone
	e (unsuported)	Timezone identifier	Examples: UTC, GMT, Atlantic/Azores
	I	Whether or not the date is in daylights savings time	1 if Daylight Savings Time, 0 otherwise.
	O	Difference to Greenwich time (GMT) in hours	Example: +0200
	P	Difference to Greenwich time (GMT) with colon between hours and minutes Example: +02:00
	T	Timezone setting of this machine	Examples: EST, MDT …
	Z	Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.	-43200 through 43200
	Full Date/Time
	c	ISO 8601 date (added in PHP 5)	2004-02-12T15:19:21+00:00
	r	RFC 2822 formatted date	Example: Thu, 21 Dec 2000 16:01:07 +0200
	U	Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)	See also time()

	*/
	var returnStr = "";
	var replace = Date.replaceChars;
	for (var i = 0; i < format.length; i++) {
		var curChar = format.charAt(i);
		if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
			returnStr += curChar;
		} else if (replace[curChar]) {
			returnStr += replace[curChar].call(this);
		} else if (curChar != "\\") {
			returnStr += curChar;
		}
	}
	return returnStr;
};

Date.format = (input, format) => {
	let result = input;
	try {
		let date = new Date(input);
		result = date.format(format)
	} catch (error) {
		console.error("Date.format error", error)
	}

	// console.log("Date.format input", input, "result", result)
	return result;
}

Date.replaceChars = {
	shortMonths: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	],
	longMonths: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	],
	shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	longDays: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	],

	// Day
	d: function () {
		return (this.getDate() < 10 ? "0" : "") + this.getDate();
	},
	D: function () {
		return Date.replaceChars.shortDays[this.getDay()];
	},
	j: function () {
		return this.getDate();
	},
	l: function () {
		return Date.replaceChars.longDays[this.getDay()];
	},
	N: function () {
		return this.getDay() + 1;
	},
	S: function () {
		return this.getDate() % 10 == 1 && this.getDate() != 11
			? "st"
			: this.getDate() % 10 == 2 && this.getDate() != 12
				? "nd"
				: this.getDate() % 10 == 3 && this.getDate() != 13
					? "rd"
					: "th";
	},
	w: function () {
		return this.getDay();
	},
	z: function () {
		var d = new Date(this.getFullYear(), 0, 1);
		return Math.ceil((this - d) / 86400000);
	}, // Fixed now
	// Week
	W: function () {
		var d = new Date(this.getFullYear(), 0, 1);
		return Math.ceil(((this - d) / 86400000 + d.getDay() + 1) / 7);
	}, // Fixed now
	// Month
	F: function () {
		return Date.replaceChars.longMonths[this.getMonth()];
	},
	m: function () {
		return (this.getMonth() < 9 ? "0" : "") + (this.getMonth() + 1);
	},
	M: function () {
		return Date.replaceChars.shortMonths[this.getMonth()];
	},
	MMM: function () {
		return Date.replaceChars.shortMonths[this.getMonth()];
	},
	n: function () {
		return this.getMonth() + 1;
	},
	t: function () {
		var d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), 0).getDate();
	}, // Fixed now, gets #days of date
	// Year
	L: function () {
		var year = this.getFullYear();
		return year % 400 == 0 || (year % 100 != 0 && year % 4 == 0);
	}, // Fixed now
	o: function () {
		var d = new Date(this.valueOf());
		d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3);
		return d.getFullYear();
	}, //Fixed now
	Y: function () {
		return this.getFullYear();
	},
	yyyy: function () {
		return this.getFullYear();
	},
	y: function () {
		return ("" + this.getFullYear()).substr(2);
	},
	// Time
	a: function () {
		return this.getHours() < 12 ? "am" : "pm";
	},
	A: function () {
		return this.getHours() < 12 ? "AM" : "PM";
	},
	B: function () {
		return Math.floor(
			((((this.getUTCHours() + 1) % 24) +
				this.getUTCMinutes() / 60 +
				this.getUTCSeconds() / 3600) *
				1000) /
			24
		);
	}, // Fixed now
	g: function () {
		return this.getHours() % 12 || 12;
	},
	G: function () {
		return this.getHours();
	},
	h: function () {
		return (
			((this.getHours() % 12 || 12) < 10 ? "0" : "") +
			(this.getHours() % 12 || 12)
		);
	},
	H: function () {
		return (this.getHours() < 10 ? "0" : "") + this.getHours();
	},
	i: function () {
		return (this.getMinutes() < 10 ? "0" : "") + this.getMinutes();
	},
	s: function () {
		return (this.getSeconds() < 10 ? "0" : "") + this.getSeconds();
	},
	u: function () {
		var m = this.getMilliseconds();
		return (m < 10 ? "00" : m < 100 ? "0" : "") + m;
	},
	// Timezone
	e: function () {
		return "Not Yet Supported";
	},
	I: function () {
		var DST = null;
		for (var i = 0; i < 12; ++i) {
			var d = new Date(this.getFullYear(), i, 1);
			var offset = d.getTimezoneOffset();

			if (DST === null) {
				DST = offset;
			} else if (offset < DST) {
				DST = offset;
				break;
			} else if (offset > DST) {
				break;
			}
		}
		return (this.getTimezoneOffset() == DST) | 0;
	},
	O: function () {
		return (
			(-this.getTimezoneOffset() < 0 ? "-" : "+") +
			(Math.abs(this.getTimezoneOffset() / 60) < 10 ? "0" : "") +
			Math.abs(this.getTimezoneOffset() / 60) +
			"00"
		);
	},
	P: function () {
		return (
			(-this.getTimezoneOffset() < 0 ? "-" : "+") +
			(Math.abs(this.getTimezoneOffset() / 60) < 10 ? "0" : "") +
			Math.abs(this.getTimezoneOffset() / 60) +
			":00"
		);
	}, // Fixed now
	T: function () {
		var m = this.getMonth();
		this.setMonth(0);
		var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, "$1");
		this.setMonth(m);
		return result;
	},
	Z: function () {
		return -this.getTimezoneOffset() * 60;
	},
	// Full Date/Time
	c: function () {
		return this.format("Y-m-d\\TH:i:sP");
	}, // Fixed now
	r: function () {
		return this.toString();
	},
	U: function () {
		return this.getTime() / 1000;
	},
	since: function () {
		let startTime = this.getTime();
		let endTime = performance.now();
		var timeDiff = endTime - startTime; //in ms 
		// strip the ms 
		timeDiff /= 1000;
		// get seconds 
		let seconds = Math.round(timeDiff);

		function secondsToDHms (secs) {
			secs = Number(secs);

			var d = Math.floor(secs / (3600 * 24));
			var h = Math.floor(secs % (3600 * 24) / 3600);
			var m = Math.floor(secs % 3600 / 60);
			var s = Math.floor(secs % 60);
			return {
				days: d,
				hrs: h,
				mins: m,
				secs: s,
			};
		}

		return secondsToDHms(seconds);
	},
};

Date.prototype.addDays = function (days) {
	this.setDate(this.getDate() + days);
	return this;
};

Date.prototype.addHours = function (hrs) {
	this.setTime(this.getTime() + hrs * 3600000);
	return this;
};

Date.prototype.addMinutes = function (min) {
	this.setTime(this.getTime() + min * 60000);
	return this;
};

Date.prototype.addSeconds = function (sec) {
	this.setTime(this.getTime() + sec * 1000);
	return this;
};

Date.prototype.addMilliSeconds = function (ms) {
	this.setTime(this.getTime() + ms);
	return this;
};

Date.prototype.minusDays = function (days) {
	this.setDate(this.getDate() - days);
	return this;
};

Date.prototype.minusHours = function (hrs) {
	this.setTime(this.getTime() - hrs * 3600000);
	return this;
};

Date.prototype.minusMinutes = function (min) {
	this.setTime(this.getTime() - min * 60000);
	return this;
};

Date.prototype.minusSeconds = function (sec) {
	this.setTime(this.getTime() - sec * 1000);
	return this;
};

Date.prototype.minusMilliSeconds = function (ms) {
	this.setTime(this.getTime() - ms);
	return this;
};



/*Date.difference = function(date1, date2 = new Date()) {
	
	if (Number.isNumber(date1)) {
		try {
			date1 = new Date(date1);
		} catch (e) {
			
		}
	}
	if (Number.isNumber(date2)) {
		try {
			date2 = new Date(date2);
		} catch (e) {
			
		}
	}
	
	var intervals = {
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		direction: "forward",
		description: "",
	}

	if ((date1 instanceof Date) && (date2 instanceof Date)) {
		var years = 0;
		var months = 0;
		var weeks = 0;
		var days = 0;
		var hours = 0;
		var minutes = 0;
		var seconds = 0;
		var milliseconds = 0;
		var direction = date2.getTime() >= date1.getTime()? "forward" : "reverse";
		var description = "";

		var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if (date2.getFullYear() % 4 === 0) {
			daysInMonth[1] = 29;
		}
		
		
		
		years = Math.abs((date2.getFullYear() - date1.getFullYear()));

		//months = date2.getDate() - date1.getMonth();

		months = (years === 0? (date2.getMonth() - date1.getMonth()) : (( 11 - date1.getMonth()) +  (11 - date2.getMonth())));
		if (years > 0 && date1.getMonth() < 6) {
			months = (11 - date1.getMonth()) + date2.getMonth();
		}
		days = (months === 0? (date2.getDate() - date1.getDate()) : (( daysInMonth[date1.getMonth()] - date1.getDate()) + (daysInMonth[date2.getMonth()] - date2.getDate())));
		
		weeks = Math.floor((days >= 7? (days/7) : 0));
		days = weeks > 0? (days - (weeks*7)) : days;
		hours = ((days === 0? (date2.getHours() - date1.getHours()) : (( 23 - date1.getHours()) + (23 - date2.getHours()))));
		minutes = ((hours === 0? (date2.getMinutes() - date1.getMinutes()) : (( 59 - date1.getMinutes()) + (59 - date2.getMinutes()))));
		seconds = ((minutes === 0? (date2.getSeconds() - date1.getSeconds()) : (( 59 - date1.getSeconds()) + (59 - date2.getSeconds()))));
		milliseconds = ((seconds === 0? (date2.getMilliseconds() - date1.getMilliseconds()) : (( 999 - date1.getMilliseconds()) + (599 - date1.getMilliseconds()))));

		if (years > 0) {
			description = years+" years";
			if (years === 1) {
				description = "last year";
				if (months > 0) {
					description = date1.toLocaleString;
				}
			}
			
		}
		else  if (months > 0) {

		}
		
			


		intervals.years = years;
		intervals.months = months;
		intervals.weeks = weeks;
		intervals.days = days;
		intervals.hours = hours;
		intervals.minutes = minutes;
		intervals.seconds = seconds;
		intervals.milliseconds = milliseconds;
		intervals.direction = direction;
		intervals.description = description;
	}
		

	return intervals;
};*/

Date.difference = function (date1, date2 = new Date()) {
	date1 = Date.from(date1);
	date2 = Date.from(date2);

	let difference = {
		value: 0,
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		type: "future",
		description: "",
	}

	if (Date.isDate(date1) && Date.isDate(date2)) {
		const secondMs = 1000;
		const minuteMs = secondMs * 60;
		const hourMs = minuteMs * 60;
		const dayMs = hourMs * 24;
		const weekMs = dayMs * 7;
		const monthMs = dayMs * 30;
		const yearMs = dayMs * 365;

		let differenceMs = date2.getTime() - date1.getTime();
		if (differenceMs < 0) {
			difference.type = "past";
		}
		differenceMs = differenceMs < 0 ? (0 - differenceMs) : differenceMs
		var years = Math.floor(differenceMs / 3.154e+10);
		var durationMinusYears = differenceMs - (years * 3.154e+10);
		var months = Math.floor(differenceMs / 2.628e+9) % 12;
		var durationMinusMonths = durationMinusYears - (months * 2.628e+9);
		var weeks = Math.floor(durationMinusMonths / weekMs);
		var durationMinusWeeks = durationMinusMonths - (weeks * weekMs);
		var days = Math.floor(durationMinusWeeks / dayMs);
		var durationMinusDays = durationMinusWeeks - (days * dayMs);
		var hours = Math.floor(durationMinusDays / hourMs);
		var durationMinusHours = durationMinusDays - (hours * hourMs);
		var minutes = Math.floor(durationMinusHours / hourMs);
		var durationMinusMinutes = durationMinusHours - (minutes * minuteMs);
		var seconds = Math.floor(durationMinusMinutes / secondMs);
		var durationMinusSeconds = durationMinusMinutes - (seconds * secondMs);
		var milliseconds = durationMinusSeconds;

		// differenceMs = differenceMs < 0 ? (0 - differenceMs) : differenceMs
		// var years = Math.floor(differenceMs / yearMs);
		// differenceMs = differenceMs - (years * yearMs);
		// var months = Math.floor(differenceMs / monthMs);
		// differenceMs = differenceMs - (months * monthMs);
		// var weeks = Math.floor(differenceMs / weekMs);
		// differenceMs = differenceMs - (weeks * weekMs);
		// var days = Math.floor(differenceMs / dayMs);
		// differenceMs = differenceMs - (days * dayMs);
		// var hours = Math.floor(differenceMs / hourMs);
		// differenceMs = differenceMs - (hours * hourMs);
		// var minutes = Math.floor(differenceMs / minuteMs);
		// differenceMs = differenceMs - (minutes * minuteMs);
		// var seconds = Math.floor(differenceMs / secondMs);
		var milliseconds = differenceMs - (seconds * secondMs);





		difference.value = date2.getTime() - date1.getTime();

		difference.years = (years);
		difference.months = (months);
		difference.weeks = weeks;
		difference.days = days;
		difference.hours = (hours);
		difference.minutes = (minutes);
		difference.seconds = (seconds);
		difference.milliseconds = milliseconds
		difference.same_hour = differenceMs <= hourMs
		difference.same_day = differenceMs <= dayMs && date1.getDay() == date2.getDay()
		difference.same_month = differenceMs <= monthMs && date1.getMonth() == date2.getMonth()
	}


	return difference;
};
Date.prototype.difference = function (targetdate) {
	return Date.difference(this, targetdate);
};

Date.isDate = function (target) {
	return target && Object.prototype.toString.call(target) === "[object Date]" && !isNaN(target);
};

Date.from = function (input, defaultDate = null) {
	let date = defaultDate;
	if (!!input) {
		if (Date.isDate(input)) {
			date = input
		}
		try {
			let ms = Date.parse(input);
			date = new Date(ms);
		} catch (e) {
			console.error("Date.from error", e);
		}
	}
	// console.log("Date.from date", date);
	return date;
};