var initGapi = function () {
    window.initGapi();
};

var initMap = function () {
    window.initMap();
};

var getPersonFromRow = function (row) {
    if (row instanceof Array === false || typeof row[0] !== 'string') {
        console.error("Object passed is not a valid row", row);
        return {};
    }

    var metaArr = row[0].split('##');
    var metaIsValid = (metaArr.length === 4);
    var visitHistory = !metaIsValid ? [] :
        metaArr[0].split('@@')
            .filter(function(s) { return s.length; })
            .map(function(s) { return new Date(s) })
            .sort(function(a,b) { return b - a; });

    return {
        visitHistory: visitHistory,
        firstName: row[1],
        lastName: row[2],
        address: row[3] + ', ' + row[4] + ', ' + row[5] + ' ' + row[6],
        notes: metaIsValid ? metaArr[1] : '',
        addressLat: metaIsValid ? parseFloat(metaArr[2]) : undefined,
        addressLng: metaIsValid ? parseFloat(metaArr[3]) : undefined
    }
};

var getMetaString = function (person) {
    return [
        person.visitHistory.join('@@'),
        person.notes,
        person.addressLat,
        person.addressLng,
    ].join('##');
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
                            return getPersonFromRow(row);
                        });

                        if ($scope.mapIsReady) {
                            mapService.initMap($scope.people);
                        }
                    });
                });
            });

            $scope.addVisit = function (personIdx) {
                gapiService.addVisit(personIdx, $scope.people[personIdx]).then(function (updatedPerson) {
                    $scope.people[personIdx] = updatedPerson;
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

        this.addVisit = function (index, person) {
            var deferred = $q.defer();

            var updatedPerson = angular.copy(person);
            updatedPerson.visitHistory.unshift(new Date());

            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: SS_ID,
                range: 'List!A' + (index + 2),
                valueInputOption: 'USER_ENTERED',
                values: [[getMetaString(updatedPerson)]]
            }).then(function (response) {
                deferred.resolve(updatedPerson);
            });

            return deferred.promise;
        };

        this.addCoordinates = function (index, person, location) {
            var deferred = $q.defer();

            var updatedPerson = angular.copy(person);
            updatedPerson.addressLat = location.lat();
            updatedPerson.addressLng = location.lng();

            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: SS_ID,
                range: 'List!A' + (index + 2),
                valueInputOption: 'USER_ENTERED',
                values: [[getMetaString(updatedPerson)]]
            }).then(function (response) {
                deferred.resolve(updatedPerson);
            });

            return deferred.promise;
        };
    }])

    .service('mapService', ['$q', 'gapiService', function ($q, gapiService) {

        this.initMap = function (people) {
            var deferred = $q.defer();

            if (people instanceof Array === false) {
                return deferred.reject("Passed value is not an array");
            }

            var bounds = new google.maps.LatLngBounds();

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12
            });

            this.getMarkers(people).then(function (markers) {
                // Loop through our array of markers & place each one on the map  
                for (i = 0; i < markers.length; i++) {
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
            var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function (event) {
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

            var delayedIdx = 0;
            var validMarkers = 0;

            people.forEach(function (person, index) {
                if (person.addressLat && person.addressLng) {
                    validMarkers++;

                    markers.push([
                        person.firstName + ' ' + person.lastName,
                        person.addressLat,
                        person.addressLng
                    ]);

                    if (validMarkers === people.length) {
                        deferred.resolve(markers);
                    }
                } else {
                    setTimeout(function () {
                        geocoder.geocode({ 'address': person.address }, function (results, status) {
                            validMarkers++;

                            if (status == google.maps.GeocoderStatus.OK) {
                                var location = results[0].geometry.location;
                                gapiService.addCoordinates(index, person, location);
                                markers.push([
                                    person.firstName + ' ' + person.lastName,
                                    location.lat(),
                                    location.lng()
                                ]);
                            }

                            if (validMarkers === people.length) {
                                deferred.resolve(markers);
                            }
                        });
                    }, 500 * delayedIdx++);
                }
            });

            return deferred.promise;
        }
    }]);