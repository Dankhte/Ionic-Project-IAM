var myApp = angular.module("starter.config",[]);
myApp.constant('RESOURCES', (function() {
    // Define your variable/*
    var resource = 'http://www.planificaciondeportiva.es';
    var activeApi = '/bmoll-app/api/web/v1';
    // Use the variable in your constants
    return {
        USERS_DOMAIN: resource,
        USERS_API: resource + activeApi,
        COUNTRIES: resource + activeApi+ '/countries',
        CATEGORIES: resource + activeApi+ '/categories',
        ITEMS: resource + activeApi+ '/items',
        IMAGES: resource + activeApi+ '/images'
    }
})());

myApp.factory("Category", function(RESOURCES, $resource) {
    //return $resource(RESOURCES.CATEGORIES+"/:id");
    return $resource(RESOURCES.CATEGORIES + "/:id", null,
        {
            query: {method: 'GET', isArray: true},
            get: {method: 'GET'},
            add: {method: 'POST'},
            delete: {method: 'DELETE'},
            update: {method: 'PUT'} /*,params:{id:'@code'}*/
        });
});

myApp.factory("Item", function(RESOURCES, $resource) {
    return $resource(RESOURCES.ITEMS + "/:id", null,
        {
            query: {method: 'GET', isArray: true},
            get: {method: 'GET'},
            add: {method: 'POST'},
            delete: {method: 'DELETE'},
            update: {method: 'PUT'}
        });
});

myApp.factory("Image", function(RESOURCES, $resource) {
    return $resource(RESOURCES.IMAGES + "/:id", null,
        {
            query: {method: 'GET', isArray: true},
            get: {method: 'GET'},
            add: {method: 'POST'},
            delete: {method: 'DELETE'},
            update: {method: 'PUT'}
        });
});

myApp.factory("Country", function(RESOURCES, $resource) {
    //return $resource("http://www.planificaciondeportiva.es/bmoll-app/api/web/v1/countries/:id");
    return $resource(RESOURCES.COUNTRIES + "/:id", null,
        {
            query: {method: 'GET', isArray: true},
            get: {method: 'GET'},
            add: {method: 'POST'},
            delete: {method: 'DELETE'},
            update: {method: 'PUT'} /*,params:{id:'@code'}*/
        });
});

/* Upload file directory */
myApp.service('fileUpload', ['$http', function ($http) {
    /**
     *
     * @param file fichero a subir obtenido en el controlador
     * @param uploadUrl URL de tratamiento del fichero de resources.config
     * @param additionalData Objeto JSON con attributos del formulario (el objeto a guardar adicionalmente)
     */
    this.uploadFileToUrl = function(file, uploadUrl, additionalData){
        //genero
        var fd = new FormData();
        fd.append('file', file);
        if (additionalData!=null){
            for (var key in additionalData) {
                if (additionalData.hasOwnProperty(key)) {
                    fd.append(key,additionalData[key]);
                }
            }
        }
        //Realizo un post a la url definida. Pendiente realización callbacks para subida correcta
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}, /* ASOTO it makes browser detect type of content type and set by the server to multipart*/
        })
            .success(function(){
                console.log("Upload OK");
            })
            .error(function(data, status, headers, config){
                console.log("Upload ERROR");
            });
    }
}]);

myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

/* Loading directive. */
myApp.directive('routeLoading', [ '$rootScope', '$ionicLoading', function($rootScope, $ionicLoading) {
    return {
        restrict: 'E',
        link: function() {
            $rootScope.$on('$ionicView.beforeEnter', function(event) {
                $ionicLoading.show({
                    template: 'Loading<br/><span class="ion-load-a"></span>'
                });
            });
            $rootScope.$on('$ionicView.afterEnter', function(event) {
                $ionicLoading.hide();
            });
      }
    };
}]);

/*
 Definimos soporte de formularios para objetos JSON
 http://cacodaemon.de/index.php?id=44
 */
angular.module('starter').config(function($httpProvider) {
    $httpProvider.defaults.transformRequest = function (data) {
        var str = [];
        for (var p in data) {
            data[p] !== undefined && str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
        }
        return str.join('&');
    };
    $httpProvider.defaults.headers.put['Content-Type'] = $httpProvider.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded; charset=UTF-8';
});