"use strict";
/**
 * Created by Brianna on 4/4/2017.
 */
require('angular').module('ays').controller('CategoryController', function($sails, $scope, _){

  console.log("Category ctrl");
  $sails.get('/api/category/').then(function(){
    console.log(category);
	$scope.category = category.data;
  }, function(err) {
    console.log(err);
  });

});
