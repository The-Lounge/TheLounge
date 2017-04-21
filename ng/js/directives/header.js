angular.module('ays')

	/*Author: Tyler Russell
	 *Directive to be placed in various HTML headers for user management,
	 *login/logout navigation, etc.
	 */
	.directive('sessionheader', function(AuthService) {

		return {
			restrict: 'E',
			controller: function($scope, $sails) {
				$scope.loggedIn = false;
				$scope.data = {};

				AuthService.async().then(function authCallback(authorized) {
					if (authorized === 401) {} 
					else {
						$scope.data = authorized.data;
						$scope.loggedIn = true;
					}
				});

				$scope.logout = function() {
					$sails.get('/logout')
						.error(function(error) {
							console.log('Error calling /logout endpoint:\n' + error);
						})
						.then(function(res, req) {
							//Dunno what we would need to handle here, they should always be able to log out???
						})
				}
			},	
			//In /ng/views/
			templateUrl: 'views/sessionheader.html'		
		};
	});