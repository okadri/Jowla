var app = angular.module('jawlaTracker', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/:sheetId', {
            templateUrl: 'views/homeCtrl.html',
            controller: 'HomeCtrl',
            resolve : {
                initApis : function(actionCreators,$route) {
                    return actionCreators.initGapi($route.current.params.sheetId).then(function() {
                        return actionCreators.setMapReady();
                    });
                }
            }
        })
        .when('/:sheetId/p/:personId', {
            templateUrl: 'views/personCtrl.html',
            controller: 'PersonCtrl',
            resolve : {
                initApis : function(actionCreators,$route) {
                    return actionCreators.initGapi($route.current.params.sheetId).then(function() {
                        return actionCreators.setMapReady();
                    });
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });
});
