/**
 * Created by Greg on 5/7/2016.
 * Updated by Tyler on 5/2/2017.
 */
require('angular').module('ays')
  .controller('PostingController', 
    ['SessionService', '$sails', '$scope', '$stateParams',
    function (SessionService, $sails, $scope, $stateParams) {
    $scope.posting = {};
    $scope.userData = SessionService.user;  
    
    $sails.get('/api/posting/' +  $stateParams.id)
      .then(function (response) {
        $scope.posting = response.data;
      })
      .catch(function () {
        console.log('An error occurred retrieving the posting details.');
      });
}]);
