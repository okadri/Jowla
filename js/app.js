var app = angular.module('jawlaTracker', ['ngRoute']);

app.config(function ($routeProvider) {
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
});
