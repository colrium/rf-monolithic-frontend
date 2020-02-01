import lodash from 'lodash';
import lodash_inflection from "lodash-inflection";
import { dashboardBaseUri, landingPageBaseUri, orderFormBaseUri } from 'config';

lodash.mixin(lodash_inflection);



//Type Extensions
// Warn if overriding existing method
if(String.isString){
	console.warn("Overriding existing String.isString.");
}
String.isString = function(input) {
	return input !== undefined && input !== null? (input.constructor === String ) : false;
};

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

String.toDate = function(input) {
	try {
		let ms = Date.parse(input);
		return new Date(ms);
	} catch(e){
		console.error("String.toDate", e);
		return null;
	}
};

String.uid = function(len, numeric, all_caps) {
	let buf = [];
	let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let charlen = chars.length;
	if (numeric) {
		chars = '0123456789';
		charlen = chars.length;
	}
	else if (all_caps) {
		chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		charlen = chars.length;
	}

	for (var i = 0; i < len; ++i) {
		buf.push(chars[Number.getRandomInt(0, charlen - 1)]);
	}

	return buf.join('');
};


String.prototype.shorten = function(size, ellipsis="...") {
	let target = this;
	if (target.length > size) {
		return target.substring(0, size)+ellipsis;
	}
	return target;
};

String.prototype.toUriWithDashboardPrefix = function() {
	let target = this;
	let uriWithBaseRoute = (dashboardBaseUri.startsWith("/")? dashboardBaseUri  : ("/"+dashboardBaseUri)) ;
	uriWithBaseRoute += dashboardBaseUri.endsWith("/")? dashboardBaseUri.substring(0, (dashboardBaseUri.length-2)) : "";
	uriWithBaseRoute += target.startsWith("/")? target : ("/"+target);
	return uriWithBaseRoute;
};

String.prototype.toUriWithLandingPagePrefix = function() {
	let target = this;
	let uriWithBaseRoute = (landingPageBaseUri.startsWith("/")? landingPageBaseUri  : ("/"+landingPageBaseUri)) ;
	uriWithBaseRoute += landingPageBaseUri.endsWith("/")? landingPageBaseUri.substring(0, (landingPageBaseUri.length-2)) : "";
	uriWithBaseRoute += target.startsWith("/")? target : ("/"+target);
	return uriWithBaseRoute;
};

String.prototype.toUriWithOrderFormPrefix = function() {
	let target = this;
	let uriWithBaseRoute = (orderFormBaseUri.startsWith("/")? orderFormBaseUri  : ("/"+orderFormBaseUri)) ;
	uriWithBaseRoute += orderFormBaseUri.endsWith("/")? orderFormBaseUri.substring(0, (orderFormBaseUri.length-2)) : "";
	uriWithBaseRoute += target.startsWith("/")? target : ("/"+target);
	return uriWithBaseRoute;
};


String.prototype.singularize = function () {
	var target = this;
	return lodash.singularize(target);
};

String.prototype.pluralize = function () {
	var target = this;
	return lodash.pluralize(target);
};

String.prototype.variablelize = function (connector="_") {
	console.log("connector", connector);
	var target = this;
	target = target.replaceAll(/([A-Z])/g, ' $1');
	target = target.trim();
	target = target.replaceAll(/\s\s+/g, ' ');
	target = target.replaceAll(' ', connector);
	return target.toLowerCase();
};

String.prototype.humanize = function(){
	var target = this;
	return target.replace(/([A-Z])/g, ' $1').trim().replace(/^[\s_]+|[\s_]+$/g, '').replace(/[_\s]+/g, ' ').replace(/^[a-z]/, function(m) { return m.toUpperCase(); });
}

String.prototype.hasHTML = function(){
	var target = this;
	return /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(target);
}

String.isUrl = function(target, protocol=true){
	if (String.isString(target)) {
		if (protocol) {
			return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(target);
		}
		else {
			return /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi.test(target);
		}
	}
	return false;
	
}

String.isEmpty = function(target){
	if (String.isString(target)) {
		return target.trim().length > 0? false : true;
	}
	return true;
	
}





if(JSON.isJSON){
	console.warn("Overriding existing JSON.isJSON.");
}
JSON.isJSON = function(input) {
	return input !== undefined && input !== null? (input.constructor === ({}).constructor) : false;
};
JSON.prettyStringify = function(input, spaces=4) {
	let spacing = "";
	for (var i = 0; i < spaces; i++) {
		spacing = spacing+" ";
	}
	function syntaxHighlight(json) {
		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			var cls = 'text-gray-700';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'text-red-700';
				} else {
					cls = 'text-green-700';
				}
			} else if (/true|false/.test(match)) {
				cls = 'text-blue-600';
			} else if (/null/.test(match)) {
				cls = 'text-gray-500';
			}
			return '<span class="' + cls + '">' + match + '</span>';
		});
	}
	let str = "";
	if (JSON.isJSON(input)) {
		str = syntaxHighlight(JSON.stringify(input, undefined, spaces));
		str = str.replaceAll(spacing, " \t \t ");
	}
	return str;
};
JSON.readable = function(input, highLightSytax = true, linebreaker="\n", spacer="\t") {    
	let str = "";
	if (JSON.isJSON(input)) {
		str = str + "Object("+ linebreaker +" "+ spacer;
		for (let [key, value] of Object.entries(input)) {
			str = str + " " + linebreaker +" "+ spacer +" "+ key.humanize()+" = ";
			if (JSON.isJSON(value)) {
				str = str + JSON.readable(value);
			}
			else if (Array.isArray(value)) {
				str = str + "Array(";
				const last_index = value.length > 0? value.length - 1 : 0;
				for (var i = 0; i <= last_index; i++) {
					if (JSON.isJSON(value[i])) {
						str = str + JSON.readable(value[i])+(i < last_index? ", " : "");
					}
					else{
						str = str +new String(value)+(i < last_index? ", " : "");
					}
				}
				str = str + ")";
			}
			else if (Boolean.isBoolean(value)) {
				str = str + (value? "Yes" : "No");
			}
			else {
				str = str + new String(value);
			}
			str = str + linebreaker;
		}
		str = str + linebreaker + ")";
	}
	return str;
};

if (JSON.indexOf) {
	console.warn("Overriding existing JSON.indexOf.");
}

JSON.positionOfKey = function (object, key) {
	let position = -1;
	if (JSON.isJSON(object)) {
		let keys = Object.keys(object);
		position = keys.indexOf(key);
	}	
	return position;
};

if (JSON.moveKey) {
	console.warn("Overriding existing JSON.moveKey.");
}
JSON.moveKey = function (object, key, position=0) {
	let newObject = {};
	if (JSON.isJSON(object)) {
		newObject = {};
		let object_keys_arr = Object.keys(object);
		let current_position = object_keys_arr.indexOf(key);
		if (current_position !== -1) {
			if (current_position === position) {
				newObject = object;
			}
			else{
				let cutOut = object_keys_arr.splice(current_position, 1)[0]; // cut the element at index 'current_position'
				object_keys_arr.splice(position, 0, cutOut);
				
				newObject = {};
				for (let i = 0; i < object_keys_arr.length; i++) {
					newObject[object_keys_arr[i]] = object[object_keys_arr[i]];
				}				
			}
		}
		else{
			newObject = object;
		}
		
	}
	
	return newObject;
};

//This is to ensure equating objects doesnt change original
JSON.fromJSON = function(input){
	let newObject = {};
	if (JSON.isJSON(input)) {
		newObject = JSON.parse(JSON.stringify(input));
	}
	return newObject;
}

JSON.updateJSON = function (original={}, updater={}) {
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
JSON.removeProperty = function(input, key){
	let newObject = {};
	if (JSON.isJSON(input)) {
		newObject = JSON.fromJSON(input);		
		delete newObject[key];
		console.log("JSON.removeProperty input ", input, "newObject", newObject);
	}
	return newObject;
}



if(Boolean.isBoolean){
	console.warn("Overriding existing Boolean.isBoolean.");
}
Boolean.isBoolean = function(input) {
	return input !== undefined && input !== null? (input.constructor === Boolean) : false;
};

if(Function.isFunction){
	console.warn("Overriding existing Function.isFunction.");
}
Function.isFunction = function(input) {
	return input !== undefined && input !== null? (input.constructor === Function || typeof input === "function") : false;
};

if(Number.isNumber){
	console.warn("Overriding existing Number.isNumber.");
}
Number.isNumber = function(input) {
	return input !== undefined && input !== null? (input.constructor === Number && input !== NaN) : false;
};

if(Error.isError){
	console.warn("Overriding existing Error.isError.");
}
Error.isError = function(input) {
	return input !== undefined && input !== null? (input instanceof Error) : false;
};


if(RegExp.isRegExp){
	console.warn("Overriding existing RegExp.isRegExp.");
}
RegExp.isRegExp = function(input) {
	return input !== undefined && input !== null? (input.constructor === RegExp) : false;
};



//Number Extensions
if(Number.isFloat){
	console.warn("Overriding existing Number.isFloat.");
}
Number.isFloat = function(input) {
	return input !== undefined && input !== null && input !== NaN? (/[-+]?(?:\d*\.\d+\.?\d*)(?:[eE][-+]?\d+)?/igm.test(input)) : false;
};

if(Number.isInt){
	console.warn("Overriding existing Number.isInt.");
}
Number.isInt = function(input) {
	return input !== undefined && input !== null && input !== NaN? (/^[-+]?(\d*)?\d+$/igm.test(input)) : false;
};

if(Number.parseNumber){
	console.warn("Overriding existing Number.parseNumber.");
}
Number.parseNumber = function(input, fallback=null) {
	if (Number.isFloat(input)) {
		return parseFloat(input);
	}
	else if (Number.isInt(input)) {
		return parseInt(input);
	}
	else{
		return fallback;
	}
};


//String Extensions

Number.getRandomInt = function(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

Array.prototype.removeAtIndex = function (index) {
	var target = this;
	target.splice(index, 1);
	return target;
};

Array.prototype.removeItem = function() {
	var what, a = arguments, L = a.length, ax;
	var target = this;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			target = target.filter(item => item !== what);
		}
	}
	return target;
};

Array.prototype.removeDuplicates = function() {
	return lodash.uniqWith(this, lodash.isEqual);
};

// Warn if overriding existing method
if(Array.prototype.equals)
console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
	// if the other array is a falsy value, return
	if (!array)
		return false;

	// compare lengths - can save a lot of time 
	if (this.length != array.length)
		return false;

	for (var i = 0, l=this.length; i < l; i++) {
		// Check if we have nested arrays
		if (this[i] instanceof Array && array[i] instanceof Array) {
			// recurse into the nested arrays
			if (!this[i].equals(array[i]))
				return false;       
		}           
		else if (this[i] != array[i]) { 
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;   
		}           
	}       
	return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});


Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};



Object.difference = function (a, b, comprehensive = true) {
	var result = {
		different: [],
		missing_from_first: [],
		missing_from_second: []
	};
	if (JSON.isJSON(a) && JSON.isJSON(b)) {
		lodash.reduce(a, function (result, value, key) {
			if (b.hasOwnProperty(key)) {
				if (lodash.isEqual(value, b[key])) {
					return result;
				} else {
					if (typeof (a[key]) != typeof ({}) || typeof (b[key]) != typeof ({})) {
						//dead end.
						result.different.push(key);
						return result;
					} else {
						var deeper = Object.difference(a[key], b[key]);
						result.different = result.different.concat(lodash.map(deeper.different, (sub_path) => {
							return key + "." + sub_path;
						}));
						if (comprehensive) {
							result.missing_from_second = result.missing_from_second.concat(lodash.map(deeper.missing_from_second, (sub_path) => {
								return key + "." + sub_path;
							}));

							result.missing_from_first = result.missing_from_first.concat(lodash.map(deeper.missing_from_first, (sub_path) => {
								return key + "." + sub_path;
							}));
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
		}, result);

		lodash.reduce(b, function (result, value, key) {
			if (JSON.isJSON(a)) {
				if (a.hasOwnProperty(key)) {
					return result;
				}
				else {
					if (comprehensive) {
						result.missing_from_first.push(key);
					}
					return result;
				}
			}
			else{
				return result;
			}		
			
		}, result);
		if (comprehensive) {
			return result;
		}
		else {
			return result.different;
		}
	}
	else if (JSON.isJSON(a) && !JSON.isJSON(b)) {
		let different = Object.keys(a);
		result.different = different;
		result.missing_from_second = different;
		if (comprehensive) {
			return result;
		}
		else {
			return result.different;
		}
	}
	else if (!JSON.isJSON(a) && JSON.isJSON(b)) {
		let different = Object.keys(b);
		result.different = different;
		result.missing_from_first = different;
		if (comprehensive) {
			return result;
		}
		else {
			return result.different;
		}
	}
	else {
		if (comprehensive) {
			return result;
		}
		else {
			return result.different;
		}
	}	

};

Object.areEqual = function() {
	let no_of_args = arguments.length;
	let last_index = no_of_args > 0? (no_of_args-1): no_of_args;
	let equal = true;
	for (var i = 0; i < no_of_args; i++) {
		if (i < last_index) {
			if (JSON.isJSON(arguments[i]) && JSON.isJSON(arguments[(i + 1)])) {
				const difference = Object.difference(arguments[i], arguments[(i + 1)], true);

				if (difference.different.length > 0 || difference.missing_from_first.length > 0 || difference.missing_from_second.length > 0) {
					equal = false;
					break;
				}
			}
			
		}
	}

	return equal;
};

Object.isFunctionalComponent = Component => {
	return Function.isFunction(Component) && !(Component.prototype && Component.prototype.render);
};

Object.isReactComponent = Component => {
	return Component.prototype && Component.prototype.render;
};
	

Date.prototype.format = function(format) {
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
	e (unsuported)	Timezone identifier (added in PHP 5.1.0)	Examples: UTC, GMT, Atlantic/Azores
	I	Whether or not the date is in daylights savings time	1 if Daylight Savings Time, 0 otherwise.
	O	Difference to Greenwich time (GMT) in hours	Example: +0200
	P	Difference to Greenwich time (GMT) with colon between hours and minutes (added in PHP 5.1.3)	Example: +02:00
	T	Timezone setting of this machine	Examples: EST, MDT …
	Z	Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.	-43200 through 43200
	Full Date/Time
	c	ISO 8601 date (added in PHP 5)	2004-02-12T15:19:21+00:00
	r	RFC 2822 formatted date	Example: Thu, 21 Dec 2000 16:01:07 +0200
	U	Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)	See also time()

	*/
	var returnStr = '';
	var replace = Date.replaceChars;
	for (var i = 0; i < format.length; i++) {
		var curChar = format.charAt(i);         
		if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
			returnStr += curChar;
		}
		else if (replace[curChar]) {
			returnStr += replace[curChar].call(this);
		} else if (curChar != "\\"){
			returnStr += curChar;
		}
	}
	return returnStr;
};



Date.replaceChars = {
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

	// Day
	d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
	D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
	j: function() { return this.getDate(); },
	l: function() { return Date.replaceChars.longDays[this.getDay()]; },
	N: function() { return this.getDay() + 1; },
	S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
	w: function() { return this.getDay(); },
	z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
	// Week
	W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
	// Month
	F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
	m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
	M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
	n: function() { return this.getMonth() + 1; },
	t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
	// Year
	L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
	o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
	Y: function() { return this.getFullYear(); },
	y: function() { return ('' + this.getFullYear()).substr(2); },
	// Time
	a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
	A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
	B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
	g: function() { return this.getHours() % 12 || 12; },
	G: function() { return this.getHours(); },
	h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
	H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
	i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
	s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
	u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ? '0' : '')) + m; },
	// Timezone
	e: function() { return "Not Yet Supported"; },
	I: function() {
		var DST = null;
			for (var i = 0; i < 12; ++i) {
					var d = new Date(this.getFullYear(), i, 1);
					var offset = d.getTimezoneOffset();

					if (DST === null) {
						DST = offset;
					}
					else if (offset < DST) { 
						DST = offset; break; 
					}
					else if (offset > DST) {
						break;
					}
			}
			return (this.getTimezoneOffset() == DST) | 0;
		},
	O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
	P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
	T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
	Z: function() { return -this.getTimezoneOffset() * 60; },
	// Full Date/Time
	c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
};


Date.prototype.addDays = function(days) {
	this.setDate(this.getDate() + days);
	return this;
};

Date.prototype.addHours = function(hrs) {
	this.setTime(this.getTime() + (hrs * 3600000 ));
	return this;
};

Date.prototype.addMinutes = function(min) {
	this.setTime(this.getTime() + (min*60000));
	return this;
};

Date.prototype.addSeconds = function(sec) {
	this.setTime(this.getTime() + (sec*1000));
	return this;
};

Date.prototype.addMilliSeconds = function(ms) {
	this.setTime(this.getTime() + ms);
	return this;
};







