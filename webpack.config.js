var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'app': './js/index.js',
    'thermoscope': './js/thermoscope/index.js',
    'particle-modeler': './js/particle-modeler/index.js',
    'icon-setter': './js/icon-setter/index.js',
    'windows-ble': './js/windows-ble/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env',  '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'css-loader'
        }]
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        // inline base64 URLs for <=4000k images, direct URLs for the rest
        use: [{
          loader: 'url-loader?limit=4096000'
        }]
      },
      {
        // Support ?123 suffix, e.g. ../fonts/m4d-icons.eot?3179539#iefix
        test: /\.(eot|ttf|woff|woff2|svg)((\?|\#).*)?$/,
        use: [{ loader: 'url-loader?limit=81920' }]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: 'public'},
      {from: 'node_modules/react-lab/dist/lab', to: 'lab'}
    ])
  ]
};
