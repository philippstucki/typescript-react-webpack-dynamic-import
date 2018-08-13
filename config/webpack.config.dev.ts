import * as merge from 'webpack-merge';
import { config } from './webpack.config.common';
import * as webpack from 'webpack';

module.exports = merge(config, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
});
