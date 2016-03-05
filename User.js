angular.module('calite').factory('User', ['$resource', 'rallyURL', 'Iteration', function($resource, rallyURL, Iteration) {
    var User = $resource(rallyURL + 'User/:ObjectID', {ObjectID: '@ObjectID'}, {
        get: {
            isArray: false,
            withCredentials: true,
            transformResponse: function(response) {
                return JSON.parse(response).User;
            }
        },
        query: {
            isArray: true,
            withCredentials: true,
            transformResponse: function(response) {
                return JSON.parse(response).QueryResult.Results;
            }
        }
    });

    return User;
}]);
