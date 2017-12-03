/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: '<%= engineModulePrefix %>',
    environment
  };

  return ENV;
};
