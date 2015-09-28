'use strict';

describe('Controller: BrandphotoCtrl', function () {

  // load the controller's module
  beforeEach(module('adminApp'));

  var BrandphotoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BrandphotoCtrl = $controller('BrandphotoCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
