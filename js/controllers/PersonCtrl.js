app.controller('PersonCtrl', ['$scope', '$timeout', '$routeParams', '$location', 'actionCreators',
    function ($scope, $timeout, $routeParams, $location, actionCreators) {
        $scope.personId = $routeParams.personId;
        $scope.view = {
            state: actionCreators.getState()
        };
        actionCreators.setPageTitle($scope.view.state.people.list[$scope.personId].fullName);

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
            if ($scope.visitedToday(personId)) { return; }
            actionCreators.addVisit($scope.view.state.people.list[personId]);
        };

        $scope.updateNotes = function (personId) {
            actionCreators.updateNotes($scope.view.state.people.list[personId]);
        };

        $scope.hidePerson = function (personId) {
            actionCreators.hidePerson($scope.view.state.people.list[personId]);
        };

        $scope.visitedToday = function (personId) {
            return $scope.view.state.people.list[personId].visitHistory.some(function(visit){
                return visit.date.toDateString() == (new Date()).toDateString();
            });
        };

        // State changes listener
		$scope.$on('stateChanged', function (event, data) {
            $timeout(function() {
                $scope.view.state = data.state;

                // If initial load of view, populate map
                if ($scope.view.state.ui.mapIsReady && data.action.type === GET_SHEET_ROWS && $scope.view.state.people.ids.length) {
                    var people = angular.copy($scope.view.state.people);
                    people.ids = [$scope.personId]; // Limit map markers to just the current person
                    actionCreators.populateMap(people);
                }
                // If hiding person, navigate to main list
                if (data.action.type === HIDE_PERSON) {
                    $location.path('/' + $scope.view.state.ui.sheet.id);
                }
            });
		});

    }]);

