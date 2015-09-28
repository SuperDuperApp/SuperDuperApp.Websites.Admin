'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:matchListView
 * @description
 * # matchListView
 */
angular.module('adminApp')
  .directive('matchListView', function () {
    return {
      templateUrl: 'views/partials/match-list-view.html',
      restrict: 'E',
      scope: {
        title: '=',
        parentRefresh: '=',
        show: '=',
        product: '=',
        brands: '=',
        productSeasons: '=',
        productTypes: '=',
        existingMatches: '='
      },
      link: function postLink(scope, element) {
        scope.editItem = {};
        scope.rows = [];
        scope.columns = [];


        scope.closeButtonClick = function() {
          scope.show = false;
        };

        scope.selectButtonClick = function(row) {
          row.selected = !row.selected;
        };
        scope.saveButtonClick = function() {

          var relation = scope.product.relation('matches');
          for (var i = 0; i < scope.rows.length; i++) {
            var row = scope.rows[i];
            if (row.selected) {

              relation.add(row.model);
            }
          }

          scope.product.save({
            success: function() {
              scope.parentRefresh();
              scope.show = false;
              $(element).find('.add-modal').modal('hide');
            },
            error: function(model, error) {
              console.log('create Product Object failed');
              console.log(error);
            }
          });
        };

        scope.$watch('show', function() {
          if (scope.show) {
            $(element).find('.add-modal').modal('show');
            scope.listProductModelObjects();
          }
        });


        scope.createColumns = function() {
          scope.columns = [
            {
              label: 'Color',
              key: 'color',
              value: '',
              inputType: 'text'
            },
            {
              label: 'Color #',
              key: 'colorNumber',
              value: '',
              inputType: 'text'
            },
            /*{
             label: 'Copy',
             key: 'displayCopy',
             value: '',
             inputType: 'text'
             },
             {
             label: 'In Stock',
             key: 'inStock',
             value: false,
             inputType: 'checkbox'
             },*/
            {
              label: 'Price',
              key: 'price',
              value: '',
              inputType: 'number'
            },
            /*
             {
             label: 'References',
             key: 'references',
             value: '',
             inputType: 'text'
             },*/
            {
              label: 'Brand',
              key: 'brand',
              value: '',
              inputType: 'rel',
              collection: scope.brands
            },
            {
              label: 'Season',
              key: 'productSeason',
              value: '',
              inputType: 'rel',
              collection: scope.productSeasons
            },
            {
              label: 'Type',
              key: 'productType',
              value: '',
              inputType: 'rel',
              collection: scope.productTypes
            },
            /*
             {
             label: 'Visible',
             key: 'visible',
             value: true,
             inputType: 'checkbox'
             }*/
          ];
        };


        scope.findModelById = function(id, collection) {
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

        scope.createRow = function(model) {
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
            brandModel = scope.findModelById(model.get('brand').id, scope.brands);
          }

          if (model.get('productSeason')) {
            productSeasonModel = scope.findModelById(model.get('productSeason').id, scope.productSeasons);
          }

          if (model.get('productType')) {
            productTypeModel = scope.findModelById(model.get('productType').id, scope.productTypes);
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
            color: model.get('color'),
            colorNumber: model.get('colorNumber'),
            displayCopy: model.get('displayCopy'),
            inStock: model.get('inStock'),
            price: model.get('price'),
            references: model.get('references'),
            brand: brandLabel,
            productSeason: productSeasonLabel,
            productType: productTypeLabel,
            brandId: brandId,
            productSeasonId: productSeasonId,
            productTypeId: productTypeId,
            visible: model.get('visible'),
            model: model,
            selected: false
          };
        };


        scope.existingMatch = function(obj) {
          if (obj.id === scope.product.id) {
            return true;
          }

          var index = scope.existingMatches.length;
          while(index--) {
            var match = scope.existingMatches[index].model;
            if (match.id === obj.id) {
              return true;
            }
          }
          return false;
        };

        scope.listProductModelObjects = function() {
          var Product = Parse.Object.extend('Product');
          var query = new Parse.Query(Product);

          query.find({
            success: function(results) {
              scope.rows = [];
              var temp = [];
              for(var i = 0; i < results.length; i++) {
                var obj = results[i];
                if (!scope.existingMatch(obj)) {
                  temp.push(scope.createRow(obj));
                }
              }
              scope.$apply(function() {
                scope.rows = temp;
                scope.createColumns();
              });
            },
            error: function(error) {
              alert('Error: ' + error.code + ' ' + error.message);
            }
          });
        };



      }
    };
  });
