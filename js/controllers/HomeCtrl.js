app.controller('HomeCtrl', ['$scope', '$window', '$timeout', '$routeParams', '$location', 'actionCreators',
    function ($scope, $window, $timeout, $routeParams, $location, actionCreators) {
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

        $scope.goToPerson = function (personId) {
            $location.path('/' + $scope.view.state.ui.sheetId + '/p/' + personId);
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

