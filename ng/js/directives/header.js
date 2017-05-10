require('angular').module('ays')

  /* Author: Tyler Russell
   * Directive to be placed in various HTML headers for user management,
   * login/logout navigation, etc.
   */
  .directive('sessionheader', function (AuthService, SessionService) {
    return {
      restrict: 'E',
      controller: function ($scope, $sails, AuthService, SessionService) {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.userData = SessionService.user;

        $scope.logout = function () {
          AuthService.logout();// no need for then()
        };
      },
      // In /ng/views/
      templateUrl: 'views/sessionheader.html',
    };
});
