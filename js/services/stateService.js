app.service('stateService', function ($rootScope, $log, Person) {
    function sortPeople (people) {
        people.ids.sort(function (id1, id2) {
            // By lastVisit
            var lastVisit1 = people.list[id1].visitHistory.length ? people.list[id1].visitHistory[0] : 0;
            var lastVisit2 = people.list[id2].visitHistory.length ? people.list[id2].visitHistory[0] : 0;
            if (lastVisit1 < lastVisit2) {
                return -1;
            } else if (lastVisit1 > lastVisit2) {
                return 1;
            }
            // By fullName
            var fullName1 = people.list[id1].fullName;
            var fullName2 = people.list[id2].fullName;
            if (fullName1 < fullName2) {
                return -1;
            } else if (fullName1 > fullName2) {
                return 1;
            }
            return 0;
        });
        return people;
    }

    return {
        _state: {},
        _personReducers: function (action, people) {
            var defaultPeople = {
                ids: [],
                list: {}
            };
            switch (action.type) {
                case GET_SHEET_ROWS:
                    people = defaultPeople;
                    var length = action.payload.rows ? action.payload.rows.length : 0;
                    for (var i = 0; i < length; i++) {
                        var rowData = action.payload.rows[i];
                        people.list[i] = new Person(rowData, i);
                        people.ids.push(i);
                    }
                    return sortPeople(people);
                case ADD_VISIT:
                    people.list[action.payload.updatedPerson.id] = action.payload.updatedPerson;
                    return sortPeople(people);
                case FILTER_PEOPLE:
                    var searchTerm = action.payload.searchTerm;
                    var searchFields = ['fullName', 'address', 'notes'];
                    people.ids.forEach(function(personId) {
                        var person = people.list[personId];
                        var matches = searchFields.some(function(sf) {
                            return person[sf].toLowerCase().search(searchTerm.toLowerCase()) >= 0;
                        });
                        person.isFiltered = !matches;
                        return personId;
                    });
                    return sortPeople(people);
                case UPDATE_SIGNIN_STATUS:
                    if (action.payload.isSignedIn == false) {
                        people = defaultPeople;
                    }
                    return people;
                default:
                    return people || defaultPeople;
            }
        },
        _uiReducers: function (action, ui) {
            var defaultUi = {
                displayMode: DISPLAY_MODE.LIST,
                isSignedIn: false,
                mapIsReady: false,
                mapIsPopulated: false,
                currentUser: undefined,
                sheet: {}
            }
            switch (action.type) {
                case GET_SHEET_ROWS:
                    ui.sheet.title = action.payload.title;
                    ui.sheet.users = action.payload.users;
                    return ui;
                case UPDATE_SIGNIN_STATUS:
                    ui = ui || defaultUi;
                    ui.isSignedIn = action.payload.isSignedIn;
                    ui.sheet.id = action.payload.sheetId;
                    ui.displayMode = DISPLAY_MODE.LIST;
                    ui.currentUser = action.payload.currentUser
                    return ui;
                case MAP_READY:
                    ui = ui || defaultUi;
                    ui.mapIsReady = true;
                    return ui;
                case POPULATE_MAP:
                    ui.mapIsPopulated = true;
                    return ui;
                case SWITCH_DISPLAY_MODE:
                    ui.displayMode = (ui.displayMode == DISPLAY_MODE.LIST) ? DISPLAY_MODE.MAP : DISPLAY_MODE.LIST;
                    return ui;
                default:
                    return ui || defaultUi;
            }
        },
        reduce: function (action) {
            var scope = this;

            if (!action || !action.type) {
                return;
            }

            newState = {};
            newState.people = scope._personReducers(action, scope._state.people);
            newState.ui = scope._uiReducers(action, scope._state.ui);

            scope._state = newState;
            $rootScope.$broadcast('stateChanged', {
                state: scope._state,
                action: action
            });

            $log.debug("State updated:");
            $log.debug(scope._state, action.type);
        },
        getState: function() {
            return this._state;
        }
    };
});