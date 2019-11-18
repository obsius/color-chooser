import React from 'react';
import Input from './Input';

export default class Readout extends React.Component {

	render() {

		let inputs = [];

		switch (mode) {

			case 'hex':
				let hex = alpha ? color.getHexAlpha() : color.getHex();
				hex = hex.substr(1);

				break;

			case 'rgb':
				inputs.push(
					<Input key="rgb-r" value={rgb(color.rgb.r)} onChange={this.handleRgbR} />,
					<Input key="rgb-g" value={rgb(color.rgb.g)} onChange={this.handleRgbG} />,
					<Input key="rgb-b" value={rgb(color.rgb.b)} onChange={this.handleRgbB} />,
				);
				break;

			case 'hsv':
				inputs.push(
					<Input key="hsv-h" value={hue(color.h)} onChange={this.handleHue} />,
					<Input key="hsv-s" value={pct(color.sv.s)} onChange={this.handleHsvS} />,
					<Input key="hsv-v" value={pct(color.sv.v)} onChange={this.handleHsvV} />,
				);
				break;

			case 'hsl':
				inputs.push(
					<Input key="hsv-h" value={hue(color.h)} onChange={this.handleHue} />,
					<Input key="hsv-s" value={pct(color.sl.s)} onChange={this.handleHsvS} />,
					<Input key="hsv-v" value={pct(color.sl.v)} onChange={this.handleHsvV} />,
				);
		}

		return (
			<div className="color-chooser-readout">
				<div className="color-chooser-values">
					<div className="color-chooser-values-mode">
						{ mode.toUpperCase() }
					</div>
					{ inputs }
				</div>
				<Toggle onClick={this.handleToggle} />
			</div>
		);
	}
}


/* internal */

const Toggle = ({ onClick }) => (
	<button onClick={onClick}>↔</button>
);

function rgb(val) {
	return Math.round(val * 255);
}

function hue(val) {
	return Math.round(val * 360);
}

function pct(val) {
	return Math.round(val * 100);
}