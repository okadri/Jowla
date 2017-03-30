app.controller('HomeCtrl', ['$scope', '$window', '$timeout', '$routeParams', 'actionCreators',
    function ($scope, $window, $timeout, $routeParams, actionCreators) {
        $scope.view = {
            state: actionCreators.getState()
        };

        // TODO: Consider moving to a directive
        if($scope.view.state.ui.isSignedIn && $scope.view.state.ui.displayMode == DISPLAY_MODE.MAP) {
            $timeout(function() {
                actionCreators.populateMap($scope.view.state.people);
            });
        }

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
		$scope.$on('stateChanged', function (event, data) {
            $timeout(function() {
                $scope.view.state = data.state;
            });

            if ($scope.view.state.ui.mapIsReady &&
            data.action.type == SWITCH_DISPLAY_MODE &&
            $scope.view.state.ui.displayMode == DISPLAY_MODE.MAP) {
                $timeout(function() {
                    actionCreators.populateMap($scope.view.state.people);
                });
            }
		});

    }]);

