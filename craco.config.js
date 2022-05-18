/** @format */

//// craco.config.js
// module.exports = {
// 	style: {
// 		postcss: {
// 			plugins: [require("tailwindcss"), require("autoprefixer")],
// 		},
// 	},
// }
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

module.exports = function () {
	return {
		webpack: {
			plugins: [new BundleAnalyzerPlugin({ analyzerMode: "server" })],
		},
	}
}
