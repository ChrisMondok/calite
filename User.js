angular.module('calite').factory('User', ['$resource', 'rallyURL', 'Iteration', function($resource, rallyURL, Iteration) {
    var User = $resource(rallyURL + 'User/:ObjectID', {ObjectID: '@ObjectID'}, {
        get: {
            isArray: false,
            withCredentials: true,
            responseType: 'json',
            transformResponse: function(response) {
                return response.User;
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

    return User;
}]);

