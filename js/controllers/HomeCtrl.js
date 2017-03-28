app.controller('HomeCtrl', ['$rootScope', '$scope', '$window', '$timeout', '$routeParams', 'actionCreators',
    function ($rootScope, $scope, $window, $timeout, $routeParams, actionCreators) {
        $scope.mapIsReady = false;
        $scope.view = {
            state: {}
        };

        $scope.login = function () {
            actionCreators.signIn();
        };

        $scope.logout = function () {
            actionCreators.signOut();
        };

        $scope.addVisit = function (personIdx) {
            actionCreators.addVisit($scope.view.state.people.list[personIdx]);
        };

        $scope.switchDisplayMode = function () {
            actionCreators.switchDisplayMode();
        };

        // State changes listener
		$rootScope.$on('stateChanged', function (event, data) {
            $scope.view.state = data.state;

            if ($scope.view.state.ui.mapIsReady &&
            data.action.type == SWITCH_DISPLAY_MODE &&
            $scope.view.state.ui.displayMode == DISPLAY_MODE.MAP) {
                $timeout(function() {
                    actionCreators.populateMap($scope.view.state.people);
                });
            }
		});

        // Deferred Initializations
        $window.initGapi = function () {
            // Wait for the digest cycle to make sure the route params are set
            $timeout(function() {
                actionCreators.initGapi($routeParams.sheetId);
            });
        };

        $window.initMap = function () {
            actionCreators.setMapReady();
        };

    }])

