'use strict';

describe('Controller: ProductseasonCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ProductseasonCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductseasonCtrl = $controller('ProductseasonCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
