/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # HomeController
 * The home page of the app. Note that when this route is accessed,
 * an instance of this controller is created and instantiated. This
 * controller is binded to the 'home' state in app.module.js
 */
require('angular').module('ays')
  .controller('HomeController', function ($scope, AuthService) {
    $scope.authenticated = false;
    AuthService.checkAuth().then(function authCallback(callback) {
      if (callback.status !== 401) {
        $scope.data = callback.data;
        $scope.authenticated = true;
      }
    });
  });
