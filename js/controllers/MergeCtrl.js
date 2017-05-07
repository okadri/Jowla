app.controller('MergeCtrl', ['$scope', '$uibModalInstance', 'state', 'actionCreators',
	function ($scope, $uibModalInstance, state, actionCreators) {

		$scope.view = {
			state: state,
			newSheetId: '',
			idInvalid: true
		};

		$scope.next = function () {
			if ($scope.view.idInvalid) { return; }
			actionCreators.getMergeReport($scope.view.newSheetId);
		};

		$scope.apply = function () {
			$uibModalInstance.close($scope.view.state.ui.filters);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.validateSheetId = function () {
			if ($scope.view.newSheetId.length !== 44) {
				$scope.view.error = 'Invalid Google sheet ID';
				$scope.view.idInvalid = true;
			} else if ($scope.view.newSheetId === $scope.view.state.ui.sheet.id) {
				$scope.view.error = 'Sheet cannot be merged into itself';
				$scope.view.idInvalid = true;
			} else {
				delete $scope.view.error;
				$scope.view.idInvalid = false;
			}
		}
	}
]);