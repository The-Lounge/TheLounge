/**
 * Proxy script for browserify requiring angular.min instead of angular
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
'use strict';
require('../node_modules/angular/angular.min');
module.exports = angular;