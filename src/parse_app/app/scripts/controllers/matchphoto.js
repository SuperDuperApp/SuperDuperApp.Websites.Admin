'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:MatchphotoCtrl
 * @description
 * # MatchphotoCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('MatchPhotoCtrl', function ($scope, $route, $timeout) {
    $scope.title = '';
    $scope.loading = true;
    $scope.product = {};
    $scope.productId = $route.current.params.productId;
    $scope.productName = '';
    $scope.matchId = $route.current.params.id;
    $scope.match = {};
    $scope.matchName = '';
    $scope.rows = [];

    $scope.createRow = function(name, image, displayCopy, orderIndex, visible, model) {
      return {
        id: model.id,
        name: name,
        image: image,
        displayCopy: displayCopy,
        orderIndex: orderIndex,
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
          label: 'Image',
          key: 'image',
          value: '',
          inputType: 'image',
          hidden: false
        },
        {
          label: 'Display Copy',
          key: 'displayCopy',
          value: '',
          inputType: 'text',
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
        }
      ];

      $scope.loading = false;
    };

    $scope.createModelObject = function() {
      $scope.loading = true;

      var MatchPhoto = Parse.Object.extend('MatchPhoto');
      var model = new MatchPhoto();
      var obj = {};
      var file = null;
      for (var i = 0; i < $scope.columns.length; i++) {
        var col = $scope.columns[i];

        if (col.inputType === 'image') {
          var name = 'photo.jpg';
          file = new Parse.File(name, col.value);
        } else {
          obj[col.key] = col.value;
        }
      }

      file.save().then(function() {
        // The file has been saved to Parse.
        model.set('image', file);

        model.save(obj, {
          success: function() {
            // The file has been saved to Parse.
            var relation = $scope.match.relation('photos');
            relation.add(model);
            $scope.match.save({
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
            console.log('create MatchPhoto Object failed');
            console.log(error);
          }
        });

      }, function(error) {
        console.log('error saving photo image ' + error);
      });
    };

    $scope.updateModelObject = function(row) {
      $scope.loading = true;
      var model = row.model;


      var file = null;
      for (var i = 0; i < $scope.columns.length; i++) {
        var col = $scope.columns[i];

        if (col.inputType === 'image') {
          if (typeof row[col.key] !== 'string') {
            var name = 'photo.jpg';
            file = new Parse.File(name, row[col.key]);
          }

        } else {
          model.set(col.key, row[col.key]);
        }
      }

      var saveObject = function() {
        model.save({
          success: function() {
            // The file has been saved to Parse.
            var relation = $scope.match.relation('photos');
            relation.add(model);
            $scope.match.save({
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
            console.log('create MatchPhoto Object failed');
            console.log(error);
          }
        });
      };

      if (file) {
        file.save().then(function() {
          // The file has been saved to Parse.
          model.set('image', file);
          saveObject();
        }, function(error) {
          console.log('error saving photo image ' + error);
        });
      } else {
        saveObject();
      }
    };

    $scope.deleteModelObject = function(row) {
      $scope.loading = true;
      var model = row.model;
      model.destroy({
        success: function() {
          $scope.listModelObjects();
        },
        error: function(model, error) {
          console.log('destroying MatchPhoto Object failed');
          console.log(error);
        }
      });
    };

    $scope.listModelObjects = function() {

      var relation = $scope.match.relation('photos');
      var query = relation.query();
      query.ascending('orderIndex');

      query.find({
        success: function(results) {
          $scope.rows = [];
          var temp = [];
          for(var i = 0; i < results.length; i++) {
            var obj = results[i];

            temp.push($scope.createRow(obj.get('name'), obj.get('image').url(), obj.get('displayCopy'), obj.get('orderIndex'), obj.get('visible'), obj));
          }
          $timeout(function() {
            $scope.$apply(function() {
              $scope.rows = temp;
              $scope.createColumns();
            });
          });

          $scope.match.set('photoCount', temp.length);
          $scope.match.save({
            success: function() {

            },
            error: function(model, error) {
              console.log('setting match photo count failed');
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
          $scope.title = 'Product Photos : ' + $scope.productName + ' : ' + $scope.matchName;
          $scope.listModelObjects();
        },
        error: function(error) {
          alert('Error: ' + error.code + ' ' + error.message);
        }
      });

    };

    $scope.getMatchModelObject = function() {
      var Match = Parse.Object.extend('Match');
      var query = new Parse.Query(Match);

      query.get($scope.matchId, {
        success: function(result) {
          $scope.match = result;
          $scope.match.get('match').fetch(
            {
              success: function(result) {
                $scope.matchName = result.get('color');
                $scope.getProductModelObject();
              },
              error: function(error) {
                console.log(error);
              }
            }
          );
        },
        error: function(error) {
          alert('Error: ' + error.code + ' ' + error.message);
        }
      });

    };

    $scope.getMatchModelObject();


  });
