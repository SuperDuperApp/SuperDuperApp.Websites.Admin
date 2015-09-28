'use strict';

describe('Service: BrandPhotoService', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var BrandPhotoService;
  beforeEach(inject(function (_BrandPhotoService_) {
    BrandPhotoService = _BrandPhotoService_;
  }));

  it('should do something', function () {
    expect(!!BrandPhotoService).toBe(true);
  });

});
