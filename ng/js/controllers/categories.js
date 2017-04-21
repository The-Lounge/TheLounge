/**
 * Created by Brianna on 4/4/2017.
 */
require('angular').module('ays')

	.controller('CategoriesController', function ($sails, $scope) {
		$scope.category = {};
  		// $sails.get('/category')
  		// 	.then(function (category) {
    // 			$scope.category = category.data;
    // 		// Will need to do a check to only return active categories
    		
  		// });
	});
