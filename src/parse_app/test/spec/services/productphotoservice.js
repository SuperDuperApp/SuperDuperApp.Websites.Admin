'use strict';

describe('Service: ProductPhotoService', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var ProductPhotoService;
  beforeEach(inject(function (_ProductPhotoService_) {
    ProductPhotoService = _ProductPhotoService_;
  }));

  it('should do something', function () {
    expect(!!ProductPhotoService).toBe(true);
  });

});
