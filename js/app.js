var app = angular.module('jawlaTracker', ['ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap']);

app.config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|sms):/);

	$routeProvider
		.when('/', {
			templateUrl: 'views/instructions.html'
		})
		.when('/:sheetId', {
			templateUrl: 'views/homeCtrl.html',
			controller: 'HomeCtrl',
			resolve: {
				initApis: function (actionCreators, $route) {
					return actionCreators.initialize($route.current.params.sheetId);
				}
			}
		})
		.when('/:sheetId/p/:personId', {
			templateUrl: 'views/personCtrl.html',
			controller: 'PersonCtrl',
			resolve: {
				initApis: function (actionCreators, $route) {
					return actionCreators.initialize($route.current.params.sheetId, parseInt($route.current.params.personId));
				}
			}
		})
		.when('/:sheetId/newPerson', {
			templateUrl: 'views/personCtrl.html',
			controller: 'PersonCtrl',
			resolve: {
				initApis: function (actionCreators, $route) {
					return actionCreators.initialize($route.current.params.sheetId);
				}
			}
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

app.run(['$rootScope', '$location', function ($rootScope, $location) {
	$rootScope.title = "Jowla";

	$rootScope.$on('$routeChangeStart', function () {
		$rootScope.loading = true;
	});

	$rootScope.$on('$routeChangeSuccess', function () {
		$rootScope.loading = false;
	});

	$rootScope.$on('$routeChangeError', function (a, b, c) {
		$rootScope.loading = false;
		$location.path('/');
	});
}]);

function getMobileOperatingSystem() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	// Windows Phone must come first because its UA also contains "Android"
	if (/windows phone/i.test(userAgent)) {
			return "Windows Phone";
	}

	if (/android/i.test(userAgent)) {
			return "Android";
	}

	// iOS detection from: http://stackoverflow.com/a/9039885/177710
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
			return "iOS";
	}

	return "unknown";
}