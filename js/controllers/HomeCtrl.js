app.controller('HomeCtrl', ['$rootScope', '$scope', '$window', '$timeout', 'Person', 'actionCreators',
    function ($rootScope, $scope, $window, $timeout, Person, actionCreators) {
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

        // State changes listener
		$rootScope.$on('stateChanged', function (event, data) {
            $scope.view.state = data.state;

            if ($scope.view.state.ui.mapIsReady && data.action.type == GET_SHEET_ROWS) {
                actionCreators.populateMap($scope.view.state.people);
            }
		});

        // Deferred Initializations
        $window.initGapi = function () {
            actionCreators.initGapi();
        };

        $window.initMap = function () {
            actionCreators.setMapReady();
            if ($scope.view.state.people && $scope.view.state.people.ids.length > 0) {
                actionCreators.populateMap($scope.view.state.people);
            }
        };

    }])

