// Directive that can be added in case some HTML element contains a way
// to redirect to a page that requires authentication first. 
require('angular').module('ays')

  .directive('checkUser', ['$state', '$rootScope', 'UserService',
    function ($state, $rootScope, UserService) {
      return {
        link: function (scope, elem, attrs, ctrl) {
          $rootScope.$on('$stateChangeStart', function(e, curr, prev) {
            // if user doesnt have access to this state
            if (!curr.access.isFree && !UserService.isLogged) {
              e.preventDefault();
              $state.transitionTo('login');
            }
          });
        }
      }
  }]);