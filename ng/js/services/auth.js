/*
 * Author: Tyler Russell
 * Contains an Authentication Service that provides functionality such as checking if
 * a user is logged in, logs a user in and out, and a static function that safeguards
 * protected states from unauthenticated users. Contains a service that stores the
 * user object returned from the DB, and checking if a user is authenticated is done
 * by checking the status of SessionService.user. 
 * Also contains an app constant called AUTH_EVENTS, which should be used to broadcast
 * auth-related events app wide like: $rootScope.$on('$some-auth-event-name', ...)
 * Will be useful for allowing/denying access to parts of the app when user permissions
 * are implemented.
 */
require('angular').module('ays')
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    loginWhileSessionValid: 'auth-login-with-valid-session',
    notAuthenticated: 'auth-not-authenticated', // this is broadcasted when a user isn't logged in
    notAuthorized: 'auth-not-authorized',
  })
  .factory('AuthService', 
    ['$sails', 'SessionService', 'HttpPendingRequestsService', '$rootScope', '$state',
    function ($sails, SessionService, HttpPendingRequestsService, $rootScope, $state) {
    var AuthService = {
      getUserAuthStatus: function () {
        // $http/$sails returns a promise, which has a then function, which also returns a promise
        var promise = $sails.get('/api/me')
          .then(function (response) {
            SessionService.user = response.data;
            return response;
          })
          .catch(function (error) {
            return error;
          });
        return promise;
      },
      login: function (credentials) {
        var promise = $sails.post('/api/login', credentials)
          .then(function (response) {
            SessionService.user = response.data;
            return response;
          })
          .catch(function (error) {
            return error;
          });
        return promise;
      },
      isAuthenticated: function () {
        return !!SessionService.user;
      },
      logout: function () {
        var promise = $sails.get('/api/logout')
          .then(function (response) {
            return response;
          })
          .catch(function (error) {
            return error;
          });
        SessionService.destroy();// reset saved user info in front-end no matter what
        return promise;
      },
      initStateGuard: function () {
        // run auth check for each url visited
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
          if (!AuthService.isAuthenticated()) {
            if (toState.protected) {
              event.preventDefault();
              HttpPendingRequestsService.cancelAll(); // prevent all http requests
              // if user isnt authenticated and attempts to view a protected state,
              // redirect to login and store the desired view to redirect them back after
              $state.go('login', {toState: toState.name, toParams: toParams});
            }
          } 
        });
      },
      initAppLoad: function () {
        // set up Session Service on app load
        AuthService.getUserAuthStatus().then(function (response) {
          if (response.status === 401) {
            SessionService.user = null;
          } else if (response.status === 200) {
            SessionService.user = response.data;
            $state.go('home');// redirect user straight to /home if they are still logged in
          }
        });
      },
    };
    return AuthService;
  }])
  .service('SessionService', function () {
    this.create = function (user) {
      this.user = user;
    };
    this.destroy = function () {
      this.user = null;
    };
  });
