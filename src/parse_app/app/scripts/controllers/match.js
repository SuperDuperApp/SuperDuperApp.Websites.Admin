'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:MatchCtrl
 * @description
 * # MatchCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('MatchCtrl', function ($scope, $rootScope, $route, $timeout, $location, ProductService, BrandService, ProductSeasonService, ProductTypeService) {
    $rootScope.activeView = 'product';
    $scope.title = 'Product - Matches';
    // $scope.titleLink = '#/product';

    $scope.rows = [];
    $scope.columns = [];
    $scope.loading = true;
    $scope.productId = $route.current.params.id;
    $scope.productName = '';
    $scope.products = [];
    $scope.brands = [];
    $scope.productChoiceDataSource = {columns: [], rows:[]};
    $scope.showChoiceFirst = true;
    $scope.choiceSearchColumns = ['color', 'brand'];

    $scope.showPhotos = function(row) {
      $location.path('product/' + $scope.productId + '/match/' + row.model.id + '/photo');
    };

    $scope.itemButtons = [
      {
        label: 'Photos',
        action: $scope.showPhotos,
        cls: 'btn-primary'
      }
    ];

    $scope.searchColumns = ['match'];
    $scope.createColumns = function() {
      $scope.columns = [
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
        },
        {
          label: 'References',
          key: 'references',
          value: '',
          inputType: 'textarea',
          hidden: true
        },
        {
          label: 'Match',
          key: 'match',
          value: 'None chosen.',
          inputType: 'choice',
          collection: $scope.productChoiceDataSource,
          model: null,
          hidden: false
        },
        {
          label: 'Brand',
          key: 'brand',
          value: '',
          inputType: 'none',
          hidden: false
        },
        {
          label: 'Order Index',
          key: 'orderIndex',
          value: 0,
          inputType: 'number',
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
      $scope.loading = false;
    };

    $scope.createRow = function(model) {
      var index = $scope.products.length;
      var matchLabel = '';
      var brandLabel = '';
      if (model.get('match')) {
        var matchId = model.get('match').id;

        while (index--) {
          var p = $scope.products[index];
          if (p.id === matchId) {
            matchLabel = p.get('color');
            var brand = p.get('brand');
            if (brand) {
              var bIndex = $scope.brands.length;
              while(bIndex--) {
                var b = $scope.brands[bIndex];
                if (b.id === brand.id) {
                  brandLabel = b.name;
                  break;
                }
              }
            }
            break;
          }
        }
      }

      return {
        id: model.id,
        displayCopy: model.get('displayCopy'),
        notes: model.get('notes'),
        references: model.get('references'),
        match: matchLabel,
        brand: brandLabel,
        visible: model.get('visible'),
        photoCount: model.get('photoCount'),
        model: model,
        orderIndex: model.get('orderIndex'),
        show: true
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
      var Match = Parse.Object.extend('Match');
      var model = new Match();
      var obj = {};

      for (var i = 0; i < $scope.columns.length; i++) {
        var col = $scope.columns[i];
        if (col.inputType === 'rel') {
          obj[col.key] = $scope.findModelById(col.value, col.collection);
        } else if (col.inputType === 'choice') {
          obj[col.key] = col.model;
        } else if (col.inputType === 'none' || col.inputType === 'swatch'){
          // ignore
        } else {
          obj[col.key] = col.value;
        }
      }

      model.save(obj, {
        success: function() {

          var relation = $scope.product.relation('matches');
          relation.add(model);

          $scope.product.save({
            success: function() {
              $scope.listModelObjects();
            },
            error: function(model, error) {
              console.log('create Product Object failed');
              console.log(error);
            }
          });
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
        } else if (col.inputType === 'choice') {
          model.set(col.key, row.choice);
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
      var relation = $scope.product.relation('matches');
      relation.remove(row.model);

      $scope.product.save({
        success: function() {
          $scope.listModelObjects();
        },
        error: function(model, error) {
          console.log('remove Product Match Object failed');
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

    $scope.createProductTypeObjects = function(items) {
      var temp = [];
      for(var i = 0; i < items.length; i++) {
        var obj = items[i];
        temp.push($scope.createProductTypeListItem(obj.get('name'), obj));
      }
      $scope.productTypes = temp;
      $scope.listProductModelObjects();
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

    $scope.createProductSeasonListItem = function(oName, model) {
      return {
        id: model.id,
        name: oName,
        model: model
      };
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

    $scope.listProductSeasonModelObjects = function() {
      if (ProductSeasonService.items.length === 0) {
        ProductSeasonService.list(function() {
          $scope.createProductSeasonObjects(ProductSeasonService.items);
        });
      } else {
        $scope.createProductSeasonObjects(ProductSeasonService.items);
      }
    };

    $scope.createBrandListItem = function(oName, model) {
      return {
        id: model.id,
        name: oName,
        model: model
      };
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

    $scope.listBrandModelObjects = function() {
      if (BrandService.items.length === 0) {
        BrandService.list(function() {
          $scope.createBrandObjects(BrandService.items);
        });
      } else {
        $scope.createBrandObjects(BrandService.items);
      }
    };

    $scope.createProductsFromList = function(items) {
      $scope.products = items;

      var cols = [
        {
          label: 'Color',
          key: 'color',
          value: '',
          inputType: 'text',
          useAsSelectedLabel: true
        },
        {
          label: 'Brand',
          key: 'brand',
          value: '',
          inputType: 'text',
          useAsSelectedLabel: true
        }
      ];
      var rows = [];
      for (var i = 0; i < $scope.products.length; i++) {
        var p = $scope.products[i];
        var brandLabel = '';
        var brand = p.get('brand');
        if (brand) {
          var bIndex = $scope.brands.length;
          while(bIndex--) {
            var b = $scope.brands[bIndex];
            if (b.id === brand.id) {
              brandLabel = b.name;
              break;
            }
          }
        }

        rows.push({
          color: p.get('color'),
          brand: brandLabel,
          model: p,
          selected: false,
          show: true
        });
      }

      $scope.productChoiceDataSource.columns = cols;
      $scope.productChoiceDataSource.rows = rows;

      $scope.listModelObjects();

    };

    $scope.listProductModelObjects = function() {

      if (ProductService.items.length === 0) {
        ProductService.list(function() {
          $scope.createProductsFromList(ProductService.items);
        });
      } else {
        $scope.createProductsFromList(ProductService.items);
      }
    };

    $scope.listModelObjects = function() {
      var relation = $scope.product.relation('matches');
      var query = relation.query();
      query.ascending('orderIndex');
      query.limit(1000);
      query.find({
        success: function(results) {

          $scope.rows = [];
          var temp = [];
          for(var i = 0; i < results.length; i++) {

            var obj = results[i];
            temp.push($scope.createRow(obj));
          }

          $timeout(function() {
            $scope.$apply(function() {
              $scope.rows = temp;
              $scope.createColumns();
            });
          });

          $scope.product.set('matchCount', temp.length);
          $scope.product.save({
            success: function() {

            },
            error: function(model, error) {
              console.log('setting match count failed');
              console.log(error);
            }
          });
        },
        error: function(error) {
          alert('Error: ' + error.code + ' ' + error.message);
        }
      });

    };

    $scope.getProductModelObject = function() {
      var Product = Parse.Object.extend('Product');
      var query = new Parse.Query(Product);

      query.get($scope.productId, {
        success: function(result) {
          $scope.product = result;
          $scope.productName = result.get('color');
          $scope.title = $scope.productName + ' - Matches';
          $scope.listBrandModelObjects();
        },
        error: function(error) {
          alert('Error: ' + error.code + ' ' + error.message);
        }
      });
    };

    $scope.getProductModelObject();
  });
