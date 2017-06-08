/* eslint-env node */
'use strict';

module.exports = function(environment) {
  const ENV = {
    modulePrefix: '<%= engineModulePrefix %>',
    environment
  };

  return ENV;
};
