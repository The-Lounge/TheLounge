/*
 * Author: Tyler Russell
 */
require('angular').module('ays')
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    loginWhileSessionValid: 'auth-login-with-valid-session',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',// useful for when User Roles are implemented
  })
  .factory('AuthService', function ($sails, SessionService, HttpPendingRequestsService, $rootScope, $state) {
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
          })
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
          })
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
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
          if(!AuthService.isAuthenticated()) {
            if(toState.protected) {
              event.preventDefault();
              HttpPendingRequestsService.cancelAll(); // prevent all http requests
              // if user isnt authenticated and attempts to view a protected state,
              // redirect to login and store the desired view to redirect them back after
              $state.go('login', {'toState': toState.name, 'toParams': toParams});
            }
          }
        })
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
  })
  .service('SessionService', function () {
    this.create = function (user) {
      this.user = user;
      // this.userRole = userRole;
    };
    this.destroy = function () {
      this.user = null;
      // this.userRole = null;
    };
})
