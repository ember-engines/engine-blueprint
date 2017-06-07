/*jshint node:true*/
'use strict';

module.exports = function(environment) {
  const ENV = {
    modulePrefix: '<%= engineModulePrefix %>',
    environment
  };

  return ENV;
};
