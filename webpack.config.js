const path = require('path');

module.exports = {
    entry: {
        index: './public/src/ui/index.ts',
        new: '/public/src/ui/new.ts',
        signin: '/public/src/ui/signin.ts',
        post: '/public/src/ui/post.ts'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: "html-loader"
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public/dist'),
    },
};