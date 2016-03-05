angular.module('calite').factory('Iteration', ['$resource', 'Artifact', 'rallyURL', function($resource, Artifact, rallyURL) {
    var Iteration = $resource(rallyURL + 'Iteration/:ObjectID', {ObjectID: '@ObjectID'}, {
        get: {
            isArray: false,
            withCredentials: true,
            transformResponse: function(r) {
                return hydrate(JSON.parse(r).Iteration);
            }
        },
        query: {
            isArray:  true,
            withCredentials: true,
            transformResponse: transformArray
        },
        forProject: {
            url: rallyURL + 'Project/:ProjectID/Iterations',
            isArray: true,
            withCredentials: true,
            transformResponse: transformArray
        }
    });

    Iteration.prototype.isCurrent = function() {
        var now = new Date();
        return now > this.StartDate && now < this.EndDate;
    };

    Iteration.prototype.getArtifacts = function(otherParams) {
        var params = {query: '(Iteration.ObjectID = '+this.ObjectID+')'};
        angular.extend(params, otherParams);
        return Artifact.query(params);
    };

    function transformArray(response) {
        return JSON.parse(response).QueryResult.Results.map(hydrate);
    }

    function hydrate(iteration) {
        ['StartDate', 'CreationDate', 'EndDate'].forEach(function(d) { iteration[d] = Date.create(iteration[d]); });
        return iteration;
    }

    return Iteration;
}]);
