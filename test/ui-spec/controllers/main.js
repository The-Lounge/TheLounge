describe('Controller: MainCtrl', () => {
  // load the controller's module
  beforeEach(module('appApp'));

  let MainCtrl;
  let scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(($controller, $rootScope) => {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', () => {
    expect(MainCtrl.awesomeThings.length).toBe(3);
  });
});
