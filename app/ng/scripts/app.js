'use strict';

/**
 * @ngdoc overview
 * @name ays
 * @description
 * # ays
 *
 * Main module of the application.
 */
angular
  .module('ays', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router'
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
