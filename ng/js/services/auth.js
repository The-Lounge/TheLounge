'use strict';

require('angular').module('ays')

	.factory('AuthService', function($sails) {

		var AuthService = {
			async: function() {
				// $http/$sails returns a promise, which has a then function, which also returns a promise
				var promise = $sails.get('/me')
					.then(function (response) {
						return response.status;
					});
				return promise;
			},
		};
		return AuthService;
	});
