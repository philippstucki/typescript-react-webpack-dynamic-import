import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';

export const config: webpack.Configuration = {
    context: path.resolve(__dirname, '../'),
    entry: './src/main.ts',

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(
                                __dirname,
                                '../',
                                'tsconfig-client.json'
                            ),
                            onlyCompileBundledFiles: true
                        }
                    }
                ]
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    output: {
        filename: 'bundle.js',
        path: __dirname
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../', 'index.html')
        })
    ]
};
