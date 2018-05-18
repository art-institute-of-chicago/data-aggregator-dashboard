(function () {

    angular
        .module('app')
        .controller('DefaultEntityController',  Controller);

    Controller.$inject = ['$rootScope', '$stateParams', '$injector'];

    function Controller( $rootScope, $stateParams, $injector ) {

        var ModelService = $injector.get( $stateParams.model );

        var vm = this;

        vm.entity = null;

        vm.refresh = refresh;

        vm.getDaApiLink = getDaApiLink;
        vm.getCdsLink = getCdsLink;
        vm.getLpmSolrLink = getLpmSolrLink;
        vm.getLpmFedoraLink = getLpmFedoraLink;
        vm.getLakeFedoraLink = getLakeFedoraLink;

        activate();

        return vm;

        function activate() {

            if( !$stateParams.id ) {

                var request = ModelService.list( { params: { limit: 1 } } );

                // Just for testing: if id is omitted, get first one in the list
                request.promise.then( function( response ) {

                    vm.entity = ModelService.find( response.data.data[0].id ).clean;

                });

            } else {

                vm.entity = ModelService.find( $stateParams.id ).clean;

            }

            // Refresh the view when the env changes
            $rootScope.$on('envChanged', function() {
                refresh();
            });

        }

        function refresh() {

            if( !vm.entity || !vm.entity.id )
            {
                return;
            }

            vm.entity = ModelService.detail( vm.entity.id ).cache.clean;

        }

        function getDaApiLink( entity ) {

            if(!entity) {
                return;
            }

            return ModelService.route( entity.id );

        }

        // TODO: Account for other data services
        function getCdsLink( entity ) {

            if(!entity) {
                return;
            }

            return window.config.CDS_URL + "/" + ModelService.settings.route + "/" + entity.id;

        }

        function getLpmSolrLink( entity ) {

            if(!entity) {
                return;
            }

            return window.config.LPM_SOLR_URL + "/select?wt=json&q=id:" + entity.lake_guid;

        }

        function getLpmFedoraLink( entity ) {

            return getFedoraLink( entity, window.config.LPM_FEDORA_URL );

        }

        function getLakeFedoraLink( entity ) {

            return getFedoraLink( entity, window.config.LAKE_FEDORA_URL );

        }

        function getFedoraLink( entity, base_fedora_url ) {


            if(!entity) {
                return;
            }

            var guid = entity.lake_guid;

            if(!guid) {
                return;
            }

            return base_fedora_url
                + "/" + guid.substr(0, 2)
                + "/" + guid.substr(2, 2)
                + "/" + guid.substr(4, 2)
                + "/" + guid.substr(6, 2)
                + "/" + guid;

        }

    }

})();
