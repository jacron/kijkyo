/**
 * Tab Auto Complete
 * Emulate the behaviour of Terminal in a input field:
 * on tab, autocomplete the directory path.
 * Created by orion on 20-06-15.
 */
'use strict';

angular.module('jcDirectives',[])

    .directive("jcTabAutocomplete", function(Autocomplete) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                element.bind('keydown', function(e){
                    if (e.which === 9) {
                        e.preventDefault();
                        e.stopPropagation();

                        Autocomplete.autoComplete(ngModel.$viewValue)
                          .then(function(completed) {
                            if (completed) {
                                ngModel.$setViewValue(completed);
                                ngModel.$render();
                            }
                        });
                    }
                });
            }
        };
});
