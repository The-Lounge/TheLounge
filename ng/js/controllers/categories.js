/**
 * Created by Brianna on 4/4/2017.
 */
require('angular').module('ays')
  .controller('CategoriesController', ['$sails', '$scope',
    function ($sails, $scope) {
        $scope.category = {};
    }]);
