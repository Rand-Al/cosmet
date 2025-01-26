const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
    mode: process.env.NODE_ENV,
    entry: "./src/js/main.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].[contenthash].js",
        assetModuleFilename: "assets/[name][ext]",
        publicPath: "/",
    },
    resolve: {
        alias: {
            "@src": path.resolve(__dirname, "src"),
            "@images": path.resolve(__dirname, "src/assets/images"),
            "@components": path.resolve(__dirname, "src/components"),
            "@assets": path.resolve(__dirname, "src/assets"),
        },
        // Добавляем расширения для автоматического разрешения
        extensions: [".js", ".scss", ".html"],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        watchFiles: ["src/**/*.*"],
        hot: true,
        port: 3000,
        open: true,
        liveReload: true,
        historyApiFallback: true,
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: !isDev,
                            esModule: false,
                            sources: true, // Включаем обработку всех источников
                            preprocessor: (content) => {
                                return content.replace(
                                    /<%=require\(['"]([^'"]+)['"]\)%>/g,
                                    (match, path) => {
                                        // Преобразуем путь в правильный формат
                                        return path;
                                    }
                                );
                            },
                        },
                    },
                ],
                exclude: /src\/[^/]+\.html$/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [
                    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [["autoprefixer"]],
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require.resolve("sass"),
                            sourceMap: isDev,
                            api: "modern",
                            // Важно: добавляем modern API
                            sassOptions: {
                                outputStyle: isDev ? "expanded" : "compressed",
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "images/[name][ext]",
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name][ext]",
                },
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/about.html",
            filename: "about.html",
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: !isDev,
            inject: "body",
        }),
        ...(isDev
            ? []
            : [
                  new MiniCssExtractPlugin({
                      filename: "css/[name].[contenthash].css",
                  }),
              ]),
    ],

    optimization: {
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
};
