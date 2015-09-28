'use strict';

describe('Controller: BrandCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var BrandCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BrandCtrl = $controller('BrandCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
