app.controller('MergeCtrl', ['$scope', '$uibModalInstance', 'state', 'actionCreators',
	function ($scope, $uibModalInstance, state, actionCreators) {

		$scope.view = {
			state: state
		};

		$scope.apply = function () {
			$uibModalInstance.close($scope.view.state.ui.filters);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}
]);