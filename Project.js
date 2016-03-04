angular.module('calite').factory('Project', ['$resource', 'rallyURL', 'Iteration', function($resource, rallyURL, Iteration) {
    var Project = $resource(rallyURL + 'Project/:ObjectID', {ObjectID: '@ObjectID'}, {
        get: {
            isArray: false,
            withCredentials: true,
            responseType: 'json',
            transformResponse: function(response) {
                return response.Project;
            }
        },
        query: {
            isArray: true,
            withCredentials: true,
            responseType: 'json',
            transformResponse: function(response) {
                return response.QueryResult.Results;
            }
        }
    });

    Project.prototype.getIterations = function() {
        return Iteration.forProject({ProjectID: this.ObjectID, pagesize: this.Iterations.Count});
    };

    return Project;
}]);
