require('angular').module('ays')

  .factory('UserService', [function() {
    return {
      isLogged: false,
      data: {},
    };
  }]);