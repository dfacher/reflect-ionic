angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('ReflectHttpAPI', ['$resource', function($resource){
    return $resource('http://logg.herokuapp.com/api/:path', {}, { //http://logg.herokuapp.com/
        save: {method:'GET', params: {path:'save'}},
        reflections: {method:'GET', params: {path:'reflections'}, isArray:false},
        reflectionPost: {method:'POST', params: {path:'reflection'}}
    });
}]);
