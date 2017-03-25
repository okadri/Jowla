app.controller('HomeCtrl', ['$scope', '$window', '$rootScope', '$timeout', 'Person', 'gapiService', 'mapService',
    function ($scope, $window, $rootScope, $timeout, Person, gapiService, mapService) {
        $scope.people = [];
        $scope.mapIsReady = false;

        $scope.login = function () {
            gapiService.signIn();
        };

        $scope.logout = function () {
            gapiService.signOut();
        };

        $window.initGapi = function () {
            gapiService.initGapi();
        };

        $window.initMap = function () {
            $scope.mapIsReady = true;
            if ($scope.people.length > 0) {
                mapService.initMap($scope.people);
            }
        };

        $scope.$on('google:authenticated', function (event, isSignedIn) {
            $timeout(function () {
                $scope.isSignedIn = isSignedIn;
                gapiService.getSheetRows().then(function (rows) {
                    $scope.people = rows.map(function (row) {
                        return new Person(row);
                    });

                    if ($scope.mapIsReady) {
                        mapService.initMap($scope.people);
                    }
                });
            });
        });

        $scope.addVisit = function (personIdx) {
            gapiService.addVisit(personIdx, $scope.people[personIdx]).then(function (updatedPerson) {
                $scope.people[personIdx] = updatedPerson;
            })
        };

    }])

