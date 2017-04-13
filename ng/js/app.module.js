'use strict';
/**
 * app.module
 * This is the entry point of the browser app
 *
 * It is compiled to `app.bundle.js` by Browserify, which resolves all dependencies
 * in and creates a single script
 */

// Include JQuery and BootStrap
window.$ = window.jQuery = require('jquery');
window.boostrapjs = require('bootstrap-sass');
window.angular = require('angular');
window._ = require('lodash');
require('angular-sails');

// Start the sails client
window.io = require('./dependencies/sails.io')(require('socket.io-client'));

/**
 * @ngdoc overview
 * @name ays
 * @description
 * # ays
 *
 * Main module of the application.
 */


var app = angular.module('ays', [
    require('angular-animate'),
    require('angular-cookies'),
    require('angular-resource'),
    require('angular-route'),
    require('angular-sanitize'),
    require('angular-touch'),
    require('angular-ui-router'),
    'ngSails'
  ])
  //This handles the users session, redirects to login if currently unauthorized, homepage otherwise
  .run(function(AuthService, $state) {
    AuthService.async().then(function(authorized) {
      console.log(authorized);
      if(authorized == 401) {
        $state.go('entry');
      }
      else {
        $state.go('home');
      }
    })
  })
  .constant('_', require('lodash'))
  .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    console.log("AYS is up and running...");

    $urlRouterProvider.otherwise('/');
    //$locationProvider.html5Mode(true);//removes #! from urls.

    $stateProvider
      .state('posting', {
        url: '/posting/:id',
        controller: 'PostingController',
        templateUrl: 'views/posting.html'
      })
      .state('category', {
        url: '/category',
        controller: 'CategoryController',
        templateUrl: 'views/category.html'
      })
      .state('faq', {
        url: '/faq',
        templateUrl: 'views/faq.html'
      })
      .state('entry', {
        url: '/',
        controller: 'LoginController',
        templateUrl: 'views/login.html'
      })
      .state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: 'views/home.html',
      });
  });

   //Pull in the controllers, this should be done through modules eventually
require('./services/auth')
require('./controllers/login')
require('./controllers/main');
require('./controllers/posting');
require('./controllers/category');

