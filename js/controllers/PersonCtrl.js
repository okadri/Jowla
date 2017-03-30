app.controller('PersonCtrl', ['$scope', '$timeout', '$routeParams', 'actionCreators',
    function ($scope, $timeout, $routeParams, actionCreators) {
        $scope.personId = $routeParams.personId;
        $scope.view = {
            state: actionCreators.getState()
        };

        // TODO: Consider moving to a directive
        if($scope.view.state.ui.isSignedIn) {
            $timeout(function() {
                var people = angular.copy($scope.view.state.people);
                people.ids = [$scope.personId]; // Limit map markers to just the current person
                actionCreators.populateMap(people);
            });
        }

        $scope.login = function () {
            actionCreators.signIn();
        };

        $scope.logout = function () {
            actionCreators.signOut();
        };

        $scope.addVisit = function (personId) {
            actionCreators.addVisit($scope.view.state.people.list[personId]);
        };

        // State changes listener
		$scope.$on('stateChanged', function (event, data) {
            $timeout(function() {
                $scope.view.state = data.state;

                if ($scope.view.state.ui.mapIsReady && data.action.type !== POPULATE_MAP && $scope.view.state.people.ids.length) {
                    var people = angular.copy($scope.view.state.people);
                    people.ids = [$scope.personId]; // Limit map markers to just the current person
                    actionCreators.populateMap(people);
                }
            });
		});

    }]);

