/**
 * Created by Greg on 5/7/2016.
 * Updated by Tyler on 5/2/2017.
 */
require('angular').module('ays')
  .controller('PostingController', function (UserService, $sails, $scope, $stateParams) {
    $scope.posting = {};
    $scope.userFN = UserService.data.name.firstName;
    $scope.userLN = UserService.data.name.lastName;
    
    $sails.get('/api/posting/' +  $stateParams.id)
      .success(function (data) {
        $scope.posting = data;
      })
      .error(function (error) {
        console.log(error);
      });
});
