app.directive('spinner', [function () {
	return {
		restrict: 'E',
		link: function (scope, element, attr) {
			var opts = {
				lines: 10 // The number of lines to draw
				, length: 30 // The length of each line
				, width: 10 // The line thickness
				, radius: 20 // The radius of the inner circle
				, scale: 1 // Scales overall size of the spinner
				, corners: 1 // Corner roundness (0..1)
				, color: '#000' // #rgb or #rrggbb or array of colors
				, opacity: 0.25 // Opacity of the lines
				, rotate: 0 // The rotation offset
				, direction: 1 // 1: clockwise, -1: counterclockwise
				, speed: 1 // Rounds per second
				, trail: 60 // Afterglow percentage
				, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
				, zIndex: 2e9 // The z-index (defaults to 2000000000)
				, className: 'spinner' // The CSS class to assign to the spinner
				, top: '50%' // Top position relative to parent
				, left: '50%' // Left position relative to parent
				, shadow: false // Whether to render a shadow
				, hwaccel: false // Whether to use hardware acceleration
				, position: 'absolute' // Element positioning
			};
			var spinner = new Spinner(opts).spin(element[0]);
		}
	};
}]);

app.directive('confirmButton', ['$document', '$parse', function ($document, $parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var buttonId, html, message, nope, title, yep;

			buttonId = Math.floor(Math.random() * 10000000000);

			attrs.buttonId = buttonId;

			var message = attrs.message || "Are you sure?";
			var yep = attrs.yes || "Yes";
			var nope = attrs.no || "No";
			var title = attrs.title || "Confirm";
			var position = attrs.position || "left";

			html = "<div id=\"button-" + buttonId + "\" class=\"confirmbutton-popover\">\
            <span class=\"confirmbutton-msg\">" + message + "</span><br><br>\
            <button class=\"confirmbutton-yes btn btn-danger\">" + yep + "</button>\
            <button class=\"confirmbutton-no btn\">" + nope + "</button>\n</div>";

			element.popover({
				content: html,
				html: true,
				trigger: "manual",
				title: title,
				placement: position
			});

			element.bind('click', function (e) {
				e.stopPropagation();
				var dontBubble = true;

				element.popover('show');
				var pop = $("#button-" + buttonId);

				pop.closest(".popover").click(function (e) {
					if (dontBubble) {
						e.stopPropagation();
					}
				});

				pop.find('.confirmbutton-yes').click(function (e) {
					dontBubble = false;

					var func = $parse(attrs.confirmButton);
					func(scope);
				});

				pop.find('.confirmbutton-no').click(function (e) {
					dontBubble = false;

					$document.off('click.confirmbutton.' + buttonId);

					element.popover('hide');
				});

				$document.on('click.confirmbutton.' + buttonId, ":not(.popover, .popover *)", function () {
					$document.off('click.confirmbutton.' + buttonId);
					element.popover('hide');
				});

			});
		}
	};
}]);

app.directive('showFocus', ['$timeout', function ($timeout) {
	return function (scope, element, attrs) {
		scope.$watch(attrs.showFocus,
			function (newValue) {
				$timeout(function () {
					newValue && element.focus();
				});
			}, true);
	};
}]);

app.directive('multiToken', [function () {
	return {
		restrict: 'E',
		templateUrl: 'views/multiToken.html',
		replace: true,
		scope: {
			choices: '=',
			selected: '=',
			displayProperty: '@',
			idProperty: '@',
			onAdd: '&',
			onRemove: '&'
		},
		link: function (scope, element, attr) {
			scope.selected = scope.selected || [];
			scope.view = {
				selectValue: ''
			};

			scope.add = function () {
				var item = scope.choices.find(function (c) { return c[scope.idProperty] == scope.view.selectValue; });
				scope.selected.push(item);
				scope.view.selectValue = '';
				scope.onAdd();
			};

			scope.remove = function (item) {
				var itemIndex = scope.selected.indexOf(item);
				scope.selected.splice(itemIndex, 1);
				scope.onRemove();
			};
		}
	};
}]);
