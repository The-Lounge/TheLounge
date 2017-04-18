/**
 * Created by Greg on 5/7/2016.
 */
require('angular').module('ays').controller('PostingController', function ($sails, $scope, $stateParams) {
  console.log('Posting ctrl');
  $sails.get('/api/posting/' +  $stateParams.id).then(function (posting) {
    $scope.posting = posting.data;
  }, function (err) {
    console.log(err);
  });
});
