'use strict';

describe('Directive: matchListView', function () {

  // load the directive's module
  beforeEach(module('adminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<match-list-view></match-list-view>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the matchListView directive');
  }));
});
