'use strict';

describe('Service: ProductSeasonService', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var ProductSeasonService;
  beforeEach(inject(function (_ProductSeasonService_) {
    ProductSeasonService = _ProductSeasonService_;
  }));

  it('should do something', function () {
    expect(!!ProductSeasonService).toBe(true);
  });

});
