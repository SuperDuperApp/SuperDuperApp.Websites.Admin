'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:ProductCtrl
 * @description
 * # ProductCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('ProductCtrl', function ($scope, $rootScope, $location, $timeout, ProductService, BrandService, ProductTypeService) {
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
          label: 'Product Visible',
          key: 'visible',
          value: true,
          defaultValue: true,
          inputType: 'checkbox',
          hidden: true
        },
        {
          label: 'In Stock',
          key: 'inStock',
          value: true,
          defaultValue: true,
          inputType: 'checkbox',
          hidden: true
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
          value: -1,
          defaultValue: -1,
          inputType: 'rel',
          collection: $scope.brands,
          hidden: false
        },
        {
          label: 'Sub-brand',
          key: 'subBrand',
          value: -1,
          defaultValue: -1,
          inputType: 'rel',
          collection: $scope.subbrands,
          hidden: true
        },
        {
          label: 'Visible',
          key: 'displayVisible',
          value: true,
          hiddenPopup: true,
          inputType: 'checkbox',
          hidden: false
        },
        {
          label: 'In Stock',
          key: 'displayInStock',
          value: true,
          inputType: 'checkbox',
          hiddenPopup: true,
          hidden: false
        },
        {
          label: 'Collection',
          key: 'collection',
          value: '',
          inputType: 'text',
          hidden: true
        },
        {
          label: 'Release Date',
          key: 'releaseDate',
          value: '',
          inputType: 'text',
          hidden: true
        },
        {
          label: 'Hex code',
          key: 'hex',
          value: '',
          inputType: 'text',
          hidden: true
        },
        {
          label: 'Price',
          key: 'price',
          value: 0,
          inputType: 'number',
          hidden: true
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
          label: 'Description',
          key: 'description',
          value: '',
          inputType: 'textarea',
          hidden: true
        },

        {
          label: 'Links to External Swatches',
          key: '',
          value: '',
          inputType: 'label',
          hidden: true
        },
        {
          label: 'External link 1 Visible',
          key: 'externalLinkVisible',
          value: false,
          inputType: 'checkbox',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'External link 1',
          key: 'externalLink',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'Link Text',
          key: 'externalLinkText',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'External link 2 Visible',
          key: 'externalLinkVisible2',
          value: false,
          inputType: 'checkbox',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'External link 2',
          key: 'externalLink2',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'Link Text',
          key: 'externalLinkText2',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'External link 3 Visible',
          key: 'externalLinkVisible3',
          value: false,
          inputType: 'checkbox',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'External link 3',
          key: 'externalLink3',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'Link Text',
          key: 'externalLinkText3',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },

        {
          label: '"Buy" Buttons',
          key: '',
          value: '',
          inputType: 'label',
          hidden: true
        },
        {
          label: 'Shopping link 1 Visible',
          key: 'shoppingLinkVisible',
          value: false,
          inputType: 'checkbox',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'Shopping link 1',
          key: 'shoppingLink',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'button text',
          key: 'shoppingLinkText',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'Shopping link 2 Visible',
          key: 'shoppingLinkVisible2',
          value: false,
          inputType: 'checkbox',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'Shopping link 2',
          key: 'shoppingLink2',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'button text',
          key: 'shoppingLinkText2',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'Shopping link 3 Visible',
          key: 'shoppingLinkVisible3',
          value: false,
          inputType: 'checkbox',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'Shopping link 3',
          key: 'shoppingLink3',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },
        {
          label: 'button text',
          key: 'shoppingLinkText3',
          value: '',
          inputType: 'text',
          marginLeft: 20,
          hidden: true
        },

        {
          label: 'Keywords',
          key: 'keywords',
          value: '',
          inputType: 'text',
          hidden: true
        },
        {
          label: 'Notes',
          key: 'notes',
          value: '',
          inputType: 'textarea',
          hidden: true
        },
        {
          label: 'Type',
          key: 'productType',
          value: $scope.productTypes[0].id || '',
          defaultValue: $scope.productTypes[0].id || '',
          inputType: 'rel',
          collection: $scope.productTypes,
          hidden: true
        },
      ];
      $scope.loading = false;
    };

    $scope.createRow = function(model) {
      var brandLabel = '', brandId = null, brandModel = null;
      var subBrandLabel = '', subBrandId = null, subBrandModel = null;
      var productTypeLabel = '', productTypeId = null, productTypeModel = null;

      if (model.get('brand')) {
        brandModel = $scope.findModelById(model.get('brand').id, $scope.brands);
        if (brandModel) {
          brandLabel = brandModel.get('name');
          brandId    = brandModel.id;
        }
        else {
          brandLabel = 'None';
          brandId    = -1;
        }
      }
      else {
        brandLabel = 'None';
        brandId    = -1;
      }

      if (model.get('subBrand')) {
        subBrandModel = $scope.findModelById(model.get('subBrand').id, $scope.subbrands);
        if (subBrandModel) {
          subBrandLabel = subBrandModel.get('name');
          subBrandId    = subBrandModel.id;
        }
        else {
          subBrandLabel = 'None';
          subBrandId    = -1;
        }
      }
      else {
        subBrandLabel = 'None';
        subBrandId    = -1;
      }

      if (model.get('productType')) {
        productTypeModel = $scope.findModelById(model.get('productType').id, $scope.productTypes);
        if (productTypeModel) {
          productTypeLabel = productTypeModel.get('name');
          productTypeId    = productTypeModel.id;
        }
      }

      return {
        id: model.id,
        visible: model.get('visible'),
        inStock: model.get('inStock'),
        color: model.get('color'),
        colorNumber: model.get('colorNumber'),
        photoCount: model.get('photoCount'),
        matchCount: model.get('matchCount'),
        
        brandId: brandId,
        brand: brandLabel,
        subBrandId: subBrandId,
        subBrand: subBrandLabel,

        displayVisible: model.get('visible'),
        displayInStock: model.get('inStock'),

        collection: model.get('collection'),
        releaseDate: model.get('releaseDate'),
        hex: model.get('hex'),
        price: model.get('price'),
        description: model.get('description'),

        externalLinkVisible: model.get('externalLinkVisible'),
        externalLink: model.get('externalLink'),
        externalLinkText: model.get('externalLinkText'),
        externalLinkVisible2: model.get('externalLinkVisible2'),
        externalLink2: model.get('externalLink2'),
        externalLinkText2: model.get('externalLinkText2'),
        externalLinkVisible3: model.get('externalLinkVisible3'),
        externalLink3: model.get('externalLink3'),
        externalLinkText3: model.get('externalLinkText3'),

        shoppingLinkVisible: model.get('shoppingLinkVisible'),
        shoppingLink: model.get('shoppingLink'),
        shoppingLinkText: model.get('shoppingLinkText'),
        shoppingLinkVisible2: model.get('shoppingLinkVisible2'),
        shoppingLink2: model.get('shoppingLink2'),
        shoppingLinkText2: model.get('shoppingLinkText2'),
        shoppingLinkVisible3: model.get('shoppingLinkVisible3'),
        shoppingLink3: model.get('shoppingLink3'),
        shoppingLinkText3: model.get('shoppingLinkText3'),

        keywords: model.get('keywords'),
        notes: model.get('notes'),
        productType: productTypeLabel,
        productTypeId: productTypeId,

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
        } else if (col.inputType === 'none' || col.inputType === 'swatch' || col.inputType === 'label'){
          // ignore
        } else {
          obj[col.key] = col.value;
        }

      }

      model.save(obj, {
        success: function() {
          var new_row = $scope.createRow(model);
          $scope.rows.unshift(new_row);
          ProductService.items.push(model);
          $scope.updateTitle(ProductService.items.length);
          $scope.$apply();
          // $scope.listModelObjects();
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
        } else if (col.inputType === 'none' || col.inputType === 'swatch' || col.inputType === 'label'){
            // ignore
        } else {
          model.set(col.key, row[col.key]);
        }
      }

      model.save(null, {
        success: function() {
          var i = 0;
          for (i = 0; i < $scope.rows.length; i++) {
            if (model.id === $scope.rows[i].id)
              break;
          }

          if (i < $scope.rows.length) {
            $scope.rows[i] = $scope.createRow(model);
            ProductService.items[i] = model;
            $scope.$apply();
          }
          // $scope.listModelObjects();
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
      var model_id = model.id;

      model.destroy({
        success: function() {
          var i = 0;
          for (i = 0; i < $scope.rows.length; i++) {
            if (model_id === $scope.rows[i].id)
              break;
          }

          if (i < $scope.rows.length) {
            $scope.rows.splice(i, 1);
            ProductService.items.splice(i, 1);
            $scope.updateTitle(ProductService.items.length);
            $scope.$apply();
          }
          // $scope.listModelObjects();
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

    $scope.brands    = [];
    $scope.subbrands = [];

    $scope.createBrandObjects = function(items) {
      var brands = [], subbrands = [];

      brands.push(
        {
          id:     -1,
          name:   'None',
          model:  null
        }
      );
      subbrands.push(
        {
          id:     -1,
          name:   'None',
          model:  null
        }
      );

      for(var i = 0; i < items.length; i++) {
        var obj = items[i];
        brands.push($scope.createBrandListItem(obj.get('name'), obj));
        if (obj.get('parent'))
          subbrands.push($scope.createBrandListItem(obj.get('name'), obj));
      }

      $scope.brands    = brands;
      $scope.subbrands = subbrands;

      $scope.listProductTypeModelObjects();
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

    $scope.updateTitle = function(count) {
      $scope.title = 'Products (' + count + ')';
    };

    $scope.createRowsFromList = function(items) {
      // var temp = [];
      // for(var i = 0; i < items.length; i++) {
      //   var obj = items[i];
      //   temp.push($scope.createRow(obj));
      // }

      $scope.rows = [];
      $scope.updateTitle(items.length);
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
