// TODO: convert to a prototype and prototype functions
var getPersonFromRow = function (row) {
    if (row instanceof Array === false || typeof row[0] !== 'string') {
        console.error("Object passed is not a valid row", row);
        return {};
    }

    var metaArr = row[0].split('##');
    var metaIsValid = (metaArr.length === 4);
    var visitHistory = !metaIsValid ? [] :
        metaArr[0].split('@@')
            .filter(function(s) { return s.length; })
            .map(function(s) { return new Date(s) })
            .sort(function(a,b) { return b - a; });

    return {
        visitHistory: visitHistory,
        firstName: row[1],
        lastName: row[2],
        address: row[3] + ', ' + row[4] + ', ' + row[5] + ' ' + row[6],
        notes: metaIsValid ? metaArr[1] : '',
        addressLat: metaIsValid ? parseFloat(metaArr[2]) : undefined,
        addressLng: metaIsValid ? parseFloat(metaArr[3]) : undefined
    }
};

var getMetaString = function (person) {
    return [
        person.visitHistory.join('@@'),
        person.notes,
        person.addressLat,
        person.addressLng,
    ].join('##');
};

