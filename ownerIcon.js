angular.module('calite').directive('ownerIcon', function() {
	return {
		scope: {
			owner: '=ownerIcon',
			size: '='
		},
		controller: ['$scope', function($scope) {
			$scope.size = $scope.size || 31;
		}],
		template: '<img data-ng-src="https://rally1.rallydev.com/slm/profile/image/{{owner.ObjectID}}/{{size}}.sp" alt="user icon" title="{{owner._refObjectName}}"/>'
	};
});
