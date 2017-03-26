app.service('stateService', function ($rootScope, $log, Person) {
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
                    return people;
                case ADD_VISIT:
                    people.list[action.payload.updatedPerson.id] = action.payload.updatedPerson;
                    return people;
                default:
                    return people;
            }
        },
        _uiReducers: function (action, ui) {
            switch (action.type) {
                case UPDATE_SIGNIN_STATUS:
                    ui = ui || {};
                    ui.isSignedIn = action.payload.isSignedIn;
                    return ui;
                case MAP_READY:
                    ui = ui || {};
                    ui.mapIsReady = true;
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