import React from 'react';

export default class Input extends React.Component {

	constructor(props) {
		super(props);

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

	handleChange = (e) => {

		let { value } = e.target;

		let cleanValue = validateOutput(this.props.type, value);

		this.setState({
			valid: cleanValue != null,
			value: value
		});

		if (cleanValue != null) {
			this.props.onChange(cleanValue);
		}
	};

	render() {

		let { type } = this.props;
		let { valid, value } = this.state;

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

		return (
			<div className={`color-chooser-input-container ${!valid && 'color-chooser-input-invalid'}`}>
				{ prefix && <div className="color-chooser-input-prefix">{ prefix }</div> }
				<input value={value} onChange={this.handleChange} />
				{ suffix && <div className="color-chooser-input-suffix">{ suffix }</div> }
			</div>
		);
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

	return (val >= 0 && val <= 1) ? val : null;
}