app.controller('PersonCtrl', ['$scope', '$timeout', '$routeParams', '$location', 'actionCreators',
    function ($scope, $timeout, $routeParams, $location, actionCreators) {
        var state = actionCreators.getState();
        $scope.view = {
            state: state,
            person: state.people.list[$routeParams.personId],
            countries: countries,
            languages: languages,
            accIsOpen: [true, false, false, false]
        };
        actionCreators.setPageTitle($scope.view.person.fullName);

        // TODO: Consider moving to a directive
        if($scope.view.state.ui.isSignedIn) {
            $timeout(function() {
                actionCreators.populateMap($scope.view.state.people, $scope.view.person.id);
            });
        }

        $scope.login = function () {
            actionCreators.signIn();
        };

        $scope.logout = function () {
            actionCreators.signOut();
        };

        $scope.addVisit = function () {
            if ($scope.view.person.isVisitedToday()) { return; }
            actionCreators.addVisit($scope.view.person);
        };

        $scope.updateNotes = function () {
            actionCreators.updateNotes($scope.view.person);
        };

        $scope.updateCountry = function () {
            actionCreators.updateCountry($scope.view.person);
        };

        $scope.updateLanguages = function () {
            actionCreators.updateLanguages($scope.view.person);
        };

        $scope.hidePerson = function () {
            actionCreators.hidePerson($scope.view.person);
        };

        // State changes listener
		$scope.$on('stateChanged', function (event, data) {
            $timeout(function() {
                $scope.view.state = data.state;
                $scope.view.person = data.state.people.list[$routeParams.personId];

                // If initial load of view, populate map
                if ($scope.view.state.ui.mapIsReady && data.action.type === GET_SHEET_ROWS && $scope.view.state.people.ids.length) {
                    actionCreators.populateMap($scope.view.state.people, $scope.view.person.id);
                }
                // If hiding person, navigate to main list
                if (data.action.type === HIDE_PERSON) {
                    $location.path('/' + $scope.view.state.ui.sheet.id);
                }
            });
		});

    }]);

