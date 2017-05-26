require('angular').module('ays')

  /* Author: Tyler Russell
   * Directive to be used as a footer which contains links to various
   * informational pages
   */
  .directive('loungefooter', function () {
    return {
      restrict: 'E',
      controller: function ($scope) {
        $scope.contact = function () {
          console.log('navigate to contact page');
        }
        $scope.about = function () {
          console.log('navigate to about page');
        }
        $scope.policies = function () {
          console.log('navigate to policies page');
        }
        $scope.getTheLounge = function () {
          console.log('get the lounge at your school');
        }
      },
      // In /ng/views/
      templateUrl: 'views/loungefooter.html',
    };
});
