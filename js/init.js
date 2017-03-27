var initGapi = function () {
    window.initGapi();
};

var initMap = function () {
    window.initMap();
};

// Create the Google Maps <script> element to inject the API key dynamically
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://maps.googleapis.com/maps/api/js?v=3' +
    '&key=' + GOOGLE_MAP_KEY +'&callback=initMap';
document.body.appendChild(script);


// Constant Variables
var UPDATE_SIGNIN_STATUS = 'UPDATE_SIGNIN_STATUS';
var GET_SHEET_ROWS = 'GET_SHEET_ROWS';
var ADD_VISIT = 'ADD_VISIT';
var MAP_READY = 'MAP_READY';
var POPULATE_MAP = 'POPULATE_MAP';
var SWITCH_DISPLAY_MODE = 'SWITCH_DISPLAY_MODE';
var DISPLAY_MODE = {MAP: 'map', LIST: 'list'};