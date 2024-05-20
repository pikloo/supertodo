import { join, resolve } from 'path';

export const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
export const entry = './src/index.js';
export const env = {
    DOMAIN_URL: process.env.DOMAIN_URL,
    APP_PORT: process.env.APP_PORT,
    API_PORT: process.env.API_PORT,
};
export const devServer = {
    static: join(__dirname, 'dist'),
    // Allow connections from outside the container (not much use otherwise).
    host: process.env.HOST || '0.0.0.0',
    // Proxy api routes through to the todo backend.
    proxy: [
        {
            context: ['/api'],
            target: `${process.env.DOMAIN_URL}:${process.env.APP_PORT}`
        }
    ]
};
export const output = {
    filename: 'main.js',
    path: resolve(__dirname, 'dist'),
};
export const module = {
    rules: [
        {
            test: /\.css$/i,
            include: resolve(__dirname, 'src'),
            use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
    ],
};