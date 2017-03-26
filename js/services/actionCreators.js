app.service('actionCreators', ['stateService', 'gapiService', 'mapService',
    function (stateService, gapiService, mapService) {
        return {
            initGapi: function () {
                var self = this;

                gapiService.initGapi().then(function (isSignedIn) {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                    // Handle the initial sign-in state.
                    updateSigninStatus(isSignedIn);

                    function updateSigninStatus(isSignedIn) {
                        var action = {
                            type: UPDATE_SIGNIN_STATUS,
                            payload: {
                                isSignedIn: isSignedIn
                            }
                        };
                        stateService.reduce(action);

                        if (isSignedIn) {
                            self.getSheetRows();
                        }
                    }

                });
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
            }
        };
    }]);