'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

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

class Input extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleChange", value => {
      this.setState({
        value: value
      });

      if (typeof this.props.onChange == 'function') {
        this.props.onChange(value);
      }
    });

    this.state = {
      value: props.value
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      value: props.value
    });
  }

  render() {
    let {
      value
    } = this.state;

    if (this.props.prefix) {
      value = this.props.prefix + value;
    }

    if (this.props.suffix) {
      value += value;
    }

    return React.createElement("input", {
      value: value,
      onChange: this.handleChange
    });
  }

}

class Readout extends React.Component {
  render() {
    let inputs = [];

    switch (mode) {
      case 'hex':
        let hex = alpha ? color.getHexAlpha() : color.getHex();
        hex = hex.substr(1);
        break;

      case 'rgb':
        inputs.push(React.createElement(Input, {
          key: "rgb-r",
          value: rgb(color.rgb.r),
          onChange: this.handleRgbR
        }), React.createElement(Input, {
          key: "rgb-g",
          value: rgb(color.rgb.g),
          onChange: this.handleRgbG
        }), React.createElement(Input, {
          key: "rgb-b",
          value: rgb(color.rgb.b),
          onChange: this.handleRgbB
        }));
        break;

      case 'hsv':
        inputs.push(React.createElement(Input, {
          key: "hsv-h",
          value: hue(color.h),
          onChange: this.handleHue
        }), React.createElement(Input, {
          key: "hsv-s",
          value: pct(color.sv.s),
          onChange: this.handleHsvS
        }), React.createElement(Input, {
          key: "hsv-v",
          value: pct(color.sv.v),
          onChange: this.handleHsvV
        }));
        break;

      case 'hsl':
        inputs.push(React.createElement(Input, {
          key: "hsv-h",
          value: hue(color.h),
          onChange: this.handleHue
        }), React.createElement(Input, {
          key: "hsv-s",
          value: pct(color.sl.s),
          onChange: this.handleHsvS
        }), React.createElement(Input, {
          key: "hsv-v",
          value: pct(color.sl.v),
          onChange: this.handleHsvV
        }));
    }

    return React.createElement("div", {
      className: "color-chooser-readout"
    }, React.createElement("div", {
      className: "color-chooser-values"
    }, React.createElement("div", {
      className: "color-chooser-values-mode"
    }, mode.toUpperCase()), inputs), React.createElement(Toggle, {
      onClick: this.handleToggle
    }));
  }

}
/* internal */

const Toggle = ({
  onClick
}) => React.createElement("button", {
  onClick: onClick
}, "\u2194");

function rgb(val) {
  return Math.round(val * 255);
}

function hue(val) {
  return Math.round(val * 360);
}

function pct(val) {
  return Math.round(val * 100);
}

const MODES = ['hex', 'rgb', 'hsl', 'hsv'];
class ColorChooser extends React.Component {
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

    _defineProperty(this, "handleChange", (...args) => {
      switch (this.state.mode) {
        case 'hex':
          this.color.setHex(args[0]);
          break;

        case 'rgb':
          this.color.setRgb(...args);
          break;

        case 'hsl':
          this.color.setHsl(...args);
          break;

        case 'hsv':
          this.color.setHsv(...args);
          break;
      }

      this.update();
    });

    _defineProperty(this, "handleToggle", () => {
      let index = MODES.indexOf(this.state.mode);
      index = (index + 1) % MODES.length;
      this.setState({ ...this.state,
        mode: MODES[index]
      });
    });

    this.canvasRef = React.createRef();
    this.spectrumRef = React.createRef();
    this.color = props.color ? Color.fromHex(props.color) : new Color();
    this.state = {
      mode: MODES[0],
      draggingCanvas: false,
      draggingSpectrum: false,
      canvasX: this.color.sv.s,
      canvasY: this.color.sv.v,
      spectrumX: this.color.h
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
        this.color = color;
      }

      this.setState({ ...this.state,
        canvasX: this.color.s,
        canvasY: this.color.l,
        spectrumX: this.color.h
      });
    }
  }

  setCanvas(pageX, pageY) {
    let bounds = this.canvasBounds;
    let x = bound((pageX - bounds.left) / bounds.width);
    let y = bound((bounds.bottom - pageY) / bounds.height);
    this.color.setHsv(this.color.h, x, y);
    return {
      canvasX: x,
      canvasY: y
    };
  }

  setSpectrum(pageX) {
    let bounds = this.spectrumBounds;
    let x = bound((pageX - bounds.left) / (bounds.right - bounds.left));
    this.color.setHue(x);
    return {
      spectrumX: x
    };
  }

  render() {
    let {
      color
    } = this;
    let {
      mode,
      canvasX,
      canvasY,
      spectrumX
    } = this.state;
    let hex = color.getHex();
    let hue = color.getHueHex();
    return React.createElement("div", {
      className: "color-chooser"
    }, React.createElement("div", {
      ref: this.canvasRef,
      className: "color-chooser-canvas",
      style: {
        backgroundColor: hue
      },
      onMouseDown: this.handleCanvasMouseDown
    }, React.createElement("div", {
      className: "color-chooser-canvas-lighten"
    }), React.createElement("div", {
      className: "color-chooser-canvas-darken"
    }), React.createElement("div", {
      className: "color-chooser-canvas-selected",
      style: {
        left: `calc(${canvasX * 100}% - 10px)`,
        bottom: `calc(${canvasY * 100}% - 10px)`,
        borderColor: color.getInverseOverlayHex()
      }
    })), React.createElement("div", {
      className: "color-chooser-controls"
    }, React.createElement("div", {
      className: "color-chooser-preview",
      style: {
        backgroundColor: hex
      }
    }), React.createElement("div", {
      ref: this.spectrumRef,
      className: "color-chooser-spectrum",
      onMouseDown: this.handleSpectrumMouseDown
    }, React.createElement("div", {
      className: "color-chooser-spectrum-selected",
      style: {
        left: `calc(${spectrumX * 100}% - 5px)`,
        borderColor: color.getInverseOverlayHueHex()
      }
    }))), React.createElement(Readout, {
      color: this.color,
      mode: mode,
      alpha: this.props.alpha
    }));
  }

}
ColorChooser.MODES = {
  hex: 'hex',
  rgb: 'rgb',
  hsv: 'hsv',
  hsl: 'hsl'
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
