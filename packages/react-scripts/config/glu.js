'use strict';

const webpack = require('webpack');

const alias = {
  handlebars: 'handlebars/dist/handlebars.min.js',
  backbone: 'backbone.marionette/node_modules/backbone',
};

const rules = [
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
];

const plugins = [
  new webpack.ProvidePlugin({
    // DO NOT provide '$', it causes a circular reference that results in an '{}'
    // $: 'jquery',
    jQuery: 'jquery',
  }),
];

module.exports = {
  alias,
  rules,
  plugins,
};
