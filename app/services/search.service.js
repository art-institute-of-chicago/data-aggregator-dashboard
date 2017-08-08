(function () {
    'use strict';

    angular
        .module('app')
        .factory('SearchService', Service);

    Service.$inject = ['$http'];

    // TODO: Use the API service, somehow?
    function Service( $http ) {

        // TODO: Don't hardcode the search URL
        var url = "http://localhost:8983/solr/data_aggregator/select";

        // define public interface
        return {
            get: get,
        };

        // returns an angular promise
        // performs a strict search for phrase
        function get( params ) {

            var query = params.query;

            return $http.get( url, {
                params: {
                    wt: 'json',
                    rows: params.rows,
                    start: params.start,
                    q: query ? query : "*.*",
                }
            });

        }

    }

})();
