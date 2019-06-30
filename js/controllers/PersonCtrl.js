app.controller('PersonCtrl', ['$scope', '$timeout', '$routeParams', '$location', '$uibModal', 'actionCreators',
    function ($scope, $timeout, $routeParams, $location, $uibModal, actionCreators) {
        var state = actionCreators.getState();

        if ($routeParams.personId) {
            $scope.view = {
                state: state,
                person: state.people.list[$routeParams.personId],
                editedPerson: angular.copy(state.people.list[$routeParams.personId]),
                countries: countries,
                languages: languages,
                accIsOpen: [true, false, false, false],
                isEditing: false,
            };
            actionCreators.setPageTitle($scope.view.person.fullName);

            // TODO: Consider moving to a directive
            if($scope.view.state.ui.isSignedIn) {
                $timeout(function() {
                    actionCreators.populateMap($scope.view.state.people, $scope.view.person.id);
                });
            }
        } else {
            $scope.view = {
                state: state,
                isEditing: true,
            };
            actionCreators.setPageTitle("Add a new person");
        }

        $scope.login = function () {
            actionCreators.signIn();
        };

        $scope.logout = function () {
            actionCreators.signOut();
        };

        $scope.openVisitDiag = function (size) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/visit.html',
                controller: 'VisitCtrl',
                size: size,
                resolve: {
                    state: function () {
                        return $scope.view.state;
                    }
                }
            });

            modalInstance.result.then(function (notes) {
                if (!$scope.view.person.isVisitedToday()) {
                    actionCreators.addVisit($scope.view.person, notes);
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
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

        $scope.toggleEdit = function (doSave) {
            if ($scope.view.isEditing && doSave) {
                actionCreators.updatePerson($scope.view.editedPerson);
            } else {
                $scope.view.editedPerson = angular.copy(state.people.list[$routeParams.personId]);
            }
            $scope.view.isEditing = !$scope.view.isEditing;
        };

        // State changes listener
        $scope.$on('stateChanged', function (event, data) {
            $timeout(function() {
                $scope.view.state = data.state;
                $scope.view.person = data.state.people.list[$routeParams.personId];

                // If initial load of view, populate map
                if ($scope.view.person && $scope.view.state.ui.mapIsReady && data.action.type === GET_SHEET_ROWS && $scope.view.state.people.ids.length) {
                    actionCreators.populateMap($scope.view.state.people, $scope.view.person.id);
                }
                // If hiding person, navigate to main list
                if (data.action.type === HIDE_PERSON) {
                    $location.path('/' + $scope.view.state.ui.sheet.id);
                }

                // Update map location if user has been updated
                if (data.action.type === UPDATE_PERSON && $scope.view.person.address.md5 !== MD5($scope.view.person.address.full)) {
                    actionCreators.populateMap($scope.view.state.people, $scope.view.person.id);
                }
            });
        });

    }]);

