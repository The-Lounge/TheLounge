require('angular').module('ays')
  .controller('CreatePostingController',
    ['$window', '$scope', '$sails', '$timeout', '$state', 'SessionService',
    function ($window, $scope, $sails, $timeout, $state, SessionService) {
      $scope.postingCategories = [];
      $scope.selectedCategoryDescription = '';
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
          var i = null;
          for (i = 0; i < response.data.length; i++) {
            $scope.postingCategories.push(response.data[i]);
          }
        });

      // dont change these field names!
      $scope.newPosting = {
        sellerId: '',
        title: '',
        categoryId: '',
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

      // Helper that grabs the categoryId for a given categoryDescription
      var parseCategoriesForCreation = function (categoryDescription) {
        var i = null;
        for (i = 0; i < $scope.postingCategories.length; i++) {
          if ($scope.postingCategories[i].description === categoryDescription) {
            $scope.newPosting.categoryId = $scope.postingCategories[i].id;
            break;
          }
        }
      };

      // Submit the form. Only gets called after validation occurs.
      $scope.submitForm = function () {
        $scope.validateForm();
        parseCategoriesForCreation($scope.categoryDescription);
        $scope.isSubmitting = true;
        // Since we know these prices are validated in string form already, convert directly to floats
        $scope.newPosting.price.minimum = parseFloat($scope.newPosting.price.minimum);
        $scope.newPosting.price.maximum = parseFloat($scope.newPosting.price.maximum);

        if (isNaN($scope.newPosting.price.minimum)) {
          $scope.newPosting.price.minimum = null;
        } else if (isNaN($scope.newPosting.price.maximum)) {
          $scope.newPosting.price.maximum = null;
        }
        $scope.newPosting.sellerId = SessionService.user.id;
        // Copy over the input data to a new object, then reset the scope variable
        var actual = angular.copy($scope.newPosting);
        $sails.post('/api/posting', actual)
          .then(function (resp) {
            $scope.isSubmitting = false;
            $state.go('posting.view', {id: resp.data.id});
          })
          .catch(function (err) {
            console.log(err);
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
        if ($scope.categoryDescription === '') {
          $scope.categoryValidated = false;
          $scope.categoryErrorMessages.push('You must select a category that your post most closely belongs to.');
        }
      };

      $scope.validateDescription = function () {
        var text = $scope.newPosting.description;
        $scope.descriptionErrorMessages = [];
        $scope.descriptionValidated = true;
        if (text.length < 1) {
          $scope.descriptionValidated = false;
          $scope.descriptionErrorMessages.push('A description of your post is required');
        } else if (text.length > 200) {
          $scope.descriptionValidated = false;
          $scope.descriptionErrorMessages.push('The description must be at most 200 characters.');
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
        // ensure title is alphanumeric and allows period, comma, colon, parentheses, spaces
        if (!empty && !text.match(/^[a-zA-Z0-9 .,():]*$/)) {
          $scope.titleValidated = false;
          $scope.titleErrorMessages.push('Title is not valid');
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
        var msg1 = 'Either the minimum or maximum price (or both for a range) is required';
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
          if ($window.document.getElementById('inputPriceLow').value.indexOf('$') >= 0) {
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
          if ($window.document.getElementById('inputPriceHigh').value.indexOf('$') >= 0) {
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
          // IE11 retardant
          var counter;
          var flag = false;
          if ($scope.priceErrorMessages.length > 0) {
            for (counter = 0; counter < $scope.priceErrorMessages.length; counter++) {
              if ($scope.priceErrorMessages[counter] === msg2 || $scope.priceErrorMessages[counter] === msg3) {
                flag = true;
              }
            }
            if (flag) {
              $scope.priceErrorMessages.push('Minimum price must be less than the maximum price');
            }
          } else {
            $scope.priceErrorMessages.push('Minimum price must be less than the maximum price');
          }
        }
      };
    },
  ]);
