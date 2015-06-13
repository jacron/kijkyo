/*
 * Author: jan
 * Date: 1-jun-2014
 */
'use strict';

angular.module('kijkyoApp')
  .directive('keyTrap', function () {
  return function( scope, elem ) {
    elem.bind('keydown', function( event ) {
      scope.$broadcast('keydown', { code: event.keyCode } );
    });
  };
});

