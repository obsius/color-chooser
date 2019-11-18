import React from 'react';
import Readout from './Readout';

const MODES = ['hex', 'rgb', 'hsl', 'hsv'];

export default class ColorChooser extends React.Component {

	constructor(props) {
		super(props);

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

			this.setState({
				...this.state,
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
		}
	}

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
		}
	}

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

	handleChange = (...args) => {

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
	}
	
	handleToggle = () => {

		let index = MODES.indexOf(this.state.mode);
		index = (index + 1) % MODES.length;

		this.setState({
			...this.state,
			mode: MODES[index]
		});
	};

	render() {

		let { color } = this;

		let {
			mode,
			canvasX,
			canvasY,
			spectrumX
		} = this.state;

		let hex = color.getHex();
		let hue = color.getHueHex();

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
					<div className="color-chooser-preview" style={{ backgroundColor: hex }} />
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
				</div>
				<Readout color={this.color} mode={mode} alpha={this.props.alpha} />
			</div>
		);
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
	return (val < 0) ? 0 : (val > 1) ? 1 : val;
}