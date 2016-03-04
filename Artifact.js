angular.module('calite').factory('Artifact', ['$resource', 'rallyURL', function($resource, rallyURL) {
    var Artifact = $resource(rallyURL + 'Artifact/:ObjectID', {ObjectID: '@ObjectID'}, {
        query: {
            isArray:  true,
            withCredentials: true,
            responseType: 'json',
            transformResponse: function(response) {
                return response.QueryResult.Results;
            }
        },
        update: {
            method: 'PUT',
            withCredentials: true,
            requestType: 'json',
            responseType: 'json',
            transformRequest: function(request) {
                var model = {};
                model[request._type] = request;
                return JSON.stringify(model);
            },
            transformResponse: function(response) {
                if(response.OperationResult.Errors.length)
                    return response.OperationResult;
                return undefined;
            }
        }
    });

    Artifact.prototype.unblock = function() {
        this.Blocked = false;
        return this.$update.apply(this, arguments);
    };

    return Artifact;
}]);
