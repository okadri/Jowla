var initGapi = function () {
    window.initGapi();
};

var initMap = function () {
    window.initMap();
};

angular
    .module('jawlaTracker', [])

    .controller('jawlaTrackerCtrl', ['$scope', '$window', '$rootScope', '$timeout', 'gapiService', 'mapService',
        function ($scope, $window, $rootScope, $timeout, gapiService, mapService) {
            $scope.people = [];
            $scope.mapIsReady = false;

            $scope.login = function () {
                gapiService.signIn();
            };

            $scope.logout = function () {
                gapiService.signOut();
            };

            $window.initGapi = function () {
                gapiService.initGapi();
            };

            $window.initMap = function () {
                $scope.mapIsReady = true;
                if ($scope.people.length > 0) {
                    mapService.initMap($scope.people);
                }
            };

            $scope.$on('google:authenticated', function (event, isSignedIn) {
                $timeout(function () {
                    $scope.isSignedIn = isSignedIn;
                    gapiService.getSheetRows().then(function (rows) {
                        $scope.people = rows.map(function (row) {
                            return {
                                isVisited: !!row[0],
                                lastVisited: row[0] ? moment(row[0]).format('LL') : 'Never',
                                firstName: row[1],
                                lastName: row[2],
                                address: row[3] + ', ' + row[4] + ', ' + row[5] + ' ' + row[6]
                            }
                        });

                        if ($scope.mapIsReady) {
                            mapService.initMap($scope.people);
                        }
                    });
                });
            });

            $scope.toggleStatus = function (index) {
                gapiService.toggleStatus(index, $scope.people[index].isVisited).then(function (updatedStatus) {
                    $scope.people[index].isVisited = updatedStatus.isVisited;
                    $scope.people[index].lastVisited = updatedStatus.lastVisited ? moment(updatedStatus.lastVisited).format('LL') : 'Never';
                })
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
                deferred.resolve({
                    isVisited: !currentVisitStatus,
                    lastVisited: newValue
                });
            });

            return deferred.promise;
        };
    }])

    .service('mapService', ['$q', function ($q) {

        this.initMap = function (people) {
            var deferred = $q.defer();

            if (people instanceof Array === false) {
                return deferred.reject("Passed value is not an array");
            }

            var bounds = new google.maps.LatLngBounds();

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12
            });

            this.getMarkers(people).then( function (markers) {
                // Loop through our array of markers & place each one on the map  
                for( i = 0; i < markers.length; i++ ) {
                    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
                    bounds.extend(position);
                    marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: markers[i][0]
                    });
                    
                    // Automatically center the map fitting all markers on the screen
                    map.fitBounds(bounds);
                }
            });

            // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
            var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
                this.setZoom(14);
                deferred.resolve("Map initialized");
               google.maps.event.removeListener(boundsListener);
            });
        };

        this.getMarkers = function (people) {

            var deferred = $q.defer();
            var markers = [];

            if (people instanceof Array === false) {
                return deferred.reject("Passed value is not an array");
            }

            geocoder = new google.maps.Geocoder();
            people.forEach(function (person, index) {
                setTimeout(function() {
                    geocoder.geocode({ 'address': person.address }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var location = results[0].geometry.location;
                            markers.push([
                                person.firstName + ' ' + person.lastName,
                                location.lat(),
                                location.lng()
                            ]);
                        } else {
                            console.log(status);
                        }

                        if (index === people.length - 1) {
                            console.log(markers);
                            deferred.resolve(markers);
                        }
                    });
                }, 1000 * index);
            });

            return deferred.promise;
        }
    }]);