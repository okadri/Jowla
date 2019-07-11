app.controller('ImageCtrl', ['$scope', '$uibModalInstance', 'helpItem',
	function ($scope, $uibModalInstance, helpItem) {

		$scope.view = {
			helpItem: helpItem
		};

		$scope.close = function () {
			$uibModalInstance.dismiss();
		};

	}
]);