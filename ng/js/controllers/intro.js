/**
 * Author: Tyler Russell
 */
require('angular').module('ays')
  .controller('IntroController', 
    ['$scope', '$state',
    function ($scope, $state) {
        $scope.profile = function () {
            // Go to user profile
        };
        $scope.goAsk = function () {
            // Go ask
        };
        $scope.categories = function () {
            $state.go('categories');
        };
        $scope.search = function () {
            // Search function
        };
    }]);
