'use strict';

describe('Service: MatchPhotoService', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var MatchPhotoService;
  beforeEach(inject(function (_MatchPhotoService_) {
    MatchPhotoService = _MatchPhotoService_;
  }));

  it('should do something', function () {
    expect(!!MatchPhotoService).toBe(true);
  });

});
