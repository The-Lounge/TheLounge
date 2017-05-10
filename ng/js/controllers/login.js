/*
 * Author: Tyler Russell
 */
require('angular').module('ays')
  .controller('LoginController', 
    function (AUTH_EVENTS, $sails, $scope, $state, AuthService, $rootScope, SessionService) {
      $scope.loginErrorMessage = '';
      $scope.credentials = {
        userName: '',
        password: '',
      };

      // Scope variable linked to the actual login button. Checks for validity via
      // the HTTP response codes from the AuthService methods, which in turn gets them from
      // our backend. Its not uniform yet, so if statements will probably get updated in the future
      $scope.authenticate = function () {
        // when logging in, check if user is already authenticated
        AuthService.getUserAuthStatus().then(function callback(response) {
          // if they aren't authenticated, attempt to log them in with input credentials
          if(response.status === 401) {
            loginUser().then(function (response) {
              // if user's login attempt failed with code 422
              if (response.data.code === 422) {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);// broadcast isn't being caught for now
                $scope.loginErrorMessage = response.data.message;
              } else if (response.status === 200) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);// broadcast isn't being caught for now
                $state.go($state.params.toState, $state.params.toParams);
              }
            });
          } else { // else the user is already authenticated
            $state.go($state.params.toState, $state.params.toParams);
          }
        })
        // catch when the user is not logged in
        .catch(function (error) {
          console.log(error);
        });
      };
      var loginUser = function () {
        return AuthService.login($scope.credentials)
          .then(function (response) {
            return response;
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    });
