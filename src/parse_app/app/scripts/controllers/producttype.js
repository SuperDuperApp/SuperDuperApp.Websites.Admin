'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:ProducttypeCtrl
 * @description
 * # ProducttypeCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('ProductTypeCtrl', function ($scope, $rootScope) {
    $rootScope.activeView = 'product_type';
    $scope.title = 'Product Types';
    $scope.loading = true;
    $scope.rows = [];

    $scope.createRow = function(name, visible, model) {
      return {
        id: model.id,
        name: name,
        visible: visible,
        model: model,
        show: true
      };
    };

    $scope.searchColumns = ['name'];
    $scope.createColumns = function() {
      $scope.columns = [
        {
          label: 'Name',
          key: 'name',
          value: '',
          inputType: 'text',
          hidden: false
        },
        {
          label: 'Visible',
          key: 'visible',
          value: true,
          inputType: 'checkbox',
          hidden: false
        }
      ];

    };



    $scope.createModelObject = function() {
      $scope.loading = true;
      var ProductType = Parse.Object.extend('ProductType');
      var model = new ProductType();
      var obj = {};
      for (var i = 0; i < $scope.columns.length; i++) {
        var col = $scope.columns[i];
        obj[col.key] = col.value;
      }

      model.save(obj, {
        success: function() {
          $scope.listModelObjects();
        },
        error: function(model, error) {
          console.log('create ProductType Object failed');
          console.log(error);
        }
      });
    };

    $scope.updateModelObject = function(row) {
      $scope.loading = true;
      var model = row.model;

      for (var i = 0; i < $scope.columns.length; i++) {
        var col = $scope.columns[i];
        model.set(col.key, row[col.key]);
      }

      model.save(null, {
        success: function() {
          $scope.listModelObjects();
        },
        error: function(model, error) {
          console.log('update ProductType Object failed');
          console.log(error);
        }
      });
    };

    $scope.deleteModelObject = function(row) {
      $scope.loading = true;
      var model = row.model;
      model.destroy({
        success: function() {
          $scope.listModelObjects();
        },
        error: function(model, error) {
          console.log('destroying ProductType Object failed');
          console.log(error);
        }
      });
    };

    $scope.listModelObjects = function() {
      $scope.loading = true;
      var ProductType = Parse.Object.extend('ProductType');
      var query = new Parse.Query(ProductType);
      query.ascending('name');
      query.find({
        success: function(results) {
          $scope.rows = [];
          var temp = [];
          for(var i = 0; i < results.length; i++) {
            var obj = results[i];
            temp.push($scope.createRow(obj.get('name'), obj.get('visible'), obj));
          }
          $scope.$apply(function() {
            $scope.rows = temp;
            $scope.createColumns();
            $scope.loading = false;
          });
        },
        error: function(error) {
          alert('Error: ' + error.code + ' ' + error.message);
        }
      });

    };

    $scope.listModelObjects();
  });
