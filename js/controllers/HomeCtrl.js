app.controller('HomeCtrl', ['$rootScope', '$scope', '$window', '$timeout', 'Person', 'actionCreators', 'gapiService', 'mapService',
    function ($rootScope, $scope, $window, $timeout, Person, actionCreators, gapiService, mapService) {
        $scope.people = [];
        $scope.mapIsReady = false;
        $scope.view = {};

        $scope.login = function () {
            gapiService.signIn();
        };

        $scope.logout = function () {
            gapiService.signOut();
        };

        $window.initGapi = function () {
            actionCreators.initGapi();
        };

        $scope.addVisit = function (personIdx) {
            gapiService.addVisit(personIdx, $scope.people[personIdx]).then(function (updatedPerson) {
                $scope.people[personIdx] = updatedPerson;
            })
        };

        // State changes listener
		$rootScope.$on('stateChanged', function (event, data) {
                $scope.view.state = data.state;
                console.log($scope.view.state);

                if ($scope.mapIsReady) {
                    mapService.initMap($scope.people);
                }
		});

        $window.initMap = function () {
            $scope.mapIsReady = true;
            if ($scope.people.length > 0) {
                mapService.initMap($scope.people);
            }
        };

    }])

