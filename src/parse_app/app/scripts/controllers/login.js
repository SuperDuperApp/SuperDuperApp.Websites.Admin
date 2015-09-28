'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('LoginCtrl', function ($scope, $rootScope) {
    $scope.uname = '';
    $scope.password = '';

    $scope.submitButtonClick = function() {


      Parse.User.logIn($scope.uname, $scope.password, {
        success: function(user) {
          // Do stuff after successful login.
          $rootScope.$apply(function(){
            $rootScope.loggedIn = true;
          });

          console.log(user);
          $('.login-modal').modal('hide');
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          $rootScope.loggedIn = false;
          console.log(user);
          alert(error.code + ' : ' + error.message);
        }
      });

    };
  });
