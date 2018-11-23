const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: './seller-app/src/main.js',
    output: {
        path: path.join(__dirname, 'seller-app/static/js'),
        filename: 'dashboard-seller-bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [ 'vue-style-loader', 'css-loader' ]
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
