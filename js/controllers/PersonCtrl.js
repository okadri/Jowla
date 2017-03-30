app.controller('PersonCtrl', ['$rootScope', '$scope', '$timeout', '$routeParams', 'actionCreators',
    function ($rootScope, $scope, $timeout, $routeParams, actionCreators) {
        $scope.personId = $routeParams.personId;
        $scope.view = {
            state: actionCreators.getState()
        };

        // TODO: Consider moving to a directive
        $timeout(function() {
            var people = angular.copy($scope.view.state.people);
            people.ids = [$scope.personId]; // Limit map markers to just the current person
            actionCreators.populateMap(people);
        });

        $scope.addVisit = function (personId) {
            actionCreators.addVisit($scope.view.state.people.list[personId]);
        };

        // State changes listener
		$rootScope.$on('stateChanged', function (event, data) {
            $scope.view.state = data.state;
		});

    }]);

