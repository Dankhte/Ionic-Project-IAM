// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'ngResource', 'starter.controllers', 'starter.config'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.categories', {
    url: "/categories",
    views: {
      'menuContent': {
        templateUrl: "templates/categories.html",
        controller: 'CategoriesCtrl'
      }
    }
  })

  .state('app.single', {
    url: "/categories/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "templates/category.html",
        controller: "CategoryCtrl"
      }
    }
  })

  .state('app.single2', {
    url: "/categories/:categoryId/:itemId",
    views: {
      'menuContent': {
        templateUrl: "templates/item.html",
        controller: "ItemCtrl"
      }
    }
  })

  .state('app.countries', {
    url: "/countries",
    views: {
      'menuContent': {
        templateUrl: "templates/country.main.html",
        controller: 'CountryListCtrl'
      }
    }
  })

  .state('app.country', {
    url: "/countries/:countryCode",
    views: {
      'menuContent': {
        templateUrl: "templates/country.detail.html",
        controller: 'CountryDetailCtrl'
      }
    }
  })

  .state('app.favourites', {
    url: "/favourites",
    views: {
      'menuContent': {
        templateUrl: "templates/favourites.html",
        controller: 'FavouritesCtrl'
      }
    }
  })

  .state('app.random', {
    url: "/random",
    views: {
      'menuContent': {
        templateUrl: "templates/item.html",
        controller: 'RandomCtrl'
      }
    }
  })

  .state('app.upload', {
    url: "/upload",
    views: {
      'menuContent': {
        templateUrl: "templates/upload.html",
        controller: 'UploadCtrl'
      }
    }
  })
/* Try to do another nav-view.

  .state('upload.main', {
    url: "/main",
    views: {
      'uploadContent': {
        templateUrl: "templates/upload.html",
        controller: 'UploadCtrl'
      }
    }
  })

  .state('upload', {
    url: "/upload",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('upload.item', {
    url: "/item",
    views: {
      'uploadContent': {
        templateUrl: "templates/upload.item.html"
      }
    }
  })*/;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
