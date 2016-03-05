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

            $scope.types = [
                {name: 'User Story', value: 'hierarchicalrequirement', show: true},
                {name: 'Defect', value: 'defect', show: true}
            ];

            $scope.$watchCollection(getSelectedTypes, function(types) {
                //"Name,Blocked,FormattedID,State,ScheduleState,ObjectID,Owner"
                $scope.artifacts = $scope.iteration.getArtifacts({pagesize: 99, fetch: true, types: types.join(',')});
            });

            $scope.shouldShow = function(artifact) {
                return artifactIsNotStarted(artifact)
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
