'use strict';

const { buildEngine } = require('ember-engines/lib/engine-addon');

module.exports = buildEngine({
  name: '<%= dasherizedModuleName %>',

  lazyLoading: {
    enabled: <%= isLazy %>,
    includeRoutesInApplication: <%= includeRoutesInApplication %>,
  },
});
