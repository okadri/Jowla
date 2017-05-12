app.controller('MergeCtrl', ['$scope', '$uibModalInstance', 'state', 'actionCreators',
	function ($scope, $uibModalInstance, state, actionCreators) {

		$scope.view = {
			state: state,
			newSheetId: '',
			idInvalid: true
		};

		$scope.next = function () {
			if ($scope.view.idInvalid) { return; }
			switch ($scope.view.state.ui.mergeStep) {
				case 0:
					actionCreators.getMergeReport($scope.view.newSheetId);
					break;
				case 1:
					actionCreators.performMerge($scope.view.state.people);
					$scope.close();
					break;
				default:
					$scope.close();
			}
		};

		$scope.close = function () {
			actionCreators.resetMerge();
			$uibModalInstance.dismiss();
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