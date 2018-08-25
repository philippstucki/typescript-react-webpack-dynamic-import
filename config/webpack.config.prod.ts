import * as path from 'path';
import * as merge from 'webpack-merge';
import * as UglifyWebpackPlugin from 'uglifyjs-webpack-plugin';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import { config } from './webpack.config.common';

const targetRoot = path.join(__dirname, '../');

module.exports = merge(config, {
    output: {
        path: path.resolve(targetRoot, 'build'),
        filename: 'bundle-[hash].js',
        chunkFilename: '[name].bundle-[hash].js'
    },
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin('build', { root: targetRoot }),
        new UglifyWebpackPlugin()
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 1000,
            name: true
        }
    }
});
