/*
 * Author: jan
 * Date: 11-jun-2014
 */
'use strict';

angular.module('kijkyoApp')
  .factory('DirData', function(Dir) {
      return  {

        changePath: function() {
            this.storeSettings();
            //this.setDriveFromPath(this.path);
            this.onDirChange(this.path);
        },
        /*
        changePathByDrive: function() {
            this.path = this.drive.letter;
            this.getDirs();
        },*/
        directoryChange: function() {
            this.changePath();
            this.showDirs = false;
        },
        directoryCancel: function() {
            this.showDirs = false;
            this.restoreSettings();
        },
        dialog: function() {
            if (!this.showDirs) {
                // Open dialog
                this.getDirs();
                angular.element('.directory-browser ul').css('height', 300);
                //this.showOverlay = true;
            }
            else {
                // Close dialog
                this.showDirs = false;
                //this.showOverlay = false;
                this.restoreSettings();
            }
        },
        folderUpVisible: function() {
            var parts = this.path.split(this.path_seperator);

            this.showFolderUp = parts.length > 1;
        },
        handleKeyDown: function(e, cb) {
            if (e.keyCode === 27 && this.showDirs) {
                this.showDirs = false;
                cb();
            }
        },
        hidePopUp: function() {
            this.showOverlay = false;
        },
        handleInputPath: function(e) {
            if (e.which === 13) {
                this.changePath();
            }
            e.stopPropagation();
        },
        /*
        getDriveByLetter: function(letter) {
            var ndrive = null;

            angular.forEach(this.drives, function(drive){
                if (drive.letter.substr(0, 1) === letter.toUpperCase()) {
                    ndrive = drive;
                }
            });
            return ndrive;
        },*/
        getDirs: function() {
            var that = this;

            this.pathParts = this.path.split(this.path_seperator);

            this.waiting = true;

            // get drive letters
            /*
            Dir.getDriveLetters(function(data) {
                that.drives = data;
                that.drive = that.getDriveByLetter(that.path.substr(0, 1));
            });*/

            // get dirs
            Dir.getDirs(that.path, function(data){
                //console.log(data);
                if (data && typeof data === 'string') { // && data.substr(0,1) === '@') {
                    console.log(data.substr(1));
                    that.errorMessage = data;//.substr(1);
                    that.curdirs = [];
                }
                else {
                    that.folderUpVisible();
                    that.curdirs = data;
                }
                that.waiting = false;
                that.showDirs = true;
            });
        },
        higherDir: function() {
            var parts = this.path.split(this.path_seperator);

            if (parts.length > 1) {
                this.curdirinfo = '';
                parts.pop();
                this.path = parts.join(this.path_seperator);
                this.getDirs();
            }
            this.showFolderUp = parts.length > 1;
        },
        openDir: function(dir) {
            this.path += this.path_seperator + dir.name;
            this.getDirs();
            this.showFolderUp = true;
            this.curdirinfo = dir.info;
        },
        stopPropagation: function(e){
            e.stopPropagation();
        },
        toPart: function(part) {
            var p = '';
            for (var i=0; i<this.pathParts.length;i++){
                var pp = this.pathParts[i];

                p += pp + this.path_seperator;
                if (part === pp) {
                    break;
                }
            }
            this.path = p.substr(0, p.length - 1);
            this.curdirinfo = '';
            this.getDirs();
        },
        curdirs: '',
        curdirinfo: '',
        //drives: '',
        errorMessage: '',
        path: '',
        pathParts: [],
        showDirs: false,
        showOverlay: false,
        showFolderUp: true,
        storepathname: 'kijk.path',
        waiting: false,
        waiting2: true,
        path_seperator: ''
    };
  });


