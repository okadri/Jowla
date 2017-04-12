app.controller('HomeCtrl', ['$scope', '$window', '$timeout', '$routeParams', '$location', 'actionCreators',
    function ($scope, $window, $timeout, $routeParams, $location, actionCreators) {
        $scope.view = {
            state: actionCreators.getState(),
            searchTerm: ''
        };
        actionCreators.setPageTitle($scope.view.state.ui.sheet.title);

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
            $location.path('/' + $scope.view.state.ui.sheet.id + '/p/' + personId);
        };

        $scope.switchDisplayMode = function () {
            actionCreators.switchDisplayMode();
        };

        $scope.search = function() {
            actionCreators.filterPeople($scope.view.searchTerm);
        };

        // State changes listener
        var reMapActions = [
            SWITCH_DISPLAY_MODE,
            FILTER_PEOPLE
        ]
		$scope.$on('stateChanged', function (event, data) {
            $timeout(function() {
                $scope.view.state = data.state;
            });

            if ($scope.view.state.ui.mapIsReady &&
            reMapActions.indexOf(data.action.type) >= 0 &&
            $scope.view.state.ui.displayMode == DISPLAY_MODE.MAP) {
                $timeout(function() {
                    actionCreators.populateMap($scope.view.state.people, true);
                });
            }
		});

		$scope.$on('mapPopulationStatusChanged', function (event, data) {
            $timeout(function() {
                $scope.view.mapProgress = data;
            });
        });
    }]);

