'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, BrandService) {
    $rootScope.activeView = 'home';

    $scope.rows = [];
    $scope.totalMatchedCount = 0;
    $scope.totalMatches = 0;
    $scope.findMatched = function(index) {
      var brand = BrandService.items[index];
      if (brand.get('visible')) {
        BrandService.matchCount(brand, function(results) {

          var i = results.length;
          var t = 0;
          while (i--) {
            var p = results[i];
            var mc = Number(p.get('matchCount'));
            t += mc;
          }

          var obj = {
            name: brand.get('name'),
            matchedCount: results.length,
            total: t
          };
          $scope.rows.push(obj);

          $scope.totalMatchedCount += results.length;
          $scope.totalMatches += t;

          if (index < BrandService.items.length - 1) {
            index++;
            $scope.findMatched(index);
          } else {
            $timeout(function() {
              $scope.$digest();
            });
          }
        });
      } else {
        if (index < BrandService.items.length - 1) {
          index++;
          $scope.findMatched(index);
        } else {
          $timeout(function() {
            $scope.$digest();
          });
        }
      }

    };

    BrandService.list(function() {
      $scope.findMatched(0);
    });
  });
