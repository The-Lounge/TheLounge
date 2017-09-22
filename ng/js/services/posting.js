require('angular').module('ays')
  .factory('PostingService', ['$sails', '$stateParams',
    function ($sails, $stateParams) {
      var postingService = {
        getPostingsByUser: function () {
          var promise = $sails.get('/api/posting/user/' + $stateParams.id + '/10')
            .then(function (response) {
              return response;
            })
            .catch(function (error) {
              return error;
            });
          return promise;
        },
      };
      return postingService;
    },
  ]);
