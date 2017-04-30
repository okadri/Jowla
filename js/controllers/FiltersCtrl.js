app.controller('FiltersCtrl', ['$scope', '$uibModalInstance', 'state', 'actionCreators',
    function ($scope, $uibModalInstance, state, actionCreators) {

        // Construct a sorted unique country list from people list
        var userCountries = state.people.ids.filter(function (id) {
            return state.people.list[id].country;
        }).map(function (id) {
            return state.people.list[id].country;
        }).reduce(function (result, current) {
            if (result.indexOf(current) < 0) {
                result.push(current);
                return result;
            } else {
                return result;
            }
        }, []).sort(function(c1,c2) {
            return (c1.name > c2.name) ? 1 : (c1.name < c2.name) ? -1 : 0;
        });

        // Construct a sorted unique language list from people list
        var userLanguages = state.people.ids.filter(function (id) {
            return state.people.list[id].languages && state.people.list[id].languages.length;
        }).reduce(function (result, current) {
            var currentUser = state.people.list[current];
            currentUser.languages.forEach(function(l) {
                if (result.indexOf(l) < 0) {
                    result.push(l);
                }
            });
            return result;
        }, []).sort(function(l1,l2) {
            return (l1.name > l2.name) ? 1 : (l1.name < l2.name) ? -1 : 0;
        });

        $scope.view = {
            state: state,
            userCountries: userCountries,
            userLanguages: userLanguages
        };

        $scope.apply = function () {
            $uibModalInstance.close($scope.view.state.ui.filters);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.clearFilters = function () {
            $scope.view.state.ui.filters.countries.length = 0;
            $scope.view.state.ui.filters.languages.length = 0;
        };

    }
]);