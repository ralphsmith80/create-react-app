'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const appBowerModules = resolveApp('bower_components');
const glu = resolveApp('bower_components/glu');
const gluVendor = resolveApp('bower_components/glu/vendor');

const alias = {
  backbone: path.resolve(gluVendor, 'backbone/backbone'),
  'backbone.wreqr': path.resolve(
    gluVendor,
    'backbone.wreqr/lib/backbone.wreqr.min'
  ),
  'backbone.babysitter': path.resolve(
    gluVendor,
    'backbone.babysitter/lib/backbone.babysitter.min'
  ),
  'bootstrap.affix': path.resolve(gluVendor, 'bootstrap/js/affix'),
  'bootstrap.alert': path.resolve(gluVendor, 'bootstrap/js/alert'),
  'bootstrap.button': path.resolve(gluVendor, 'bootstrap/js/button'),
  'bootstrap.collapse': path.resolve(gluVendor, 'bootstrap/js/collapse'),
  'bootstrap-daterangepicker': path.resolve(
    gluVendor,
    'bootstrap-daterangepicker/daterangepicker'
  ),
  'bootstrap.dropdown': path.resolve(gluVendor, 'bootstrap/js/dropdown'),
  'bootstrap.modal': path.resolve(gluVendor, 'bootstrap/js/modal'),
  'bootstrap.popover': path.resolve(gluVendor, 'bootstrap/js/popover'),
  'bootstrap.scrollspy': path.resolve(gluVendor, 'bootstrap/js/scrollspy'),
  'bootstrap.tab': path.resolve(gluVendor, 'bootstrap/js/tab'),
  'bootstrap.tooltip': path.resolve(gluVendor, 'bootstrap/js/tooltip'),
  'bootstrap.transition': path.resolve(gluVendor, 'bootstrap/js/transition'),
  c3: path.resolve(gluVendor, 'c3/c3.min'),
  d3: path.resolve(gluVendor, 'd3/d3.min'),
  handlebars: path.resolve(gluVendor, 'handlebars/handlebars.min'),
  jquery: path.resolve(gluVendor, 'jquery/dist/jquery.min'),
  'jquery-mask': path.resolve(
    gluVendor,
    'jQuery-Mask-Plugin/dist/jquery.mask.min'
  ),
  jui: path.resolve(gluVendor, 'jquery-ui/ui'),
  marionette: path.resolve(
    gluVendor,
    'marionette/lib/core/amd/backbone.marionette.min'
  ),
  moment: path.resolve(gluVendor, 'moment/moment'),
  numeral: path.resolve(gluVendor, 'numeral/min/numeral.min'),
  respond: path.resolve(gluVendor, 'respond/dest/respond.src'),
  rsvp: path.resolve(gluVendor, 'rsvp/rsvp.min'),
  select2: path.resolve(gluVendor, 'select2/select2.min'),
  'string-replace-loader': path.resolve(
    resolveApp('node_modules/string-replace-loader')
  ),
  underscore: path.resolve(gluVendor, 'underscore/underscore'),
};

const rules = [
  {
    // Shim the `this` reference for `respond.src`
    // https://webpack.js.org/guides/shimming/#granular-shimming
    test: require.resolve(path.resolve(gluVendor, 'respond/dest/respond.src')),
    // use: 'imports-loader?this=>window',
    use: `${require.resolve('imports-loader')}?this=>window`,
  },
  {
    test: /\.js$/,
    exclude: [/node_modules/, /test[\/\\]test\.js/],
    loader: require.resolve('string-replace-loader'),
    enforce: 'pre',
    options: {
      multiple: [
        // Fix all the instances of hbs! when requiring in templates
        {
          // https://github.com/Va1/string-replace-loader/issues/31
          // this used to have the g in the flags property here but that caused an issue with node 4.4.7 which using a regex with the g built in solved
          // recommend leaving this in just for greater compatibility even after we go to node 6+
          search: /hbs\!/g,
          replace: '',
        },
        // require.js gives access to module.config(), we don't have that with webpack
        {
          search: 'module.config()',
          replace: '{}',
        },
      ],
    },
  },
  {
    test: /\.hbs$/,
    loader: require.resolve('handlebars-loader'),
    options: {
      runtime: 'handlebars',
      // prevent handlebars-loader from looking for files that match the name of any helper in hbs templates.
      // We have several instances where the files are not helpers and this blackbox behavior seems unnecessary for now
      rootRelative: '',

      // Work around issue with unknown helpers at build time for any page that has partials
      // partials will trigger a recompile of the page in the loader (as will finding new helpers and a few other things)
      // On recompile handlebars-loader passes handlebars.precompile a knownHelpersOnly flag which makes it blow up if it
      // encounters a helper that isn't already registered at build time.
      // For now the work around is to list all helpers that are not registered at build time on pages with partials below.
      knownHelpers: [
        'date',
        'amount',
        'number',
        'abbrNumber',
        'money',
        'documentRoot',
        'loadingMessages',
        'dateFormat',
        'bool',
        'stringContains',
        'locale',
        'currencySymbol',
        'route',
        'isEqual',
        'collapsePanel',
        'icon',
      ],
      exclude: 'node_modules(\\/|\\\\).*',

      inlineRequires: 'images/',
      debug: false,
    },
  },
  {
    test: /\.less$/,
    use: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          // this is require for glu less/font/image file urls
          // https://github.com/webpack-contrib/less-loader/issues/109#issuecomment-358008310
          url: false,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebookincubator/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
              flexbox: 'no-2009',
            }),
          ],
        },
      },
      {
        loader: require.resolve('less-loader'),
        options: {
          // relativeUrls: true,
          relativeUrls: false,
          lint: true,
          strictImports: false,
        },
      },
    ],
  },
];

const plugins = [
  new webpack.ProvidePlugin({
    // DO NOT provide '$', it causes a circular reference that results in an '{}'
    // $: 'jquery',
    jQuery: 'jquery',
  }),
];

module.exports = {
  appBowerModules,
  alias,
  rules,
  plugins,
};
