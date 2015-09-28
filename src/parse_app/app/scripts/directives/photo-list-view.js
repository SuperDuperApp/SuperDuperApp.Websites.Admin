'use strict';

/**
 * @ngdoc directive
 * @name adminApp.directive:photoListView
 * @description
 * # photoListView
 */
angular.module('adminApp')
  .directive('photoListView', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element) {
        element.text('this is the photoListView directive');
      }
    };
  });
