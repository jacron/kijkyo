'use strict';

angular.module('kijkyoApp').
  directive('draggable', function($document) {
    return {
      restrict: 'A',
      link: function(scope, elm, attr) {
        var startX,
            startY,
            x = 0,
            y = 0,
            draggableParms=attr['draggable'],
            draggableObject = attr['draggableObject'],
            obj = elm;

    if (draggableObject) {
        obj = angular.element(draggableObject);
    }
    elm.css({cursor: 'move'});
    if (draggableParms) {
        var coords = draggableParms.split(',');
        x = coords[0];
        y = coords[1];
        obj.css({
          top: y + 'px',
          left:  x + 'px'
        });
    }

     elm.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.screenX - x;
        startY = event.screenY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.screenY - startY;
        x = event.screenX - startX;
        obj.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }
        function mouseup() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
      }
    };
  });
