/**
 * app.module
 * This is the entry point of the browser app
 *
 * It is compiled to `app.bundle.js` by Browserify, which resolves all dependencies
 * in and creates a single script
 */

// Include JQuery and BootStrap
// eslint-disable-next-line no-multi-assign
window.$ = window.jQuery = require('jquery');
window.boostrapjs = require('bootstrap-sass');
window.angular = require('angular');
window._ = require('lodash');
require('angular-sails');
require('angular-validator');
require('angular-filter');

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

window.angular.module('ays', [
    require('angular-animate'),
    require('angular-cookies'),
    require('angular-resource'),
    require('angular-route'),
    require('angular-sanitize'),
    require('angular-touch'),
    require('angular-ui-router'),
    'angular.filter',
    'ngSails',
  ])
  // This handles the users session, redirects to login if currently unauthorized, homepage otherwise
  .run(function run(AuthService, $state) {
    AuthService.checkAuth().then(function authCallback(authorized) {
      if (authorized === 401) {
        $state.go('login');
      } else {
        $state.go('categories');
      }
    });
  })
  .constant('_', require('lodash'))
  .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    // $locationProvider.html5Mode(true);//removes #! from urls, disables browser refresh without backend changes
    // $locationProvider.html5Mode(true);//remove #! from urls

    $stateProvider
      .state('newposting', {
        url: '/posting/new',
        controller: 'CreatePostingController',
        templateUrl: 'views/createPost.html',
      })
      .state('posting', {
        url: '/posting/:id',
        controller: 'PostingController',
        templateUrl: 'views/posting.html',
      })
      .state('categories', {
        url: '/categories',
        controller: 'CategoriesController',
        templateUrl: 'views/categories.html',
      })
      .state('faq', {
        url: '/faq',
        templateUrl: 'views/faq.html',
      })
      .state('login', {
        url: '/',
        controller: 'LoginController',
        templateUrl: 'views/login.html',
      })
      .state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: 'views/home.html',
      });

      $urlRouterProvider.otherwise('/');
  });

// Pull in the controllers, this should be done through modules eventually
require('./controllers/new_posting');
require('./directives/header');
require('./services/auth');
require('./controllers/login');
require('./controllers/main');
require('./controllers/posting');
require('./controllers/categories');

