require('angular').module('ays')

  /* Author: Tyler Russell
   * Directive to be placed in various HTML headers for user management,
   * login/logout navigation, etc.
   */
  .directive('sessionheader', function () {
    return {
      restrict: 'E',
      controller: function ($scope, $sails, $state, AuthService, SessionService) {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.userData = SessionService.user;
        $scope.logout = function () {
          AuthService.logout();
          $state.go('login');
        };

        $scope.profile = function () {
          $state.go('profile', {id: SessionService.user.id});
        }
      },
      // In /ng/views/
      templateUrl: 'views/sessionheader.html',
    };
});
