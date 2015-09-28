'use strict';

describe('Controller: ProducttypeCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var ProducttypeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProducttypeCtrl = $controller('ProducttypeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
