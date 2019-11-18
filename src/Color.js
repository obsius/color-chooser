const S = 1 / 6;

const R = 1 * S;
const Y = 2 * S;
const G = 3 * S;
const C = 4 * S;
const B = 5 * S;
const M = 6 * S;

export default class Color {

	a = 1;

	h = 0;

	rgb = {
		r: 0,
		g: 0,
		b: 0
	};

	sv = {
		s: 0,
		v: 0
	};

	sl = {
		s: 0,
		l: 0
	};

	constructor(r, g, b, a) {
		this.setRgba(
			r || this.r,
			g || this.g,
			b || this.b,
			a || this.a
		);
	}

	/* getters */

	getHex() {
		return rgbaToHex(this.rgb.r, this.rgb.g, this.rgb.b);
	}

	getAlphaHex() {
		return rgbaToHex(this.rgb.r, this.rgb.g, this.rgb.b, this.a);
	}

	getHueHex() {
		let { r, g, b } = this.getHueRgb();
		return rgbaToHex(r, g, b);
	}

	getInverseOverlayHex() {
		return inverseOverlayHex(this.rgb.r, this.rgb.g, this.rgb.b);
	}

	getInverseOverlayHueHex() {
		let { r, g, b } = this.getHueRgb();
		return inverseOverlayHex(r, g, b);
	}

	getHueRgb() {

		let { h } = this;

		if (h < R) {
			return {
				r: 1,
				b: 0,
				g: h / R
			};
		} else if (h < Y) {
			return {
				r: (Y - h) / S,
				b: 0,
				g: 1
			};
		} else if (h < G) {
			return {
				r: 0,
				b: (h - Y) / S,
				g: 1
			};
		} else if (h < C) {
			return {
				r: 0,
				b: 1,
				g: (C - h) / S
			};
		} else if (h < B) {
			return {
				r: (h - C) / S,
				b: 1,
				g: 0
			};
		} else {
			return {
				r: 1,
				b: (M - h) / S,
				g: 0
			};
		}
	}

	getRgb() {
		return {
			r: this.rgb.r,
			g: this.rgb.g,
			b: this.rgb.b
		};
	}

	getRgba() {
		return {
			r: this.rgb.r,
			g: this.rgb.g,
			b: this.rgb.b,
			a: this.a
		};
	}

	getHsv() {
		return {
			h: this.h,
			s: this.sv.s,
			v: this.sv.v
		};
	}

	getHsl() {
		return {
			h: this.h,
			s: this.sl.s,
			l: this.sl.l
		};
	}

	/* setters */

	setRgba(r, g, b, a) {

		if (r == null) { r = this.rgb.r; }
		if (g == null) { g = this.rgb.g; }
		if (b == null) { b = this.rgb.b; }
		if (a == null) { a = this.a; }

		// validate
		r = validatePercent(r);
		g = validatePercent(g);
		b = validatePercent(b);
		a = validatePercent(a);

		this.a = a;

		let min = Math.min(r, g, b);
		let max = Math.max(r, g, b);
		let d = max - min;
	
		let h;
		let s;

		// chormatic
		if (max && d) {

			s = d / max;

			// red
			if (r == max) {
				h = (g - b) / d;

			// green
			} else if (g == max) {
				h = 2 + ((b - r) / d);

			// blue
			} else {
				h = 4 + ((r - g) / d);
			}

			h /= 6;

			if (h < 0) {
				h += 1;
			}

		// achromatic
		} else {
			s = 0;
		}

		// hsv
		this.h = (h != null) ? h : this.h;
		this.sv.s = s;
		this.sv.v = max;

		this.update();
	}

	setHex(hex) {

		let { a } = this;
		let { r, g, b } = this.rgb;

		hex = ('' + hex).trim();

		if (hex[0] == '#') {
			hex = hex.substring(1, hex.length);
		}

		switch (hex.length) {
			case 8:
				a = fromHex(hex.substr(6, 2));
			case 6:
				b = fromHex(hex.substr(4, 2));
			case 4:
				g = fromHex(hex.substr(2, 2));
			case 2:
				r = fromHex(hex.substr(0, 2));
		}

		this.setRgba(r, g, b, a);
	}

	setHsl(h, s, l) {

		if (h == null) { h = this.h; }
		if (s == null) { s = this.sl.s; }
		if (l == null) { l = this.sl.l; }

		h = validatePercent(h);
		s = validatePercent(s);
		l = validatePercent(l);

		let t = s * ((l < .5) ? l : (1 - l));

		let v = l + t;
		let s2 = l > 0 ? ((2 * t) / v) : s;

		this.setHsv(h, s2, v);
	}

	setHsv(h, s, v) {

		if (h == null) { h = this.h; }
		if (s == null) { s = this.sv.s; }
		if (v == null) { v = this.sv.v; }

		h = validatePercent(h);
		s = validatePercent(s);
		v = validatePercent(v);

		this.h = h;
		this.sv.s = s;
		this.sv.v = v;

		this.update();
	}

	setAlpha(a) {
		a = validatePercent(a);
		this.a = a;
	}

	setHue(hue) {
		hue = validatePercent(hue);
		this.setHsv(hue, this.sv.s, this.sv.v);
	}

	/* methods */

	equals(color) {

		// string
		if (typeof color == 'string') {

			let thisColor = this.getHex().toLowerCase();

			if (color[0] == '#') {
				return thisColor == color;
			} else {
				return thisColor.substring(1) == color;
			}

		// color
		} else if (color instanceof Color) {
			return this.rgb.r == color.rgb.r && this.rgb.g == color.rgb.g && this.rgb.b == color.rgb.b && this.a == color.a;

		// invalid comparison
		} else {
			return false;
		}
	}

	update() {

		let { h } = this;
		let { s, v } = this.sv;

		let r;
		let g;
		let b;

		// achromatic
		if (s == 0) {
			r = v;
			g = v;
			b = v;

		// chromatic 
		} else {

			let i = Math.floor(h * 6) % 6;
			let f = ((h * 6) % 6) - i;
			let p = v * (1 - s);
			let q = v * (1 - s * f);
			let t = v * (1 - s * (1 - f));

			// red
			if (i == 0) {
				r = v;
				g = t;
				b = p;

			// yellow
			} else if (i == 1) {
				r = q;
				g = v;
				b = p;

			// green
			} else if (i == 2) {
				r = p;
				g = v;
				b = t;

			// cyan
			} else if (i == 3) {
				r = p;
				g = q;
				b = v;

			// blue
			} else if (i == 4) {
				r = t;
				g = p;
				b = v;

			// magenta
			} else {
				r = v;
				g = p;
				b = q;
			}
		}

		// rgb
		this.rgb.r = r;
		this.rgb.g = g;
		this.rgb.b = b;

		let l = ((2 - s) * v) / 2;

		if (l > 0) {
			if (l == 1) {
				s = 0;
			} else if (l < .5) {
				s = (s * v) / (l * 2);
			} else {
				s = (s * v) / (2 - l * 2);
			}
		}

		// hsl
		this.sl.s = s;
		this.sl.l = l;
	}

	/* static */

	static fromHex(hex) {
		let color = new Color();
		color.setHex(hex);
		return color;
	}

	static fromRgba(r, g, b, a) {
		return new Color(r, g, b, a);
	}
}

/* internal */

function fromHex(hex) {
	return parseInt(hex, 16) / 255;
}

function toHex(color) {
	let hex = Math.round(color * 255).toString(16);
	return hex.length == 1 ? `0${hex}` : hex;
}

function rgbaToHex(r, g, b, a) {
	return '#' + toHex(r) + toHex(g) + toHex(b) + ((a != null) ? toHex(a) : '');
}

function inverseOverlayHex(r, g, b) {
	return ((r * 0.299 + g * 0.587 + b * 0.114) > .729) ? rgbaToHex(0, 0, 0) : rgbaToHex(1, 1, 1);
}

function validatePercent(pct) {
	return (pct < 0) ? 0 : (pct > 1) ? 1 : pct;
}