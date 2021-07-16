const path = require('path')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// check Git
function getGitHash () {
  try {
    return GitRevision.version()
  } catch (e) {}
  return 'unknown'
}

const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  publicPath: '/',
  outputDir: 'admin',
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require('./package.json').version}"`,
        GIT_HASH: JSON.stringify(getGitHash()),
        BUILD_DATE: buildDate
      })
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8000,
    host: '0.0.0.0',
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      // 前端代码生成
      '/api/createFile': {
        target: 'http://localhost:9228',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
      // demo服务
      /* '/api/demo': {
        target: 'http://10.110.1.179:67',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
      // 流程服务
      '/api/activiti': {
        target: 'http://10.110.1.179:61',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
      '/activiti': {
        target: 'http://10.110.1.179:61',
        changeOrigin: true
      },
      // 系统服务
      '/api/sys': {
        target: 'http://10.110.1.11:68',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
      // 文件上传服务
      '/api/upload': {
        target: 'http://10.110.1.179:63',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
      /!**
       * 数据分析
       *!/
      '/api/report': {
        target: 'http://10.110.1.179:62',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }, */
      /**
       * 数据分析-第三方
       */
      '/da': {
        target: 'http://10.110.1.179:80',
        // target: 'http://10.110.1.179:62',
        // pathRewrite: { '^/da': '/report/da' },
        changeOrigin: true
      },
      '/api': {
        target: 'http://10.110.1.179:80',
        changeOrigin: true/*,
        pathRewrite: { '^/api': '' } */
      },
      // 文件回显需要在nginx 配置
      '/uploads': {
        target: 'http://10.110.1.179',
        changeOrigin: true
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
