'use strict';

describe('Service: BrandService', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var BrandService;
  beforeEach(inject(function (_BrandService_) {
    BrandService = _BrandService_;
  }));

  it('should do something', function () {
    expect(!!BrandService).toBe(true);
  });

});
