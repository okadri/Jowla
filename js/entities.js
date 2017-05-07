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

			var metaData = {};
			var visitHistory = [];
			var compinedNotes = personRowData[8];

			try {
				if (personRowData[0]) {
					metaData = JSON.parse(personRowData[0]);
					visitHistory = metaData.visitHistory
						.map(function (s) {
							s.date = new Date(s.date);
							return s;
						})
						.sort(function (a, b) { return b.date - a.date; });
					// This appends the notes from the meta data column with the notes column, to avoid any data loss
					// Can be removed in the future once no notes are left in the metadata column
					compinedNotes = [metaData.notes, personRowData[8]].filter(function (c) { return c; }).join('\n');
				}
			} catch (e) {
				console.warn("metaData not valid", personRowData[0]);
			}

			var userCountry = personRowData[9] ? countries.find(function (c) {
				return c.code.toLowerCase() == personRowData[9].toLowerCase();
			}) : undefined;

			var userLanguages = personRowData[10] ? personRowData[10].split(',').map(function (code) {
				return languages.find(function (l) {
					return l.code.toLowerCase() == code.toLowerCase();
				});
			}) : [];

			angular.extend(this, {
				id: id,
				visitHistory: visitHistory,
				firstName: personRowData[1],
				lastName: personRowData[2],
				fullName: personRowData[1] + ' ' + personRowData[2],
				address: personRowData[3] + ', ' + personRowData[4] + ', ' + personRowData[5] + ' ' + personRowData[6],
				notes: compinedNotes,
				country: userCountry,
				languages: userLanguages,
				addressMD5: metaData.addressMD5,
				addressLat: metaData.addressLat,
				addressLng: metaData.addressLng,
				isHidden: metaData.isHidden
			});
		},
		isVisitedToday: function () {
			return this.visitHistory.some(function (visit) {
				return visit.date.toDateString() == (new Date()).toDateString();
			});
		},
		getMetaString: function () {
			return JSON.stringify({
				addressMD5: this.addressMD5,
				addressLat: this.addressLat,
				addressLng: this.addressLng,
				visitHistory: this.visitHistory,
				isHidden: this.isHidden
			});
		}
	};
	return Person;
}]);

app.factory('PersonDiff', ['Person', function (Person) {
	function PersonDiff(fromPerson, toPerson) {
		if (fromPerson instanceof Person && toPerson instanceof Person) {
			this.setData(fromPerson, toPerson);
		}
	};
	PersonDiff.prototype = {
		setData: function (fromPerson, toPerson) {
			this.fromPerson = fromPerson;
			this.toPerson = toPerson;
		}
	};
	return PersonDiff;
}]);
