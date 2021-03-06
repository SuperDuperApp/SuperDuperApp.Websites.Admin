'use strict';

describe('Directive: photoListView', function () {

  // load the directive's module
  beforeEach(module('adminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<photo-list-view></photo-list-view>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the photoListView directive');
  }));
});
