'use strict';

require('angular').module('ays')

	.factory('Auth', function() {
		var user;

		return {
			setUser : function(aUser) {
				user = aUser;
			},
			isLoggedIn : function() {
				return(user) ? user : false;
			}
		}
	})