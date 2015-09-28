'use strict';

describe('Service: ProductTypeService', function () {

  // load the service's module
  beforeEach(module('adminApp'));

  // instantiate service
  var ProductTypeService;
  beforeEach(inject(function (_ProductTypeService_) {
    ProductTypeService = _ProductTypeService_;
  }));

  it('should do something', function () {
    expect(!!ProductTypeService).toBe(true);
  });

});
