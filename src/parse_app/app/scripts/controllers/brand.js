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
        label:    'Photos',
        action:   $scope.showPhotos,
        cls:      'btn-primary'
      }
    ];

    $scope.createRow = function(model) {
      var parentId = '', parentName = '', parentModel = null;

      if (model.get('parent')) {
        parentModel = $scope.findModelById(model.get('parent').id, $scope.brands);
        parentId    = parentModel.id;
        parentName  = parentModel.get('name');
      }
      else {
        parentId    = -1;
        parentName  = 'None';
      }

      return {
        id:           model.id,
        model:        model,
        name:         model.get('name'),
        visible:      model.get('visible'),
        photoCount:   model.get('photoCount'),
        parent:       parentName,
        parentId:     parentId,
        shortDesc:    model.get('shortDesc'),
        longerDesc:   model.get('longerDesc'),
        keywords:     model.get('keywords'),
        show:         true
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
          label: 'Parent',
          key: 'parent',
          value: -1,
          inputType: 'rel',
          collection: $scope.brands,
          hidden: true
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
        },
        {
          label: 'Short Description (displays on Brands page)',
          key: 'shortDesc',
          value: '',
          inputType: 'textarea',
          hidden: true
        },
        {
          label: 'Longer Description (displays on individual brand page)',
          key: 'longerDesc',
          value: '',
          inputType: 'textarea',
          hidden: true
        },
        {
          label: 'Keywords',
          key: 'keywords',
          value: '',
          inputType: 'text',
          hidden: true
        },
      ];
    };

    $scope.listSort = function (a, b) {
      if (a.get('name') < b.get('name')) { return -1; }
      if (a.get('name') > b.get('name')) { return 1; }
      return 0;
    };

    $scope.findModelById = function(id, collection) {
      var index = collection.length;
      var result = null;
      while(index--) {
        var item = collection[index];
        if (item.id === id) {
          result = item.model;
          break;
        }
      }
      return result;
    };

    $scope.createModelObject = function() {
      var i, j;
      var model = {};
      var files = [];

      for (i = 0; i < $scope.columns.length; i++) {
        var col = $scope.columns[i];
        if (col.inputType === 'rel') {
          model[col.key] = $scope.findModelById(col.value, col.collection);
        }
        else if (col.inputType === 'none' || col.inputType === 'swatch') {
          // ignore
        } else {
          model[col.key] = col.value;
        }
      }

      $scope.saveModelObject(model, false);
    };

    $scope.saveModelObject = function(model, isUpdating) {
      if (isUpdating) {
        BrandService.update(model, function() {
          BrandService.items.sort($scope.listSort);
          $scope.listModelObjects();
        });
      }
      else {
        BrandService.save(model, function() {
          BrandService.items.sort($scope.listSort);
          $scope.listModelObjects();
        });
      }
    };

    $scope.updateModelObject = function(row) {
      var i, j;
      var model = row.model;
      var files = [];

      $scope.loading = true;

      for (i = 0; i < $scope.columns.length; i++) {
        var col = $scope.columns[i];
        if (col.inputType === 'rel') {
          model.set(col.key, $scope.findModelById(row[col.key], col.collection));
        }
        else if (col.inputType === 'none' || col.inputType === 'swatch'){
            // ignore
        }
        else {
          model.set(col.key, row[col.key]);
        }
      }

      $scope.saveModelObject(model, true);
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
      $scope.brands = [];
      $scope.brands.push(
        {
          id:     -1,
          name:   'None',
          model:  null
        }
      );

      for(var i = 0; i < items.length; i++) {
        var obj = items[i];
        if (!obj.get('parent')) {
          $scope.brands.push(
            {
              id:     obj.id,
              name:   obj.get('name'),
              model:  obj
            }
          );
        }
      }

      $scope.rows = [];
      var temp = [];
      for(var i = 0; i < items.length; i++) {
        var obj = items[i];
        temp.push($scope.createRow(obj));
      }
      //if (apply) {

      $timeout(function() {
        $scope.rows = temp;
        $scope.createColumns();
        $scope.loading = false;
        $scope.$apply();
      });
    };

    $scope.listModelObjects();

  });
