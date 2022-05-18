/** @format */

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	important: true,
	theme: {
		extend: {
			minHeight: ({ theme }) => {
				console.log(theme)
				return ({
				halfScreen: "50vh",
			})},
		},
	},
	plugins: [],
}
