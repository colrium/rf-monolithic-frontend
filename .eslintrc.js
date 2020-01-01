module.exports = {
	parser: "babel-eslint",
	env: {
		es6: true,
		node: true,
		browser: true
	},
	parserOptions: {
		ecmaVersion: 6,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true
		}
	},
	plugins: ["react"],
	/* extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:prettier/recommended"
	] */
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
	],
	rules: {
		"no-console": "off",
		"react/prop-types": 0,
		"no-unused-vars": 0,
		"no-extend-native": 0,
		"eqeqeq": 0,
		"react/display-name": 0,
		"react/jsx-max-props-per-line": [1, {"maximum": 10}]
	},
};