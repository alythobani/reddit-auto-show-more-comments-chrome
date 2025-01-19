import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import type webpack from "webpack";

const config: webpack.Configuration = {
  mode: "production",
  optimization: {
    minimize: false,
  },
  entry: {
    background: "./src/background.ts",
    content: "./src/content.ts",
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // Clean the output directory before emit.
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/manifest.json" },
        { from: "assets", to: "assets" },
      ],
    }),
  ],
};

export default config;
