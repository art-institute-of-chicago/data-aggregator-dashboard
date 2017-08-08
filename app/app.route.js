(function () {

    angular
        .module('app')
        .config(routing)
        .config(models)
        .config(rejections)
        .run(services)
        .run(scroll)
        .run(redirection);

    routing.$inject = ['$stateConfigProvider', '$urlRouterProvider'];

    function routing( $stateConfigProvider, $urlRouterProvider ) {

        // default route
        $urlRouterProvider.otherwise('/');

        // decorator: set reasonable defaults for entity.* routes
        $stateConfigProvider.decorator('views', function( state, parent ) {

            var config = state.self;

            // console.log( config );

            if( config.name.match(/^entity\./) ) {

                config.templateUrl = config.templateUrl || 'states/entity/default.html';
                config.controller = config.controller || 'DefaultEntityController';
                config.controllerAs = 'vm';

            }

            return parent(state);

        });

        // app routes
        $stateConfigProvider
            .state('root', {
                url: '/',
                redirectTo: {
                    state: 'entity.artwork',
                    params: { id: null }
                },
            })
            // Use as parent state to add topbar
            .state('entity', {
                abstract: true,
                // Omit URL so that it's not prepended to everything
                templateUrl: 'states/entity/entity.html',
                controller: 'EntityController',
                controllerAs: 'vm',
                data: {
                    cssClassnames: 'aic-state-entity'
                }
            })
            .state('entity.artwork', {
                url: '/artworks/:id',
                params: {
                    model: 'ArtworkService'
                }
            })
            .state('entity.agent', {
                url: '/agents/:id',
                params: {
                    model: 'AgentService'
                }
            });

    }


    models.$inject = ['$modelProvider'];

    function models( $modelProvider ) {

        $modelProvider.models([

            {
                name: 'artwork',
                linked: [
                    {
                        // Testing partial overrides
                        // Incomplete, but default format
                        field: 'department_id',
                        title: 'department',
                        model: 'department',
                    },
                    'object-type',
                    'gallery',
                    'artists',
                    'categories',
                    {
                        // Custom id field, but normal model
                        label: 'Copyright Representatives',
                        field: 'copyright_representative_ids',
                        model: 'agents',
                    },
                    // TODO: sets and parts? Subresources?
                    {
                        label: 'Sets',
                        field: 'set_ids',
                        model: 'artworks',
                    },
                    {
                        label: 'Parts',
                        field: 'part_ids',
                        model: 'artworks',
                    },
                    'tours',
                    'publications',
                    'sites',
                ],
            },

            {
                name: 'agent',
                linked: [
                    'agent-type'
                ],
            },

            {
                name: 'artist',
                linked: [
                    'agent-type'
                ],
            },


            {
                name: 'venue',
                linked: [
                    'agent-type'
                ],
            },

            'department',
            'object-type',

            {
                name: 'category',
                linked: [
                    {
                        field: 'parent_id',
                        model: 'category',
                    }
                ],
            },

            'agent-type',

            {
                name: 'gallery',
                linked: [
                    'categories',
                ],
            },

            {
                name: 'exhibition',
                linked: [
                    'department',
                    'gallery',
                    'artworks',
                    'venues',
                ],
            },

            {
                name: 'image',
                linked: [
                    'artist',
                    'categories',
                    'artworks',
                ],
            },

            {
                name: 'video',
                linked: [
                    'artist',
                    'categories',
                ],
            },


            {
                name: 'link',
                linked: [
                    'artist',
                    'categories',
                ],
            },

            {
                name: 'sound',
                linked: [
                    'artist',
                    'categories',
                ],
            },

            {
                name: 'text',
                linked: [
                    'artist',
                    'categories',
                ],
            },

            {
                name: 'shop-category',
                linked: [
                    {
                        label: 'Parent Shop Cat.',
                        field: 'parent_id',
                        model: 'shop-category',
                    },
                    {
                        label: 'Child Shop Cat.',
                        field: 'child_ids',
                        model: 'shop-categories',
                    },
                ],
            },

            {
                name: 'product',
                linked: [
                    {
                        field: 'category_ids',
                        model: 'shop-categories',
                    },
                ],
            },

            'event',
            'tour',
            'publication',
	    {
		name: 'site',
                linked: [
                    'artworks',
                    'exhibition',
                ],
	    }

        ]);

    }


    rejections.$inject = ['$qProvider'];

    function rejections( $qProvider ) {

        $qProvider.errorOnUnhandledRejections(false);

    }


    services.$inject = ['ApiService'];

    function services( ApiService ) {

        // TODO: Load config from file?
        ApiService.init({
            url: 'http://data-aggregator.dev/api/v1/',
        });

    }


    scroll.$inject = ['$rootScope'];

    function scroll( $rootScope ) {

        // Scroll to top on state change
        // https://stackoverflow.com/questions/26444418/autoscroll-to-top-with-ui-router-and-angularjs
        $rootScope.$on('$stateChangeSuccess', function() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });

    }


    redirection.$inject = ['$rootScope', '$state'];

    function redirection( $rootScope, $state ) {

        // Allows us to add redirects to routes via redirectTo
        // https://stackoverflow.com/a/29491412/1943591
        $rootScope.$on('$stateChangeStart', function( event, to, params ) {

            if( to.redirectTo ) {

                event.preventDefault();

                if( typeof to.redirectTo === 'object' ) {
                    $state.go(to.redirectTo.state, to.redirectTo.params, {location: 'replace'})
                }else{
                    $state.go(to.redirectTo, params, {location: 'replace'})
                }

            }

        });

    }

})();
