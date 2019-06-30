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

		$scope.newPerson = function () {
			$location.path('/' + $scope.view.state.ui.sheet.id + '/newPerson');
		};

		$scope.switchDisplayMode = function (mode) {
			actionCreators.switchDisplayMode(mode);
		};

		$scope.search = function () {
			actionCreators.filterPeople($scope.view.state.ui.filters);
		};

		$scope.clearSearch = function () {
			$scope.view.navMode = '';
			$scope.view.state.ui.filters.searchTerm = '';
			actionCreators.filterPeople($scope.view.state.ui.filters);
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

			modalInstance.result.then(function () {
				actionCreators.filterPeople($scope.view.state.ui.filters);
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.openMergeDiag = function (size) {
			var modalInstance = $uibModal.open({
				templateUrl: 'views/merge.html',
				controller: 'MergeCtrl',
				size: size,
				resolve: {
					state: function () {
						return $scope.view.state;
					}
				}
			});

			modalInstance.result.then(function () {
				// Do Stuff
			}, function () {
				// Dismissed
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

