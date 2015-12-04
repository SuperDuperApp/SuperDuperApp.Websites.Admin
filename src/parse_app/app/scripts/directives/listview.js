'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:listView
 * @description
 * # listView
 */
angular.module('adminApp')
  .directive('listView', function ($timeout) {
    return {
      templateUrl: 'views/partials/list-view.html',
      restrict: 'E',
      scope: {
        title: '=',
        columns: '=',
        rows: '=',
        createModelObject: '=',
        updateModelObject: '=',
        deleteModelObject: '=',
        itemButtons: '=',
        loading: '=',
        resetColumns: '=',
        searchColumns: '=',
        choiceSearchColumns: '=',
        showChoiceFirst: '='
      },
      link: function postLink(scope, element) {
        scope.editItem = {};
        scope.choiceRows = [];
        scope.choiceColumns = [];
        scope.showChoice = scope.showChoiceFirst;
        scope.searchStr = '';
        scope.choiceSearchStr = '';
        scope.activeChoice = {};
        scope.colSortOrders = {};
        scope.choiceColSortOrders = {};

        scope.sort = function(property) {
          var sortOrder = 1;
          if(property[0] === '-') {
            sortOrder = -1;
            property = property.substr(1);
          }
          return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
          };
        };

        scope.choiceColumnHeaderClick = function(col) {

          var index = scope.choiceColumns.length;
          while (index--) {
            if (col.key !== scope.choiceColumns[index].key) {
              col.sortOrder = '';
            }
          }

          scope.choiceColSortOrders[col.key] = scope.choiceColSortOrders[col.key] || '';

          if (scope.choiceColSortOrders[col.key] === '-') {
            scope.choiceColSortOrders[col.key] = '';
          } else {
            scope.choiceColSortOrders[col.key] = '-';
          }

          scope.choiceRows.sort(scope.sort(scope.choiceColSortOrders[col.key] + col.key));
        };

        scope.columnHeaderClick = function(col) {

          var index = scope.columns.length;
          while (index--) {
            if (col.key !== scope.columns[index].key) {
              col.sortOrder = '';
            }
          }

          scope.colSortOrders[col.key] = scope.colSortOrders[col.key] || '';

          if (scope.colSortOrders[col.key] === '-') {
            scope.colSortOrders[col.key] = '';
          } else {
            scope.colSortOrders[col.key] = '-';
          }

          scope.rows.sort(scope.sort(scope.colSortOrders[col.key] + col.key));
        };

        scope.choiceSearchInputChange = function () {
          var str = scope.choiceSearchStr.toLowerCase();
          var index = scope.choiceRows.length;
          while(index--) {
            var row = scope.choiceRows[index];

            if (str.trim() === '') {
              row.show = true;
            } else {
              row.show = false;
              var colIndex = scope.choiceSearchColumns.length;
              while (colIndex--) {
                var col = scope.choiceSearchColumns[colIndex];
                var compare = row[col];

                if (compare.toLowerCase().indexOf(str) >= 0) {
                  row.show = true;
                  break;
                }
              }
            }
          }
        };

        scope.searchInputChange = function () {
          var str = scope.searchStr.toLowerCase();
          var index = scope.rows.length;
          while(index--) {
            var row = scope.rows[index];

            if (str.trim() === '') {
              row.show = true;
            } else {
              row.show = false;
              var colIndex = scope.searchColumns.length;
              while (colIndex--) {
                var col = scope.searchColumns[colIndex];
                var compare = row[col];

                if (compare.toLowerCase().indexOf(str) >= 0) {
                  row.show = true;
                  break;
                }
              }
            }
          }
        };

        scope.addCloseButtonClick = function() {
          // scope.resetColumns();
        };

        scope.chooseButtonClick = function(col, dataSource) {
          scope.activeChoice = col;
          scope.choiceColumns = dataSource.columns;
          scope.choiceRows = dataSource.rows;
          scope.showChoice = true;
        };

        scope.selectButtonClick = function(row) {
          var index = scope.choiceRows.length;
          while(index--) {
            scope.choiceRows[index].selected = false;
          }

          scope.activeChoice.model = row.model;
          scope.activeChoice.value = '';
          for ( var i = 0; i < scope.choiceColumns.length; i++) {
            var col = scope.choiceColumns[i];
            if (col.useAsSelectedLabel) {
              scope.activeChoice.value += row[col.key] + ' ';
            }
          }

          row.selected = true;

          for (var j = 0; j < scope.columns.length; j++) {
            var tempCol = scope.columns[j];
            if (tempCol.inputType === 'choice') {
              scope.editItem[tempCol.key] = scope.activeChoice.value;
              scope.editItem.choice = tempCol.model;
              break;
            }
          }

          scope.showChoice = false;
        };


        scope.editCloseButtonClick = function() {
          scope.editItem = {};
        };

        scope.saveButtonClick = function() {
          scope.createModelObject();
          $(element).find('.add-modal').modal('hide');
        };

        scope.updateButtonClick = function() {
          scope.updateModelObject(scope.editItem);
          $(element).find('.edit-modal').modal('hide');
        };

        scope.deleteButtonClick = function() {
          scope.deleteModelObject(scope.editItem);
          $(element).find('.edit-modal').modal('hide');
        };

        scope.viewButtonClick = function(row) {
          $timeout(function() {
            scope.$apply(function() {
              scope.viewItem = row;
            });
          });


          $(element).find('.read-modal').modal('show');
        };

        scope.addButtonClick = function() {
          scope.editMode = false;
          if (scope.showChoiceFirst) {

            for (var i = 0; i < scope.columns.length; i++) {
              var col = scope.columns[i];
              if (col.inputType === 'choice' ) {
                console.log(col);
                scope.chooseButtonClick(col, col.collection);
                break;
              }
            }
          }

          $(element).find('.add-modal input').val('');
          $(element).find('.add-modal').modal();
        };

        scope.editButtonClick = function(row) {
          scope.editItem = {};
          scope.editMode = true;
          scope.showChoice = false;


          for (var key in row) {
            scope.editItem[key] = row[key];
          }

          for (var i = 0; i < scope.columns.length; i++) {
            var col = scope.columns[i];

            if (col.inputType === 'rel' ) {
              scope.editItem[col.key] = row[col.key + 'Id'];
            } else if (col.inputType === 'choice' ) {
              scope.editItem[col.key] = row[col.key];
            } else {
              scope.editItem[col.key] = row[col.key];
            }

          }

          $(element).find('.edit-modal').modal('show');

        };
      }
    };
  });
