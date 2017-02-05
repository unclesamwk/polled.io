const webpack = require('webpack')
const { resolve } = require('path')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')

const getEntry = (ifDev) => {
  let entry

  if (ifDev()) {
    entry = {
      app: [
        './js/index.jsx'
      ],
      vendor: ['react']
    }
  } else {
    entry = {
      bundle: './js/index.jsx',
      vendor: ['react']
    }
  }

  return entry
}

const config = env => {
  const { ifProd, ifDev } = getIfUtils(env)

  return {
    entry: getEntry(ifDev),
    output: {
      path: resolve('./public/dist/'),
      filename: 'bundle.js',
    },
    context: resolve(__dirname, 'assets'),
    devtool: env.prod ? 'source-map' : 'eval-cheap-module-source-map',
    bail: env.prod,
    module: {
      loaders: [
        { test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ['babel-loader'] },
        { test: /\.css$/, loader: 'style-loader!css-loader' },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: removeEmpty([
      ifDev(new webpack.NoEmitOnErrorsPlugin()),
      ifDev(new webpack.NamedModulesPlugin()),

      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify((env.prod) ? 'production' : 'development') }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.js'
      }),

      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false },
        sourceMap: false
      }))
    ]),
  }
}

module.exports = config
