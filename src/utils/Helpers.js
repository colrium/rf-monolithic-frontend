/* eslint-disable */
import React from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import Color from 'color';
import decode from 'jwt-decode';
import lodash from 'lodash';
import lodash_inflection from "lodash-inflection";
import { AudiotrackOutlined as AudioIcon, InsertDriveFileOutlined as FileIcon, MovieOutlined as VideoIcon } from '@material-ui/icons';
import { authTokenLocation, authTokenName, baseUrls, environment } from 'config';


lodash.mixin(lodash_inflection);


class App{
	inDevelopment() {
		return environment === "development"
	}
	inProduction() {
		return environment === "production"
	}
}


class Utilities {
	static objIndexOf(object, value) {
		return Object.keys(object).find(key => object[key] === value);
	}

	static singularize(str) {
		return lodash.singularize(str);
	}

	static pluralize(str) {
		return lodash.pluralize(str);
	}

	static arrayIntersection(a, b) {
		return a.filter(x => b.includes(x));
	}

	static arrayDifference(a, b) {
		return a.filter(x => !b.includes(x));
	}

	static arraySymetricDifference(a, b) {
		return a.filter(x => !b.includes(x)).concat(b.filter(x => !a.includes(x)));
	}

	static uid(len, numeric, all_caps) {
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
			buf.push(chars[this.getRandomInt(0, charlen - 1)]);
		}

		return buf.join('');
	}

	static variablelizeStr(str){
		str = str.replaceAll(/([A-Z])/g, ' $1');
		str = str.trim();
		str = str.replaceAll(/\s\s+/g, ' ');
		str = str.replaceAll(' ', '_');

		return str.toLowerCase();
	}	

	static monochromeColorScheme(base_color, no_of_colors = 1) {
		//default to 1 to avoid division by zero syntax error
		no_of_colors = no_of_colors > 0? no_of_colors : 1;
		//instatiate color
		let color = Color(base_color);		
		let variant = 1 / no_of_colors;
		let color_scheme = [];
		//Desatulate or satulate subject to color luminosity
		for (let i = 0; i < no_of_colors; i++) {
			let variant_color = color.isLight()? color.saturate(i*variant).mix(color.grayscale().mix(color.saturate(i*variant))).hex() : color.desaturate(i*variant).mix(color.grayscale().mix(color.desaturate(i*variant))).hex();
			color_scheme.push(variant_color);
		}		
		return color_scheme;
	}

	static rotationColorScheme(start_color, no_of_colors = 1) {
		//default to 1 to avoid division by zero syntax error
		no_of_colors = no_of_colors > 0? no_of_colors : 1;
		//instatiate color
		let color = Color(start_color);		
		let variant = 360 / no_of_colors;
		let color_scheme = [];
		//Rotate color by variant
		for (let i = 0; i < no_of_colors; i++) {
			color_scheme.push(color.rotate(i*variant).hex());
		}		
		return color_scheme;
	}

	static convertBytesToMbsOrKbs(filesize){
		var size = '';
		// I know, not technically correct...
		if(filesize >= 1000000){
			size = (filesize / 1000000) + ' megabytes';
		}else if(filesize >= 1000){
			size = (filesize / 1000) + ' kilobytes';
		}else{
			size = filesize + ' bytes' 
		}
		return size
	}

	static readableFileSize(bytes, si=true){
		var thresh = si ? 1000 : 1024;
		if(Math.abs(bytes) < thresh) {
			return bytes + ' B';
		}
		var units = si
			? ['kB','MB','GB','TB','PB','EB','ZB','YB']
			: ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
		var u = -1;
		do {
			bytes /= thresh;
			++u;
		} while(Math.abs(bytes) >= thresh && u < units.length - 1);
		return bytes.toFixed(1)+' '+units[u];
	}

	static isImage(fileName) {
		const suffix = fileName.substr(fileName.indexOf('.') + 1).toLowerCase();
		return ['jpg', 'jpeg', 'bmp', 'png', 'ico', 'svg', 'tiff', 'jfif' ].includes(suffix.toLowerCase());
	}

	static uid(len, numeric, all_caps){
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
			buf.push(chars[this.getRandomInt(0, charlen - 1)]);
		}

		return buf.join('');
	}
	static isOfType(input, expect) {
		return 	(expect.constructor === String 
					&& ((["array", "arr"].includes(expect.toLowerCase()) && (input !== undefined && input !== null && input.constructor === Array))
						|| (["boolean", "bool"].includes(expect.toLowerCase()) && (input !== undefined && input !== null && input.constructor === Boolean))
						|| (["function", "method", "fn", "callable"].includes(expect.toLowerCase()) && (input !== undefined && input !== null && (input.constructor === Function || typeof input === "function" )))
						|| (["number", "float", "int", "long"].includes(expect.toLowerCase()) && (input !== undefined && input !== null && input.constructor === Number) && input !== NaN)
						|| (["string", "str"].includes(expect.toLowerCase()) && (input !== undefined && input !== null && input.constructor === String))
						|| (["regexp", "regex"].includes(expect.toLowerCase()) && (input !== undefined && input !== null && input.constructor === RegExp))
						|| (["error", "err"].includes(expect.toLowerCase()) && (input !== undefined && input !== null && input instanceof Error))
						|| (["object", "obj"].includes(expect.toLowerCase()) && (input !== undefined && input !== null && typeof input === 'object' && input.constructor !== Number && input.constructor !== NaN && input.constructor !== String && input.constructor !== RegExp && input.constructor !== Boolean && input.constructor !== Error && input.constructor !== Function) && !Array.isArray(input))
						|| (["json_object", "json", "jsonobj", "jsonobject", "json_obj"].includes(expect.toLowerCase()) && (input !== undefined && input !== null && typeof input === 'object' && input.constructor !== ({}).constructor))
						))
				||  ((expect === null || expect === undefined || expect === false) 
					&& (input  === undefined || input === null || input === false));
	}
}

class ServiceData {
	resolveReferenceColumnDisplay(column, entry, data_resolves, user, secondary_prefix="(", secondary_suffix=")") {
		let resolve = "";
		let resolves = data_resolves;
		if (Utilities.isOfType(data_resolves.display, "function")) {
			resolves.display = data_resolves.display(entry, user);
		}
		if (Utilities.isOfType(resolves, "object")) {
			if ("display" in resolves) {
				resolves = resolves.display;
			}
			if ("value" in resolves) {
				resolves.value = resolves.value;
			}
			else{
				resolves.value = "_id";
			}
			let primary_resolves = resolves.primary;
			let secondary_resolves = resolves.secondary;
			if (Utilities.isOfType(primary_resolves, "function")) {
				primary_resolves = primary_resolves(entry, user);
			}
			if (Utilities.isOfType(secondary_resolves, "function")) {
				secondary_resolves = secondary_resolves(entry, user);
			}

			if (Utilities.isOfType(entry[column], "object")) {
				let column_value = entry[column][resolves.value];
				let column_resolve = "";				
				if (Utilities.isOfType(primary_resolves, "array") && primary_resolves.length > 0) {
					let primary_resolve_value = "";
					for (var j = 0; j < primary_resolves.length; j++) {
						if (Utilities.isOfType(primary_resolves[j], "object")) {
							for (let [primary_key, primary_value] of Object.entries(primary_resolves[j])) {
								if (Utilities.isOfType(entry[column][primary_key], "object")) {
									if (Utilities.isOfType(primary_value, "array")) {								
										for (var n = 0; n < primary_value.length; n++) {
											if (primary_value[n] in entry[column][primary_key] && entry[column][primary_key][primary_value[n]]) {
												primary_resolve_value += " "+entry[column][primary_key][primary_value[n]];
											}									
										}
									}
									else if (Utilities.isOfType(primary_value, "string") && primary_value in entry[column][primary_key]) {
										primary_resolve_value += " "+entry[column][primary_key][primary_value];
									}		
								}																				
							}
						}
						else if (Utilities.isOfType(primary_resolves[j], "string") && entry[column][primary_resolves[j]]) {							
							primary_resolve_value += " "+entry[column][primary_resolves[j]];
						}											
					}
					column_resolve += primary_resolve_value.trim();

				}
					
				if (Utilities.isOfType(secondary_resolves, "array") && secondary_resolves.length > 0) {
					let secondary_resolve_value = "";
					for (var k = 0; k < secondary_resolves.length; k++) {
						if (secondary_resolves[k] in entry[column]) {
							secondary_resolve_value += " "+entry[column][secondary_resolves[k]];
						}
					}
					column_resolve += secondary_resolve_value.trim().length > 0? ((secondary_prefix? secondary_prefix : " (") + secondary_resolve_value + (secondary_suffix? secondary_suffix : ")")) : "";
				}
				resolve = {value: column_value, resolve: column_resolve.trim()};
			}
			else if (Utilities.isOfType(entry[column], "array")) {
				resolve = [];
				for (var x = 0; x < entry[column].length; x++) {
					let item_value = entry[column][x][resolves.value];
					let item_resolve = "";
					if (Utilities.isOfType(primary_resolves, "array") && primary_resolves.length > 0) {
						let primary_resolve_value = "";
						for (var j = 0; j < primary_resolves.length; j++) {
							if (Utilities.isOfType(primary_resolves[j], "object")) {
								for (let [primary_key, primary_value] of Object.entries(primary_resolves[j])) {
									if (Utilities.isOfType(entry[column][x][primary_key], "object")) {
										if (Utilities.isOfType(primary_value, "array")) {								
											for (var n = 0; n < primary_value.length; n++) {
												if (primary_value[n] in entry[column][x][primary_key] && entry[column][x][primary_key][primary_value[n]]) {
													primary_resolve_value += " "+entry[column][x][primary_key][primary_value[n]];
												}									
											}
										}
										else if (Utilities.isOfType(primary_value, "string") && primary_value in entry[column][x][primary_key]) {
											primary_resolve_value += " "+entry[column][x][primary_key][primary_value];
										}		
									}																				
								}
							}
							else if (Utilities.isOfType(primary_resolves[j], "string") && entry[column][x][primary_resolves[j]]) {
								
								primary_resolve_value += " "+entry[column][x][primary_resolves[j]];
							}											
						}
						item_resolve += primary_resolve_value.trim();

					}
						
					if (Utilities.isOfType(secondary_resolves, "array") && secondary_resolves.length > 0) {
						let secondary_resolve_value = "";
						for (var k = 0; k < secondary_resolves.length; k++) {
							if (secondary_resolves[k] in entry[column][x]) {
								secondary_resolve_value += " "+entry[column][x][secondary_resolves[k]];
							}
						}
						item_resolve += secondary_resolve_value.trim().length > 0? ((secondary_prefix? secondary_prefix : " (") + secondary_resolve_value + (secondary_suffix? secondary_suffix : ")")) : "";
					}
					resolve.push({value: item_value, resolve: item_resolve.trim() })
				}
			}
			else if (Utilities.isOfType(entry[column], "string")) {

				resolve = {value: entry[column], resolve: entry[column]};
			}
		}
		return resolve;
	}

	resolveReferenceColumnsDisplays(entries, columns, user, secondary_prefix="(", secondary_suffix=")") {
		let resolved_entries = [];
		let columns_resolves = {};
		if (Utilities.isOfType(columns, "object")) {
			for (let [name, properties] of Object.entries(columns)) {
				if (properties.reference) {
					if (Utilities.isOfType(properties.reference, "object") && "resolves" in properties.reference) {
						columns_resolves[name] = properties.reference.resolves						
					}
				}
			}
		}

		if (Utilities.isOfType(entries, "array")) {
			for (let i = 0; i < entries.length; i++) {
				let resolved_entry = {};
				for (let [field, value] of Object.entries(entries[i])) {					
					if (field in columns_resolves) {
						if (entries[i][field]) {
							resolved_entry[field] = this.resolveReferenceColumnDisplay(field, entries[i], columns_resolves[field], user, secondary_prefix, secondary_suffix);
						}
						else{
							resolved_entry[field] = entries[i][field];
						}
					}
					else{
						if (JSON.isJSON(entries[i][field])) {
							resolved_entry[field] = JSON.prettyStringify(entries[i][field]);
						}
						else{
							resolved_entry[field] = entries[i][field];
						}
						
					}
				}
				resolved_entries.push(resolved_entry);

				/*for (let [column, resolves] of Object.entries(columns_resolves)) {
					if (Utilities.isOfType(resolves, "function")) {
						resolves = resolves(entries[i], user);
					}
					
					if (column in entries[i]) {
						if (entries[i][column]) {
							entries[i][column] = { value: entries[i][column][resolves.value], display_value: this.resolveReferenceColumnDisplay(column, entries[i], resolves, user, secondary_prefix, secondary_suffix) };
							console.log(column, "entries[i][column]", entries[i][column]);
						}
						else{
							entries[i][column] = {value: null, display_value: "" };
						}
					}
					else{
						entries[i][column] = {value: null, display_value: "" };
					}
				}*/
			}
		}
			
		return resolved_entries;
	}
}

class FileUtilities{
	fileTypes = {
			text: {
				extensions: ["doc", "docx", "ebook", "log", "md", "msg", "odt", "org", "pages", "pdf", "rtf", "rst", "tex", "txt", "wpd", "wps"],
				icon: <FileIcon />
			},
			sheet: {
				extensions: ["ods", "xls", "xlsx", "csv", "ics", "vcf"],
				icon: <FileIcon />
			},
			slide: {
				extensions: ["ppt", "odp"],
				icon: <FileIcon />
			},
			archive: {
				extensions: ["7z", "a", "ar", "bz2", "cab", "cpio", "deb", "dmg", "egg", "gz", "iso", "jar", "lha", "mar", "pea", "rar", "rpm", "s7z", "shar", "tar", "tbz2", "tgz", "tlz", "war", "whl", "xpi", "zip", "zipx", "deb", "rpm", "xz", "pak", "crx"],
				icon: <FileIcon />
			},
			web: {
				extensions: ["html", "htm", "css", "less", "scss"],
				icon: <FileIcon />
			},
			image: {
				extensions: ["bmp", "gif", "jpg", "jpeg", "png", "tif", "tiff", "yuv", "ico", "svg", "webp"],
				icon: <FileIcon />
			},
			video: {
				extensions: ["3g2", "3gp", "aaf", "asf", "avchd", "avi", "drc", "flv", "m2v", "m4p", "m4v", "mkv", "mng", "mov", "mp2", "mp4", "mpe", "mpeg", "mpg", "mpv", "mxf", "nsv", "ogg", "ogv", "ogm", "qt", "rm", "rmvb", "roq", "srt", "svi", "vob", "webm", "wmv", "yuv"],
				icon: <VideoIcon />
			},
			audio: {
				extensions: ["aac", "aiff", "ape", "au", "flac", "gsm", "it", "m3u", "m4a", "mid", "mod", "mp3", "mpa", "pls", "ra", "s3m", "sid", "wav", "wma", "xm"],
				icon: <AudioIcon />
			},
			code: {
				extensions: ["c", "cc", "class", "clj", "cpp", "cs", "cxx", "el", "go", "h", "java", "js", "jsx", "lua", "m", "m4", "php", "pl", "po", "py", "rb", "rs", "sh", "sql", "swift", "vb", "vcxproj", "xcodeproj", "xml", "diff", "patch"],
				icon: <FileIcon />
			},
	};

	convertBytesToMbsOrKbs(filesize){
		var size = '';
		// I know, not technically correct...
		if(filesize >= 1000000){
			size = (filesize / 1000000) + ' megabytes';
		}else if(filesize >= 1000){
			size = (filesize / 1000) + ' kilobytes';
		}else{
			size = filesize + ' bytes' 
		}
		return size
	}

	readableFileSize(bytes, si=true){
		var thresh = si ? 1000 : 1024;
		if(Math.abs(bytes) < thresh) {
			return bytes + ' B';
		}
		var units = si
			? ['kB','MB','GB','TB','PB','EB','ZB','YB']
			: ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
		var u = -1;
		do {
			bytes /= thresh;
			++u;
		} while(Math.abs(bytes) >= thresh && u < units.length - 1);
		return bytes.toFixed(1)+' '+units[u];
	}

	isImage(fileName) {
		const suffix = this.fileExtension(fileName);
		return this.fileTypes.image.extensions.includes(suffix.toLowerCase());
	}

	fileExtension(fileName){
		return String.isString(fileName)? fileName.split('.').pop() : "";
	}


	fileType(fileName){
		let extension = this.fileExtension(fileName);

		for (let [type, value] of Object.entries(this.fileTypes)) {
			if (value.extensions.includes(extension.toLowerCase())) {
				
				return type;
			}
		}
		return "file";
	}

	fileIcon(fileName){
		let type = this.fileType(fileName);


		if (type !== "file") {
			return this.fileTypes[type].icon;
		}
		return <FileIcon />;
	}

}

class CountriesData{
	static names() {
		let names =  {"AD" : "Andorra", "AE" : "United Arab Emirates", "AF" : "Afghanistan", "AG" : "Antigua and Barbuda", "AI" : "Anguilla", "AL" : "Albania", "AM" : "Armenia", "AO" : "Angola", "AQ" : "Antarctica", "AR" : "Argentina", "AS" : "American Samoa", "AT" : "Austria", "AU" : "Australia", "AW" : "Aruba", "AX" : "Aland Islands", "AZ" : "Azerbaijan", "BA" : "Bosnia and Herzegovina", "BB" : "Barbados", "BD" : "Bangladesh", "BE" : "Belgium", "BF" : "Burkina Faso", "BG" : "Bulgaria", "BH" : "Bahrain", "BI" : "Burundi", "BJ" : "Benin", "BL" : "Saint Barthelemy", "BM" : "Bermuda", "BN" : "Brunei", "BO" : "Bolivia", "BQ" : "Bonaire, Saint Eustatius and Saba ", "BR" : "Brazil", "BS" : "Bahamas", "BT" : "Bhutan", "BV" : "Bouvet Island", "BW" : "Botswana", "BY" : "Belarus", "BZ" : "Belize", "CA" : "Canada", "CC" : "Cocos Islands", "CD" : "Democratic Republic of the Congo", "CF" : "Central African Republic", "CG" : "Republic of the Congo", "CH" : "Switzerland", "CI" : "Ivory Coast", "CK" : "Cook Islands", "CL" : "Chile", "CM" : "Cameroon", "CN" : "China", "CO" : "Colombia", "CR" : "Costa Rica", "CU" : "Cuba", "CV" : "Cape Verde", "CW" : "Curacao", "CX" : "Christmas Island", "CY" : "Cyprus", "CZ" : "Czech Republic", "DE" : "Germany", "DJ" : "Djibouti", "DK" : "Denmark", "DM" : "Dominica", "DO" : "Dominican Republic", "DZ" : "Algeria", "EC" : "Ecuador", "EE" : "Estonia", "EG" : "Egypt", "EH" : "Western Sahara", "ER" : "Eritrea", "ES" : "Spain", "ET" : "Ethiopia", "FI" : "Finland", "FJ" : "Fiji", "FK" : "Falkland Islands", "FM" : "Micronesia", "FO" : "Faroe Islands", "FR" : "France", "GA" : "Gabon", "GB" : "United Kingdom", "GD" : "Grenada", "GE" : "Georgia", "GF" : "French Guiana", "GG" : "Guernsey", "GH" : "Ghana", "GI" : "Gibraltar", "GL" : "Greenland", "GM" : "Gambia", "GN" : "Guinea", "GP" : "Guadeloupe", "GQ" : "Equatorial Guinea", "GR" : "Greece", "GS" : "South Georgia and the South Sandwich Islands", "GT" : "Guatemala", "GU" : "Guam", "GW" : "Guinea-Bissau", "GY" : "Guyana", "HK" : "Hong Kong", "HM" : "Heard Island and McDonald Islands", "HN" : "Honduras", "HR" : "Croatia", "HT" : "Haiti", "HU" : "Hungary", "ID" : "Indonesia", "IE" : "Ireland", "IL" : "Israel", "IM" : "Isle of Man", "IN" : "India", "IO" : "British Indian Ocean Territory", "IQ" : "Iraq", "IR" : "Iran", "IS" : "Iceland", "IT" : "Italy", "JE" : "Jersey", "JM" : "Jamaica", "JO" : "Jordan", "JP" : "Japan", "KE" : "Kenya", "KG" : "Kyrgyzstan", "KH" : "Cambodia", "KI" : "Kiribati", "KM" : "Comoros", "KN" : "Saint Kitts and Nevis", "KP" : "North Korea", "KR" : "South Korea", "KW" : "Kuwait", "KY" : "Cayman Islands", "KZ" : "Kazakhstan", "LA" : "Laos", "LB" : "Lebanon", "LC" : "Saint Lucia", "LI" : "Liechtenstein", "LK" : "Sri Lanka", "LR" : "Liberia", "LS" : "Lesotho", "LT" : "Lithuania", "LU" : "Luxembourg", "LV" : "Latvia", "LY" : "Libya", "MA" : "Morocco", "MC" : "Monaco", "MD" : "Moldova", "ME" : "Montenegro", "MF" : "Saint Martin", "MG" : "Madagascar", "MH" : "Marshall Islands", "MK" : "Macedonia", "ML" : "Mali", "MM" : "Myanmar", "MN" : "Mongolia", "MO" : "Macao", "MP" : "Northern Mariana Islands", "MQ" : "Martinique", "MR" : "Mauritania", "MS" : "Montserrat", "MT" : "Malta", "MU" : "Mauritius", "MV" : "Maldives", "MW" : "Malawi", "MX" : "Mexico", "MY" : "Malaysia", "MZ" : "Mozambique", "NA" : "Namibia", "NC" : "New Caledonia", "NE" : "Niger", "NF" : "Norfolk Island", "NG" : "Nigeria", "NI" : "Nicaragua", "NL" : "Netherlands", "NO" : "Norway", "NP" : "Nepal", "NR" : "Nauru", "NU" : "Niue", "NZ" : "New Zealand", "OM" : "Oman", "PA" : "Panama", "PE" : "Peru", "PF" : "French Polynesia", "PG" : "Papua New Guinea", "PH" : "Philippines", "PK" : "Pakistan", "PL" : "Poland", "PM" : "Saint Pierre and Miquelon", "PN" : "Pitcairn", "PR" : "Puerto Rico", "PS" : "Palestinian Territory", "PT" : "Portugal", "PW" : "Palau", "PY" : "Paraguay", "QA" : "Qatar", "RE" : "Reunion", "RO" : "Romania", "RS" : "Serbia", "RU" : "Russia", "RW" : "Rwanda", "SA" : "Saudi Arabia", "SB" : "Solomon Islands", "SC" : "Seychelles", "SD" : "Sudan", "SE" : "Sweden", "SG" : "Singapore", "SH" : "Saint Helena", "SI" : "Slovenia", "SJ" : "Svalbard and Jan Mayen", "SK" : "Slovakia", "SL" : "Sierra Leone", "SM" : "San Marino", "SN" : "Senegal", "SO" : "Somalia", "SR" : "Suriname", "SS" : "South Sudan", "ST" : "Sao Tome and Principe", "SV" : "El Salvador", "SX" : "Sint Maarten", "SY" : "Syria", "SZ" : "Swaziland", "TC" : "Turks and Caicos Islands", "TD" : "Chad", "TF" : "French Southern Territories", "TG" : "Togo", "TH" : "Thailand", "TJ" : "Tajikistan", "TK" : "Tokelau", "TL" : "East Timor", "TM" : "Turkmenistan", "TN" : "Tunisia", "TO" : "Tonga", "TR" : "Turkey", "TT" : "Trinidad and Tobago", "TV" : "Tuvalu", "TW" : "Taiwan", "TZ" : "Tanzania", "UA" : "Ukraine", "UG" : "Uganda", "UM" : "United States Minor Outlying Islands", "US" : "United States", "UY" : "Uruguay", "UZ" : "Uzbekistan", "VA" : "Vatican", "VC" : "Saint Vincent and the Grenadines", "VE" : "Venezuela", "VG" : "British Virgin Islands", "VI" : "U.S. Virgin Islands", "VN" : "Vietnam", "VU" : "Vanuatu", "WF" : "Wallis and Futuna", "WS" : "Samoa", "XK" : "Kosovo", "YE" : "Yemen", "YT" : "Mayotte", "ZA" : "South Africa", "ZM" : "Zambia", "ZW" : "Zimbabwe"};


		/*let sorted_values = Object.values(names).sort(function(a,b) {
			let x = a.toLowerCase().replace(/\s/g, '');
			let y = b.toLowerCase().replace(/\s/g, '');
			return x === y ? 0 : x < y ? -1 : 1;
		});

		let sorted_names = {};

		for (var i = 0; i < sorted_values.length; i++) {
			let value = sorted_values[i];
			let key = Utilities.objIndexOf(names, value);
			sorted_names[key] = value;
		}*/

		return names;

	}
	
}


class FormValidation{
	static asyncValidate(values /*, dispatch */) {
		return environment === "development"
	}
	
}

export const AppHelper = new App();

export const UtilitiesHelper = Utilities;
export const ServiceDataHelper = new ServiceData();
export const CountriesHelper = CountriesData;
export const FormValidationHelper = new FormValidation();
export const FilesHelper = new FileUtilities();

