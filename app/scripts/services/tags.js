/*
 * Author: jan
 * Date: 7-jun-2014
 */
'use strict';


angular.module('kijkyoApp')
  .service('Tags', function Tags($q) {
      var tags,
        that = this;

      this.init = function(ptags) {
          tags = ptags;
      };

      this.updateTags = function(tag) {
        var found = false;

        angular.forEach(tags, function(ftag) {
            if (ftag.text === tag.text) {
                found = true;
            }
        });
        if (!found) {
            tags.push(tag);
        }
      };

      this.filterTags = function(q) {
          if (!q) {
              return tags;
          }
          var ntags = [];

          angular.forEach(tags, function(tag){
              if (tag.text.length && tag.text.indexOf(q) !== -1) {
                  ntags.push(tag);
              }
          });
          return ntags;
      };

      this.load = function(q) {
          //console.log(tags);
          var deferred = $q.defer(),
                ntags = that.filterTags(q);

          deferred.resolve(ntags);
          return deferred.promise;
      };

      this.getTags = function(tagsFilter) {
          var ntags = [];
          angular.forEach(tags, function(tag){
              var found = false;
              angular.forEach(tagsFilter, function(t){
                if (tag.text === t.text) {
                    found = true;
                }
              });
              if (!found) {
                  ntags.push(tag);
              }
          });
          return ntags;
      };


  });

