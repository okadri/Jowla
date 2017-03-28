app.service('stateService', function ($rootScope, $log, Person) {
    function sortPeople (people) {
        people.ids.sort(function (id1, id2) {
            var lastVisit1 = people.list[id1].visitHistory.length ? people.list[id1].visitHistory[0] : 0;
            var lastVisit2 = people.list[id2].visitHistory.length ? people.list[id2].visitHistory[0] : 0;
            if (lastVisit1 < lastVisit2) {
                return -1;
            } else if (lastVisit1 > lastVisit2) {
                return 1;
            }
            return 0;
        });
        return people;
    }

    return {
        _state: {},
        _personReducers: function (action, people) {
            switch (action.type) {
                case GET_SHEET_ROWS:
                    people = {
                        ids: [],
                        list: {}
                    };
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
                default:
                    return people;
            }
        },
        _uiReducers: function (action, ui) {
            var defaultUi = {
                displayMode: DISPLAY_MODE.LIST,
                isSignedIn: false,
                mapIsReady: false,
                mapIsPopulated: false
            }
            switch (action.type) {
                case UPDATE_SIGNIN_STATUS:
                    ui = ui || defaultUi;
                    ui.isSignedIn = action.payload.isSignedIn;
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
                    return ui;
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
            $rootScope.$emit('stateChanged', {
                state: scope._state,
                action: action
            });

            $log.debug("State updated:");
            $log.debug(scope._state, action.type);
        }
    };
});