import React from 'react';

import Color from './Color';
import Readout from './Readout';

const MODES = ['hex', 'rgb', 'hsl', 'hsv'];

export default class ColorChooser extends React.Component {

	constructor(props) {
		super(props);

		this.canvasRef = React.createRef();
		this.spectrumRef = React.createRef();
		this.alphaRef = React.createRef();

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
					this.color =  color;
				}
			}

			this.setState({
				...this.state,
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

	handleMouseMove = (e) => {

		// canvas
		if (this.state.draggingCanvas) {
			this.setState({
				...this.state,
				...this.setCanvas(e.pageX, e.pageY)
			});

		// spectrum
		} else if (this.state.draggingSpectrum) {
			this.setState({
				...this.state,
				...this.setSpectrum(e.pageX)
			});

		// alpha
		} else if (this.state.draggingAlpha) {
			this.setState({
				...this.state,
				...this.setAlpha(e.pageX)
			});
		}
	};

	handleMouseUp = (e) => {

		// canvas
		if (this.state.draggingCanvas) {
			this.setState({
				...this.state,
				...this.setCanvas(e.pageX, e.pageY),
				draggingCanvas: false
			});
		
		// spectrum
		} else if (this.state.draggingSpectrum) {
			this.setState({
				...this.state,
				...this.setSpectrum(e.pageX),
				draggingSpectrum: false
			});

		// alpha
		} else if (this.state.draggingAlpha) {
			this.setState({
				...this.state,
				...this.setAlpha(e.pageX),
				draggingAlpha: false
			});
		}
	};

	handleCanvasMouseDown = (e) => {

		this.canvasBounds = getBounds(this.canvasRef.current);

		this.setState({
			...this.state,
			...this.setCanvas(e.pageX, e.pageY),
			draggingCanvas: true
		});
	};

	handleSpectrumMouseDown = (e) => {

		this.spectrumBounds = getBounds(this.spectrumRef.current);

		this.setState({
			...this.state,
			...this.setSpectrum(e.pageX),
			draggingSpectrum: true
		});
	};

	handleAlphaMouseDown = (e) => {

		this.alphaBounds = getBounds(this.alphaRef.current);

		this.setState({
			...this.state,
			...this.setAlpha(e.pageX),
			draggingAlpha: true
		});
	};
	
	handleToggle = () => {

		let index = MODES.indexOf(this.state.mode);
		index = (index + 1) % MODES.length;

		this.setState({
			...this.state,
			mode: MODES[index]
		});
	};

	handleInput = () => {
		this.emitChange();
		this.update();
	};

	render() {

		let { color } = this;

		let { alpha } = this.props;

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

		let spectrumSlider = (
			<div
				ref={this.spectrumRef}
				className="color-chooser-spectrum"
				onMouseDown={this.handleSpectrumMouseDown}
			>
				<div
					className="color-chooser-spectrum-selected"
					style={{
						left: `calc(${spectrumX * 100}% - 5px)`,
						borderColor: color.getInverseOverlayHueHex()
					}}
				/>
			</div>
		);

		let alphaSlider = alpha && (
			<div
				ref={this.alphaRef}
				className="color-chooser-alpha"
				onMouseDown={this.handleAlphaMouseDown}
			>
				<div
					className="color-chooser-alpha-mask"
					style={{
						backgroundImage: `linear-gradient(to right, ${hex}00, ${hex}ff)`
					}}
				/>
				<div
					className="color-chooser-alpha-selected"
					style={{
						left: `calc(${alphaX * 100}% - 5px)`
					}}
				/>
			</div>
		);

		return (
			<div className="color-chooser">
				<div
					ref={this.canvasRef}
					className="color-chooser-canvas"
					style={{ backgroundColor: hue }}
					onMouseDown={this.handleCanvasMouseDown}
				>
					<div className="color-chooser-canvas-lighten" />
					<div className="color-chooser-canvas-darken" />
					<div
						className="color-chooser-canvas-selected"
						style={{
							left: `calc(${canvasX * 100}% - 10px)`,
							bottom: `calc(${canvasY * 100}% - 10px)`,
							borderColor: color.getInverseOverlayHex()
						}}
					/>
				</div>
				<div className="color-chooser-controls">
					<div className="color-chooser-preview">
						<div className="color-chooser-preview-mask" style={{ backgroundColor: alphaHex }} />
					</div>
					<div className="color-chooser-sliders">
						{ spectrumSlider }
						{ alphaSlider }
					</div>
				</div>
				<Readout
					color={this.color}
					mode={mode}
					alpha={this.props.alpha}
					onToggle={this.handleToggle}
					onChange={this.handleInput}
				/>
			</div>
		);
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
	return (val < 0) ? 0 : (val > 1) ? 1 : val;
}