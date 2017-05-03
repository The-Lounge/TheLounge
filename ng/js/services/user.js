// Simply User service, so controllers can simply inject it
// and have easy access to user data
require('angular').module('ays')

  .factory('UserService', [function () {
    return {
      isLogged: false,
      data: {},
    };
  }]);
