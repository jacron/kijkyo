/*
 * Author: jan
 * Date: 10-jun-2014
 */
angular.module("kijkyoApp")
    .directive("jcDirBrowser", function () {
    return {
        restrict: 'E',
        scope: {
            dir: '=jcDirBrowserData'
        },
        templateUrl: 'views/templates/dirbrowser.html?v=2',
        link: function(scope, element, attrs) {
            scope.dir.restoreSettings();
            scope.dir.onInit();
        }
    };
});


