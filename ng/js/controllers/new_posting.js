require('angular').module('ays')
  .controller('CreatePostingController', function ($scope, $sails, $timeout, $state) {
    $scope.categoryOptions = [];
    $scope.categoryDescription = '';
    $scope.titleErrorMessages = [];
    $scope.priceErrorMessages = [];
    $scope.descriptionErrorMessages = [];
    $scope.categoryErrorMessages = [];

    $scope.allInputValidated = false;
    $scope.titleValidated = false;
    $scope.pricesValidated = false;
    $scope.descriptionValidated = false;
    $scope.categoryValidated = false;
    $scope.isSubmitting = false;

    // Populate category options based on what server has
    $sails.get('/api/category')
      .then(function (response) {
        var i = 0;
        for (i = 0; i < response.data.length; i++) {
          $scope.categoryOptions.push(response.data[i].description);
        }
      });

    $scope.newPosting = {
      sellerID: '',
      id: '',
      title: '',
      categoryID: '',
      image: null,
      description: '',
      price: {
        minimum: '',
        maximum: '',
      },
      date: '',
      tags: '',
      skills: '',
      active: false,
    };

    // Simple helper function that resets the newposting object to default values.
    function getDisplayObject() {
      return {
        sellerID: '',
        id: '',
        title: '',
        categoryID: '',
        image: null,
        description: '',
        price: {
          minimum: '',
          maximum: '',
        },
        date: '',
        tags: '',
        skills: '',
        active: false,
      };
    }

    // Submit the form. Only gets called after validation occurs.
    $scope.submitForm = function () {
      $scope.newPosting.categoryID = $scope.categoryOptions.indexOf($scope.categoryDescription);
      $scope.isSubmitting = true;
      // Since we know these prices are validated in string form already, convert directly to floats
      $scope.newPosting.price.minimum = parseFloat($scope.newPosting.price.minimum);
      $scope.newPosting.price.maximum = parseFloat($scope.newPosting.price.maximum);
      
      if (isNaN($scope.newPosting.price.minimum)) {
        $scope.newPosting.price.minimum = null;
      } else if (isNaN($scope.newPosting.price.maximum)) {
        $scope.newPosting.price.maximum = null;
      }
      // Copy over the input data to a new object, then reset the scope variable
      var actual = angular.copy($scope.newPosting);
      $scope.newPosting = getDisplayObject();
      $scope.responseID = null;
      $sails.post('/api/posting', actual)
        .success(function (resp) {
          $state.go('posting', {id: resp.id});
        })
        .error(function (error) {
          console.log(error);
        })
        .then(function () {
          $scope.isSubmitting = false;
        });
    };
    $scope.validateForm = function () {
      if ($scope.pricesValidated && 
         $scope.titleValidated &&
         $scope.descriptionValidated &&
         $scope.categoryValidated) {
        $scope.allInputValidated = true;
      }
    };
    $scope.validateCategory = function () {
      $scope.categoryErrorMessages = [];
      $scope.categoryValidated = true;
      if ($scope.newPosting.category === '') {
        $scope.categoryValidated = false;
        $scope.categoryErrorMessages.push('You must select a category that your post belongs to');
      }
    };

    $scope.validateDescription = function () {
      var text = $scope.newPosting.description;
      $scope.descriptionErrorMessages = [];
      $scope.descriptionValidated = true;
      if (text.length < 1) {
        $scope.descriptionValidated = false;
        $scope.descriptionErrorMessages.push('A description of your post is required');
      }
    };
    // Ensure title is between 3-60 characters and is alphanumeric.
    // Add each valid error message to the messages array, not including
    // the length checks since its always one or the other
    $scope.validateTitle = function () {
      var text = $scope.newPosting.title;
      var empty = false;
      $scope.titleErrorMessages = [];// empty out message array on each attempt
      $scope.titleValidated = true;
      if (text.length === 0) {
        $scope.titleValidated = false;
        empty = true;
        $scope.titleErrorMessages.push('Title is required');
      } else if (text.length < 3) {
        $scope.titleValidated = false;
        $scope.titleErrorMessages.push('Title is too short');
      }
      if (text.length > 60) {
        $scope.titleValidated = false;
        $scope.titleErrorMessages.push('Title is too long');
      }
      if (!empty && !text.match(/^[\w ]*[^\W_][\w ]*$/)) {
        $scope.titleValidated = false;
        $scope.titleErrorMessages.push('Title is not alphanumeric');
      }
    };

    // Validate each price field. Gets called in 'focusableForm'
    // directive, based on which input field was last 'blurred',
    // or unfocused.
    $scope.validatePrices = function () {
      var lowPrice = $scope.newPosting.price.minimum;
      var highPrice = $scope.newPosting.price.maximum;
      var fLow = parseFloat(lowPrice.replace(/,/g, ''));
      var fHigh = parseFloat(highPrice.replace(/,/g, ''));
      var msg1 = 'Either the minimum or maximum price (or both if posting a price range) is required';
      var msg2 = 'Minimum price is invalid';
      var msg3 = 'Maximum price is invalid';
      var regex = /^([1-9]\d{0,2}(,\d{3})*|([1-9]\d*))(\.\d{2})?$/;
      $scope.priceErrorMessages = [];
      $scope.pricesValidated = true;
      // If min price is empty
      if (lowPrice === '') {
        // If high price is also empty, mark invalid
        if (highPrice === '') {
          $scope.pricesValidated = false;
          if ($scope.priceErrorMessages.indexOf(msg1) === -1) {
            $scope.priceErrorMessages.push(msg1);
          }
        }
      } else if (!lowPrice.match(regex)) { // If low price isnt empty, but has invalid input
        $scope.pricesValidated = false;
        if (lowPrice.includes('$')) {
          $scope.priceErrorMessages.push('Do not include a dollar sign in minimum price');
        } else {
          $scope.priceErrorMessages.push(msg2);
        }
      }
      // If max price is empty along with min price (will not repeat first 'if' since its in an if/else if block)
      if (highPrice === '') {
        if (lowPrice === '') {
          $scope.pricesValidated = false;
          if ($scope.priceErrorMessages.indexOf(msg1) === -1) {
            $scope.priceErrorMessages.push(msg1);
          }
        }
      } else if (!highPrice.match(regex)) {
        $scope.pricesValidated = false;
        if (highPrice.includes('$')) {
          $scope.priceErrorMessages.push('Do not include a dollar sign in maximum price');
        } else {
          $scope.priceErrorMessages.push(msg3);
        }
      }
      // Min is equal to or greater than max price
      if (fLow >= fHigh) {
        $scope.pricesValidated = false;
        // Don't want to include redundant error messages. 
        // If its not already saying its invalid, then include this message
        if (!$scope.priceErrorMessages.includes(msg2) && !$scope.priceErrorMessages.includes(msg3)) {
          $scope.priceErrorMessages.push('Minimum price must be less than the maximum price');
        }
      }
    };
  })

  // This directive is added to the form in createPost.html, used to execute validation
  // during the on-blur events.
  .directive('focusableForm', function ($timeout, $animate) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var FOCUSED_CLASS = 'focused';
        var inputElements = element.find('input');
        var textareas = element.find('textarea');
        var selects = element.find('select');

        angular.forEach(selects, function (value) {
          angular.element(value)
            .on('blur', function () {
              // Validate this input field when the user leaves that field
              if (value.id === 'categorySelector') {
                scope.validateCategory();
              }
              scope.validateForm();
              $timeout(function () {
                $animate.setClass(element, '', FOCUSED_CLASS);
              }, 0);
            });
        });
        // Check each textarea in the form, filter through each by the ID attribute,
        // then call their respective validation functions
        angular.forEach(textareas, function (value) {
          angular.element(value)
            .on('blur', function () {
              // Validate this input field when the user leaves that field
              if (value.id === 'postDescription') {
                scope.validateDescription();
              }
              scope.validateForm();
              $timeout(function () {
                $animate.setClass(element, '', FOCUSED_CLASS);
              }, 0);
            });
        });
        
        angular.forEach(inputElements, function (value) {
          angular.element(value)
            .on('focus', function () {
              $timeout(function () {
                $animate.setClass(element, FOCUSED_CLASS, '');
              }, 0);
            })
            .on('blur', function () {
              // Validate title field when user leaves the input element
              if (value.id === 'postTitle') {
                scope.validateTitle();
              }
              // Validate this input field when user leaves the field
              if (value.id === 'inputPriceLow' || value.id === 'inputPriceHigh') {
                scope.validatePrices();
              }
              // After validation on all input fields, validate the entire form
              scope.validateForm();
              scope.$apply();
              
              $timeout(function () {
                $animate.setClass(element, '', FOCUSED_CLASS);
              }, 0);
            });
        });
      },
    };
  });

