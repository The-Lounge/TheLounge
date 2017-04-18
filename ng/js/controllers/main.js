/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # HomeController
 * The home page of the app. Note that when this route is accessed,
 * an instance of this controller is created and instantiated. Referencing
 * this anywhere else will create a new instance!
 */
require('angular').module('ays')

  .controller('HomeController', function ($scope, AuthService) {
    console.log('Home Controller instantiated');

    $scope.authenticated = false;

    // Service call returns the HTTP status of the /me endpoint
    AuthService.async().then(function (resp) {
      console.log(resp);
      if (resp !== 401) {
        $scope.authenticated = true;
      } else {
        $scope.authenticated = false;
      }
    });
  });
