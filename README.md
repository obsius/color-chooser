# Color Select

A React component for selecting colors.

## Screenshots
![screenshot1](https://raw.githubusercontent.com/obsius/color-chooser/master/doc/1.png "Example")

### Example

```js
import React from 'react';
import ColorChooser from 'color-chooser';

import 'color-chooser/lib/color-chooser.css';
import './my-color-chooser-style-override.css';

class App extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			color: '#00FF00'
		};
	}

	handleColorChange = (color) => {
		this.setState({
			...this.state,
			color
		});
	};

	render() {

		let overlay = this.state.isOpen && (
			<div>
				<ColorChooser color={this.state.color} onChange={this.handleColorChange} />
			</div>
		);

		return (
			<div>
				{ overlay }
			</div>
		);
	}
}
```

## Contributing
Feel free to make changes and submit pull requests whenever.


## License
ColorChooser uses the [MIT](https://opensource.org/licenses/MIT) license.