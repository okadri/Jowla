app.filter('peopleFilter', [function () {
	return function (ids, people) {
		return ids.filter(function(id) {
            return !people[id].isFiltered;
        });
	};
}]);