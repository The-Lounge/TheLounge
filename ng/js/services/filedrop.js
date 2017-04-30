/**
 * Created by Greg on 12/1/2015.
 */
var angular = require('angular');
var $ = require('jquery');

angular.module('FileDrop', [])
  .value('fileTypesMap', [
    'dmg', 'rar', 'zip', 'tgz', 'iso', 'java', 'rb', 'py', 'c', 'php', 'cpp', 'ics', 'exe',
    'dat', 'xml', 'yml', 'sql', 'asp', 'h', 'css', 'html', 'js', 'less', 'scss', 'sass', '',
    ['ppt', 'pptx'], 'pps', 'key', 'opd', 'otp', '', '', '', '', '', '', '', '',
    'txt', 'rtf', 'doc', 'dot', 'docx', 'odt', 'ott', 'ods', 'ots', 'xls', 'dotx', 'xlsx', '',
    'gif', 'tga', 'eps', 'bmp', 'png', 'jpg', 'tiff', 'ai', 'psd', 'dwg', 'dxf', 'pdf', '',
    'mp4', 'avi', 'mov', 'mpg', 'qt', 'flv', 'm4v', '', '', '', '', '', '',
    'mp3', 'wav', 'aiff', 'aac', 'mid', '', '', '', '', '', '', 'file', '',
  ])
  .value('fileIcons', '')
  .provider('fileDropConfig', function () {
    var noop   = function () {};
    var config = {
      autoUpload    : true,
      fileLimit     : 1,
      allowTypes    : ['png', 'jpeg', 'jpg'],
      iconsPath     : './images/fdIconMap.png',
      iconMap       : null,
      iconDimensions: {w: 45, h: 51},
      iconColumns   : 13,
      defaultIcon   : {x: 11, y: 6},
      uploadURL     : '/',
      dragAndDrop   : true,

      onFileSelection     : noop,
      onFileUploadComplete: noop,
      onFileUploadProgress: noop,
      onFileUploadError   : noop,
      onFileRemove        : noop,
    };

    this.setOptions = function (opts) {
      Object.keys(opts).forEach(function (key) {
        config[key] = opts[key];
      });
    };

    this.$get = function fileDropFactory() {
      return config;
    };
  })
  .controller('fdFileDropCtrl', ['$scope', '$element', '$timeout', 'fdFileService', 'fileDropConfig',
    function ($scope, $element, $timeout, fs, config) {
      var xhr            = new XMLHttpRequest();
      $scope.state       = '';
      $scope.active      = 'active';
      $scope.error       = null;
      $scope.dragAndDrop = config.dragAndDrop;

      $timeout(function () {
        $scope.noTransclution = !$element[0].querySelector('[ng-transclude]').innerText;
      });

      if (!window.File || !window.FileList || !window.FileReader || !xhr.upload) {
        $scope.error = 'File Upload is not supported by your browser!';
      }

      $scope.files = fs.files;

      function handleEvent(callback) {
        return function (e) {
          e.stopPropagation();
          e.preventDefault();

          $scope.$apply(callback.bind(null, e));
        };
      }

      function triggerUpload(e) {
        var files = e.target.files || e.dataTransfer.files;
        Object.keys(files).forEach(function (index) {
          var file   = files[index];
          var result = fs.validateFile(file);
          if (result === true) {
            fs.files.push(file);
            config.onFileSelection(file);
          } else {
            config.onFileUploadError(result);
            $scope.error = result.message;
          }
        });
      }

      var el = $element[0];
      if (config.dragAndDrop) {
        var dropArea = el.querySelector('.fd-drop-area');
        dropArea.addEventListener('dragover', handleEvent(function () {
          $scope.state = 'fd-highlight';
        }), false);

        dropArea.addEventListener('dragleave', handleEvent(function () {
          $scope.state = '';
        }), false);

        dropArea.addEventListener('drop', handleEvent(function (e) {
          $scope.state = '';
          triggerUpload(e);
        }), false);
      }

      var fileInput = el.querySelector('.fd-file-select');
      fileInput.addEventListener('change', handleEvent(triggerUpload));
    }])
  .directive('fdFileDrop', [function () {
    return {
      restrict  : 'AE',
      template  : '<div class="fd-file-drop panel" ng-class="[\'fd-\' + active, state]">' +
      '<div class="fd-drop-area bg-primary" ng-show="dragAndDrop"></div>' +
      '<ul class="fd-file-list list-group"><fd-file-block ng-repeat="file in files" file="file"></fd-file-block></ul>' +
      '<span class="alert alert-danger" ng-bind="error" ng-show="error"></span>' +
      '<h3 class="wall" ng-show="noTransclution && dragAndDrop">Drag & Drop files here</h3>' +
      '<h3 class="well" ng-transclude></h3>' +

      '<div class="fd-input-wrapper panel-footer">' +
      '<input type="file" class="fd-file-select" multiple="multiple">' +
      '<button class="btn btn-primary" type="button">Browse</button>' +
      '</div>' +
      '</div>',
      transclude: true,
      scope     : true,
      controller: 'fdFileDropCtrl',
    };
  }])
  .service('fdFileService', ['fileDropConfig', 'fileTypesMap', '$q', '$rootScope',
    function (config, defaultIcons, $q, $rootScope) {
      var fs = {
        files          : [],
        validateFile   : function (f) {
          if (!f || !f.name && !f.fileName) {
            return new Error('Invalid file or no file to parse');
          }

          if (fs.files.length >= config.fileLimit) {
            return new Error('No more files can be uploaded');
          }

          var ext = f.name.split('.').pop().toLowerCase();
          if (config.allowTypes.indexOf(ext) === -1) {
            return new Error('File type of ' + ext + 'is not allowed.');
          }

          return true;
        },
        getIconPosition: function (f) {
          var ext   = f.name.split('.').pop().toLowerCase();
          var index = (config.iconMap || defaultIcons).reduce(function (foundIndex, type, curIndex) {
                return type.indexOf(ext) > -1 ? curIndex : foundIndex;
              }, -1);

          var iconPos = config.defaultIcon;
          if (ext && index > -1) {
            iconPos.x = index % config.iconColumns;
            iconPos.y = (index - iconPos.x) / config.iconColumns;
          }

          return iconPos;
        },
        uploadFile     : function (f) {
          // Were not using Angular $http because it doesn't support progress
          var defer    = $q.defer();
          var formData = new FormData();

          function applyScope(func) {
            return function (e) {
              $rootScope.$evalAsync(function () {
                func(e);
              });
            };
          }

          formData.append('FILE', f);
          formData.append('testField', 'value');

          $.ajax({
            type       : 'post',
            data       : formData,
            url        : config.uploadURL,
            success    : applyScope(defer.resolve),
            error      : applyScope(defer.reject),
            xhr        : function () {
              var xhr = new XMLHttpRequest();
              if (xhr.upload) {
                xhr.upload.onprogress = applyScope(defer.notify);
              }
              return xhr;
            },
            xhrFields  : {
              onprogress: applyScope(defer.notify),
            },
            processData: false,
            contentType: false,
          });

          return defer.promise;
        },
      };

      return fs;
    }])
  .directive('fdFileBlock', ['fileDropConfig', 'fdFileService', 'fileIcons', '$timeout',
    function (config, fs, iconSheet, $timeout) {
      return {
        restrict: 'E',
        // require: '^fdFileDrop',
        template: '<li class="list-group-item media" ng-class="{\'list-group-item-danger\': error}">' +
        '<div class="media-left media-top"><div class="media-object fd-icon"></div></div>' +
        '<div class="media-body">' +
        '<h4 class="media-heading" ng-bind="file.name || file.fileName"></h4>' +
        '<span class="text-danger" ng-if="upload === false" ng-bind="error || \'Error\'"></span>' +
        '<div ng-if="upload !== true && upload !== false" class="progress">' +
        '<div class="progress-bar progress-bar-success" ng-class="animate(upload)">{{ upload | number }}%</div>' +
        '</div>' +
        '<span ng-click="scope.removeFile(file)" class="fa fa-close"></span> ' +
        '</div>' +
        '</li>',
        replace : true,
        scope   : {file: '='},
        link    : function (scope, elem) {
          var iconPos  = fs.getIconPosition(scope.file);
          var offsetX = iconPos.x * config.iconDimensions.w;
          var offsetY = iconPos.y * config.iconDimensions.h;

          scope.upload = true;
          scope.removeFile = fs.removeFile;

          scope.animate = function (upload) {
            return upload === 100 ? ['active', 'progress-bar-striped'] : '';
          };

          scope.$watch('file', function (file /* , oldFile */) {
            scope.error  = null;
            scope.upload = 0;
            if (!config.autoUpload) {
              return;
            }

            fs.uploadFile(file).then(function done(resp) {
              scope.upload = true;
              console.info('complete', resp);
              config.onFileUploadComplete(resp);
            }, function error(err) {
              scope.upload = false;
              scope.error  = err.message || err.responseText || err.statusText;
              console.error(err);
              config.onFileUploadError(err);
            }, function progress(e) {
              if (e.lengthComputable) {
                scope.upload = (e.loaded / e.total) * 100;
              } else {
                scope.upload = 100;
              }

              angular.element(elem[0].querySelector('.progress-bar')).attr('style', 'width: ' + scope.upload + '%');
              console.log('progress:', scope.upload);
              config.onFileUploadProgress(e);
            });
          });

          $timeout(function () {
            angular.element(elem[0].querySelector('.fd-icon')).attr('style',
              'background: transparent url(' + config.iconsPath + ') -' + offsetX + 'px -' + offsetY + 'px');
          });
        },
      };
    }]);
