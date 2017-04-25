require('angular').module('ays')
  .controller('CreatePostingController', function ($scope, $sails) {

  	$scope.categoryOptions = [];
  	$scope.titleErrorMessages = [];
  	$scope.priceErrorMessages = [];
  	$scope.descriptionErrorMessages = [];

  	$scope.allInputValidated = false;
  	$scope.titleValidated = false;
  	$scope.pricesValidated = false;
  	$scope.descriptionValidated = false;

  	//Populate category options based on what server has
  	$sails.get('/category')
  	  .then(function (response) {
  		for(var i = 0; i < response.data.length; i++)
  		  $scope.categoryOptions.push(response.data[i].description) 
  	  })

  	$scope.newPosting = {
  		title: '',
  		priceHigh: '',
  		priceLow: '',
  		description: '',
  		category: '',
  	};
  	$scope.submitForm = function() {
  	  console.log('form submitted!');
  	};
  	$scope.validateForm = function() {
  		if($scope.pricesValidated && 
  			 $scope.titleValidated &&
  			 $scope.descriptionValidated)
  			$scope.allInputValidated = true;
  	}

  	$scope.validateDescription = function () {
  		$scope.descriptionErrorMessages = [];
  		$scope.descriptionValidated = true;
  		var text = $scope.newPosting.description;
  		if(text.length < 1) {
  			$scope.descriptionValidated = false;
  			$scope.descriptionErrorMessages.push('A description of your post is required');
  		}
  	}

  	// Ensure title is between 3-60 characters and is alphanumeric.
  	// Add each valid error message to the messages array, not including
  	// the length checks since its always one or the other
		$scope.validateTitle = function () {		
			$scope.titleErrorMessages = [];//empty out message array on each attempt
			var text = $scope.newPosting.title;
			var empty = false;
			$scope.titleValidated = true;
			if(text.length == 0) {
				$scope.titleValidated = false;
				empty = true;
				$scope.titleErrorMessages.push('Title is required');
			}
			else if(text.length < 3) {
				$scope.titleValidated = false;
				$scope.titleErrorMessages.push('Title is too short');
			}
			if(text.length > 60) {
				$scope.titleValidated = false;
				$scope.titleErrorMessages.push('Title is too long');
			}
			if(!empty && !text.match(/^[a-z0-9]+$/i)) {
				$scope.titleValidated = false;
				$scope.titleErrorMessages.push('Title is not alphanumeric');
			}
		};

		// Validate each price field. Gets called in 'focusableForm'
		// directive, based on which input field was last 'blurred',
		// or unfocused.
		$scope.validatePrices = function () {
  		$scope.priceErrorMessages = [];
  		$scope.pricesValidated = true;
  		var lowPrice = $scope.newPosting.priceLow;
  		var highPrice = $scope.newPosting.priceHigh;
  		var fLow = parseFloat(lowPrice);
  		var fHigh = parseFloat(highPrice);
  		var regex = /^(\$|)([1-9]\d{0,2}(\,\d{3})*|([1-9]\d*))(\.\d{2})?$/;
 
  		// If min price is empty
  		if(lowPrice == '') {
  			// If high price is also empty, mark invalid
  			if(highPrice == '') {
  				$scope.pricesValidated = false;
  				var msg = 'Either the minimum or maximum price (or both if posting a price range) is required';
  				if($scope.priceErrorMessages.indexOf(msg) == -1)
  					$scope.priceErrorMessages.push(msg);
  			}
  		}
  		// If low price isnt empty, but has invalid input
  		else if(!lowPrice.match(regex)) {
  			$scope.pricesValidated = false;
  			$scope.priceErrorMessages.push('Minimum price is invalid')
  		}
  		// If max price is empty along with min price (will not repeat first 'if' since its in an if/else if block)
  		if(highPrice == '') {
  			if(lowPrice == '') {
  				$scope.pricesValidated = false;
  				var msg = 'Either the minimum or maximum price (or both if posting a price range) is required';
  				if($scope.priceErrorMessages.indexOf(msg) == -1)
  					$scope.priceErrorMessages.push(msg);
  			}
  		}
  		else if(!highPrice.match(regex)) {
  			$scope.pricesValidated = false;
  			$scope.priceErrorMessages.push('Maximum price is invalid')	
  		}
  		// Min is equal to or greater than max price
  		if(fLow >= fHigh) {
  			$scope.pricesValidated = false;
  			$scope.priceErrorMessages.push('Minimum price must be less than the maximum price');
  		}
  	}
  })

  // This directive is added to the form in createPost, used to execute validation
  // during the on-blur events.
  .directive('focusableForm', function ($timeout, $animate) {
		return {
			restrict: 'A',
			link: function (scope, element, attr) {
				var FOCUSED_CLASS = 'focused';
				var input_elements = element.find('input');
				var textareas = element.find('textarea');

				// Check each textarea in the form, filter through each by the ID attribute,
				// then call their respective validation functions
				angular.forEach(textareas, function (value, key) {
					angular.element(value)
						.on('blur', function () {
							// Validate this input field when the user leaves that field
							if(value.id == 'postDescription') {
								scope.validateDescription();
							}
							scope.validateForm();
							$timeout(function () {
								$animate.setClass(element, '', FOCUSED_CLASS);
							}, 0);
						});
				});
				
				angular.forEach(input_elements, function (value, key) {
					angular.element(value)
						.on('focus', function () {
							$timeout(function () {
								$animate.setClass(element, FOCUSED_CLASS, '');
							}, 0);
						})
						.on('blur', function () {
							// Validate title field when user leaves the input element
							if(value.id == 'postTitle') {
								scope.validateTitle();
							}
							// Validate this input field when user leaves the field
							if(value.id == 'inputPriceLow' || value.id == 'inputPriceHigh') {
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
			}
		};
  });