const path = require("path");

module.exports = {
  mode: "development",
  entry: ["./src/js/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devtool: "eval-cheap-source-map",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    publicPath: "/",
    watchContentBase: true,
    disableHostCheck: true,
  },
};
