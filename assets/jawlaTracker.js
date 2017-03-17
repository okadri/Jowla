// Client ID and API key from the Developer Console
var CLIENT_ID = '273724384440-85de3san0p08tod1gn9lnlicropdhqau.apps.googleusercontent.com';
var SS_ID = '1lcXvxSW6BH3OIa2leTuxP_M1XKxzRnPu2I2f645BsxE';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
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
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listMajors();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var entry = document.createElement("P");
    entry.innerHTML = message;
    pre.appendChild(entry);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SS_ID,
        range: 'List!A2:G',
    }).then(function (response) {
        var range = response.result;
        if (range.values.length > 0) {
            for (i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                var rowNum = (i + 2);
                var checked = row[0] ? 'checked' : '';
                var checkBox = "<input type='checkbox' onclick='toggleEntry(" + rowNum + ",\"" + row[0] + "\")' " + checked + "> ";
                appendPre(checkBox + row[1] + ' ' + row[2] + ', ' + row[3] + ' ' + row[4] + ' ' + row[5] + ' ' + row[6]);
            }
        } else {
            appendPre('No data found.');
        }
    }, function (response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

/**
 * Update the first cell in the row
 * Adds time stamp if empty, empty if has content
 */
function toggleEntry(rowNum, value) {
    var newValue = value? '' : new Date();
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SS_ID,
        range: 'List!A' + rowNum,
        valueInputOption: 'USER_ENTERED',
        values: [[newValue]]
    }).then(function (response) {
        console.log(response);
    });
}
