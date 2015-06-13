'use strict';

angular.module('kijkyoApp').
  directive('vsplitter', function($document, $window) {
    return {
      restrict: 'A',
      link: function(scope, elm, attr) {
        var startY,
            sel = attr['vsplitter'],
            panel = angular.element(sel),
            y = parseInt(panel.css('height'));

      elm.css({
//          position: 'relative',
          cursor: 'ns-resize'
      });
     elm.on('mousedown', function(event) {
        startY = event.screenY - y;

        // Prevent default dragging of selected content
        event.preventDefault();

        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        var yy = event.screenY;
        if (yy > $window.innerHeight + 100) {
            return;
        }

        y = yy - startY;
        panel.css({height: y + 'px'});
      }
        function mouseup() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
      }
    };
  });
