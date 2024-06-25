const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, '..', './src/index.js'),
    resolve: {
        extensions: ['.js'],
    },
    module: {
        rules: [{
            test: /\.(js)x?$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
            }, ],
        }, ],
    },
    output: {
        path: path.resolve(__dirname, '..', './build'),
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '..', './src/index.html'),
        }),
    ],
}