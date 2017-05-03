// Directive that can be added in case some HTML element contains a way
// to redirect to a page that requires authentication first. 
require('angular').module('ays')

  .directive('checkUser', ['$state', '$rootScope', 'UserService',
    function ($state, $rootScope, UserService) {
      return {
        link: function () {
          $rootScope.$on('$stateChangeStart', function (e, curr) {
            // if user doesnt have access to this state
            if (!curr.access.isFree && !UserService.isLogged) {
              e.preventDefault();
              $state.transitionTo('login');
            }
          });
        },
      };
  }]);
