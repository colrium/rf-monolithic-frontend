/** @format */

module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
	},
	extends: ["airbnb", "prettier"],
	plugins: ["prettier", "unused-imports"],
	rules: {
		indent: ["error", 4],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"prettier/prettier": "error",
		"no-unused-vars": "off",
		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"warn",
			{
				vars: "all",
				varsIgnorePattern: "^_",
				args: "after-used",
				argsIgnorePattern: "^_",
			},
		],
		"sort-imports": [
			"error",
			{
				ignoreDeclarationSort: true,
			},
		],
		"no-console": "error",
		"func-names": "off",
		"no-process-exit": "off",
		"object-shorthand": "off",
		"class-methods-use-this": "off",
		"function-paren-newline": [
			"error",
			{
				minItems: 3,
			},
		],
		"array-bracket-newline": ["error", "consistent"],
		"function-call-argument-newline": ["error", "consistent"],
		"array-bracket-spacing": ["error", "always"],
		"no-var": "error",
		"object-curly-spacing": ["error", "always", { objectsInObjects: false }],
		"function-call-argument-newline": ["error", "consistent"],
	},
}
