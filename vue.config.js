const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const IS_DEV = process.env.NODE_ENV !== 'production'

const DEVELOPMENT = webpackConfig => {
  webpackConfig.store.set('devtool', 'eval-source-map')
  webpackConfig.plugin('html').tap(([options]) => [
    Object.assign(options, {
      minify: false,
      chunksSortMode: 'none'
    })
  ])

  // webpackConfig.plugin('BundleAnalyzerPlugin').use(BundleAnalyzerPlugin)

  return webpackConfig
}

const PRODUCTION = webpackConfig => {
  webpackConfig.store.set('devtool', '')
  webpackConfig.plugin('html').tap(([options]) => [
    Object.assign(options, {
      minify: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        conservativeCollapse: false,
        collapseInlineTagWhitespace: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        removeAttributeQuotes: false,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyJS: true,
        minifyCSS: true
      },
      cache: true,
      hash: true,
      scriptLoading: 'defer',
      inject: true,
      chunksSortMode: 'none'
    })
  ])

  return webpackConfig
}

module.exports = {
  publicPath: '/',
  css: {
    loaderOptions: {
      less: {
        globalVars: {},
        srouceMap: IS_DEV,
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  devServer: {
    proxy: 'http://192.168.2.233:8080/'
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: ['./src/styles/index.less']
    }
  },

  configureWebpack: config => {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        minSize: 3000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 6,
        automaticNameDelimiter: '-',
        name: true,
        cacheGroups: {
          lodash: {
            name: 'lodash',
            test: /[\\/]node_modules[\\/]lodash[\\/]/,
            priority: 20
          },
          vue: {
            name: 'vue',
            test: /[\\/]node_modules[\\/]vue[\\/]/
          },
          vuex: {
            name: 'vuex',
            test: /[\\/]node_modules[\\/]vuex[\\/]/
          },
          'vuex-presistedstate': {
            name: 'vuex-presistedstate',
            test: /[\\/]node_modules[\\/]vuex-presistedstate[\\/]/
          },
          'vue-router': {
            name: 'vue-router',
            test: /[\\/]node_modules[\\/]vue-router[\\/]/
          },
          'ant-design-vue': {
            name: 'ant-design-vue',
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/
          },
          moment: {
            name: 'moment',
            test: /[\\/]node_modules[\\/]moment[\\/]/,
            priority: 40
          }
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.symlinks(true)

    if (process.env.use_analyzer) {
      config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
    }

    IS_DEV ? DEVELOPMENT(config) : PRODUCTION(config)
  },
  productionSourceMap: false,
  lintOnSave: true
}
