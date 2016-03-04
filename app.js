angular.module('calite', ['ngResource', 'ui.router']);

angular.module('calite').constant('rallyURL','https://rally1.rallydev.com/slm/webservice/v2.0/');

angular.module('calite').controller('main', ['$scope', 'Project', function($scope, Project) { }]);

angular.module('calite').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        templateUrl: 'projects.html',
        controller: ['$scope', 'Project', function($scope, Project) {
            $scope.projects = Project.query({fetch:'Name,ObjectID'});
        }]
    });

    $stateProvider.state('project', {
        url: '/project?projectId',
        templateUrl: 'project.html',
        resolve: {
            project: ['Project', 'Iteration', '$stateParams', function(Project, Iteration, $stateParams) {
                return Project.get({ObjectID: $stateParams.projectId}).$promise;
            }],
            user: ['User', function(User) {
                return User.get().$promise;
            }]
        },
        controller: ['$scope', 'project', function($scope, project) {
            $scope.project = project;
        }]
    });

    $stateProvider.state('project.iterations', {
        url: '/iterations',
        templateUrl: 'iterations.html',
        resolve: {
            iterations: ['project', function(project) {
                return project.getIterations().$promise;
            }]
        },
        controller: ['$scope', 'iterations', function($scope, iterations) {
            $scope.iterations = iterations;
        }]
    });
}]);
