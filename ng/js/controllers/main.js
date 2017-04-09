'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # LoginController
 * User Login Angular Controller. Note that when this route is accessed, 
 * an instance of this controller is created and instantiated. Referencing
 * this anywhere else will create a new instance!
 */
require('angular').module('ays')
  
    .controller('HomeController', function ($scope, Auth) {
    
    console.log("HomeController instantiated.");

    //Not working currently
    $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

        //If at any point the user becomes unauthorized, redirect to login
        if(!value && oldValue) {
            $location.url('/login');
        }

        if(value) {
            //Do something when the user is connected
        }

    }, true);
    
    });
