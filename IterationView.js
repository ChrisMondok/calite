angular.module('calite').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('project.iteration', {
        url: '/iteration?iterationId',
        templateUrl: 'iteration.html',
        resolve: {
            iteration: ['$stateParams', 'Iteration', function($stateParams, Iteration) {
                return Iteration.get({ObjectID: $stateParams.iterationId, fetch: true}).$promise;
            }]
        },
        controller: ['$scope', 'iteration', 'user', function($scope, iteration, user) {
            $scope.iteration = iteration;
            $scope.user = user;
			$scope.showEverything = false;

            $scope.types = [
                {name: 'User Story', value: 'hierarchicalrequirement', show: true},
                {name: 'Defect', value: 'defect', show: true}
            ];

            $scope.$watchCollection(getSelectedTypes, function(types) {
				var fetch = "Name,Blocked,FormattedID,ScheduleState,ObjectID,Owner,Owner.ObjectID";
                $scope.artifacts = $scope.iteration.getArtifacts({pagesize: 99, fetch: fetch, types: types.join(',')});
            });

            $scope.shouldShow = function(artifact) {
				return $scope.showEverything
					|| artifactIsNotStarted(artifact)
                    || artifactHasNoOwner(artifact)
                    || artifactIsMine(artifact);
            };

            $scope.getSortOrder = function(artifact) {
                return ['Defined', 'In-Progress', 'Completed', 'Accepted'].indexOf(artifact.ScheduleState);
            };

            function artifactIsNotStarted(artifact) { return artifact.ScheduleState == 'Defined'; }
            function artifactHasNoOwner(artifact) { return !artifact.Owner; }
            function artifactIsMine(artifact) { return artifact.Owner._refObjectUUID == user.ObjectUUID; }

            function getSelectedTypes() {
                return $scope.types.filter({show: true}).map('value');
            }
        }]
    });
}]);
