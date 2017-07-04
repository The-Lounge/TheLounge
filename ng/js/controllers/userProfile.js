/**
 * Author: Tyler Russell
 */
require('angular').module('ays')
  .controller('UserProfileController',
    ['$scope', '$state', '$stateParams',
    function ($scope, $state, $stateParams) {
        $scope.data = $stateParams;
    }]);
