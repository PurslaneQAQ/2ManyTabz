const path = require('path');
const autoprefixer = require('autoprefixer');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

require('@babel/register');
require('@babel/polyfill');

const PAGES_PATH = './src/pages';

const env = process.env.NODE_ENV || 'production';
// set to 'production' or 'development' in your env

const finalCSSLoader = (env === 'production') ? MiniCssExtractPlugin.loader : { loader: 'style-loader' };

function generateHtmlWebpackPlugins(items) {
  return items.map((name) => new HtmlWebpackPlugin(
    {
      filename: `.ss/${name}.html`,
      chunks: [name],
    },
  ));
}

module.exports = {
  entry: {
    background: [
      'babel-polyfill',
      `${PAGES_PATH}/background`,
    ],
    popup: [
      'babel-polyfill',
      `${PAGES_PATH}/popup`,
    ],
  },
  mode: 'development',
  output: {
    path: path.resolve('dist/pages/'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'babel-loader' },
          { loader: 'eslint-loader' },
        ],
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
        use: 'file-loader?name=[name].[ext]?[hash]',
      },
      {
        test: /\.s?css/,
        use: [
          finalCSSLoader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()],
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/fontwoff',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyPlugin(
      [
        {
          from: 'src',
          to: path.resolve('dist'),
          ignore: ['pages/**/*'],
        },
      ],
    ),
    ...generateHtmlWebpackPlugins(
      [
        'background',
        'popup',
      ],
    ),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
};
