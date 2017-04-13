var app = angular.module('jawlaTracker', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/instructions.html'
        })
        .when('/:sheetId', {
            templateUrl: 'views/homeCtrl.html',
            controller: 'HomeCtrl',
            resolve : {
                initApis : function(actionCreators,$route) {
                    return actionCreators.initialize($route.current.params.sheetId);
                }
            }
        })
        .when('/:sheetId/p/:personId', {
            templateUrl: 'views/personCtrl.html',
            controller: 'PersonCtrl',
            resolve : {
                initApis : function(actionCreators,$route) {
                    return actionCreators.initialize($route.current.params.sheetId);
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.title = "Jowla";

    $rootScope.$on('$routeChangeStart', function(){ 
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function(){ 
        $rootScope.loading = false;
    });

    $rootScope.$on('$routeChangeError', function(a,b,c){ 
        $rootScope.loading = false;
        $location.path('/');
    });
}]);