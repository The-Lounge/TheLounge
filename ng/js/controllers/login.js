'use strict';

require('angular').module('ays')

	.config(function($qProvider) {
		$qProvider.errorOnUnhandledRejections(false)
	})

	//Not working as intended yet. New story will be added soon
	.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
		$rootScope.$on('$routeChangeStart', function (event) {

			if (!Auth.isLoggedIn()) {
				//Deny
				event.preventDefault();
				$location.url('/login');
			}
			else {
				//Proceed
				$location.url('/home');
			}
		});
	}])
	
	.controller('LoginController', function($sails, $scope, $location, Auth) {

		//If user has cookie


		$scope.loginMessage = '';
	    $scope.credentials = {
	        'userName': '',
	        'password': ''
	    };

	    $scope.authenticate = function() {
	        $sails.post('/login', $scope.credentials)
	            .success(function(user) {
	            	Auth.setUser(user);
	                console.log("success!")
	                console.log(user);
	                $location.url('/home')
	            })
	            .error(function(data) {
	            	$scope.loginMessage = data.message;
	            })
	    };
	});