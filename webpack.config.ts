import path from 'path';
import webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config: webpack.Configuration = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'development',
  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, './tsconfig.json'),
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  externals: {},

  node: {
    __dirname: false,
    __filename: false,
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node', raw: true
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/**/*.mustache',
          to: '[name][ext]'
        },
      ],
    }),
  ],
};

export default config;