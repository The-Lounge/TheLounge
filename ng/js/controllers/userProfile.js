/**
 * Author: Tyler Russell
 */
require('angular').module('ays')
  /*eslint-disable*/
  .controller('UserProfileController',
    ['$scope', '$state', 'SessionService', '$sails', 'AuthService', '$rootScope', 'PostingService', '$mdColors',
    function ($scope, $state, SessionService, $sails, AuthService, $rootScope, PostingService, $mdColors) {
      $scope.loading = true;
      /*eslint-enable*/
      function init() {
        $scope.user = SessionService.user;
        PostingService.getPostingsByUser().then(function (response) { // response
          if (response.status === 200) {
            $scope.usersPostings = response.data;
          }
        });
        $scope.loading = false;

        // TEST POSTINGS HERE, SINCE I CAN'T ACCESS THE MOCK ONES IN /mocks/
        // /*eslint-disable*/
        // $scope.usersPostings = [
        //   {
        //     price: {
        //       minimum: 12,
        //       maximum: null
        //     },
        //     description: "Test description of some kind!",
        //     title: "Ill cut your hair off for a small fee!",
        //     id: 1387420834729384
        //   },
        //   {
        //     price: {
        //       minimum: null,
        //       maximum: 20
        //     },
        //     description: "I like doing nails, so let me do yours!",
        //     title: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ae",
        //     id: 923847039283450
        //   },
        //   {
        //     price: {
        //       minimum: 1,
        //       maximum: 10
        //     },
        //     description: "Something descriptive something descriptive something
        // descriptive something descriptive something descriptive something descriptiveasdfasdfasdf",
        //     title: "Something brief",
        //     id: 102938491924
        //   }
        // ];
        // /*eslint-enable*/
      }
      init();
    }]);
