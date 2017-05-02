require('angular').module('ays')

  .controller('LoginController', function ($sails, $scope, $state, UserService) {
    var AUTH_TWICE = 'A user has already been authenticated for this session';
    $scope.loginMessage = '';
    $scope.credentials = {
      userName: '',
      password: '',
    };

    $scope.authenticate = function () {
      $sails.post('/api/login', $scope.credentials)
        .success(function (resp, data) {
          //successful
          if(data) {
            UserService.isLogged = true;
            UserService.data = data;
            $state.go('categories');
          } else {
            UserService.isLogged = false;
            UserService.username = '';
          }
        })
        .error(function (status) {
          if(status === AUTH_TWICE) {
            UserService.isLogged = true;
            $state.go('categories');
          } else {
            UserService.isLogged = false;
            UserService.username = '';
            $scope.loginMessage = 'Invalid username or password';
          }
        })
    };
});
