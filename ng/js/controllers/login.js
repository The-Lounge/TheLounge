require('angular').module('ays')
  .config(function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  })

  .controller('LoginController', function ($sails, $scope, $state) {
    $scope.loginMessage = '';
    $scope.credentials = {
      userName: '',
      password: '',
    };

    $scope.authenticate = function () {
      $sails.post('/login', $scope.credentials)
        .success(function () {})
        .error(function () {
          $scope.loginMessage = 'Invalid username or password';
        })
        .then(function (resp) {
          if (resp.status === 200) {
            $state.go('home');
          }
        });
    };
});
