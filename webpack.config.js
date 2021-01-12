const path = require("path");
const MiniCssExtractPlugin = require ("mini-css-extract-plugin");
// const autoprefixer = require("autoprefixer");

const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");
const MODE = process.env.WEBPACK_ENV;

const config = {
    entry: ["@babel/polyfill", ENTRY_FILE],
    output: {
        path: OUTPUT_DIR,
        filename: "[name].js"
    },
    mode: MODE,
    module: {
        rules: [
            // {
            //     test: /\.(js)$/,
            //     user: [
            //         {
            //             loader: "babel-loader",
            //         }
            //     ]
            // },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader",
                        // options: {
                        //     postcssOptions: {
                        //         plugins: [
                        //             [
                        //                 'autoprefixer',
                        //                 { //options
                        //                   browsers: "cover 99.5%"
                        //                 },
                        //             ]
                        //         ]
                        //     }
                        // }
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: 'styles.css'
        }),
    ]
};


module.exports = config;