require('angular').module('ays')

  /* Author: Tyler Russell
   * Directive to be placed in various HTML headers for user management,
   * login/logout navigation, etc.
   */
  .directive('sessionheader', function (AuthService, UserService) {
    return {
      restrict: 'E',
      controller: function ($scope, $sails) {
        $scope.loggedIn = false;
        $scope.data = {};

        AuthService.checkAuth().then(function authCallback(authorized) {
          if (authorized !== 401) {
            $scope.data = authorized.data;
            UserService.data = $scope.data;
            $scope.loggedIn = true;
          }
        });

        $scope.logout = function () {
          $sails.get('/api/logout')
            .success(function () {})
            .error(function (error) {
              console.log('Error calling /logout endpoint:\n' + error);
            })
            .then(function () {
              // Dunno what we would need to handle here, they should always be able to log out???
            });
        };
      },
      // In /ng/views/
      templateUrl: 'views/sessionheader.html',
    };
});
