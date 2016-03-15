'use strict';

/**
 * @ngdoc service
 * @name adminApp.ProductService
 * @description
 * # ProductService
 * Service in the adminApp.
 */
angular.module('adminApp')
  .service('ProductService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function


    this.items = [];
    this.list = function(cb) {
      console.log('ProductService::List');
      var service = this;
      var Product = Parse.Object.extend('Product');
      var query = new Parse.Query(Product);
      query.limit(1000);
      query.ascending('color');
      query.find({
        success: function(results) {
          console.log('ProductService::List::Success - ' + results.length);

          service.items = results;
          if (cb) {
            cb();
          }
        },
        error: function(error) {
          alert('Error: ' + error.code + ' ' + error.message);
          if (cb) {
            cb();
          }
        }
      });
    };

    this.item = function(itemId, cb) {

      var service = this;
      var item = null;

      for (var i = 0; i < service.items.length; i++) {

      }

      if (item === null) {
        var Product = Parse.Object.extend('Product');
        var query = new Parse.Query(Product);

        query.get(itemId, {
          success: function(result) {
            if (cb) {
              cb(result);
            }
          },
          error: function(error) {
            alert('Error: ' + error.code + ' ' + error.message);
          }
        });
      }
    };
  });
