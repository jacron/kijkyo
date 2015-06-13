/*
 * Author: jan
 * Date: 7-jun-2014
 */
'use strict';

angular.module('kijkyoApp')
  .service('Image', function Image($window, $http, Settings) {

    this.saveImages = function(path, tagsfilter, images, cb) {
        var data = {
            path: path,
            images: images
        };
       $http.post(Settings.srv.post + 'saveimages', data).success(function(response){
          console.log(response);
          //cb(response);
       });
    };

      this.getImages = function(path, tagsfilter, cb) {
        var tf = JSON.stringify(tagsfilter);
        $http.get(Settings.srv.kijk, {
            params: {
                req: 'images',
                path: path,
                tagsfilter: tf
            }
        })
        .then(function(res) {
            cb(res.data);
        },
        function(res) {
            console.log(res);
        });

      };

      this.rotate = function($img, deg, imageHeight) {

          $img.rotate({
              angle: deg
          });
      };

      this.lift = function($img, dist, rotated) {
          var pos = $img.position();

            $img.css({
                position: 'relative',
                top: pos.top + dist
            });
      };

      this.up = function($img) {
           $img.css({
                top: 'inherit',
                bottom: 0
            });
      };

      this.setAdjusted = function($img, rotated, cb) {
        var imageWidth,
            imageHeight,
            maxWidth = $window.innerWidth,
            maxHeight = $window.innerHeight,
            widthRatio,
            heightRatio,
            ratio,
            top = 0,
            shrunk;

        imageWidth = $img[0].width; //need the raw width due to a jquery bug that affects chrome
        imageHeight = $img[0].height; //need the raw height due to a jquery bug that affects chrome
        widthRatio = maxWidth / imageWidth;
        heightRatio = maxHeight / imageHeight;

        shrunk = imageWidth > maxWidth || imageHeight > maxHeight;

        if (widthRatio * imageHeight > maxHeight) {
            ratio = heightRatio;
        }
        else {
            ratio = widthRatio;
        }

        //now resize the image relative to the ratio
        $img.attr('width', imageWidth * ratio)
            .attr('height', 'auto');
            //.attr('height', imageHeight * ratio);

        //and center the image vertically and horizontally
        $img.css({
            margin: 'auto',
            position: 'absolute',
            top: top,
            bottom: 0,
            left: 0,
            right: 0
        });

        // callback notifies the dimensions of the image
        cb(imageWidth, imageHeight, shrunk);
      };

      this.zoom = function($img, ratio, rotated) {
        var imageWidth = $img[0].width,
            imageHeight = $img[0].height;

        $img.attr('height', imageHeight * ratio)
                .attr('width', 'auto');
        /*
          var s = 'scale(' + ratio + ')';

          $img.css({
              transform: s
          });*/
      };

      this.setNormal = function($img) {
        $img.attr('width', 'auto')
            .attr('height', 'auto');
      };

  });


