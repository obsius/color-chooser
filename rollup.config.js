import babel from 'rollup-plugin-babel';

export default {
	input: 'src/ColorChooser.js',
	output: {
		file: 'lib/index.js',
		format: 'cjs'
	},
	plugins: [
		babel({
			exclude: 'node_modules/**'
		})
	]
};