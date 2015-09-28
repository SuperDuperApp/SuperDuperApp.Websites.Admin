'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:BrandCtrl
 * @description
 * # BrandCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('BrandCtrl', function ($scope, $rootScope, $location, $timeout, BrandService) {
    $rootScope.activeView = 'brand';
    $scope.title = 'Brands';
    $scope.loading = true;
    $scope.rows = [];

    $scope.showPhotos = function(row) {
      $location.path('brand/' + row.model.id + '/photo');
    };

    $scope.itemButtons = [
      {
        label: 'Photos',
        action: $scope.showPhotos,
        cls: 'btn-primary'
      }
    ];

    $scope.createRow = function(name, visible, photoCount, model) {
      return {
        id: model.id,
        name: name,
        visible: visible,
        model: model,
        photoCount: photoCount,
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
        },
        {
          label: 'P',
          key: 'photoCount',
          value: '',
          inputType: 'none',
          hidden: false
        }
      ];
    };

    $scope.listSort = function (a, b) {
      if (a.get('name') < b.get('name')) { return -1; }
      if (a.get('name') > b.get('name')) { return 1; }
      return 0;
    };

    $scope.createModelObject = function() {
      var obj = {};
      for (var i = 0; i < $scope.columns.length; i++) {
        var col = $scope.columns[i];
        if (col.inputType === 'none' || col.inputType === 'swatch'){
          // ignore
        } else {
          obj[col.key] = col.value;
        }
      }

      BrandService.save(obj, function() {
        BrandService.items.sort($scope.listSort);
        $scope.listModelObjects();
      });

    };

    $scope.updateModelObject = function(row) {
      $scope.loading = true;
      var model = row.model;

      for (var i = 0; i < $scope.columns.length; i++) {
        var col = $scope.columns[i];
        model.set(col.key, row[col.key]);
      }

      BrandService.update(model, function() {
        BrandService.items.sort($scope.listSort);
        $scope.listModelObjects();
      });
    };

    $scope.deleteModelObject = function(row) {
      $scope.loading = true;
      var model = row.model;
      BrandService.destroy(model, function() {
        $scope.listModelObjects();
      });
    };


    $scope.listModelObjects = function() {
      if (BrandService.items.length === 0) {
        BrandService.list(function() {
          $scope.createRowsFromList(BrandService.items, true);
        });
      } else {
        $scope.createRowsFromList(BrandService.items, false);
      }
    };

    $scope.createRowsFromList = function(items) {
      $scope.rows = [];
      var temp = [];
      for(var i = 0; i < items.length; i++) {
        var obj = items[i];
        temp.push($scope.createRow(obj.get('name'), obj.get('visible'), obj.get('photoCount'), obj));
      }
      //if (apply) {

      $timeout(function() {
        $scope.rows = temp;
        $scope.createColumns();
        $scope.loading = false;
        $scope.$apply();
      });





    /*
    } else {
          $scope.rows = temp;
          $scope.createColumns();
          $scope.loading = false;
      }
      //$scope.$apply();
      if (!$rootScope.$$phase) { $rootScope.$apply(); }
  */
    };

    $scope.listModelObjects();


  });
