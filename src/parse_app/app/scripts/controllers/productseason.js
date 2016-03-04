'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:ProductseasonCtrl
 * @description
 * # ProductseasonCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('ProductSeasonCtrl', function ($scope, $rootScope) {
    $rootScope.activeView = 'product_season';
    $scope.title = 'Product Seasons';
    $scope.loading = true;
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

    $scope.rows = [];

    $scope.createModelObject = function() {
      $scope.loading = true;
      var ProductSeason = Parse.Object.extend('ProductSeason');
      var model = new ProductSeason();
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
          console.log('create ProductSeason Object failed');
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
          console.log('update ProductSeason Object failed');
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
          console.log('destroying ProductSeason Object failed');
          console.log(error);
        }
      });
    };

    $scope.listModelObjects = function() {
      var ProductSeason = Parse.Object.extend('ProductSeason');
      var query = new Parse.Query(ProductSeason);
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
