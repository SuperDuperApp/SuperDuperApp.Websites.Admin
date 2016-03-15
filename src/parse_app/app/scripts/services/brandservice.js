'use strict';

/**
 * @ngdoc service
 * @name adminApp.BrandService
 * @description
 * # BrandService
 * Service in the adminApp.
 */
angular.module('adminApp')
  .service('BrandService', function () {

    this.items = [];
    this.list = function(cb) {
      console.log('BrandService::List');
      var service = this;
      var Brand = Parse.Object.extend('Brand');
      var query = new Parse.Query(Brand);
      query.ascending('name');
      query.find({
        success: function(results) {
          console.log('BrandService::List::Success - ' + results.length);
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

    this.save = function(obj, cb) {

      var Brand = Parse.Object.extend('Brand');
      var model = new Brand();
      var service = this;
      model.save(obj, {
        success: function(result) {
          service.items.push(result);
          if (cb) {
            cb();
          }
        },
        error: function(model, error) {
          console.log('create Brand Object failed');
          console.log(error);
        }
      });
    };

    this.update = function(model, cb) {
      model.save(null, {
        success: function() {
          if (cb) {
            cb();
          }
        },
        error: function(model, error) {
          console.log('update Brand Object failed');
          console.log(error);
        }
      });
    };

    this.destroy = function(model, cb) {
      var service = this;
      model.destroy({
        success: function() {
          var position = service.items.map(function(item) { return item.id; }).indexOf(model.id);
          service.items.splice(position, 1);
          if (cb) {
            cb();
          }
        },
        error: function(model, error) {
          console.log('destroying Brand Object failed');
          console.log(error);
        }
      });
    };

    this.matchCount = function(brand, cb) {
      var Product = Parse.Object.extend('Product');
      var query = new Parse.Query(Product);

      query.greaterThanOrEqualTo('matchCount', 1);
      query.equalTo('brand', brand);
      query.find({
        success: function(results) {
          if (cb) {
            cb(results);
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
  });
