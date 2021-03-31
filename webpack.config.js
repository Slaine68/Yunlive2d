var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['.ts', '.js', ".less", ".vue"],
        alias: {
            '@framework': path.resolve(__dirname, 'Framework/src')
        }
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8889,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'info'
        }),
        // make sure to include the plugin for the magic
        new VueLoaderPlugin()
    ],
    module: {
        rules: [{
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            // Provide path to the file with resources
                            resources: './src/style/vars.less'
                        },
                    }
                ]
            }, {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(jpg|gif|png|jpeg|ttf|otf)$/,
                use: 'url-loader?limit=232041&name=[hash:8]-[name].[ext]'
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, './'),
        watchContentBase: true,
        inline: true,
        hot: true,
        port: 5000,
        host: '0.0.0.0',
        compress: true,
        useLocalIp: true,
        writeToDisk: true
    },
    devtool: 'inline-source-map'
}