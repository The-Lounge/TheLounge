/*
 * Authentication service factory. All Angular factories
 * are singleton instances. Originally, this was going to 
 * store the data in 'getter' methods but those are evil.
 * The 'promise' variable is what contains the return object after
 * calling the '/me' endpoint:
 *    returns the HTTP code 401(an integer) if unauthorized
 *    otherwise, returns an object containing the user info
 *
 * Typically, controllers utilizing this service will execute this code:
 *
 *  AuthService.checkAuth().then(function authCallback(callback) {
 *      if (callback.status !== 401) {
 *        $scope.user_data = callback.data;
 *        $scope.authenticated = true;
 *      }
 *  }); 
 *  Then the controller and its associated view can use the data as needed.
 */

angular.module('ays')
  .factory('AuthService', function ($sails) {

    var AuthService = {
      checkAuth: function () {
        // $http/$sails returns a promise, which has a then function, which also returns a promise
        var promise = $sails.get('/me')
          .then(function (response) {
            return response;
          });
        return promise;
      },
    };
    return AuthService;
  });
