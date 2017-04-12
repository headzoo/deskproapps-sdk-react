const path = require('path');
const webpack = require('webpack');

const ManifestPlugin = require('webpack-manifest-plugin');

const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');

const PROJECT_ROOT_PATH = path.resolve(__dirname, '../../');
const PRODUCTION = !process.env.NODE_ENV || process.env.NODE_ENV === 'production';
const SLIM_PACKAGE = process.env.DPA_PACKAGE_MODE === 'slim';

const PACKAGE_NAMES='deskpro+apps react';
const artifactName = (baseName) => PACKAGE_NAMES.replace(/\+/, '').split(' ').concat([baseName]).join('-');

const configParts = [];
configParts.push({
    devtool: 'source-map',
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
            path.resolve(PROJECT_ROOT_PATH, 'node_modules/xcomponent/dist/xcomponent.js'),
            path.resolve(PROJECT_ROOT_PATH, 'node_modules/post-robot/dist/post-robot.js')
        ]
    },
    plugins: [],
    resolve: {
        alias: {
            'meteor/check': 'empty-module', // not used, but required by uniforms
            'meteor/aldeed:simple-schema': 'empty-module', // not used, but required by uniforms
            'graphql': 'empty-module', // not used, but required by uniforms
            handlebars: 'handlebars/dist/handlebars.js', // pulled in by simpl-schema, https://github.com/wycats/handlebars.js/issues/953
            'deskproapps-sdk-core': 'deskproapps-sdk-core/dist/deskproapps-core-c150404c5f653b09f110',
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
            vendor: [ 'lodash', 'react', 'react-dom', 'semantic-ui-react', 'simpl-schema', 'uniforms', 'deskproapps-sdk-core' ],
        },
        output: {
            pathinfo: !PRODUCTION,
            chunkFilename: artifactName('[name].[hash].js'),
            filename: artifactName('[name].[hash].js'),
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
            new ChunkManifestPlugin({ filename: artifactName('manifest.json'), manifestVariable: 'DeskproAppsReactManifest' }),

            // mapping of all source file names to their corresponding output file
            new ManifestPlugin({ fileName: artifactName('asset-manifest.json') }),
        ],
    });
} else {
    configParts.push({
        entry: path.resolve(PROJECT_ROOT_PATH, 'src/main/javascript/index.js'),
        output: {
            libraryTarget: 'umd',
            umdNamedDefine: true,
            library: 'DeskproAppsReact',

            pathinfo: !PRODUCTION,
            chunkFilename: artifactName('[hash].js'),
            filename: artifactName('[hash].js'),
            path: path.resolve(PROJECT_ROOT_PATH, 'dist')
        },
        plugins: [
            new webpack.DefinePlugin({ PRODUCTION: PRODUCTION }),
            // for stable builds, in production we replace the default module index with the module's content hashe
            (PRODUCTION ? new webpack.HashedModuleIdsPlugin() : new webpack.NamedModulesPlugin()),
        ],
    });
}

module.exports = Object.assign.apply(Object, configParts);
