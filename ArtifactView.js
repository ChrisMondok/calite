angular.module('calite').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('artifact', {
		parent: 'root',
        url: '/artifact?artifactId&artifactType',
        templateUrl: 'artifact.html',
        resolve: {
            artifact: ['$stateParams', 'Artifact', function($stateParams, Artifact) {
                return Artifact.get({
					_type: $stateParams.artifactType,
					ObjectID: $stateParams.artifactId
				}).$promise;
            }]
        },
        controller: ['$scope', 'artifact', 'user', function($scope, artifact, user) {
            $scope.artifact = artifact;
			$scope.user = user;
        }]
    });
}]);

