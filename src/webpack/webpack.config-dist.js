const path = require('path');
const dpatRootPath = require.resolve('@deskproapps/dpat').split('dpat').shift().concat('dpat');

const webpack = require('@deskproapps/dpat/node_modules/webpack');
const ManifestPlugin = require('@deskproapps/dpat/node_modules//webpack-manifest-plugin');
const ChunkManifestPlugin = require('@deskproapps/dpat/node_modules/chunk-manifest-webpack-plugin');
const WebpackChunkHash = require('@deskproapps/dpat/node_modules/webpack-chunk-hash');

const BuildUtils = require('./BuildUtils');

const PROJECT_ROOT_PATH = path.resolve(__dirname, '../../');
const PRODUCTION = !process.env.NODE_ENV || process.env.NODE_ENV === 'production';

// types of packaging

const STANDALONE_PACKAGE = process.env.DPA_PACKAGE_MODE === 'standalone'; // a single bundle will be generated
const SLIM_PACKAGE = process.env.DPA_PACKAGE_MODE === 'slim'; // most (if not all) dependencies will not be included in the bundle
const COMPACT_PACKAGE = process.env.DPA_PACKAGE_MODE === 'compact'; // all deskpro sdks will be excluded from bundle

const commonPlugins = [
  new webpack.DefinePlugin({PRODUCTION: PRODUCTION}),
  (PRODUCTION ? new webpack.HashedModuleIdsPlugin() : new webpack.NamedModulesPlugin()),
  (PRODUCTION
      ? new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {unused: true, dead_code: true, warnings: false}
      })
      : null
  ),
].filter(function (entry) {
  return entry !== null
});

const configParts = [];
configParts.push({
  devtool: 'source-map',
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(PROJECT_ROOT_PATH, 'src/main/javascript'),
        ]
      },
      {test: /\.(html?|css)$/, loader: 'raw-loader'}
    ],
    noParse: [
      path.resolve(PROJECT_ROOT_PATH, 'node_modules/@deskproapps/deskproapps-sdk-core/dist'),
      path.resolve(PROJECT_ROOT_PATH, 'node_modules/handlebars'),
      path.resolve(PROJECT_ROOT_PATH, 'semantic-ui-react/dist')
    ]
  },
  plugins: [],
  resolve: {
    alias: {
      'meteor/check': 'empty-module', // not used, but required by uniforms
      'meteor/aldeed:simple-schema': 'empty-module', // not used, but required by uniforms
      'graphql': 'empty-module', // not used, but required by uniforms
      //handlebars (pulled in by simpl-schema, https://github.com/wycats/handlebars.js/issues/953), resolved in babelrc
      //'handlebars': 'handlebars/runtime.js',
      'handlebars': 'handlebars/dist/handlebars.js',
      'semantic-ui-react/src': 'semantic-ui-react/dist/commonjs',
      '@deskproapps/deskproapps-sdk-core': '@deskproapps/deskproapps-sdk-core/dist/deskproapps-sdk-core'
    },

    extensions: ['*', '.js', '.jsx', '.scss', '.css']
  },
  resolveLoader: {
    modules: [path.join(dpatRootPath, "node_modules")],
  },
  bail: true
});

if (STANDALONE_PACKAGE) {
  configParts.push({
    entry: path.resolve(PROJECT_ROOT_PATH, 'src/main/javascript/index.js'),
    output: {
      libraryTarget: 'umd',
      umdNamedDefine: true,
      library: 'DeskproAppsSDKReact',

      pathinfo: !PRODUCTION,
      chunkFilename: BuildUtils.artifactName('.js'),
      filename: BuildUtils.artifactName('.js'),
      path: path.resolve(PROJECT_ROOT_PATH, 'dist')
    },
    plugins: commonPlugins.concat([]),
  });
} else if (COMPACT_PACKAGE) {
  configParts.push({
    entry: path.resolve(PROJECT_ROOT_PATH, 'src/main/javascript/index.js'),
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      '@deskproapps/deskproapps-sdk-core': 'DeskproAppsSDKCore'
    },
    output: {
      libraryTarget: 'umd',
      umdNamedDefine: true,
      library: 'DeskproAppsSDKReact',

      pathinfo: !PRODUCTION,
      chunkFilename: BuildUtils.artifactName('.compact.js'),
      filename: BuildUtils.artifactName('.compact.js'),
      path: path.resolve(PROJECT_ROOT_PATH, 'dist')
    },
    plugins: commonPlugins.concat([]),
  });
} else if (SLIM_PACKAGE) {
  configParts.push({
    entry: {
      slim: [path.resolve(PROJECT_ROOT_PATH, 'src/main/javascript/index.js')],
      vendor: ['semantic-ui-react', 'simpl-schema', 'uniforms', '@deskproapps/deskproapps-sdk-core'],
    },
    output: {
      pathinfo: !PRODUCTION,
      chunkFilename: BuildUtils.artifactName('[name].js'),
      filename: BuildUtils.artifactName('[name].js'),
      path: path.resolve(PROJECT_ROOT_PATH, 'dist')
    },
    plugins: commonPlugins.concat([
      // replace a standard webpack chunk hashing with custom (md5) one
      new WebpackChunkHash(),
      // vendor libs + extracted manifest
      new webpack.optimize.CommonsChunkPlugin({name: ['vendor', 'manifest'], minChunks: Infinity}),
      // export map of chunks that will be loaded by the extracted manifest
      new ChunkManifestPlugin({
        filename: BuildUtils.artifactName('manifest.json'),
        manifestVariable: 'DeskproAppsSDKReactManifest'
      }),

      // mapping of all source file names to their corresponding output file
      new ManifestPlugin({fileName: BuildUtils.artifactName('asset-manifest.json')}),
    ]),
  });
}

module.exports = Object.assign.apply(Object, configParts);
