angular.module('calite').factory('Artifact', ['$resource', 'rallyURL', 'GetSecurityToken', function($resource, rallyURL, GetSecurityToken) {
    var Artifact = $resource(rallyURL + 'Artifact/:ObjectID', {ObjectID: '@ObjectID', type: '@_type'}, {
        query: {
            isArray:  true,
            withCredentials: true,
            responseType: 'json',
            transformResponse: function(response) {
                return response.QueryResult.Results;
            }
        },
        update: {
			url: rallyURL + ':type/:ObjectID',
            method: 'POST',
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
		return GetSecurityToken().then(function(token) {
			return Artifact.update({key: token}, {
				ObjectID: this.ObjectID,
				_type: this._type,
				Blocked: false
			});
		}.bind(this));
    };

    return Artifact;
}]);

angular.module('calite').factory('GetSecurityToken', ['$http', '$q', function($http, $q) {
	return function() {
		return $http({
			url:'https://rally1.rallydev.com/slm/webservice/v2.0/security/authorize',
			withCredentials: true
		}).then(function(response) {
			return response.data.OperationResult.SecurityToken;
		});
	};
}]);
