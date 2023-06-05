const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    entry: './src/app.js',
    mode: "development",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
    },
    resolve: {
        fallback: {
            fs: false
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "template", to: "template"},
                {from: "css", to: "css"},
                {from: "static/fonts", to: "fonts"},
                {from: "static/images", to: "images"},
            ],
        }),
    ],


module: {
    rules: [
        // {
        //     test: /\.(?:js)$/,
        //     exclude: /node_modules/,
        //     use: {
        //         loader: 'babel-loader',
        //         options: {
        //             presets: [
        //                 ['@babel/preset-env', { targets: "defaults" }]
        //             ]
        //         }
        //     }
        // },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }
    ]
}
};