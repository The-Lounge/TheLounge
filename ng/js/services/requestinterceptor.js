angular.module('ays')
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('HttpRequestTimeoutInterceptor');
  })
  .factory('HttpRequestTimeoutInterceptor', function ($q, HttpPendingRequestsService) {
    return {
      request: function (config) {
        config = config || {};
        if (config.timeout === undefined && !config.noCancelOnRouteChange) {
          config.timeout = HttpPendingRequestsService.newTimeout();
        }
        return config;
      },
      responseError: function (response) {
        if (response.config.timeout.isGloballyCancelled) {
          return $q.defer().promise;
        }
        return $q.reject(response);
      },
    };
  })
  .service('HttpPendingRequestsService', function ($q) {
    var cancelPromises = [];

    function newTimeout() {
      var cancelPromise = $q.defer();
      cancelPromises.push(cancelPromise);
      return cancelPromise.promise;
    }

    function cancelAll() {
      angular.forEach(cancelPromises, function (cancelPromise) {
        cancelPromise.promise.isGloballyCancelled = true;
        cancelPromise.resolve();
      });
      cancelPromises.length = 0;
    }

    return {
      newTimeout: newTimeout,
      cancelAll: cancelAll,
    };
  });
