'use strict';

/**
 * @ngdoc service
 * @name adminApp.ProductSeasonService
 * @description
 * # ProductSeasonService
 * Service in the adminApp.
 */
angular.module('adminApp')
  .service('ProductSeasonService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.items = [];
    this.list = function(cb) {
      console.log('ProductSeasonService::List');
      var service = this;
      var ProductSeason = Parse.Object.extend('ProductSeason');
      var query = new Parse.Query(ProductSeason);

      query.find({
        success: function(results) {
          console.log('ProductSeasonService::List::Success - ' + results.length);
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
