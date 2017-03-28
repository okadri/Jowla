var app = angular.module('jawlaTracker', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/:sheetId?', {
            templateUrl: 'views/homeCtrl.html',
            controller: 'HomeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
