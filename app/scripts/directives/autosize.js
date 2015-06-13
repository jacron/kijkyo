/*
 * Author: jan
 * Date: 6-jun-2014
 */
angular.module("kijkyoApp")
    .directive("autosize", function ($parse) {
    return {
        link: function(scope, element, attrs) {
            var execFun = function(attrName, parms, evt) {
                var fn = $parse(attrs[attrName]);

                scope.$apply(function () {
                    fn(scope, {
                        $data: parms,
                        $event: evt
                    });
                });
            };
            element.bind("load" , function(e){
                execFun('autosizeAdjust', {}, e);
            });
        }
    };
});

