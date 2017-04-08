"use strict";
/**
 * Created by Brianna on 4/4/2017.
 */
require('angular').module('ays').controller('CategoryController', function($sails, $scope, _){

  console.log("Category ctrl");
  $sails.get('/api/category/').then(function(category){
    console.log(category);
	$scope.category = category.data;
	//Will need to do a check to only return active categories
  }, function(err) {
    console.log(err);
  });

});
