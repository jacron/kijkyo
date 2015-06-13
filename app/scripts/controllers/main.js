'use strict';

angular.module('kijkyoApp')
  .controller('MainCtrl', function ($scope, $document, $rootScope,
      Settings, Image, Tags, DirData, Dir, $timeout, $interval) {

    var rotated = false,
        that = this,
        $mainImage = $('#main-image'),
        $mainImageContainer = $('#main-image-container'),
        nextPressed = true;

    $scope.index = 0;
    $scope.showTags = false;
    $scope.showSidebar = false;
    $scope.tagsFilter = [];
    $scope.adjusted = false;
    $scope.tags = [];
    $scope.loading = true;
    $scope.shrunk = false;
    $scope.slideShowRunning = false;
    $scope.slideShowDelay = 6000;
    $scope.normalbottom = false;
    $scope.goto = '';


    this.setTitle = function() {
        if ($scope.images) {
            $rootScope.appTitle = $scope.index + ' / ' + $scope.images.length;
        }
    };

    this.saveImages = function() {
        //console.log(DirData.path);
        if (DirData.path === '') {
            return;
        }
        console.log(DirData.path);
        Image.saveImages(DirData.path, $scope.tagsFilter, $scope.images, function(data){
            console.log(data);
        });
    };

    this.getFirstFilterTag = function() {
        if ($scope.tagsFilter.length) {
            return $scope.tagsFilter[0].text;
        }
        return '';
    };

    this.getImages = function(i) {
        if (DirData.path === '') {
            return;
        }
        $scope.loading = true;
        $scope.tagName = this.getFirstFilterTag();
        //$scope.inx = 0;
        Image.getImages(DirData.path, $scope.tagsFilter, function(data){
            //console.log(data);
            $scope.images = data.images;
            $scope.imagesCount = data.count;
            $scope.imagePath = Settings.srv.kijk + 'image=' + DirData.path + Settings.path_seperator;
            if (i || i === 0) {
                $scope.inx = i;
                $scope.index = parseInt(i)+1;
            }
            else if (!$scope.inx) {
                $scope.inx = 0;
                $scope.index = 1;
            }
            $scope.showAllTags = false;
            $scope.allTags = [];
            Tags.init(data.tags);
            that.initImage();
            $scope.loading = false;
              //$scope.allTags = Tags.getTags();
        });
    };

      this.initImage = function() {
        var image;

        if (!$scope.images) {
            return;
        }
        image = $scope.images[$scope.inx];

        // prevent visible adjustments to image
        $mainImage.hide();

        that.setTitle();
        that.normalImage();
        $scope.adjusted = true;
        $mainImage.rotate(0);
        rotated = false;
        //console.log(image);
        //console.log(image.id);
        if (image) {
            //console.log(image.tags);
            $scope.tags = image.tags;
        }
    };

    this.rotate = function() {
        var deg = rotated? 0 : 270;

        //Image.rotate($mainImageContainer, deg, $mainImage.height());
        Image.rotate($mainImage, deg);
        rotated = !rotated;
    };

    this.toggleMenu = function() {
        $scope.showMenu = !($scope.showMenu);
        $scope.$apply();
        //that.storeSettings();
    };

    this.next = function() {
        $scope.next();
    };

    this.prev = function() {
        $scope.prev();
    };

    this.setIndex = function(i) {
        $scope.inx = i;
        $scope.index = parseInt(i) + 1;
        that.initImage();
        if (localStorage) {
            localStorage['index'] = i;
        }
    };

    this.gotoStart = function() {
        that.setIndex(0);
    };

    this.gotoEnd = function() {
        if ($scope.imagesCount > 1) {
            that.setIndex($scope.imagesCount - 1);
        }
    };

    this.normalImage = function() {
        Image.setNormal($mainImage);
    };

    this.adjustImage = function() {
        //console.log($scope.images[$scope.inx].width);
        $scope.measured = $scope.images[$scope.inx].width > 0;
        Image.setAdjusted($mainImage, rotated, function(w, h, shrunk){
            $scope.images[$scope.inx].width = w;
            $scope.images[$scope.inx].height = h;
            $scope.shrunk = shrunk;
        });
    };

    this.setLoading = function() {

    };

    var slide;

    this.stopSlideShow = function() {
        if (angular.isDefined(slide)) {
            $interval.cancel(slide);
            slide = undefined;
        }
    };

    this.toggleSlideshow = function() {
        if (angular.isDefined(slide)) {
            that.stopSlideShow();
            $scope.slideShowRunning = false;
        }
        else {
            $scope.slideShowRunning = true;
            $scope.$apply();
            slide = $interval(function() {
                if ($scope.inx > $scope.imagesCount - 2) {
                    $scope.inx = 0;
                }
                else {
                    $scope.inx++;
                }
                that.setIndex($scope.inx);

            }, $scope.slideShowDelay);
        }
    };


    /*--------------------------
     * Scope Functions
     --------------------------*/
      $scope.toggleFavorite = function() {
          var img = $scope.images[$scope.inx];
          console.log(img);
          img.favorite = !img.favorite;
          console.log(img);
          Dir.updateImageFavorite(img.favorite, img.id);
      };

      $scope.setSlideshowDelay = function() {
        var delay = prompt('Diashow duur', $scope.slideShowDelay);
        if (delay) {
            $scope.slideShowDelay = delay;
        }
      };

      $scope.toggleNormalbottom = function(e) {
          //console.log($scope.normalbottom); // state before click
          $scope.images[$scope.inx].normalbottom = !$scope.images[$scope.inx].normalbottom;
          if (!$scope.normalbottom) {
            that.normalImage();
            Image.up($mainImage);
          }
      };

      $scope.$on('$destroy', function() {
          that.stopSlideShow();
      });

        $scope.addTag2Filter = function(tag) {
            $scope.showTags = true;
            //$scope.tagsFilter = [];
            $scope.tagsFilter.push(tag);
            $scope.tagAddedToFilter();
            $scope.showAllTags = false;
        };

      $scope.listAllTags = function() {
          if ($scope.showAllTags) {
              $scope.showAllTags = false;
          }
          else {
              $scope.showAllTags = true;
              $scope.allTags = Tags.getTags($scope.tagsFilter);
              //$scope.allTags = Tags.getTags();
          }
      };

      $scope.openContainer = function() {
        if ($scope.images[$scope.inx]) {
            Dir.openContainer(DirData.path, $scope.images[$scope.inx].name);
        }
        else {
            Dir.openContainer(DirData.path, '');
        }
      };

      // Er is een tag toegevoegd aan een plaatje
      $scope.tagAddedToImage = function(tag) {
          //console.log($scope.images[$scope.inx]);
          Dir.updateImageAddTag(tag, $scope.images[$scope.inx].id);
          Tags.updateTags(tag);
      };

      // Er is een tag verwijderd uit een plaatje
      $scope.tagRemovedFromImage = function(tag) {
        //that.updateTagsToFilter(tag);
        Dir.updateImageRemoveTag(tag, $scope.images[$scope.inx].id);
      };

      // Er is een tag toegevoegd aan het filter
    $scope.tagAddedToFilter = function(tag) {
        that.getImages(0);
    };

      // Er is een tag verwijderd uit het filter
    $scope.tagRemovedFromFilter = function(tag) {
        that.getImages(0);
    };

    $scope.next = function() {
        nextPressed = true;
        if ($scope.inx > $scope.imagesCount - 2) {
            // mark the end .  . .
            //$scope.showMenu = true;
            return;
        }
          //console.log($scope.images[$scope.inx]);
        $scope.inx++;
        that.setIndex($scope.inx);
    };

    $scope.prev = function() {
        nextPressed = false;
        if ($scope.inx <= 0) {
            // mark the end .  . .
            //$scope.showMenu = true;
            return;
        }
        $scope.inx--;
        that.setIndex($scope.inx);
    };

    $scope.saveImages = function() {
        that.saveImages();
    };

      $scope.utf8_decode = function(s) {
          //console.log(s);
          //http://ecmanaut.blogspot.nl/2006/07/encoding-decoding-utf8-in-javascript.html
          //var t = decodeURIComponent(escape(s));
                  var e = escape(s);
          //console.log(e);
          return e;
      };

      $scope.hidePopup = function() {
        that.cancelDirectoryBrowser();
        $scope.showOverlay = false;
    };


    $scope.loadTags = function(query) {
        return Tags.load(query);
    };

    $scope.loadAllTags = function(query) {
        return Tags.load(null);
    };

    $scope.refresh = function() {
        that.next();    // work-around, to prevent image 0 from hiding
        that.getImages();
    };

    $scope.toggleTags = function() {
        $scope.showTags = !$scope.showTags;
    };

    $scope.initImage = function() {
        that.initImage();
    };

    $scope.stopPropagation = function(e) {
        e.stopPropagation();
    };

    $scope.adjustImage = function() {
        if ($scope.adjusted) {
            that.normalImage();
        }
        else {
            that.adjustImage();
        }
        $scope.adjusted = !$scope.adjusted;
        $scope.$apply();
    };

    $scope.getNumber = function(e) {
        var i = prompt('Ga naar:', $scope.goto);
        if (i > 0 && i <= $scope.imagesCount) {
            $scope.goto = i;
            $scope.inx = i - 1;
            $scope.index = i;
        }

    };

    /*---------------------------------
     * Un-angular event handling . . .
     ---------------------------------*/
    $document.keydown(function(e){
        //console.log(e.which);
        // F1 = 112, maar Chrome gebruikt die al
        //console.log(e.which);
        /*
        if (e.ctrlKey) switch(e.which) {
        }*/
        if (!e.ctrlKey) switch(e.which) {
            //case 36:    // home
            //case 35:    // end
            //case 37:    // left
            //case 39:    // right
            case 81: // q
                $scope.showMenu = true;
                $scope.showTags = true;
                var $imageTags = $('#add-tag-to-image'),
                    $input = $imageTags.find("[placeholder='Add to image']");
                //console.log($input);
                //$input.trigger('select');
                $imageTags.trigger('focus');
                $input.val('xx');
                //$input.val('');
                e.stopPropagation();

                $scope.$apply();
                $input.trigger('focus');
                $timeout(function() {
                    $input.val('');
                });
                break;
            case 87:    // w
                Image.lift($mainImageContainer, 20, rotated);
                break;
            case 83:    // s
                Image.lift($mainImageContainer, -20, rotated);
                break;
            case 221:   // ]
                Image.zoom($mainImage, 1.10, rotated);
                break;
            case 219: // [
                Image.zoom($mainImage, 0.90, rotated);
                break;
            case 65:    // a
                that.gotoStart();
                $scope.$apply();
                break;
            case 68: // d
                that.gotoEnd();
                $scope.$apply();
                break;
            case 82: // r
                that.rotate();
                break;
            case 77: // m
                that.toggleMenu();
                break;
            case 188: // ,
            case 33: // pageUp
                that.prev();
                $scope.$apply();
                break;
            case 34: // pageDown
            case 190: // .
                that.next();
                $scope.$apply();
                break;
            case 32: // space
                if (nextPressed) {
                    that.next();
                }
                else {
                    that.prev();
                }
                $scope.$apply();
                break;
            case 84:    // t
                if ($scope.showMenu) {
                    $scope.toggleTags();
                    $scope.$apply();
                }
                break;
            case 78: // n
                $scope.adjustImage();
                break;
            case 191:   // /
                // combineer groot en naar beneden
                if ($scope.adjusted) {
                    that.normalImage();
                    Image.up($mainImage);
                }
                else {
                    that.adjustImage();
                }
                $scope.adjusted = !$scope.adjusted;
                break;
            case 220:   // \
                $scope.showSidebar = !$scope.showSidebar;
                $scope.$apply();
                break;
            case 27: // escape
                DirData.handleKeyDown(e, function(){
                    $scope.$apply();
                });
                break;
            case 192: // tilde
                //console.log('tilde');
                // slide-show
                that.toggleSlideshow();
                break;
        }
    });



    /*--------------
     * On image load
     ---------------*/
    $scope.autoSizeImage = function() {
        if ($scope.images[$scope.inx].normalbottom) {
            Image.up($mainImage);
        }
        else {
            that.adjustImage();
        }
        $mainImage.show();
    };

    /*-----------------
     * Start here
     ------------------ */
    $scope.showMenu = true;
    $scope.dir = DirData;
    this.setTitle('loading . . .');

    DirData.path_seperator = Settings.path_seperator;
    DirData.onDirChange = function(path) {
        that.setIndex(0);
        that.getImages();
        $scope.folderName = Dir.getDirectoryName(path);
    };
    DirData.restoreSettings = function() {
        if (localStorage && localStorage[Settings.storage.name]) {
            // restore path
            DirData.path = localStorage[Settings.storage.name];
            //this.setDriveFromPath(localStorage[this.storepathname]);
        }
        else {
            DirData.path = Settings.storage.deflt_path;
        }
    };
    DirData.storeSettings = function() {
        if (localStorage) {
            localStorage[Settings.storage.name] = DirData.path;
        }
    };
    DirData.onInit = function() {
        that.getImages();
        $scope.folderName = Dir.getDirectoryName(DirData.path);
    };
    if (localStorage && localStorage['index']) {
        $timeout(function(){
            //console.log(localStorage['index']);
            that.setIndex(localStorage['index'], true);
        });
    }

  });
