/*
 * Author: jan
 * Date: 10-jun-2014
 */
'use strict';

angular.module('kijkyoApp')
  .service('Dir', function($http, Settings) {

    this.updateImageFavorite = function(favorite, idImage) {
          var data = {
              favorite: favorite,
              id_image: idImage
          };
        $http.post(Settings.srv.post + 'update_image_favorite', data).success(function(response){
            console.log(response);
        });
    };

      this.updateImageAddTag = function(tag, idImage) {
          var data = {
              tag: tag,
              id_image: idImage
          };
        $http.post(Settings.srv.post + 'update_image_tags_add', data).success(function(response){
            console.log(response);
        });
      };

      this.updateImageRemoveTag = function(tag, idImage) {
          var data = {
              tag: tag,
              id_image: idImage
          };
        $http.post(Settings.srv.post + 'update_image_tags_remove', data).success(function(response){
            console.log(response);
        });
      };

    this.getDirectoryName = function(path) {
        var pos = path.lastIndexOf('/');
        return path.substr(pos);
    };

    this.getFiles = function(path, extension, cb){
        $http.get(Settings.srv.dir, {
            params: {
                req: 'files',
                path: path,
                extension: extension
            }
        })
        .then(function(res){
            if (res.data === '') {
                console.log(res);
            }
            //console.log(res);
            cb(res.data);
        },
        function(res){
            console.log(res);
        });
    };

    this.getDirs = function(path, cb) {
          //console.log(path);
          if (!path.length) {
              cb(null);
          }

        $http.get(Settings.srv.dir, {
            params: {
                req: 'dirsinfo',
                path: path
            }
        })
        .then(function(res){
            if (res.data === '') {
                console.log(res);
            }
            //console.log(res);
            cb(res.data);
        },
        function(res){
            console.log(res);
        });
    };

    this.openContainer = function(path, filename) {
        //console.log(path);
        var data = {
            path: path,
            filename: filename
        };
        $http.post(Settings.srv.postwin + 'opencontainer', data).success(function(response){
            console.log(response);
        });
    };

  });
