app.factory('Person', [function () {
	function Person(personRowData, id) {
		if (personRowData && Number.isInteger(id)) {
			this.setData(personRowData, id);
		} else {
			angular.extend(this, {
				visitHistory: [],
				languages: [],
				address: {},
			});
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
			var isVisiting = {};
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
					if (metaData.isVisiting) {
						isVisiting = {
							date: new Date(metaData.isVisiting.date),
							by: metaData.isVisiting.by,
						};
					}
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
				isVisiting: isVisiting,
				firstName: personRowData[1],
				lastName: personRowData[2],
				fullName: personRowData[1] + ' ' + personRowData[2],
				notes: compinedNotes,
				country: userCountry,
				languages: userLanguages,
				address: {
					full: personRowData[3] + ', ' + personRowData[4] + ', ' + personRowData[5] + ' ' + personRowData[6],
					street: personRowData[3],
					city: personRowData[4],
					state: personRowData[5],
					zipCode: personRowData[6],
					md5: metaData.addressMD5,
					lat: metaData.addressLat,
					lng: metaData.addressLng
				},
				phone: personRowData[11],
				email: personRowData[12],
				isHidden: metaData.isHidden
			});
		},
		isVisitedToday: function () {
			return this.visitHistory.some(function (visit) {
				return visit.date.toDateString() == (new Date()).toDateString();
			});
		},
		getMarkerIcon: function () {
			var threeMonthsAgo = new Date();
			threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
			var sixMonthsAgo = new Date();
			sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

			if (this.visitHistory.length) {
				if (this.visitHistory[0].date < sixMonthsAgo) {
					return '/images/redMarker.png';
				} else if (this.visitHistory[0].date < threeMonthsAgo) {
					return '/images/amberMarker.png';
				} else {
					return '/images/greenMarker.png';
				}
			} else {
				return '/images/grayMarker.png';
			}
		},
		setAddress: function (address) {
			this.address = address;
		},
		getMetaString: function () {
			return JSON.stringify({
				addressMD5: this.address.md5,
				addressLat: this.address.lat,
				addressLng: this.address.lng,
				visitHistory: this.visitHistory,
				isVisiting: this.isVisiting,
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
			this.doMerge = true;
			this.fromPerson = fromPerson;
			this.toPerson = toPerson;
		},
		getUpdateData: function () {
			var rowNum = this.fromPerson.id + 2;
			var a = this.toPerson.address;
			return {
				range: `${FIRST_SHEET_NAME}!D${rowNum}:G${rowNum}`,
				majorDimension: "COLUMNS",
				values: [[a.street], [a.city], [a.state], [a.zipCode]]
			}
		},
		getAppendData: function () {
			var p = this.toPerson;
			var a = p.address;
			return ['', p.firstName, p.lastName, a.street, a.city, a.state, a.zipCode];
		}
	};
	return PersonDiff;
}]);
