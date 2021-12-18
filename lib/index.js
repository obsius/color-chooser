'use strict';

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const S = 1 / 6;
const R = 1 * S;
const Y = 2 * S;
const G = 3 * S;
const C = 4 * S;
const B = 5 * S;
const M = 6 * S;
class Color {
  constructor(r, g, b, a) {
    _defineProperty(this, "a", 1);

    _defineProperty(this, "h", 0);

    _defineProperty(this, "rgb", {
      r: 0,
      g: 0,
      b: 0
    });

    _defineProperty(this, "sv", {
      s: 0,
      v: 0
    });

    _defineProperty(this, "sl", {
      s: 0,
      l: 0
    });

    this.setRgba(r || this.r, g || this.g, b || this.b, a || this.a);
  }
  /* getters */


  getHex() {
    return rgbaToHex(this.rgb.r, this.rgb.g, this.rgb.b);
  }

  getAlphaHex() {
    return rgbaToHex(this.rgb.r, this.rgb.g, this.rgb.b, this.a);
  }

  getHueHex() {
    let {
      r,
      g,
      b
    } = this.getHueRgb();
    return rgbaToHex(r, g, b);
  }

  getInverseOverlayHex() {
    return inverseOverlayHex(this.rgb.r, this.rgb.g, this.rgb.b);
  }

  getInverseOverlayHueHex() {
    let {
      r,
      g,
      b
    } = this.getHueRgb();
    return inverseOverlayHex(r, g, b);
  }

  getHueRgb() {
    let {
      h
    } = this;

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
    if (r == null) {
      r = this.rgb.r;
    }

    if (g == null) {
      g = this.rgb.g;
    }

    if (b == null) {
      b = this.rgb.b;
    }

    if (a == null) {
      a = this.a;
    } // validate


    r = validatePercent(r);
    g = validatePercent(g);
    b = validatePercent(b);
    a = validatePercent(a);
    this.a = a;
    let min = Math.min(r, g, b);
    let max = Math.max(r, g, b);
    let d = max - min;
    let h;
    let s; // chormatic

    if (max && d) {
      s = d / max; // red

      if (r == max) {
        h = (g - b) / d; // green
      } else if (g == max) {
        h = 2 + (b - r) / d; // blue
      } else {
        h = 4 + (r - g) / d;
      }

      h /= 6;

      if (h < 0) {
        h += 1;
      } // achromatic

    } else {
      s = 0;
    } // hsv


    this.h = h != null ? h : this.h;
    this.sv.s = s;
    this.sv.v = max;
    this.update();
  }

  setHex(hex) {
    let {
      a
    } = this;
    let {
      r,
      g,
      b
    } = this.rgb;
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
    if (h == null) {
      h = this.h;
    }

    if (s == null) {
      s = this.sl.s;
    }

    if (l == null) {
      l = this.sl.l;
    }

    h = validatePercent(h);
    s = validatePercent(s);
    l = validatePercent(l);
    let t = s * (l < .5 ? l : 1 - l);
    let v = l + t;
    let s2 = l > 0 ? 2 * t / v : s;
    this.setHsv(h, s2, v);
  }

  setHsv(h, s, v) {
    if (h == null) {
      h = this.h;
    }

    if (s == null) {
      s = this.sv.s;
    }

    if (v == null) {
      v = this.sv.v;
    }

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
      } // color

    } else if (color instanceof Color) {
      return this.rgb.r == color.rgb.r && this.rgb.g == color.rgb.g && this.rgb.b == color.rgb.b && this.a == color.a; // invalid comparison
    } else {
      return false;
    }
  }

  update() {
    let {
      h
    } = this;
    let {
      s,
      v
    } = this.sv;
    let r;
    let g;
    let b; // achromatic

    if (s == 0) {
      r = v;
      g = v;
      b = v; // chromatic 
    } else {
      let i = Math.floor(h * 6) % 6;
      let f = h * 6 % 6 - i;
      let p = v * (1 - s);
      let q = v * (1 - s * f);
      let t = v * (1 - s * (1 - f)); // red

      if (i == 0) {
        r = v;
        g = t;
        b = p; // yellow
      } else if (i == 1) {
        r = q;
        g = v;
        b = p; // green
      } else if (i == 2) {
        r = p;
        g = v;
        b = t; // cyan
      } else if (i == 3) {
        r = p;
        g = q;
        b = v; // blue
      } else if (i == 4) {
        r = t;
        g = p;
        b = v; // magenta
      } else {
        r = v;
        g = p;
        b = q;
      }
    } // rgb


    this.rgb.r = r;
    this.rgb.g = g;
    this.rgb.b = b;
    let l = (2 - s) * v / 2;

    if (l > 0) {
      if (l == 1) {
        s = 0;
      } else if (l < .5) {
        s = s * v / (l * 2);
      } else {
        s = s * v / (2 - l * 2);
      }
    } // hsl


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
  return '#' + toHex(r) + toHex(g) + toHex(b) + (a != null ? toHex(a) : '');
}

function inverseOverlayHex(r, g, b) {
  return r * 0.299 + g * 0.587 + b * 0.114 > .729 ? rgbaToHex(0, 0, 0) : rgbaToHex(1, 1, 1);
}

function validatePercent(pct) {
  return pct < 0 ? 0 : pct > 1 ? 1 : pct;
}

class Input extends React__default["default"].Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleChange", e => {
      let {
        value
      } = e.target;
      let cleanValue = validateOutput(this.props.type, value);
      this.setState({
        valid: cleanValue != null,
        value: value
      });

      if (cleanValue != null) {
        this.props.onChange(cleanValue);
      }
    });

    this.state = {
      valid: true,
      value: processInput(props.type, props.value)
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      valid: true,
      value: processInput(props.type, props.value)
    });
  }

  render() {
    let {
      type
    } = this.props;
    let {
      valid,
      value
    } = this.state;
    let prefix;
    let suffix;

    switch (type) {
      case 'deg':
        suffix = '°';
        break;

      case 'pct':
        suffix = '%';
        break;

      case 'str-rgb':
      case 'str-rgba':
        prefix = '#';
    }

    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: `color-chooser-input-container ${!valid && 'color-chooser-input-invalid'}`
    }, prefix && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-input-prefix"
    }, prefix), /*#__PURE__*/React__default["default"].createElement("input", {
      value: value,
      onChange: this.handleChange
    }), suffix && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-input-suffix"
    }, suffix));
  }

}
Input.TYPES = {
  DEG: 'deg',
  HEX: 'hex',
  PCT: 'pct',
  STR_RGB: 'str-rgb',
  STR_RGBA: 'str-rgba'
};
/* internal */

function processInput(type, val) {
  switch (type) {
    case 'hex':
      return Math.round(val * 255);

    case 'deg':
      return Math.round(val * 360);

    case 'pct':
      return Math.round(val * 100);

    case 'str-rgb':
    case 'str-rgba':
      return ('' + val)[0] == '#' ? val.substring(1) : val;
  }
}

function validateOutput(type, val) {
  if (val != null) {
    switch (type) {
      case 'deg':
        val = parseFloat(val) / 360;
        break;

      case 'hex':
        val = parseFloat(val) / 255;
        break;

      case 'pct':
        val = parseFloat(val) / 100;
        break;

      case 'str-rgb':
        return /^#?[A-Fa-f0-9]{6}$/.test(val) ? val : null;

      case 'str-rgba':
        return /^#?[A-Fa-f0-9]{8}$/.test(val) ? val : null;
    }
  }

  return val >= 0 && val <= 1 ? val : null;
}

var Readout = (({
  mode,
  alpha,
  color,
  onToggle,
  onChange
}) => {
  let inputs = [];

  let handle = fn => val => {
    fn(val);
    onChange();
  }; // hex string


  if (mode == 'hex') {
    inputs.push( /*#__PURE__*/React__default["default"].createElement(Input, {
      key: "hex",
      value: (alpha ? color.getAlphaHex() : color.getHex()).substr(1),
      type: alpha ? 'str-rgba' : 'str-rgb',
      onChange: handle(str => color.setHex(str))
    })); // number type
  } else {
    switch (mode) {
      case 'rgb':
        inputs.push( /*#__PURE__*/React__default["default"].createElement(Input, {
          key: "rgb-r",
          value: color.rgb.r,
          type: "hex",
          onChange: handle(r => color.setRgba(r))
        }), /*#__PURE__*/React__default["default"].createElement(Input, {
          key: "rgb-g",
          value: color.rgb.g,
          type: "hex",
          onChange: handle(g => color.setRgba(null, g))
        }), /*#__PURE__*/React__default["default"].createElement(Input, {
          key: "rgb-b",
          value: color.rgb.b,
          type: "hex",
          onChange: handle(b => color.setRgba(null, null, b))
        }));
        break;

      case 'hsv':
        inputs.push( /*#__PURE__*/React__default["default"].createElement(Input, {
          key: "hsv-h",
          value: color.h,
          type: "deg",
          onChange: handle(h => color.setHsv(h))
        }), /*#__PURE__*/React__default["default"].createElement(Input, {
          key: "hsv-s",
          value: color.sv.s,
          type: "pct",
          onChange: handle(s => color.setHsv(null, s))
        }), /*#__PURE__*/React__default["default"].createElement(Input, {
          key: "hsv-v",
          value: color.sv.v,
          type: "pct",
          onChange: handle(v => color.setHsv(null, null, v))
        }));
        break;

      case 'hsl':
        inputs.push( /*#__PURE__*/React__default["default"].createElement(Input, {
          key: "hsl-h",
          value: color.h,
          type: "deg",
          onChange: handle(h => color.setHsl(h))
        }), /*#__PURE__*/React__default["default"].createElement(Input, {
          key: "hsl-s",
          value: color.sl.s,
          type: "pct",
          onChange: handle(s => color.setHsl(null, s))
        }), /*#__PURE__*/React__default["default"].createElement(Input, {
          key: "hsl-l",
          value: color.sl.l,
          type: "pct",
          onChange: handle(l => color.setHsl(null, null, l))
        }));
    } // add alpha input


    if (alpha) {
      inputs.push( /*#__PURE__*/React__default["default"].createElement(Input, {
        key: "alpha",
        value: color.a,
        type: "pct",
        onChange: handle(a => color.setAlpha(a))
      }));
    }
  }

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "color-chooser-readout"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "color-chooser-values"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "color-chooser-values-mode"
  }, mode.toUpperCase()), inputs), /*#__PURE__*/React__default["default"].createElement("button", {
    onClick: onToggle
  }, "\u2194"));
});

const MODES = ['hex', 'rgb', 'hsl', 'hsv'];
class ColorChooser extends React__default["default"].Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleMouseMove", e => {
      // canvas
      if (this.state.draggingCanvas) {
        this.setState({ ...this.state,
          ...this.setCanvas(e.pageX, e.pageY)
        }); // spectrum
      } else if (this.state.draggingSpectrum) {
        this.setState({ ...this.state,
          ...this.setSpectrum(e.pageX)
        }); // alpha
      } else if (this.state.draggingAlpha) {
        this.setState({ ...this.state,
          ...this.setAlpha(e.pageX)
        });
      }
    });

    _defineProperty(this, "handleMouseUp", e => {
      // canvas
      if (this.state.draggingCanvas) {
        this.setState({ ...this.state,
          ...this.setCanvas(e.pageX, e.pageY),
          draggingCanvas: false
        }); // spectrum
      } else if (this.state.draggingSpectrum) {
        this.setState({ ...this.state,
          ...this.setSpectrum(e.pageX),
          draggingSpectrum: false
        }); // alpha
      } else if (this.state.draggingAlpha) {
        this.setState({ ...this.state,
          ...this.setAlpha(e.pageX),
          draggingAlpha: false
        });
      }
    });

    _defineProperty(this, "handleCanvasMouseDown", e => {
      this.canvasBounds = getBounds(this.canvasRef.current);
      this.setState({ ...this.state,
        ...this.setCanvas(e.pageX, e.pageY),
        draggingCanvas: true
      });
    });

    _defineProperty(this, "handleSpectrumMouseDown", e => {
      this.spectrumBounds = getBounds(this.spectrumRef.current);
      this.setState({ ...this.state,
        ...this.setSpectrum(e.pageX),
        draggingSpectrum: true
      });
    });

    _defineProperty(this, "handleAlphaMouseDown", e => {
      this.alphaBounds = getBounds(this.alphaRef.current);
      this.setState({ ...this.state,
        ...this.setAlpha(e.pageX),
        draggingAlpha: true
      });
    });

    _defineProperty(this, "handleToggle", () => {
      let index = MODES.indexOf(this.state.mode);
      index = (index + 1) % MODES.length;
      this.setState({ ...this.state,
        mode: MODES[index]
      });
    });

    _defineProperty(this, "handleInput", () => {
      this.emitChange();
      this.update();
    });

    this.canvasRef = React__default["default"].createRef();
    this.spectrumRef = React__default["default"].createRef();
    this.alphaRef = React__default["default"].createRef();
    this.color = props.color ? Color.fromHex(props.color) : new Color();
    this.state = {
      mode: MODES[0],
      draggingCanvas: false,
      draggingSpectrum: false,
      draggingAlpha: false,
      canvasX: this.color.sv.s,
      canvasY: this.color.sv.v,
      spectrumX: this.color.h,
      alphaX: this.color.a
    };
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.update(props.color);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  update(color) {
    // ignore if the same color
    if (!color || !this.color.equals(color)) {
      if (color) {
        if (typeof color == 'string') {
          this.color.setHex(color);
        } else {
          this.color = color;
        }
      }

      this.setState({ ...this.state,
        canvasX: this.color.sv.s,
        canvasY: this.color.sv.v,
        spectrumX: this.color.h,
        alphaX: this.color.a
      });
    }
  }

  emitChange() {
    if (typeof this.props.onChange == 'function') {
      this.props.onChange(this.props.alpha ? this.color.getAlphaHex() : this.color.getHex());
    }
  }

  setCanvas(pageX, pageY) {
    let bounds = this.canvasBounds;
    let x = bound((pageX - bounds.left) / bounds.width);
    let y = bound((bounds.bottom - pageY) / bounds.height);
    this.color.setHsv(this.color.h, x, y);
    this.emitChange();
    return {
      canvasX: x,
      canvasY: y
    };
  }

  setSpectrum(pageX) {
    let bounds = this.spectrumBounds;
    let x = bound((pageX - bounds.left) / (bounds.right - bounds.left));
    this.color.setHue(x);
    this.emitChange();
    return {
      spectrumX: x
    };
  }

  setAlpha(pageX) {
    let bounds = this.alphaBounds;
    let x = bound((pageX - bounds.left) / (bounds.right - bounds.left));
    this.color.setAlpha(x);
    this.emitChange();
    return {
      alphaX: x
    };
  }

  render() {
    let {
      color
    } = this;
    let {
      alpha
    } = this.props;
    let {
      mode,
      canvasX,
      canvasY,
      spectrumX,
      alphaX
    } = this.state;
    let hex = color.getHex();
    let alphaHex = color.getAlphaHex();
    let hue = color.getHueHex();
    let spectrumSlider = /*#__PURE__*/React__default["default"].createElement("div", {
      ref: this.spectrumRef,
      className: "color-chooser-spectrum",
      onMouseDown: this.handleSpectrumMouseDown
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-spectrum-selected",
      style: {
        left: `calc(${spectrumX * 100}% - 5px)`,
        borderColor: color.getInverseOverlayHueHex()
      }
    }));
    let alphaSlider = alpha && /*#__PURE__*/React__default["default"].createElement("div", {
      ref: this.alphaRef,
      className: "color-chooser-alpha",
      onMouseDown: this.handleAlphaMouseDown
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-alpha-mask",
      style: {
        backgroundImage: `linear-gradient(to right, ${hex}00, ${hex}ff)`
      }
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-alpha-selected",
      style: {
        left: `calc(${alphaX * 100}% - 5px)`
      }
    }));
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      ref: this.canvasRef,
      className: "color-chooser-canvas",
      style: {
        backgroundColor: hue
      },
      onMouseDown: this.handleCanvasMouseDown
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-canvas-lighten"
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-canvas-darken"
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-canvas-selected",
      style: {
        left: `calc(${canvasX * 100}% - 10px)`,
        bottom: `calc(${canvasY * 100}% - 10px)`,
        borderColor: color.getInverseOverlayHex()
      }
    })), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-controls"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-preview"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-preview-mask",
      style: {
        backgroundColor: alphaHex
      }
    })), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "color-chooser-sliders"
    }, spectrumSlider, alphaSlider)), /*#__PURE__*/React__default["default"].createElement(Readout, {
      color: this.color,
      mode: mode,
      alpha: this.props.alpha,
      onToggle: this.handleToggle,
      onChange: this.handleInput
    }));
  }

}
ColorChooser.MODES = {
  HEX: 'hex',
  RGB: 'rgb',
  HSV: 'hsv',
  HSL: 'hsl'
};
/* internal */

function getBounds(element) {
  let bounds = element.getBoundingClientRect();
  bounds.width = bounds.right - bounds.left;
  bounds.height = bounds.bottom - bounds.top;
  return bounds;
}

function bound(val) {
  return val < 0 ? 0 : val > 1 ? 1 : val;
}

module.exports = ColorChooser;
