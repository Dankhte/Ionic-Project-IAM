angular.module('starter.controllers', [])

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $ionicLoading, $timeout) {
  // Form data for the login and register modals
  $scope.loginData = {};
  $scope.loginData.username = window.localStorage.getItem('username');
  $scope.registerData = {};
  $scope.favourites= [];
  $scope.favourites = JSON.parse(window.localStorage.getItem('favourites'));
  
  $rootScope.images = [];

  // Create the login and register modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    animation: 'slide-in-right'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope,
    animation: 'slide-in-down'
  }).then(function(modal) {
    $scope.register_modal = modal;
  });

  // Triggered in the login and register modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  $scope.closeRegister = function() {
    $scope.register_modal.hide();
  };

  // Open the login and register modal
  $scope.login = function() {
    $scope.modal.show();
  };
  $scope.register = function() {
    $scope.register_modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    window.localStorage.setItem( 'username', $scope.loginData.username);
    $scope.closeLogin();
  };
  $scope.doLogout = function() {
    $scope.loginData = {};
    console.log('Doing logout', $scope.loginData);
  };
  // Perform the register action when the user submits the form
  $scope.doRegister = function() {
    console.log('Doing register', $scope.registerData);
    $scope.closeRegister();
  };

  // Loading screen.
  $scope.loadingShow = function(){
    $ionicLoading.show({
      template: 'Loading<br/><span class="ion-load-a"></span>'
    });
  }

  $scope.loadingHide = function(){
    $scope.$on('$ionicView.afterEnter', function(){
      $ionicLoading.hide();
    })
  }

  // Favourites
  $scope.addFavourite = function(itemId){
    if ($scope.checkFavourite(itemId)){
      for(var i = 0; i < $scope.favourites.length; i++){
        if ($scope.favourites[i] == itemId) {
          $scope.favourites.splice(i,1);
        }
      }
    }else{
      $scope.favourites.push(itemId);
    }
    window.localStorage.setItem( 'favourites', JSON.stringify($scope.favourites));
  }

  $scope.checkFavourite = function(itemId){
    var exists = false;
    if ($scope.favourites != null) {
      for(var i = 0; i < $scope.favourites.length; i++){
        if ($scope.favourites[i] == itemId) {
          exists = true;
        };
      }
    }
    return exists;
  }
})

.controller('HomeCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory) {
  $ionicSideMenuDelegate.canDragContent(false);
  jQuery(".home-full").click(function(){
    $scope.login();
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.transitionTo("app.categories");
    $ionicSideMenuDelegate.canDragContent(true);
  });
})

.controller('SearchCtrl', function($scope, RESOURCES, Category, Item, Image) {
  Category.query(function(data) {
      $scope.categories = data;
        // The number of items in a category
        for(var i = 0; i < $scope.categories.length; i++){
          $scope.categories[i].items = 0;
          $scope.categories[i].thumb = "./img/default.png"; // Default img
          Item.query({category_id: $scope.categories[i].id}, function(items){
            if (items.length) {
              $scope.categories[items[0].category_id-1].items = items.length;
              // The first image from the first item in the category.
              Image.query({item_id: items[0].id}, function(images){
                if(images.length){
                  $scope.categories[items[0].category_id-1].thumb = RESOURCES.USERS_DOMAIN + images[0].uri;
                }else{
                  //$scope.categories[items[0].category_id-1].thumb = "../img/default.png";
                }
              })
            };
          });
        }
    });
  $scope.images = [];
  Item.query(function(items){
    $scope.items = items;
    for(var i = 0; i < $scope.items.length; i++){
      var temp = 0;
      Image.query({item_id: $scope.items[i].id}, function(images){
        if (images.length) {
          temp = images[0].item_id;
          var l = $scope.images.push({"item_id": temp, "uri": RESOURCES.USERS_DOMAIN + images[0].uri});
        }else{
          temp++;
          $scope.images.push({"item_id": temp, "uri": "./img/default.png"}); // Default img
        }
      })
    }
  });
})

.controller('CategoriesCtrl', function($scope, RESOURCES, Category, Item, Image) {
  $scope.updateCategories = function(){
    Category.query(function(data) {
      $scope.categories = data;
        // The number of items in a category
        for(var i = 0; i < $scope.categories.length; i++){
          $scope.categories[i].items = 0;
          $scope.categories[i].thumb = "./img/default.png"; // Default img
          Item.query({category_id: $scope.categories[i].id}, function(items){
            if (items.length) {
              $scope.categories[items[0].category_id-1].items = items.length;
              // The first image from the first item in the category.
              Image.query({item_id: items[0].id}, function(images){
                if(images.length){
                  $scope.categories[items[0].category_id-1].thumb = RESOURCES.USERS_DOMAIN + images[0].uri;
                }
              })
            };
          });
        }
    });
    $scope.$broadcast('scroll.refreshComplete');
  } 
  $scope.updateCategories();
})

.controller('CategoryCtrl', function($scope, $stateParams, RESOURCES, Category, Item, Image) {
  $scope.categoryId = $stateParams.categoryId;
  $scope.category = {};
  $scope.images = [];

  $scope.updateItems = function(){
    $scope.images = [];
    Item.query({category_id: $scope.categoryId}, function(items){
      $scope.items = items;
      for(var i = 0; i < $scope.items.length; i++){
        $scope.images.push({"item_id": $scope.items[i].id, "uri": "./img/default.png"}); // Default img
        Image.query({item_id: $scope.items[i].id}, function(images){
          if (images.length) {
            $scope.images.push({"item_id": images[0].item_id, "uri": RESOURCES.USERS_DOMAIN + images[0].uri});
          }
        })
      }
    });
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.$on('$ionicView.beforeEnter', function(event) {
    Category.get({id: $scope.categoryId}, function(category){
      $scope.category = category;
    });
  });

  $scope.updateItems();
})

.controller('ItemCtrl', function($scope, $stateParams, RESOURCES, Item, Image) {
  $scope.categoryId = $stateParams.categoryId;
  $scope.itemId = $stateParams.itemId;
  $scope.images = [];

  $scope.$on('$ionicView.beforeEnter', function(event) {
    Item.get({id: $scope.itemId}, function(item){
      $scope.item = item;
      $scope.message = $scope.item.name;
    });
  });

  $scope.updateItem = function(){
    Item.get({id: $scope.itemId}, function(item){
      $scope.item = item;
      $scope.message = $scope.item.name;
    });
    Image.query({item_id: $scope.itemId}, function(images){
      for(var i=0; i<images.length; i++){
        $scope.images.push(RESOURCES.USERS_DOMAIN + images[i].uri);
      };
    });
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.updateItem();
})

.controller('FavouritesCtrl', function($scope, RESOURCES, Item, Image) {
  $scope.updateItems = function(){
    $scope.images = [];
    Item.query(function(items){
      $scope.items = items;
      for(var i = 0; i < $scope.items.length; i++){
        $scope.images.push({"item_id": $scope.items[i].id, "uri": "./img/default.png"}); // Default img
        Image.query({item_id: $scope.items[i].id}, function(images){
          if (images.length) {
            $scope.images.push({"item_id": images[0].item_id, "uri": RESOURCES.USERS_DOMAIN + images[0].uri});
          }
        })
      }
    });
    $scope.$broadcast('scroll.refreshComplete');
  }
  $scope.updateItems();
})

.controller('RandomCtrl', function($scope, RESOURCES, Item, Image) {
  $scope.message = "other random item";
  $scope.updateItem = function(){
    $scope.images = [];
    Item.query(function(items){
      $scope.item = items[Math.floor(Math.random() * items.length)];
      Image.query({item_id: $scope.item.id}, function(images){
        for(var i=0; i<images.length; i++){
          $scope.images.push(RESOURCES.USERS_DOMAIN + images[i].uri);
        };
      });
    });
    $scope.$broadcast('scroll.refreshComplete');
  }
  $scope.updateItem();
})

.controller('FileCtrl', function($rootScope, $scope) {
  $scope.images = [];
  $scope.addImage = function(){
    var file = $scope.myFile; //name supported by new directive
    if (file) {
      $rootScope.images.push(file);
      $scope.myFile = "";
      $scope.images = $rootScope.images;
    };
  }

  $scope.removeImage = function(index){
    $rootScope.images.splice(index,1);
    $scope.images = $rootScope.images;
  }
})

//, [ '$scope', '$cordovaCamera', '$cordovaFile', '$cordovaCapture', '$ionicPopup', '$sce', 'Category', 'Item', 'fileUpload', function($scope, $cordovaCamera, $cordovaFile, $cordovaCapture, $ionicPopup, $sce, Category, Item, fileUpload) {
.controller('UploadCtrl', [ '$rootScope', '$scope', '$cordovaCamera', '$cordovaFile', '$cordovaCapture', '$ionicPopup', 'RESOURCES', 'Category', 'Item', 'fileUpload', function($rootScope, $scope, $cordovaCamera, $cordovaFile, $cordovaCapture, $ionicPopup, RESOURCES, Category, Item, fileUpload) {
  $scope.itemDetails = {};
  $scope.categoryDetails = {};
  $scope.images = [];
  $scope.data = {};

  Category.query(function(data) {
    $scope.categories = data;
    $scope.data.category = $scope.categories[$scope.categories.length-1];
  });

  $scope.captureImage = function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      //allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      correctOrientation: true,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.images.push(imageData);
    }, function(err) {
      // error
    });
  }

  $scope.getImage = function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      //allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      correctOrientation: true,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.images.push(imageData);
    }, function(err) {
      // error
    });
  }

  $scope.deleteImage = function(index) {
    $scope.images.splice(index,1);
    if ($scope.images.length == 0) {
      if (this.modal.isShown()) {
        this.closeModal();
      };
    };
  }

  $scope.captureVideo = function() {
    var options = { limit: 1, duration: 5 };

    $cordovaCapture.captureVideo(options).then(function(mediaFiles) {
      $scope.videoURL = mediaFiles[0].fullPath;
    }, function(err) {
      // error
    });
  }

    $scope.getVideo = function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: Camera.MediaType.VIDEO
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.videoURL = imageData;
    }, function(err) {
      // error
    });
  }

  $scope.deleteVideo = function() {
    $scope.videoURL = "";
  }

  $scope.checkValidityCategory = function(){
    var noSubmit = false;
    if ($scope.categoryDetails.name == "" || !angular.isString($scope.categoryDetails.name)){
      noSubmit = true;
    }if ($scope.categoryDetails.description == "" || !angular.isString($scope.categoryDetails.description)){
      noSubmit = true;
    }
    if($scope.images.length > 0){
      $scope.categoryDetails.thumb = $scope.images[$scope.images.length-1];
    }
    if (!noSubmit) {
      $scope.showConfirmCategory();
    }else{
      $scope.showAlert();
    }
  }

  $scope.showConfirmCategory = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Category: <b>'+$scope.categoryDetails.name+'</b>',
      template: 'Are you sure you want upload this category?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        Category.add({}, $scope.categoryDetails);
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.showAlert = function(){
    var alertPopup = $ionicPopup.alert({
      title: 'Can\'t upload',
      template: 'Data required'
    });
      alertPopup.then(function(res) {
    });
  }

  $scope.checkValidityItem = function(category){
    var noSubmit = false;
    if ($scope.itemDetails.name == "" || !angular.isString($scope.itemDetails.name)){
      noSubmit = true;
    }if ($scope.itemDetails.description == "" || !angular.isString($scope.itemDetails.description)){
      noSubmit = true;
    }
    $scope.itemDetails.category_id = $scope.data.category.id;    
    $scope.itemDetails.video = $scope.videoURL;
    if (!noSubmit) {
      $scope.showConfirmItem();
    }else{
      $scope.showAlert();
    }
  }

  $scope.showConfirmItem = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Item: <b>'+$scope.itemDetails.name+'</b>',
      template: 'Are you sure you want upload it in the category <b>'+$scope.data.category.name+'</b>?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        Item.add({}, $scope.itemDetails);
        $scope.uploadFile();
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.uploadFile = function(){
    var uploadUrl = RESOURCES.IMAGES; //config URL
    Item.query({category_id: $scope.itemDetails.category_id}, function(items){
      $scope.imageDetails = {};
      $scope.imageDetails.item_id = items[items.length-1].id;
      for(var i = 0; i < $rootScope.images.length; i++){
        var file = $rootScope.images[i];
        $scope.imageDetails.name = $scope.imageDetails.label = file.name;
        var image = $scope.imageDetails;
        //console.log('file is ' + file +'-' +JSON.stringify(file) + "  @"+uploadUrl);
        fileUpload.uploadFileToUrl(file, uploadUrl, image);
      }
    });    
  };
}])

.controller('MediaCtrl', function($scope, $ionicModal, $sce) {
    $scope.data = {};
    $scope.data.tracking = 0; 
    $scope.data.durationMax = "00:00"; 
    $scope.data.durationPlayed = "00:00"; 
    $scope.data.volume = 0.6;

  // Fullscreens modals for view images and videos.
  $scope.showImagesFullscreen = function(index) {
    $ionicModal.fromTemplateUrl('templates/fullscreen-image.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
        $scope.index = index;
        /* Avoid propagation. */
        jQuery('.button').bind('click', function(event) {
          event.stopPropagation();
        });
    });
  }

  $scope.showVideoFullscreen = function(src) {
    $ionicModal.fromTemplateUrl('templates/fullscreen-video.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
        $scope.videoSrc = src; // src is $sce before.
        $scope.video = document.getElementById('videoF');
        $scope.inicializeVideo();
        /* Avoid propagation. */
        jQuery('.fullscreen').bind('click', function(event) {
          event.stopPropagation();
        });
    });
  }

  $scope.closeModal = function(){
    $scope.modal.remove();
  }

  $scope.inicializeVideo = function() {
    jQuery($scope.video).bind("timeupdate", function() {
      $scope.data.tracking = $scope.video.currentTime;
      var time = $scope.video.currentTime;
      if (parseInt(time)/60>=59) {
            var h = Math.floor(time / 3600);
            time = time - h * 3600;               
            var m = Math.floor(time / 60);
            var s = Math.floor(time % 60);
            if(h.toString().length<2){h='0'+h;}
            if(m.toString().length<2){m='0'+m;}
            if(s.toString().length<2){s='0'+s;} 
            time = h+':'+m+':'+s;       
        }else{
            var m = Math.floor(time / 60);
            var s = Math.floor(time % 60);
            if(m.toString().length<2){m='0'+m;}
            if(s.toString().length<2){s='0'+s;}
            time = m+':'+s;
      }
      $scope.data.durationPlayed = time;
      $scope.$digest();
    });

    jQuery($scope.video).bind("volumechange", function() {
      $scope.data.volume = $scope.video.volume;
      $scope.refreshVolumeIcon();
      $scope.$digest();
    });

    jQuery("input[name=tracking]").bind("change", function() {
      $scope.video.currentTime = $scope.data.tracking;
      $scope.$digest();
    });

    jQuery("input[name=volume]").bind("change", function() {
      $scope.video.volume = $scope.data.volume;
      $scope.refreshVolumeIcon();
    });

    jQuery($scope.video).on("ended", function() {
      $scope.stop();
    });

    jQuery($scope.video).on("loadeddata", function() {
      var m = Math.floor($scope.video.duration / 60);
      var s = Math.floor($scope.video.duration % 60);
      if(m.toString().length<2){m='0'+m;}
      if(s.toString().length<2){s='0'+s;}
      $scope.data.durationMax = m+':'+s;
      $scope.video.volume = $scope.data.volume;
    });
  }  

  $scope.play = function() {
    if ($scope.video.paused) {
      $scope.video.play();
      $scope.hideControls();
    }else{
      $scope.video.pause();
      $scope.showControls();
    }
    var playbutton = jQuery('#playbutton');
    playbutton.toggleClass('ion-play');
    playbutton.toggleClass('ion-pause');
  }

  $scope.stop = function() {
    var playbutton = angular.element('#playbutton');
    if (!$scope.video.paused) {
      playbutton.toggleClass('ion-play');
      playbutton.toggleClass('ion-pause');
    }
    $scope.video.currentTime = 0;
    $scope.video.pause();
    $scope.showControls();
  }

  $scope.displayVolume = function() {
    jQuery('.range-vertical').toggle();
  }

  $scope.refreshVolumeIcon = function() {
    var volume = $scope.data.volume;
    var icon = jQuery('.icon-volume');
    var classes = 'button button-icon icon icon-volume ';
    if (volume == 0) {
      icon.attr( "class", classes+'ion-volume-mute');
    }if (volume > 0 && volume < 0.34) {
      icon.attr( "class", classes+'ion-volume-low');
    }if (volume > 0.34 && volume < 0.67) {
      icon.attr( "class", classes+'ion-volume-medium');
    }if (volume > 0.67) {
      icon.attr( "class", classes+'ion-volume-high');
    }
  }

  $scope.showControls = function() {
    jQuery('.controls').css('webkit-transition-delay','0').css('transition-delay','0');
    jQuery(".controls").css("opacity", 1);
  }

  $scope.hideControls = function() {
    jQuery('.controls').css('webkit-transition-delay','1s').css('transition-delay','1s');
    jQuery(".controls").css("opacity", 0);
  }

  $scope.prevImage = function(index) {
    if (index-1 >= 0) {
      $scope.index--;
    };
  }

  $scope.nextImage = function(index) {
    if (index+1 <= $scope.images.length-1) {
      $scope.index++;
    };
  }

})

.controller('CountryListCtrl', function($location, $scope, Country) {
    Country.query(function(data) {
        $scope.countries = data;
    });
    $scope.insert = function(currentCountry) {
        console.log("llega ok." + currentCountry.code);
        Country.add({}, currentCountry);
        $location.path('/countries');
    };
    $scope.remove = function(currentCountry) {
        Country.remove({id: id}, {}, function (data) {
            $location.path('/');
        });
    };

})

.controller('CountryDetailCtrl', ['$location', '$scope', '$stateParams', 'Country'
    , function($location, $scope, $stateParams, Country) {
        $scope.country = Country.get({id: $stateParams.countryCode}, function(country) {
            //$scope.mainImageUrl = phone.images[0];
            console.log("carga ok");
        });
        $scope.update = function(currentCountry) {
            Country.update({id: $scope.country.code}, currentCountry, function(data) {
                $location.path('/');
            });
        };

    }])
;