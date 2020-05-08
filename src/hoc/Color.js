/** @format */

export default class Color {
	/**
	 * Return a r,g,b string
	 *
	 * @param {String} hex
	 * @return {String}
	 */
	static hextorgb(hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? parseInt(result[1], 16) +
					"," +
					parseInt(result[2], 16) +
					"," +
					parseInt(result[3], 16)
			: "0,0,0";
	}
	/**
	 * Return a hexadecimal string
	 *
	 * @param {Number} r
	 * @param {Number} g
	 * @param {Number} b
	 * @return {String}
	 */
	static rgbtohex(r, g, b) {
		var hexr = Number(r).toString(16);
		var hexg = Number(g).toString(16);
		var hexb = Number(b).toString(16);
		if (hexr.length < 2) {
			hexr = "0" + hexr;
		}
		if (hexg.length < 2) {
			hexg = "0" + hexg;
		}
		if (hexb.length < 2) {
			hexb = "0" + hexb;
		}
		return "#" + hexr + hexg + hexb;
	}

	/**
	 * Return a hexadecimal string
	 *
	 * @param {String} color
	 * @param {Number(Range 0-1)} amt
	 * @return {String}
	 */
	static darken(color, amt) {
		color = this.hextorgb(color);
		color = color.split(",");

		var r = Math.round(parseInt(color[0]) - amt * parseInt(color[0]));
		if (r > 255) r = 255;
		else if (r < 0) r = 0;

		var g = Math.round(parseInt(color[1]) - amt * parseInt(color[1]));
		if (g > 255) g = 255;
		else if (g < 0) g = 0;

		var b = Math.round(parseInt(color[2]) - amt * parseInt(color[2]));

		if (b > 255) b = 255;
		else if (b < 0) b = 0;

		return this.rgbtohex(r, g, b);
	}

	/**
	 * Return a hexadecimal string
	 *
	 * @param {String} color
	 * @param {Number(Range 0-1)} amt
	 * @return {String}
	 */
	static lighten(color, amt) {
		color = this.hextorgb(color);
		color = color.split(",");

		var r = Math.round(parseInt(color[0]) + amt * parseInt(color[0]));
		if (r > 255) r = 255;
		else if (r < 0) r = 0;

		var g = Math.round(parseInt(color[1]) + amt * parseInt(color[1]));
		if (g > 255) g = 255;
		else if (g < 0) g = 0;

		var b = Math.round(parseInt(color[2]) + amt * parseInt(color[1]));

		if (b > 255) b = 255;
		else if (b < 0) b = 0;

		return this.rgbtohex(r, g, b);
	}

	/**
	 * Return a hexadecimal string
	 *
	 * @param {String (Hex)} a
	 * @param {String (Hex)} b
	 * @param {Number(Range 0-1)} intercept
	 * @return {String}
	 */
	static intercept(a, b, intercept) {
		var usePound = false;
		if (typeof intercept == "undefined") {
			intercept = 0.5;
		}
		if (a.startsWith("#")) {
			a = this.hextorgb(a);
			usePound = true;
		}
		if (b.startsWith("#")) {
			b = this.hextorgb(b);
			usePound = true;
		}

		a = a.split(",");
		b = b.split(",");
		for (var i = 0; i < a.length; i++) {
			a[i] = parseInt(a[i]);
			b[i] = parseInt(b[i]);
		}
		var c = new Array(3);
		c[0] = Math.round(a[0] + (b[0] - a[0]) * intercept);
		c[1] = Math.round(a[1] + (b[1] - a[1]) * intercept);
		c[2] = Math.round(a[2] + (b[2] - a[2]) * intercept);

		var result = c[0] + "," + c[1] + "," + c[2];
		if (usePound) {
			result = this.rgbtohex(c[0], c[1], c[2]);
		}
		return result;
	}
}
