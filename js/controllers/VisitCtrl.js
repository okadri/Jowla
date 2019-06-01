app.controller('VisitCtrl', ['$scope', '$uibModalInstance', 'state', 'actionCreators',
	function ($scope, $uibModalInstance, state, actionCreators) {

		$scope.view = {
			notes: ''
		};

		$scope.addVisit = function () {
			$uibModalInstance.close($scope.view.notes);
		};

		$scope.close = function () {
			$uibModalInstance.dismiss();
		};

	}
]);