'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:fileRead
 * @description
 * # fileRead
 */
angular.module('adminApp')
  .directive('fileRead', function () {
    return {
      scope: {
        fileRead: '='
      },
      link: function postLink(scope, element) {
        element.bind('change', function (changeEvent) {
          scope.$apply(function () {
            scope.fileRead = changeEvent.target.files[0];
            // or all selected files:
            // scope.fileread = changeEvent.target.files;
          });
        });
      }
    };
  });
