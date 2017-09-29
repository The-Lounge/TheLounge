require('angular').module('ays')

  /* Author: Tyler Russell
   * Directive to be placed in various HTML headers for user management,
   * login/logout navigation, etc.
   */
  .directive('sessionheader', function () {
    return {
      restrict: 'E',
      controller: function ($scope, $sails, $state, AuthService, SessionService) {
        function init() {
          $scope.loggedIn = AuthService.isAuthenticated();
          $scope.userData = SessionService.user;
        }
        init();
        $scope.logout = function () {
          AuthService.logout()
            .then(function () {
              $state.go('login');
            });
        };
        $scope.profile = function () {
          $state.go('profile', {id: $scope.userData.id});
        };
        $scope.dashboard = function () {
          $state.go('dashboard');
        };
        $scope.homepage = function () {
          $state.go('home');
        };
        $scope.categories = function () {
          $state.go('categories');
        };
        $scope.createPost = function () {
          $state.go('posting.new');
        };
      },
      // In /ng/views/
      templateUrl: 'views/sessionheader.html',
    };
});
