const path = require('path');
const { DefinePlugin } = require('webpack');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './src/index.js',
    devServer: {
        compress: true,
        static: path.join(__dirname, 'dist'),
        port: 9000,
        // Allow connections from outside the container (not much use otherwise).
        host: process.env.HOST || '0.0.0.0',
        // // Proxy api routes through to the todo backend.
        // proxy: [
        //     {
        //         context: ['/api'],
        //         target: `${process.env.DOMAIN_URL}:${process.env.APP_PORT}`
        //     }
        // ]
        // disableHostCheck: true
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    plugins: [
        new DefinePlugin({
            "process.env.DOMAIN_URL": JSON.stringify(process.env.DOMAIN_URL),
            "process.env.API_PORT": JSON.stringify(process.env.API_PORT)
        })
    ]
};