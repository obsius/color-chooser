import React from 'react';
import Input from './Input';

export default ({ mode, alpha, color, onToggle, onChange }) => {

	let inputs = [];

	let handle = (fn) => (val) => {
		fn(val);
		onChange();
	};

	// hex string
	if (mode == 'hex') {
		inputs.push(
			<Input
				key="hex"
				value={ (alpha ? color.getAlphaHex() : color.getHex()).substr(1) }
				type={ alpha ? 'str-rgba' : 'str-rgb' }
				onChange={ handle((str) => color.setHex(str)) }
			/>,
		);

	// number type
	} else {
		switch (mode) {
			case 'rgb':
				inputs.push(
					<Input key="rgb-r" value={color.rgb.r} type="hex" onChange={ handle((r) => color.setRgba(r)) } />,
					<Input key="rgb-g" value={color.rgb.g} type="hex" onChange={ handle((g) => color.setRgba(null, g)) } />,
					<Input key="rgb-b" value={color.rgb.b} type="hex" onChange={ handle((b) => color.setRgba(null, null, b)) } />,
				);
				break;

			case 'hsv':
				inputs.push(
					<Input key="hsv-h" value={color.h} type="deg" onChange={ handle((h) => color.setHsv(h)) } />,
					<Input key="hsv-s" value={color.sv.s} type="pct" onChange={ handle((s) => color.setHsv(null, s)) } />,
					<Input key="hsv-v" value={color.sv.v} type="pct" onChange={ handle((v) => color.setHsv(null, null, v)) } />,
				);
				break;

			case 'hsl':
				inputs.push(
					<Input key="hsl-h" value={color.h} type="deg" onChange={ handle((h) => color.setHsl(h)) } />,
					<Input key="hsl-s" value={color.sl.s} type="pct" onChange={ handle((s) => color.setHsl(null, s)) } />,
					<Input key="hsl-l" value={color.sl.l} type="pct" onChange={ handle((l) => color.setHsl(null, null, l)) } />,
				);
		}

		// add alpha input
		if (alpha) {
			inputs.push(
				<Input key="alpha" value={color.a} type="pct" onChange={ handle((a) => color.setAlpha(a)) } />
			);
		}
	}

	return (
		<div className="color-chooser-readout">
			<div className="color-chooser-values">
				<div className="color-chooser-values-mode">
					{ mode.toUpperCase() }
				</div>
				{ inputs }
			</div>
			<button onClick={onToggle}>↔</button>
		</div>
	);
}