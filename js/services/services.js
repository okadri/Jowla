app.service('gapiService', ['$rootScope', '$q', function ($rootScope, $q) {
    var self = this;

    self.injectedOnce = false;
    self.injectGapi = function () {
        var deferred = $q.defer();

        if (self.injectedOnce) {
            deferred.resolve("Maps API Loaded");
        } else {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function(){
                deferred.resolve("Google API loaded");
            };
            script.src = 'https://apis.google.com/js/api.js';
            document.body.appendChild(script);
            self.injectedOnce = true;
        }

        return deferred.promise;
    }
    self.initGapi = function (sheetId) {
        var deferred = $q.defer();
        SPREAD_SHEET_ID = sheetId;
        var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
        var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

        self.injectGapi().then(function() {
            gapi.load('client:auth2', function() {
                gapi.client.init({
                    discoveryDocs: DISCOVERY_DOCS,
                    clientId: GAPI_CLIENT_ID,
                    scope: SCOPES
                }).then(function () {
                    deferred.resolve(gapi.auth2.getAuthInstance().isSignedIn.get());
                });
            });
        });

        return deferred.promise;
    };

    self.signIn = function () {
        gapi.auth2.getAuthInstance().signIn();
    };

    self.signOut = function () {
        gapi.auth2.getAuthInstance().signOut();
    };

    self.getSheetRows = function () {
        var deferred = $q.defer();

        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: SPREAD_SHEET_ID,
                range: 'List!A2:G',
            }).then(function (response) {
                deferred.resolve(response.result.values);
            }, function (response) {
                deferred.reject(response.result.error);
            });
        } else {
            deferred.reject("Not signed in");
        }

        return deferred.promise;
    };

    self.addVisit = function (person) {
        var deferred = $q.defer();

        var updatedPerson = angular.copy(person);
        updatedPerson.visitHistory.unshift(new Date());

        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREAD_SHEET_ID,
            range: 'List!A' + (person.id + 2),
            valueInputOption: 'USER_ENTERED',
            values: [[updatedPerson.getMetaString()]]
        }).then(function (response) {
            deferred.resolve(updatedPerson);
        });

        return deferred.promise;
    };

    self.addCoordinates = function (index, person, location) {
        var deferred = $q.defer();

        var updatedPerson = angular.copy(person);
        updatedPerson.addressLat = location.lat();
        updatedPerson.addressLng = location.lng();

        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREAD_SHEET_ID,
            range: 'List!A' + (index + 2),
            valueInputOption: 'USER_ENTERED',
            values: [[updatedPerson.getMetaString()]]
        }).then(function (response) {
            deferred.resolve(updatedPerson);
        });

        return deferred.promise;
    };
}]);

app.service('mapService', ['$q', 'gapiService', function ($q, gapiService) {
    var self = this;

    self.injectedOnce = false;
    self.injectMapApi = function () {
        var deferred = $q.defer();

        if (self.injectedOnce) {
            deferred.resolve("Maps API Loaded");
        } else {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function(){
                deferred.resolve("Maps API Loaded");
            };
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3&key=' + GOOGLE_MAP_KEY;
            document.body.appendChild(script);
            self.injectedOnce = true;
        }


        return deferred.promise;
    };

    self.populateMap = function (people) {
        var deferred = $q.defer();

        if (people.ids instanceof Array === false) {
            return deferred.reject("Passed value is not an array");
        }

        var bounds = new google.maps.LatLngBounds();

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            maxZoom: 15
        });

        self.getMarkers(people).then(function (markers) {
            var infoWindow = new google.maps.InfoWindow(), marker, i;

            // Loop through our array of markers & place each one on the map  
            for (i = 0; i < markers.length; i++) {
                var position = new google.maps.LatLng(markers[i].lat, markers[i].lng);
                bounds.extend(position);
                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: markers[i].person.fullName
                });

                // Allow each marker to have an info window (only if more than one marker on map)
                if (markers.length > 1) { 
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infoWindow.setContent(
                                '<b>' + markers[i].person.fullName + '</b><br>' +
                                markers[i].person.address + '<br>' +
                                '<a href="#/' + SPREAD_SHEET_ID + '/p/' + markers[i].person.id + '">More...</a>'
                            );
                            infoWindow.open(map, marker);
                        }
                    })(marker, i));
                }

                // Automatically center the map fitting all markers on the screen
                map.fitBounds(bounds);
            }
        });

        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function (event) {
            deferred.resolve("Map populated");
            google.maps.event.removeListener(boundsListener);
        });

        return deferred.promise;
    };

    self.getMarkers = function (people) {

        var deferred = $q.defer();
        var markers = [];

        if (people.ids instanceof Array === false) {
            return deferred.reject("Passed value is not an array");
        }

        geocoder = new google.maps.Geocoder();

        var delayedIdx = 0;
        var validMarkers = 0;

        people.ids.forEach(function (personId, index) {
            var person = people.list[personId];
            if (person.addressLat && person.addressLng) {
                validMarkers++;

                markers.push({
                    person: person,
                    lat: person.addressLat,
                    lng: person.addressLng
                });

                if (validMarkers === people.ids.length) {
                    deferred.resolve(markers);
                }
            } else {
                setTimeout(function () {
                    geocoder.geocode({ 'address': person.address }, function (results, status) {
                        validMarkers++;

                        if (status == google.maps.GeocoderStatus.OK) {
                            var location = results[0].geometry.location;
                            gapiService.addCoordinates(index, person, location);
                            markers.push({
                                person: person,
                                lat: location.lat(),
                                lng: location.lng()
                            });
                        }

                        if (validMarkers === people.ids.length) {
                            deferred.resolve(markers);
                        }
                    });
                }, 500 * delayedIdx++);
            }
        });

        return deferred.promise;
    }
}]);
