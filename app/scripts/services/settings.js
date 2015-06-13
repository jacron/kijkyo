/*
 * Author: jan
 * Date: 8-jun-2014
 */
'use strict';

angular.module('kijkyoApp')
  .factory('Settings', function() {

    var host = 'http://192.168.0.100:88',   // zonebus, ook geschikt voor remote access v.d. website
        hostwin = host,
        storage = {
            name: 'neptunus.kijk.path',
            dflt_path: 'S:/pictures'
        }
//console.log(location.host);
    if (location.host === '192.168.0.101' || location.host === 'saturnus') {
        host = 'http://192.168.0.101:81';
        //zonebus';
        //host = 'http://192.168.0.101/zonebus';
        storage = {
            name: 'saturnus.kijk.path',
            deflt_path: '/volume1/Media/Pictures'
        };
    }
    return {
        srv: {
            luister: host + '?srv=luister&',
            dir: host + '?srv=dir&',
            kijk: host + '?srv=kijk&',
            post: host + '?post=',
            postwin: hostwin + '?post='
        },
        storage: storage,
        path_seperator: '/'
    };
  });


