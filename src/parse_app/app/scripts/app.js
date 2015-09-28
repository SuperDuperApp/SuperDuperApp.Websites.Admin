'use strict';

/**
 * @ngdoc overview
 * @name adminApp
 * @description
 * # adminApp
 *
 * Main module of the application.
 */
angular
  .module('adminApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/brand', {
        templateUrl: 'views/brand.html',
        controller: 'BrandCtrl'
      })
      .when('/brand/:id/photo', {
        templateUrl: 'views/brandphoto.html',
        controller: 'BrandPhotoCtrl'
      })
      .when('/brand_type', {
        templateUrl: 'views/brandtype.html',
        controller: 'BrandTypeCtrl'
      })
      .when('/product_type', {
        templateUrl: 'views/producttype.html',
        controller: 'ProductTypeCtrl'
      })
      .when('/product_season', {
        templateUrl: 'views/productseason.html',
        controller: 'ProductSeasonCtrl'
      })
      .when('/product', {
        templateUrl: 'views/product.html',
        controller: 'ProductCtrl'
      })
      .when('/product/:id/match', {
        templateUrl: 'views/match.html',
        controller: 'MatchCtrl'
      })
      .when('/product/:id/photo', {
        templateUrl: 'views/photo.html',
        controller: 'ProductPhotoCtrl'
      })
      .when('/product/:productId/match/:id/photo', {
        templateUrl: 'views/matchphoto.html',
        controller: 'MatchPhotoCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope) {
    Parse.initialize('3sC6jbS7mjqMHE9x2aanasCy6Bd47RnwvA3mQfWo', 'J4ztKxZVA5O7Nx1AmhiT6lZ0uaKywEeXAU1jWRpi');

    $rootScope.logout = function() {
      Parse.User.logOut();
      location.reload();
    };

    var currentUser = Parse.User.current();
    if (!currentUser) {

      $('.login-modal').modal('show');

      $rootScope.$apply(function(){
        $rootScope.loggedIn = false;
      });
    } else {
      $rootScope.$apply(function(){
        $rootScope.loggedIn = true;
      });
    }


  });
