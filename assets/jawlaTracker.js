var init = function () {
    window.initGapi();
}

angular
    .module('jawlaTracker', [])

    .controller('jawlaTrackerCtrl', ['$scope', '$window', '$rootScope', '$timeout', 'gapiService',
        function ($scope, $window, $rootScope, $timeout, gapiService) {

            $scope.login = function () {
                gapiService.signIn();
            };

            $scope.logout = function () {
                gapiService.signOut();
            };

            $window.initGapi = function () {
                gapiService.initGapi();
            };

            $scope.$on('google:authenticated', function (event, isSignedIn) {
                $timeout(function () {
                    $scope.isSignedIn = isSignedIn;
                    gapiService.getSheetRows().then(function (rows) {
                        $scope.people = rows.map(function (row) {
                            return {
                                isVisited: !!row[0],
                                lastVisited: row[0],
                                firstName: row[1],
                                lastName: row[2],
                                address: row[3] + ', ' + row[4] + ', ' + row[5] + ' ' + row[6]
                            }
                        });
                    });
                });
            });

            $scope.toggleStatus = function (index) {
                gapiService.toggleStatus(index, $scope.people[index].isVisited).then(function(){
                    $scope.people[index].isVisited = !$scope.people[index].isVisited;
                });
            };

        }])

    .service('gapiService', ['$rootScope', '$q', function ($rootScope, $q) {
        var SS_ID = '1lcXvxSW6BH3OIa2leTuxP_M1XKxzRnPu2I2f645BsxE';

        this.initGapi = function () {
            // Client ID and API key from the Developer Console
            var CLIENT_ID = '273724384440-85de3san0p08tod1gn9lnlicropdhqau.apps.googleusercontent.com';
            var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
            var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

            gapi.load('client:auth2', initClient);

            function initClient() {
                gapi.client.init({
                    discoveryDocs: DISCOVERY_DOCS,
                    clientId: CLIENT_ID,
                    scope: SCOPES
                }).then(function () {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                    // Handle the initial sign-in state.
                    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                });
            }

            function updateSigninStatus(isSignedIn) {
                $rootScope.$broadcast("google:authenticated", isSignedIn);
            }

        };

        this.signIn = function () {
            gapi.auth2.getAuthInstance().signIn();
        };

        this.signOut = function () {
            gapi.auth2.getAuthInstance().signOut();
        };

        this.getSheetRows = function () {
            var deferred = $q.defer();

            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: SS_ID,
                range: 'List!A2:G',
            }).then(function (response) {
                deferred.resolve(response.result.values);
            }, function (response) {
                deferred.reject(response.result.error);
            });

            return deferred.promise;
        };

        this.toggleStatus = function (index, currentVisitStatus) {
            var deferred = $q.defer();

            var newValue = currentVisitStatus ? '' : new Date();
            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: SS_ID,
                range: 'List!A' + (index + 2),
                valueInputOption: 'USER_ENTERED',
                values: [[newValue]]
            }).then(function (response) {
                deferred.resolve();
            });

            return deferred.promise;
        };
    }]);