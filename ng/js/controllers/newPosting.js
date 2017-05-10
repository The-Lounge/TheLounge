require('angular').module('ays')
  .controller('CreatePostingController', function ($window, $scope, $sails, $timeout, $state) {
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

    // Simple helper function that returns an empty posting object
    function emptyPosting() {
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
        active: true,
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
      $scope.newPosting = emptyPosting();
      $scope.responseID = null;
      $sails.post('/api/posting', actual)
        .then(function (resp) {
          $scope.isSubmitting = false;
          $state.go('posting.view', {id: resp.data.id});
        })
        .catch(function (error) {
          console.log(error);
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
        if($scope.priceErrorMessages.length > 0) {
          for (counter = 0; counter < $scope.priceErrorMessages.length; counter++) {
            if ($scope.priceErrorMessages[counter] === msg2 || $scope.priceErrorMessages[counter] === msg3) {
              flag = true;
            }
          }
          if (flag) {
            $scope.priceErrorMessages.push('Minimum price must be less than the maximum price');
          }
        } 
        else {
          $scope.priceErrorMessages.push('Minimum price must be less than the maximum price');
        }
      }
    };
  })

  /* This directive is added to the form in createPost.html, used 
   * to execute validation when the user unfocuses a field/on-blur event is fired.
   * Achieves on-blur validation by grabbing all input, textarea, and select elements
   * within the form tag this directive is located. Angular does not have core functionality
   * that allows you to elegantly restrict what element this is directive is added to. This 
   * is only so remember: THIS ONLY WORKS like so:
   * <form no-validate validate-on-blur>...</form>
   *
   * For each type of field, it calls .on('blur') and then calls a validation function
   * based on what the field's 'id' attribute is. It immediately calls an all-inclusive
   * validateForm() method within controller that manages the view the form is in.
   * Finally, it calls $timeout to change its focus immediately on blur, instead of 
   * just changing focus onto another element.
   */
  .directive('validateOnBlur', function ($timeout, $animate) {
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

