/**
 * Service for jcTabAutocomplete.
 *
 * Give me a path, and I will try and complete it.
 * (Terminal-style)
 *
 * Dependent on: a simpel local or remote service
 * to get files in a directory. The service gets a path and then
 * returns a list of files. Each file
 * has two fields: name and type.
 * Type = dir|file.
 * Name = just the file name (not the path).
 *
 * Created by orion on 20-06-15.
 */
'use strict';

angular.module('jcDirectives')

    .service("Autocomplete", function($http) {
        var auto = this;

        var remoteForDir = 'http://zonebus?srv=dir';

        /**
         * This API call gets all files in a dir
         * that don't start with a dot.
         *
         * @returns {*}
         * @param path
         */
        auto.getFromDir = function(path) {
            var req = $http.get(remoteForDir, {
                params: {
                    req: 'allfiles',
                    path: path
                }
            });
            return req.then(function (res) {
                    return res.data;
                },
                function (res) {
                    //console.log(res);
                });

        };

        auto.stripAfterSlash = function(s) {
            var pos = s.lastIndexOf('/');

            if (pos === -1 || pos === s.length - 1) {
                return s;
            }
            return s.substr(0, pos + 1);
        };

        auto.stripBeforeSlash = function(s) {
            var pos = s.lastIndexOf('/');

            if (pos === -1) {
                return s;
            }
            return s.substr(pos + 1);
        };

        auto.find = function(files, path, to_match) {
            var found = null;

            for (var i = 0; i < files.length; i++) {
                if (files[i].name.indexOf(to_match) === 0) {
                    // found the first one  - one and only?
                    if (!found) {
                        found = {
                            path: path,
                            file: files[i]
                        }
                    }
                    else {
                        // helas! found more than one
                        found = null;
                        break;
                    }
                }
            }
            return found;
        };

        auto.autoComplete = function(invoer) {
            var to_match = auto.stripBeforeSlash(invoer),
                path = auto.stripAfterSlash(invoer),
                files,
                info,
                completed = null;

            return auto.getFromDir(path).then(function(data){
                if (!data || typeof data === 'string') {
                    files = [];
                }
                else {
                    files = data;
                }
                info = auto.find(files, path, to_match);
                if (info) {
                    completed = info.path + info.file.name;
                    if (info.file.type === 'dir') {
                        completed += '/';
                    }
                }
                return completed;
            });
        };
    });