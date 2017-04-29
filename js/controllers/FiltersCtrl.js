app.controller('FiltersCtrl', ['$scope', '$uibModalInstance', 'state', 'actionCreators',
    function ($scope, $uibModalInstance, state, actionCreators) {
        $scope.view = {
            state: state,
            countries: countries,
        };

        $scope.apply = function () {
            $uibModalInstance.close($scope.view.state.ui.filters.countries);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.clearFilters = function () {
            $scope.view.state.ui.filters.countries.length = 0;
        };

    }
]);