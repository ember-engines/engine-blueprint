/*jshint node:true*/
'use strict';

module.exports = function(environment) {
  var ENV = {
    modulePrefix: '<%= engineModulePrefix %>',
    environment
  };

  return ENV;
};
