'use strict';

/**
 * @ngdoc service
 * @name adminApp.ProductTypeService
 * @description
 * # ProductTypeService
 * Service in the adminApp.
 */
angular.module('adminApp')
  .service('ProductTypeService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.items = [];
    this.list = function(cb) {
      var service = this;
      var ProductType = Parse.Object.extend('ProductType');
      var query = new Parse.Query(ProductType);

      query.find({
        success: function(results) {
          service.items = results;
          if (cb) {
            cb();
          }
        },
        error: function(error) {
          alert('Error: ' + error.code + ' ' + error.message);
        }
      });
    };

  });
