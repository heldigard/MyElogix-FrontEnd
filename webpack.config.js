const webpack = require('webpack');

module.exports = {
  resolve: {
    alias: {
      'process/browser': require.resolve('process/browser'),
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
};
