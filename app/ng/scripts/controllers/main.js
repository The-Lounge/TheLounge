'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('ays')
  .controller('MainCtrl', function () {
    console.log("MainCtrl");
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
