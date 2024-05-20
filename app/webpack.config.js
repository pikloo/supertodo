const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './src/index.js',
    devServer: {
        static: path.join(__dirname, 'dist'),
        // Allow connections from outside the container (not much use otherwise).
        host: process.env.HOST || '0.0.0.0',
        // Proxy api routes through to the todo backend.
        proxy: [
            {
                context: ['/api'],
                target: `${process.env.DOMAIN_URL}:${process.env.APP_PORT}`
            }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        // library: "my-library",
        // libraryTarget: "umd"
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
};