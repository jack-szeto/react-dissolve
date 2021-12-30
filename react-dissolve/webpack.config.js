var path = require("path");
const isDevelopment = process.env.NODE_ENV === 'development'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: "production",
    entry: {
        index: path.join(__dirname, 'src', 'index.tsx')
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: isDevelopment ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: { allowTsInNodeModules: true }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.module\.s[ac]ss$/,
                use: [
                    isDevelopment ? 'style-loader': MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: isDevelopment
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /\.module.(s[ac]ss)$/,
                use: [
                    // Creates `style` nodes from JS strings
                    isDevelopment ? 'style-loader': MiniCssExtractPlugin.loader,
                    // to generate a .d.ts module
                    "css-modules-typescript-loader",
                    // Translates CSS into CommonJS
                    {loader: "css-loader", options: {modules: true}},
                    // Compiles Sass to CSS
                    {loader: "sass-loader", options: {sourceMap: isDevelopment}},
                ],
            },
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".css", ".scss"]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
}