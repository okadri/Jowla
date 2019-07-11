app.controller('HelpCtrl', ['$scope', '$routeParams', '$uibModal',
	function ($scope, $routeParams, $uibModal) {
		$scope.view = {
			sheetId: $routeParams.sheetId,
			helpItems: [
				{
					title: "List View",
					content: "The main \"list\" view shows all the unhidden users from the spreadsheet. ",
					image: "list.png",
				},
				{
					title: "Person View",
					content: "The person or contact view allows you to see at a glance all the information about the user. The information can be broken down to the following: <ul><li>Location and address</li><li>Phone Number</li><li>Email</li><li>General Notes</li><li>Country of Origin</li><li>Spoken Languages</li></ul>",
					image: "person.png",
				},
				{
					title: "Navigation",
					content: "The \"Navigate to...\" button starts the Google maps app. Once clicked, it turns <b>red</b> so that multiple users don't end up visiting the same person. The color goes back to normal once a visit has been reported, or after half an hour.",
					youtubeId: "5rMLMcLpvVg",
				},
				{
					title: "Adding a new contact",
					content: "Adding a new person can be found under the menu button in the list view",
					youtubeId: "T0TZJDGc-nc",
				},
				{
					title: "Deleting/Hiding a contact",
					content: "Removing a person from the list can be done from within the person/contact view. The record will stay in the Google sheet, but a flag will be added so that it does not show in the web app",
					youtubeId: "Jt7QjSa5-8U",
				},
				{
					title: "Map View",
					content: "The map view shows all the contacts on one map. The following is the color codes: <ul><li>Gray: Never visited</li><li>Red: Visited more than 6 months ago</li><li>Amber: Visited between 3 and 6 months ago</li><li>Green: Visited less than 3 months ago</li></ul>",
					youtubeId: "HbtLNFXc4fE",
				},
				{
					title: "Filtering the list",
					content: "You can either filter by searching for a specific term, or by clicking on the \"funnel\" icon and filtering by countries or languages",
					youtubeId: "cV0BjQ1QX1s",
				},
				{
					title: "Group texting",
					content: "You can group text filtered contacts",
					youtubeId: "Pv_YXSFl44Q",
				},
				{
					title: "Editing contact information",
					content: "Editing contact information can be done from within the contact view.",
					youtubeId: "E4RL9yqUFpM",
				},
				{
					title: "Creating a new list and granting access to other maintainers",
					content: `<p>To create a new list, start by copying this <a href=\"https://docs.google.com/spreadsheets/d/1n8wdE3bu25I7i8QPuulZmG7uq1HE5xmSfNhXcjw8eLo/edit?usp=sharing\">template spread sheet</a></p>
										<p>Enter the sheet title and data, then copy the sheet ID from the address bar</p>
										<p>Append this ID to the Jawla URL in this format:<a href="http://jawlatracker.obadakadri.com/#/1n8wdE3bu25I7i8QPuulZmG7uq1HE5xmSfNhXcjw8eLo">jawlatracker.obadakadri.com/#/&lt;Spread_Sheet_ID&gt;</a></p>`,
					youtubeId: "RUjSia7xq8A",
				},
				{
					title: "Merging or Bulk Updating a list (Admin)",
					content: "If you have an updated list for a certain region, you can use the merging functionality to update addresses for existing contacts and bulk adding new contacts.",
					youtubeId: "CqGu1tVLBF8",
				},
			],
		};
		// actionCreators.setPageTitle($scope.view.state.ui.sheet.title);

		$scope.openImage = function (helpItem) {
				var modalInstance = $uibModal.open({
						templateUrl: 'views/image.html',
						controller: 'ImageCtrl',
						resolve: {
								helpItem: function () {
										return helpItem;
								}
						}
				});
		};

		$scope.clearSearch = function () {
			$scope.view.state.ui.filters.searchTerm = '';
		};

	}]);

