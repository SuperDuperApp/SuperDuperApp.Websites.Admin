'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:ProductCtrl
 * @description
 * # ProductCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('ProductCtrl', function ($scope, $rootScope, $location, $timeout, ProductService, BrandService, ProductSeasonService, ProductTypeService) {
    $rootScope.activeView = 'product';
    $scope.title = 'Products';
    $scope.rows = [];
    $scope.columns = [];
    $scope.loading = true;

    $scope.showMatches = function(row) {
      $location.path('product/' + row.model.id + '/match');
    };

    $scope.showPhotos = function(row) {
      $location.path('product/' + row.model.id + '/photo');
    };


    $scope.itemButtons = [
      {
        label: 'Matches',
        action: $scope.showMatches,
        cls: 'btn-info'
      },
      {
        label: 'Photos',
        action: $scope.showPhotos,
        cls: 'btn-primary'
      }
    ];

    $scope.searchColumns = ['color', 'colorNumber', 'brand'];

    $scope.createColumns = function() {
      $scope.columns = [
        {
          label: '',
          key: 'hex',
          value: '',
          inputType: 'swatch',
          hidden: false
        },
        {
          label: 'Color',
          key: 'color',
          value: '',
          inputType: 'text',
          hidden: false
        },
        {
          label: 'Color #',
          key: 'colorNumber',
          value: '',
          inputType: 'text',
          hidden: false
        },
        {
          label: 'Brand',
          key: 'brand',
          value: '',
          inputType: 'rel',
          collection: $scope.brands,
          hidden: false
        },
        {
          label: 'Price',
          key: 'price',
          value: 0,
          inputType: 'number',
          hidden: true
        },
        {
          label: 'In Stock',
          key: 'inStock',
          value: false,
          inputType: 'checkbox',
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
          label: 'M',
          key: 'matchCount',
          value: '',
          inputType: 'none',
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
          label: 'Shopping Link',
          key: 'shoppingLinkVisible',
          value: false,
          inputType: 'checkbox',
          hidden: true
        },
        {
          label: '',
          key: 'shoppingLink',
          value: '',
          inputType: 'text',
          hidden: true
        },
        {
          label: 'Hex',
          key: 'hex',
          value: '',
          inputType: 'text',
          hidden: true
        },
        {
          label: 'Season',
          key: 'productSeason',
          value: '',
          inputType: 'rel',
          collection: $scope.productSeasons,
          hidden: true
        },
        {
          label: 'Type',
          key: 'productType',
          value: $scope.productTypes[0].id || '',
          inputType: 'rel',
          collection: $scope.productTypes,
          hidden: true
        },
        {
          label: 'Copy',
          key: 'displayCopy',
          value: '',
          inputType: 'textarea',
          hidden: true
        },
        {
          label: 'Notes',
          key: 'notes',
          value: '',
          inputType: 'textarea',
          hidden: true
        }
      ];
      $scope.loading = false;
    };

    $scope.createRow = function(model) {
      var brandLabel = '';
      var productSeasonLabel = '';
      var productTypeLabel = '';
      var brandId = null;
      var productSeasonId = null;
      var productTypeId = null;
      var brandModel = null;
      var productSeasonModel = null;
      var productTypeModel = null;

      if (model.get('brand')) {
        brandModel = $scope.findModelById(model.get('brand').id, $scope.brands);
      }

      if (model.get('productSeason')) {
        productSeasonModel = $scope.findModelById(model.get('productSeason').id, $scope.productSeasons);
      }

      if (model.get('productType')) {
        productTypeModel = $scope.findModelById(model.get('productType').id, $scope.productTypes);
      }

      if (brandModel) {
        brandLabel = brandModel.get('name');
        brandId = brandModel.id;
      }
      if (productSeasonModel) {
        productSeasonLabel = productSeasonModel.get('name');
        productSeasonId = productSeasonModel.id;
      }
      if (productTypeModel) {
        productTypeLabel = productTypeModel.get('name');
        productTypeId = productTypeModel.id;
      }

      return {
        id: model.id,
        photoCount: model.get('photoCount'),
        matchCount: model.get('matchCount'),
        hex: model.get('hex'),
        notes: model.get('notes'),
        color: model.get('color'),
        colorNumber: model.get('colorNumber'),
        displayCopy: model.get('displayCopy'),
        inStock: model.get('inStock'),
        price: model.get('price'),
        brand: brandLabel,
        productSeason: productSeasonLabel,
        productType: productTypeLabel,
        brandId: brandId,
        productSeasonId: productSeasonId,
        productTypeId: productTypeId,
        visible: model.get('visible'),
        shoppingLink: model.get('shoppingLink'),
        shoppingLinkVisible: model.get('shoppingLinkVisible'),
        show: true,
        model: model
      };
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
      $scope.loading = true;
      var Product = Parse.Object.extend('Product');
      var model = new Product();
      var obj = {};
      for (var i = 0; i < $scope.columns.length; i++) {
        var col = $scope.columns[i];
        if (col.inputType === 'rel') {
          obj[col.key] = $scope.findModelById(col.value, col.collection);
        } else if (col.inputType === 'none' || col.inputType === 'swatch'){
          // ignore
        } else {
          obj[col.key] = col.value;
        }

      }

      model.save(obj, {
        success: function() {
          $scope.listModelObjects();
        },
        error: function(model, error) {
          console.log('create Product Object failed');
          console.log(error);
        }
      });
    };

    $scope.updateModelObject = function(row) {
      $scope.loading = true;
      var model = row.model;

      for (var i = 0; i < $scope.columns.length; i++) {
        var col = $scope.columns[i];
        if (col.inputType === 'rel') {
          model.set(col.key, $scope.findModelById(row[col.key], col.collection));
        } else if (col.inputType === 'none' || col.inputType === 'swatch'){
            // ignore
        } else {
          model.set(col.key, row[col.key]);
        }
      }

      model.save(null, {
        success: function() {
          $scope.listModelObjects();
        },
        error: function(model, error) {
          console.log('update Product Object failed');
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
          console.log('destroying Product Object failed');
          console.log(error);
        }
      });
    };


    $scope.createProductTypeListItem = function(oName, model) {
      return {
        id: model.id,
        name: oName,
        model: model
      };
    };

    $scope.listProductTypeModelObjects = function() {
      if (ProductTypeService.items.length === 0) {
        ProductTypeService.list(function() {
          $scope.createProductTypeObjects(ProductTypeService.items);
        });
      } else {
        $scope.createProductTypeObjects(ProductTypeService.items);
      }
    };

    $scope.createProductTypeObjects = function(items) {
      var temp = [];
      for(var i = 0; i < items.length; i++) {
        var obj = items[i];
        temp.push($scope.createProductTypeListItem(obj.get('name'), obj));
      }

      $scope.productTypes = temp;
      $scope.listModelObjects();

    };


    $scope.createProductSeasonListItem = function(oName, model) {
      return {
        id: model.id,
        name: oName,
        model: model
      };
    };

    $scope.listProductSeasonModelObjects = function() {
      if (ProductSeasonService.items.length === 0) {
        ProductSeasonService.list(function() {
          $scope.createProductSeasonObjects(ProductSeasonService.items);
        });
      } else {
        $scope.createProductSeasonObjects(ProductSeasonService.items);
      }
    };

    $scope.createProductSeasonObjects = function(items) {
      var temp = [];
      for(var i = 0; i < items.length; i++) {
        var obj = items[i];
        temp.push($scope.createProductSeasonListItem(obj.get('name'), obj));
      }

      $scope.productSeasons = temp;
      $scope.listProductTypeModelObjects();

    };

    $scope.createBrandListItem = function(oName, model) {
      return {
        id: model.id,
        name: oName,
        model: model
      };
    };

    $scope.listBrandModelObjects = function() {
      $scope.loading = true;
      if (BrandService.items.length === 0) {
        BrandService.list(function() {
          $scope.createBrandObjects(BrandService.items);
        });
      } else {
        $scope.createBrandObjects(BrandService.items);
      }
    };

    $scope.createBrandObjects = function(items) {
      var temp = [];
      for(var i = 0; i < items.length; i++) {
        var obj = items[i];
        temp.push($scope.createBrandListItem(obj.get('name'), obj));
      }

      $scope.brands = temp;
      $scope.listProductSeasonModelObjects();

    };

    $scope.listModelObjects = function() {
      if (ProductService.items.length === 0) {
        ProductService.list(function() {
          $scope.createRowsFromList(ProductService.items);
        });
      } else {
        $scope.createRowsFromList(ProductService.items);
      }
    };

    $scope.createRowsFromList = function(items) {
      // var temp = [];
      // for(var i = 0; i < items.length; i++) {
      //   var obj = items[i];
      //   temp.push($scope.createRow(obj));
      // }

      $scope.rows = [];
      $scope.title = 'Products (' + items.length + ')';
      $scope.createColumns();

      console.log('finished');
      $scope.createPartialRows(items, 0, 50);
    };

    $scope.createPartialRows = function(items, idx, count) {
      var temp = [];
      for (var i = 0; i < count; i++) {
        if (i + idx >= items.length)
          break;

        var obj = items[idx + i];
        temp.push($scope.createRow(obj));
      }

      $scope.rows = $scope.rows.concat(temp);
      if (i >= count) {
        $timeout(function() {
          $scope.createPartialRows(items, idx + count, count);
        }, 10);
      }
    };

    $scope.rows = [];
    $scope.listBrandModelObjects();

  });
