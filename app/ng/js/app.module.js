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
var boostrapjs = require('bootstrap-sass');

// Start the sails client
var io = require('./dependencies/sails.io')(require('socket.io-client'));

/**
 * @ngdoc overview
 * @name ays
 * @description
 * # ays
 *
 * Main module of the application.
 */
var app = require('angular').module('ays', [
    require('angular-animate'),
    require('angular-cookies'),
    require('angular-resource'),
    require('angular-route'),
    require('angular-sanitize'),
    require('angular-touch'),
    require('angular-ui-router')
  ])
  .config(function ($urlRouterProvider, $stateProvider) {
    console.log("I'm running! wadup");
    console.log("eh More things!");

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('posting', {
        url: '/posting/:id',
        controller: 'PostingController',
        templateUrl: 'views/posting.html'
      })
      .state('faq', {
        url: '/faq',
        templateUrl: 'views/faq.html'
      })
      .state('main', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: 'views/home.html'
      });
  });

//Pull in the controllers, this should be done through modules eventually
require('./controllers/main');
require('./controllers/posting');
