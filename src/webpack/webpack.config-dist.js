const path = require('path');
const webpack = require('webpack');

const ManifestPlugin = require('webpack-manifest-plugin');

const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');

const BuildUtils = require('./BuildUtils');

const PROJECT_ROOT_PATH = path.resolve(__dirname, '../../');
const PRODUCTION = !process.env.NODE_ENV || process.env.NODE_ENV === 'production';
const SLIM_PACKAGE = process.env.DPA_PACKAGE_MODE === 'slim';

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
            { test: /\.(html?|css)$/, loader: 'raw-loader' }
        ],
        noParse: [
            path.resolve(PROJECT_ROOT_PATH, 'node_modules/deskproapps-sdk-core/dist'),
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
            'deskproapps-sdk-core': 'deskproapps-sdk-core/dist/deskproapps-sdk-core'
        },

        extensions: ['*', '.js', '.jsx', '.scss', '.css']
    },
    // stats: 'minimal',
    node: { fs: 'empty' },
    bail: true
});

if (SLIM_PACKAGE) {
    configParts.push({
        entry: {
            slim: [ path.resolve(PROJECT_ROOT_PATH, 'src/main/javascript/index.js') ],
            vendor: [ 'lodash', 'semantic-ui-react', 'simpl-schema', 'uniforms', 'deskproapps-sdk-core' ],
        },
        output: {
            pathinfo: !PRODUCTION,
            chunkFilename: BuildUtils.artifactName('[name].js'),
            filename: BuildUtils.artifactName('[name].js'),
            path: path.resolve(PROJECT_ROOT_PATH, 'dist')
        },
        plugins: [
            new webpack.DefinePlugin({ PRODUCTION: PRODUCTION }),
            // for stable builds, in production we replace the default module index with the module's content hashe
            (PRODUCTION ? new webpack.HashedModuleIdsPlugin() : new webpack.NamedModulesPlugin()),

            // replace a standard webpack chunk hashing with custom (md5) one
            new WebpackChunkHash(),
            // vendor libs + extracted manifest
            new webpack.optimize.CommonsChunkPlugin({ name: ['vendor', 'manifest'], minChunks: Infinity }),
            // export map of chunks that will be loaded by the extracted manifest
            new ChunkManifestPlugin({ filename: BuildUtils.artifactName('manifest.json'), manifestVariable: 'DeskproAppsSDKReactManifest' }),

            // mapping of all source file names to their corresponding output file
            new ManifestPlugin({ fileName: BuildUtils.artifactName('asset-manifest.json') }),
        ],
    });
} else {
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
        plugins: [
            new webpack.DefinePlugin({ PRODUCTION: PRODUCTION }),
            // for stable builds, in production we replace the default module index with the module's content hash
            (PRODUCTION ? new webpack.HashedModuleIdsPlugin() : new webpack.NamedModulesPlugin()),
        ],
    });
}

module.exports = Object.assign.apply(Object, configParts);
