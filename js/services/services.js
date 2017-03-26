app.service('gapiService', ['$rootScope', '$q', function ($rootScope, $q) {
    this.initGapi = function () {
        var deferred = $q.defer();
        var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
        var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

        gapi.load('client:auth2', initClient);

        function initClient() {
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: GAPI_CLIENT_ID,
                scope: SCOPES
            }).then(function () {
                deferred.resolve(gapi.auth2.getAuthInstance().isSignedIn.get());
            });
        }

        return deferred.promise;
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

    this.addVisit = function (person) {
        var deferred = $q.defer();

        var updatedPerson = angular.copy(person);
        updatedPerson.visitHistory.unshift(new Date());

        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SS_ID,
            range: 'List!A' + (person.id + 2),
            valueInputOption: 'USER_ENTERED',
            values: [[updatedPerson.getMetaString()]]
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
            values: [[updatedPerson.getMetaString()]]
        }).then(function (response) {
            deferred.resolve(updatedPerson);
        });

        return deferred.promise;
    };
}]);

app.service('mapService', ['$q', 'gapiService', function ($q, gapiService) {

    this.populateMap = function (people) {
        var deferred = $q.defer();

        if (people.ids instanceof Array === false) {
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
            deferred.resolve("Map populated");
            google.maps.event.removeListener(boundsListener);
        });

        return deferred.promise;
    };

    this.getMarkers = function (people) {

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

                markers.push([
                    person.firstName + ' ' + person.lastName,
                    person.addressLat,
                    person.addressLng
                ]);

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
                            markers.push([
                                person.firstName + ' ' + person.lastName,
                                location.lat(),
                                location.lng()
                            ]);
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
