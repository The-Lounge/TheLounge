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
    '$mdThemingProvider',
    config]);

function run(AuthService, SessionService, $rootScope, $state) {
  // clean service data before checking backend for auth status
  SessionService.destroy();
  AuthService.initAppLoad();
  AuthService.initStateGuard();

  $rootScope.$on('$stateChangeStart', function redirect(event, toState, toParams) {
    $rootScope.background = '';
    // this references a css class, which references an image to use as a background
    $rootScope.background = toState.data.background + '-background';
    if (toState.data && typeof toState.data.redirect === 'string') {
      event.preventDefault();
      $state.go(toState.data.redirect, toParams);
    }
  });
}

function config($urlRouterProvider, $stateProvider, $locationProvider, $mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('orange', {
      default: '700',   // make all material elements that use the default color use the hue 700
    });
    // .accentPalette('brown'); // do we care about this?????

  $locationProvider.hashPrefix('');
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
      data: {
        // this is a prefix for a CSS classname, which references the image asset
        background: 'view-posting',
      },
    })
    .state('posting.new', {
      url: '/new',
      controller: 'CreatePostingController',
      templateUrl: 'views/createPost.html',
      protected: true,
      data: {
        background: 'create-posting',
      },
    })
    .state('profile', {
      url: '/user/:id',
      controller: 'UserProfileController',
      templateUrl: 'views/userProfile.html',
      protected: true,
      data: {
        background: 'profile',
      },
    })
    .state('categories', {
      url: '/categories',
      controller: 'CategoriesController',
      templateUrl: 'views/categories.html',
      protected: true,
      data: {
        background: 'categories',
      },
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: '/views/dashboard.html',
      controller: 'DashboardController',
      protected: true,
      data: {
        background: 'dashboard',
      },
    })
    .state('faq', {
      url: '/faq',
      templateUrl: 'views/faq.html',
      protected: false,
      data: {
        background: 'faq',
      },
    })
    .state('login', {
      url: '/login',
      controller: 'LoginController',
      templateUrl: 'views/login.html',
      protected: false,
      params: { // used to navigate to desired page if redirected to login, sets /home as default
        toState: 'dashboard',
        toParams: {},
      },
      data: {
        background: 'login',
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
          $state.go('dashboard');
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
require('./directives/header');
require('./directives/footer');
require('./services/posting');
require('./services/auth');
require('./services/requestinterceptor');
require('./controllers/newPosting');
require('./controllers/dashboard');
require('./controllers/login');
require('./controllers/main');
require('./controllers/posting');
require('./controllers/categories');
require('./controllers/userProfile');
