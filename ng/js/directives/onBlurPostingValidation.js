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
 angular.module('ays')
  .directive('validateOnBlur', function ($timeout, $animate) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var FOCUSED_CLASS = 'focused';
        var inputElements = element.find('input');
        var textareas = element.find('textarea');
        var selects = element.find('md-select');

        angular.forEach(selects, function (value) {
          angular.element(value)
            .on('blur', function () {
              console.log('asdfasdf')
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
