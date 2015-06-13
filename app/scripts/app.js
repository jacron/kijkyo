'use strict';

angular.module('kijkyoApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngTagsInput'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html?v=1',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
