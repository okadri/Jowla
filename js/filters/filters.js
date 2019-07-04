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