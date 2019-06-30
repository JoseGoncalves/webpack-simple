const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

let config = {
	entry: './src/main.js',
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader'
		},
		{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		},
		{
			test: /\.css$/,
			use: [
				'vue-style-loader',
				'css-loader'
			]
		},{{#sass}}
		{
			test: /\.scss$/,
			use: [
				'vue-style-loader',
				'css-loader',
				'sass-loader'
			],
		},
		{
			test: /\.sass$/,
			use: [
				'vue-style-loader',
				'css-loader',
				{
					loader: 'sass-loader',
					options: {
						indentedSyntax: true
					}
				}
			],
		},
		{{/sass}}
		{
			test: /\.(png|jpg|gif|svg)$/,
			loader: 'file-loader',
			options: {
				name: 'img/[name].[hash:8].[ext]'
			}
		}]
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: 'index.html',
			title: process.env.npm_package_description
		})
	],
	optimization: {}
};

module.exports = (env, argv) => {
	if (argv.mode === 'production') {
		config.stats = {
			children: false,
			modules: false
		};
		config.optimization.minimizer = [
			new TerserPlugin({
				cache: true,
				parallel: true,
				terserOptions: {
					output: {
						comments: false
					}
				}
			})
		];
	} else {
		config.devServer = {
			stats: {
				children: false,
				modules: false
			}
		};
		config.devtool = 'cheap-module-eval-source-map';
	}
	return config;
};
