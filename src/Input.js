import React from 'react';

export default class Input extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			value: props.value
		};
	}

	UNSAFE_componentWillReceiveProps(props) {
		this.setState({
			value: props.value
		});
	}

	handleChange = (value) => {
		this.setState({
			value: value
		});

		if (typeof this.props.onChange == 'function') {
			this.props.onChange(value);
		}
	};

	render() {

		let { value } = this.state;

		if (this.props.prefix) {
			value = this.props.prefix + value;
		}

		if (this.props.suffix) {
			value += value;
		}

		return (
			<input value={value} onChange={this.handleChange} />
		);
	}
}