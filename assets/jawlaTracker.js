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
                    gapiService.getSheetRows().then(function(rows) {
                        $scope.sheetRows = rows;
                    });
                });
            });


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
        }
    }]);



// /**
//  * Append a pre element to the body containing the given message
//  * as its text node. Used to display the results of the API call.
//  *
//  * @param {string} message Text to be placed in pre element.
//  */
// function appendPre(message) {
//     var pre = document.getElementById('content');
//     var entry = document.createElement("P");
//     entry.innerHTML = message;
//     pre.appendChild(entry);
// }

// /**
//  * Print the names and majors of students in a sample spreadsheet:
//  * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  */
// function listMajors() {
//     gapi.client.sheets.spreadsheets.values.get({
//         spreadsheetId: SS_ID,
//         range: 'List!A2:G',
//     }).then(function (response) {
//         var range = response.result;
//         if (range.values.length > 0) {
//             for (i = 0; i < range.values.length; i++) {
//                 var row = range.values[i];
//                 var rowNum = (i + 2);
//                 var checked = row[0] ? 'checked' : '';
//                 var checkBox = "<input type='checkbox' onclick='toggleEntry(" + rowNum + ",\"" + row[0] + "\")' " + checked + "> ";
//                 appendPre(checkBox + row[1] + ' ' + row[2] + ', ' + row[3] + ' ' + row[4] + ' ' + row[5] + ' ' + row[6]);
//             }
//         } else {
//             appendPre('No data found.');
//         }
//     }, function (response) {
//         appendPre('Error: ' + response.result.error.message);
//     });
// }

// /**
//  * Update the first cell in the row
//  * Adds time stamp if empty, empty if has content
//  */
// function toggleEntry(rowNum, value) {
//     var newValue = value ? '' : new Date();
//     gapi.client.sheets.spreadsheets.values.update({
//         spreadsheetId: SS_ID,
//         range: 'List!A' + rowNum,
//         valueInputOption: 'USER_ENTERED',
//         values: [[newValue]]
//     }).then(function (response) {
//         console.log(response);
//     });
// }
