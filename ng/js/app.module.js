/**
 * app.module
 * This is the entry point of the browser app
 *
 * It is compiled to `app.bundle.js` by Browserify, which resolves all dependencies
 * in and creates a single script
 */

// Include JQuery
// eslint-disable-next-line no-multi-assign
window.$ = window.jQuery = require('jquery');
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

require('angular').module('ays', [
    require('angular-animate'),
    require('angular-cookies'),
    require('angular-resource'),
    require('angular-route'),
    require('angular-sanitize'),
    require('angular-touch'),
    require('angular-ui-router'),
    require('angular-localstorage'),
    require('angular-material'),
    'ngSails',
  ])
  // This handles the users session, redirects to login if currently unauthorized, homepage otherwise
  .run([
    'AuthService',
    'SessionService',
    '$rootScope',
    '$state',
    run])
  .constant('_', require('lodash'))
  .config([
    '$urlRouterProvider',
    '$stateProvider',
    '$locationProvider',
    config]);

function run(AuthService, SessionService, $rootScope, $state) {
  // clean service data before checking backend for auth status
  SessionService.destroy();
  AuthService.initAppLoad();
  AuthService.initStateGuard();

  $rootScope.$on('$stateChangeStart', function redirect(event, toState, toParams) {
    if (toState.data && typeof toState.data.redirect === 'string') {
      event.preventDefault();
      $state.go(toState.data.redirect, toParams);
    }
  });
}

function config($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  // removes #! from urls, disables browser refresh without backend changes
  // $locationProvider.html5Mode(true);
  $stateProvider
    .state('posting', {
      abstract: true,
      url: '/posting',
      templateUrl: 'views/posting.html',
    })
    .state('posting.view', {
      url: '/view/:id',
      templateUrl: 'views/postingDetails.html',
      protected: true,
      controller: 'PostingController',
    })
    .state('posting.new', {
      url: '/new',
      controller: 'CreatePostingController',
      templateUrl: 'views/createPost.html',
      protected: true,
    })
    .state('profile', {
      url: '/user/:id',
      controller: 'UserProfileController',
      templateUrl: 'views/userProfile.html',
      protected: false,
    })
    .state('categories', {
      url: '/categories',
      controller: 'CategoriesController',
      templateUrl: 'views/categories.html',
      protected: true,
    })
    .state('intro', {
      url: '/intro',
      templateUrl: '/views/intro.html',
      controller: 'IntroController',
      protected: true,
    })
    .state('faq', {
      url: '/faq',
      templateUrl: 'views/faq.html',
      protected: false,
    })
    .state('login', {
      url: '/login',
      controller: 'LoginController',
      templateUrl: 'views/login.html',
      protected: false,
      params: { // used to navigate to desired page if redirected to login, sets /home as default
        toState: 'intro',
        toParams: {},
      },
    })
    .state('home', {
      url: '/home',
      controller: 'HomeController',
      templateUrl: 'views/home.html',
      protected: false,
    })
    .state('landing', {
      url: '/',
      // if user navigates to 'thelounge.co/' handle routing accordingly
      controller: function (AuthService, $state) {
        if (AuthService.isAuthenticated()) {
          $state.go('intro');
        } else {
          $state.go('home');
        }
      },
    })
    .state('404', {
      templateUrl: '404.html',
      protected: false,
    });

  // handle no url route match
  $urlRouterProvider.otherwise(function ($injector, $location) {
    // if a bad path was provided, display 404 (while preserving the bad path w/o location change)
    // if no path was provided, go to landing page
    var state = $location.path() ? '404' : 'landing';
    $injector.invoke(['$state', function ($state) {
      $state.go(state);
    }]);
    return true;
  });
}

// Pull in the controllers, this should be done through modules eventually
require('./directives/onBlurPostingValidation');
require('./controllers/newPosting');
require('./directives/header');
require('./directives/footer');
require('./services/auth');
require('./services/requestinterceptor');
require('./controllers/intro');
require('./controllers/login');
require('./controllers/main');
require('./controllers/posting');
require('./controllers/categories');
require('./controllers/userProfile');
