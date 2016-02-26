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
      // {
      //   label: 'Photos',
      //   action: $scope.showPhotos,
      //   cls: 'btn-primary'
      // }
    ];

    $scope.createRow = function(model) {
      var parentId = '', parentName = '', parentModel = null;
      var photo1 = '', photo2 = '';

      if (model.get('parent')) {
        parentModel = $scope.findModelById(model.get('parent').id, $scope.brands);
        parentId    = parentModel.id;
        parentName  = parentModel.get('name');
      }

      if (model.get('photo1'))
        photo1 = model.get('photo1').url();

      if (model.get('photo2'))
        photo2 = model.get('photo2').url();

      return {
        id:           model.id,
        model:        model,
        name:         model.get('name'),
        visible:      model.get('visible'),
        parent:       parentName,
        parentId:     parentId,
        photo1:       photo1,
        photo1_name:  model.get('photo1_name'),
        photo1_desc:  model.get('photo1_desc'),
        photo2:       photo2,
        photo2_name:  model.get('photo2_name'),
        photo2_desc:  model.get('photo2_desc'),
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
          value: '',
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
          label: 'Photo 1',
          key: 'photo1',
          value: '',
          inputType: 'image',
          hidden: true
        },
        {
          label: 'Photo 1 Name',
          key: 'photo1_name',
          value: '',
          inputType: 'text',
          hidden: true
        },
        {
          label: 'Short Description',
          key: 'photo1_desc',
          value: '',
          inputType: 'textarea',
          hidden: true
        },
        {
          label: 'Photo 2',
          key: 'photo2',
          value: '',
          inputType: 'image',
          hidden: true
        },
        {
          label: 'Photo 2 Name',
          key: 'photo2_name',
          value: '',
          inputType: 'text',
          hidden: true
        },
        {
          label: 'Longer Description',
          key: 'photo2_desc',
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
        else if (col.inputType === 'image') {
          if (typeof col.value !== 'string') {
            var name = col.key + '.jpg';
            for (j = 0; j < $scope.columns.length; j++) {
              if ($scope.columns[j].key === col.key + '_name') {
                if ($scope.columns[j].value !== '')
                  name = $scope.columns[j].value + '.jpg';
                break;
              }
            }
            files.push(
              {
                key:    col.key,
                file:   new Parse.File(name, col.value)
              }
            );
          }
        }
        else if (col.inputType === 'none' || col.inputType === 'swatch') {
          // ignore
        } else {
          model[col.key] = col.value;
        }
      }

      if (files[0].file) {
        // photo1 save
        files[0].file.save().then(function() {
          model[files[0].key] = files[0].file;
          // photo2 save
          if (files[1] && files[1].file) {
            files[1].file.save().then(function() {
              model[files[1].key] = files[1].file;
              $scope.saveModelObject(model, false);
            });
          }
          else
            $scope.saveModelObject(model, false);
        });
      }
      else {
        $scope.saveModelObject(model, false);
      }
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
        else if (col.inputType === 'image') {
          if (typeof row[col.key] !== 'string') {
            var name = col.key + '.jpg';
            for (j = 0; j < $scope.columns.length; j++) {
              if ($scope.columns[j].key === col.key + '_name') {
                if (row[$scope.columns[j].key] !== '')
                  name = row[$scope.columns[j].key] + '.jpg';
                break;
              }
            }
            files.push(
              {
                key:    col.key,
                file:   new Parse.File(name, row[col.key])
              }
            );
          }
        }
        else if (col.inputType === 'none' || col.inputType === 'swatch'){
            // ignore
        }
        else {
          model.set(col.key, row[col.key]);
        }
      }

      if (files.length > 0 && files[0].file) {
        // photo1 save
        files[0].file.save().then(function() {
          model.set(files[0].key, files[0].file);
          // photo2 save
          if (files[1] && files[1].file) {
            files[1].file.save().then(function() {
              model.set(files[1].key, files[1].file);
              $scope.saveModelObject(model, true);
            });
          }
          else
            $scope.saveModelObject(model, true);
        });
      }
      else {
        $scope.saveModelObject(model, true);
      }
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
