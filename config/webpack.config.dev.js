import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
	entry: "./project/src/index.js",
	output: {
		path: path.resolve("./dist"),
		filename: "bundle.js",
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./project/public/index.html",
			inject: "body",
			publicPath: "./",
		}),
	],
	experiments: {
		topLevelAwait: true,
	},
	mode: "development",
	devServer: {
		hot: false,
		port: 8080,
		open: true,
		static: {
			directory: "./project/public",
		},
		client: {
			overlay: {
				errors: true,
				warnings: false,
			},
		},
	},
};
