"use strict";
/**
 * Created by Greg on 5/7/2016.
 */
require('angular').module('ays').controller('PostingController', function($sails, $scope){

  console.log("Posting ctrl");
  $scope.posting = {title: 'Test title'};
  $sails.get('/categories').then(function(categories){
    console.log(categories);
  }, function(err) {
    console.log(err);
  });

});
