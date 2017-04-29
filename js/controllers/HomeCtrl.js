app.controller('HomeCtrl', ['$scope', '$log', '$window', '$timeout', '$routeParams', '$location', '$uibModal', 'actionCreators',
    function ($scope, $log, $window, $timeout, $routeParams, $location, $uibModal, actionCreators) {
        $scope.view = {
            state: actionCreators.getState(),
            filters: {}
        };
        actionCreators.setPageTitle($scope.view.state.ui.sheet.title);

        // TODO: Consider moving to a directive
        if ($scope.view.state.ui.isSignedIn && $scope.view.state.ui.displayMode == DISPLAY_MODE.MAP) {
            $timeout(function () {
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

        $scope.search = function () {
            actionCreators.filterPeople($scope.view.filters);
        };

        $scope.clearSearch = function () {
            $scope.view.navMode = '';
            $scope.view.filters.searchTerm = '';
            actionCreators.filterPeople($scope.view.filters);
        };

        $scope.openFilters = function (size) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/filters.html',
                controller: 'FiltersCtrl',
                size: size,
                resolve: {
                    state: function () {
                        return $scope.view.state;
                    }
                }
            });

            modalInstance.result.then(function (selectedCountries) {
                $scope.view.filters.countries = selectedCountries;
                actionCreators.filterPeople($scope.view.filters);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        // State changes listener
        var reMapActions = [
            SWITCH_DISPLAY_MODE,
            FILTER_PEOPLE
        ]
        $scope.$on('stateChanged', function (event, data) {
            $timeout(function () {
                $scope.view.state = data.state;
            });

            if ($scope.view.state.ui.mapIsReady &&
                reMapActions.indexOf(data.action.type) >= 0 &&
                $scope.view.state.ui.displayMode == DISPLAY_MODE.MAP) {
                $timeout(function () {
                    actionCreators.populateMap($scope.view.state.people);
                });
            }
        });

        $scope.$on('mapPopulationStatusChanged', function (event, data) {
            $timeout(function () {
                $scope.view.mapProgress = data;
            });
        });
    }]);

