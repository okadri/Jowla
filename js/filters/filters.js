app.filter('peopleFilter', [function () {
	return function (ids, people) {
		return ids.filter(function(id) {
            return !people[id].isFiltered;
        });
	};
}]);

app.filter('languageCodes', [function () {
	return function (languages) {
		return languages.map(function(l) {
			return l.name;
		}).join(', ');
	};
}]);