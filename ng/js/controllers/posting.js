/**
 * Created by Greg on 5/7/2016.
 * Updated by Tyler on 5/2/2017.
 */
require('angular').module('ays')
  .controller('PostingController', function (SessionService, $sails, $scope, $stateParams) {
    $scope.posting = {};
    $scope.userData = SessionService.user;  
    
    $sails.get('/api/posting/' +  $stateParams.id)
      .then(function (response) {
        $scope.posting = response.data;
      })
      .catch(function (error) {
        console.log(error);
      })
});
