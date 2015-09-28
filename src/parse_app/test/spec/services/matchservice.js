'use strict';

describe('Service: MatchService', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var MatchService;
  beforeEach(inject(function (_MatchService_) {
    MatchService = _MatchService_;
  }));

  it('should do something', function () {
    expect(!!MatchService).toBe(true);
  });

});
