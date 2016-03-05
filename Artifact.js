angular.module('calite').factory('Artifact', ['$resource', 'rallyURL', 'GetSecurityToken', function($resource, rallyURL, GetSecurityToken) {
    var Artifact = $resource(rallyURL + ':_type/:ObjectID', {ObjectID: '@ObjectID', type: '@_type'}, {
		get: {
			withCredentials: true,
			transformResponse: function(response) {
				response = JSON.parse(response);
				if(Object.keys(response).length == 1)
					return response[Object.keys(response)[0]];
				return response;
			}
		},
        query: {
			params: {_type: 'Artifact'},
            isArray:  true,
            withCredentials: true,
            transformResponse: function(response) {
                return JSON.parse(response).QueryResult.Results;
            }
        },
        update: {
			url: rallyURL + ':type/:ObjectID',
            method: 'POST',
            withCredentials: true,
            requestType: 'json',
            transformRequest: function(request) {
                var model = {};
                model[request._type] = request;
                return JSON.stringify(model);
            },
            transformResponse: function(response) {
				return JSON.parse(response).OperationResult.Object;
            }
        }
    });

    Artifact.prototype.unblock = function() {
		return GetSecurityToken().then(function(token) {
			return Artifact.update({key: token}, {
				ObjectID: this.ObjectID,
				_type: this._type,
				Blocked: false
			}).$promise.then(function(response) {
				angular.extend(this, response);
			}.bind(this));
		}.bind(this));
    };

    Artifact.prototype.block = function(reason) {
		return GetSecurityToken().then(function(token) {
			return Artifact.update({key: token}, {
				ObjectID: this.ObjectID,
				_type: this._type,
				Blocked: false,
				BlockedReason: reason
			}).$promise.then(function(response) {
				angular.extend(this, response);
			}.bind(this));
		}.bind(this));
    };

    return Artifact;
}]);

angular.module('calite').directive('artifactActions', function() {
	return {
		templateUrl: 'artifactActions.html',
		scope: {
			artifact: '=artifactActions',
			userId: '='
		}
	};
});

angular.module('calite').directive('artifactState', function() {
	return {
		replace: true,
		template: '<div class="artifact-state-indicator {{state}}"> </div>',
		scope: { state: '=artifactState' }
	};
});
