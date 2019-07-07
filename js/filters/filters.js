app.filter('peopleFilter', [function () {
	return function (ids, people) {
		return ids.filter(function (id) {
			return !people[id].isFiltered;
		});
	};
}]);

app.filter('languageCodes', [function () {
	return function (languages) {
		if (languages) {
			return languages.map(function (l) {
				return l.name;
			}).join(', ');
		} else {
			return '';
		}
	};
}]);

app.filter('filteredPhones', [function () {
	return function (ids, people) {
		return ids.filter(function (id) {
			return !people[id].isFiltered && people[id].phone;
		}).map(function(id) {
			return people[id].phone;
		}).join(",");
	};
}]);

app.filter('isVisiting', [function () {
	return function (person) {
		var visitWaitTime = 30 * 60 * 1000; // half an hour in milliseconds
		var diff = person.isVisiting.date ? new Date() - new Date(person.isVisiting.date) : visitWaitTime;
		return diff < visitWaitTime;
	};
}]);