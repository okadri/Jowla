app.controller('FiltersCtrl', ['$scope', '$uibModalInstance', 'state', 'actionCreators',
    function ($scope, $uibModalInstance, state, actionCreators) {
        $scope.view = {
            state: state,
            countries: countries,
            selectedCountries: []
        };

        $scope.apply = function () {
            $uibModalInstance.close($scope.view.selectedCountries);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
]);