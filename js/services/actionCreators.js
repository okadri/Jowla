app.service('actionCreators', ['$q', 'stateService', 'pageService', 'gapiService', 'mapService',
	function ($q, stateService, pageService, gapiService, mapService) {
		return {
			isInitialized: false,
			initialize: function (sheetId, personId) {
				var self = this;
				var deferred = $q.defer();

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
						getSheetRows(personId);
					} else {
						deferred.resolve("Login failed");
					}
				}

				function getSheetRows(personId) {
					// If the initial load of the app happens to be on a person page, grab all rows
					personId = self.isInitialized ? personId : undefined;
					gapiService.getSheetRows(sheetId, personId).then(function (payload) {
						self.isInitialized = true;

						var action = {
							type: personId ? GET_SHEET_ROW : GET_SHEET_ROWS,
							payload: payload,
							personId: personId
						};
						stateService.reduce(action);

						deferred.resolve();
					}, function (error) {
						if (self.isInitialized) {
							// Resolve anyways if already initialized (offline mode)
							deferred.resolve();
						} else {
							deferred.reject(error);
						}
					});
				}

				if (self.isInitialized) {
					getSheetRows(personId);
					// If initialized already, don't wait for response
					deferred.resolve();
				} else {
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
						});
					});
				}

				return deferred.promise;
			},
			setPageTitle: function (title) {
				pageService.setTitle(title);
			},
			signIn: function () {
				gapiService.signIn();
			},
			signOut: function () {
				gapiService.signOut();
			},
			getState: function () {
				return stateService.getState();
			},
			getMergeReport: function (sheetId) {
				gapiService.getSheetRows(sheetId).then(function (payload) {
					var action = {
						type: GET_MERGE_REPORT,
						payload: payload
					};
					stateService.reduce(action);
				});
			},
			performMerge: function (people) {
				gapiService.performMerge(people).then(function (people) {
					var action = {
						type: PERFORM_MERGE,
						payload: {
							people: people
						}
					};
					stateService.reduce(action);
				});
			},
			resetMerge: function () {
				var action = {
					type: RESET_MERGE,
					payload: {}
				};
				stateService.reduce(action);
			},
			addVisit: function (person, notes) {
				gapiService.addVisit(person, notes).then(function (updatedPerson) {
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
			createPerson: function (person) {
				gapiService.createPerson(person).then(function (updatedPerson) {
					var action = {
						type: CREATE_PERSON,
						payload: {
							updatedPerson: updatedPerson
						}
					};
					stateService.reduce(action);
				});
			},
			updatePerson: function (person) {
				gapiService.updatePerson(person).then(function (updatedPerson) {
					var action = {
						type: UPDATE_PERSON,
						payload: {
							updatedPerson: updatedPerson
						}
					};
					stateService.reduce(action);
				});
			},
			updateCountry: function (person) {
				gapiService.updateCountry(person).then(function (updatedPerson) {
					var action = {
						type: UPDATE_COUNTRY,
						payload: {
							updatedPerson: updatedPerson
						}
					};
					stateService.reduce(action);
				});
			},
			updateLanguages: function (person) {
				gapiService.updateLanguages(person).then(function (updatedPerson) {
					var action = {
						type: UPDATE_LANGUAGES,
						payload: {
							updatedPerson: updatedPerson
						}
					};
					stateService.reduce(action);
				});
			},
			hidePerson: function (person) {
				gapiService.hidePerson(person).then(function (updatedPerson) {
					var action = {
						type: HIDE_PERSON,
						payload: {
							updatedPerson: updatedPerson
						}
					};
					stateService.reduce(action);
				});
			},
			switchDisplayMode: function (mode) {
				var action = {
					type: SWITCH_DISPLAY_MODE,
					payload: {
						mode: mode
					}
				};
				stateService.reduce(action);
			},
			filterPeople: function (filters) {
				var action = {
					type: FILTER_PEOPLE,
					payload: {
						filters: filters
					}
				};
				stateService.reduce(action);
			},
			populateMap: function (people, personId) {
				if (!people) { return; }

				mapService.populateMap(people, personId).then(function (markers) {
					var action = {
						type: POPULATE_MAP,
						payload: {
							markers: markers
						}
					};
					stateService.reduce(action);
				});
			}
		};
	}
]);