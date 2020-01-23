const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

module.exports = env => {
  const isProduction = env === "production";

  return {
    entry: {
      main: ["babel-polyfill", "./src/index.js"]
    },
    // plugins: [
    //   // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    //   new CleanWebpackPlugin(),
    //   new HtmlWebpackPlugin({
    //     title: "Caching"
    //   })
    // ],
    output: {
      path: path.resolve(__dirname, "public", "dist"),
      filename: "bundle.js"
    },

    // optimization: {
    //   runtimeChunk: "single"
    // },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-transform-runtime"]
            }
          }
        }
      ]
    },

    devServer: {
      contentBase: "./public/dist"
    }
  };
};
