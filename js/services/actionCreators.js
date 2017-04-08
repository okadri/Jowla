app.service('actionCreators', ['$q', 'stateService', 'gapiService', 'mapService',
    function ($q, stateService, gapiService, mapService) {
        return {
            initialize: function (sheetId) {
                var self = this;
                var deferred = $q.defer();

                // 1. Start with map api, since the map needs to be ready to be populated with the sheet data later
                mapService.injectMapApi().then(function () {
                    var action = {
                        type: MAP_READY,
                        payload: {}
                    };
                    stateService.reduce(action);

                    // 2. Initialize GApi to grab sheet data
                    gapiService.initGapi(sheetId).then(function (isSignedIn) {
                        // Listen for sign-in state changes.
                        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                        // Handle the initial sign-in state.
                        updateSigninStatus(isSignedIn);

                        function updateSigninStatus(isSignedIn) {
                            var action = {
                                type: UPDATE_SIGNIN_STATUS,
                                payload: {
                                    isSignedIn: isSignedIn,
                                    sheetId: sheetId,
                                    currentUser: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
                                }
                            };
                            stateService.reduce(action);

                            // 3. Finally, get the sheet data
                            if (isSignedIn) {
                                gapiService.getSheetRows().then(function (payload) {
                                    deferred.resolve("Successful login and data retieval");

                                    var action = {
                                        type: GET_SHEET_ROWS,
                                        payload: payload
                                    };
                                    stateService.reduce(action);
                                });
                            } else {
                                deferred.resolve("Login failed");
                            }
                        }
                    });
                });

                return deferred.promise;
            },
            signIn: function () {
                gapiService.signIn();
            },
            signOut: function () {
                gapiService.signOut();
            },
            getState: function() {
                return stateService.getState();
            },
            getSheetRows: function () {
                gapiService.getSheetRows().then(function (rows) {
                    var action = {
                        type: GET_SHEET_ROWS,
                        payload: {
                            rows: rows
                        }
                    };
                    stateService.reduce(action);
                });
            },
            addVisit: function (person) {
                gapiService.addVisit(person).then(function (updatedPerson) {
                    var action = {
                        type: ADD_VISIT,
                        payload: {
                            updatedPerson: updatedPerson
                        }
                    };
                    stateService.reduce(action);
                });
            },
            updateNotes: function (person) {
                gapiService.updateNotes(person).then(function (updatedPerson) {
                    var action = {
                        type: UPDATE_NOTE,
                        payload: {
                            updatedPerson: updatedPerson
                        }
                    };
                    stateService.reduce(action);
                });
            },
            switchDisplayMode: function (people) {
                var action = {
                    type: SWITCH_DISPLAY_MODE,
                    payload: {}
                };
                stateService.reduce(action);
            },
            filterPeople: function (searchTerm) {
                var action = {
                    type: FILTER_PEOPLE,
                    payload: {
                        searchTerm: searchTerm
                    }
                };
                stateService.reduce(action);
            },
            populateMap: function (people, showPopups) {
                if (!people) { return; }

                mapService.populateMap(people, showPopups).then(function () {
                    var action = {
                        type: POPULATE_MAP,
                        payload: {}
                    };
                    stateService.reduce(action);
                });
            }
        };
    }]);