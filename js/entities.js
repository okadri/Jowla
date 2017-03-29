app.factory('Person', [function () {
	function Person(personRowData, id) {
		if (personRowData && Number.isInteger(id)) {
			this.setData(personRowData, id);
		}
	};
	Person.prototype = {
		setData: function (personRowData, id) {
            if (personRowData instanceof Array === false || typeof personRowData[0] !== 'string') {
                console.error("Object passed is not a valid row", personRowData);
                return {};
            }

            var metaArr = personRowData[0].split('##');
            var metaIsValid = (metaArr.length === 4);
            var visitHistory = !metaIsValid ? [] :
                metaArr[0].split('@@')
                    .filter(function(s) { return s.length; })
                    .map(function(s) { return new Date(s) })
                    .sort(function(a,b) { return b - a; });

			angular.extend(this, {
                id: id,
                visitHistory: visitHistory,
                firstName: personRowData[1],
                lastName: personRowData[2],
                fullName: personRowData[1] + ' ' + personRowData[2],
                address: personRowData[3] + ', ' + personRowData[4] + ', ' + personRowData[5] + ' ' + personRowData[6],
                notes: metaIsValid ? metaArr[1] : '',
                addressLat: metaIsValid ? parseFloat(metaArr[2]) : undefined,
                addressLng: metaIsValid ? parseFloat(metaArr[3]) : undefined
            });
		},
		getMetaString: function () {
            return [
                this.visitHistory.join('@@'),
                this.notes,
                this.addressLat,
                this.addressLng,
            ].join('##');
		}
	};
	return Person;
}]);
