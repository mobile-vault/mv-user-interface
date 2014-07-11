define(['app'],
    function(app){
        return function (query) {
            this.show({
                hash: '#teams',
                title: 'Teams',
                view: 'views/teams',
                viewOptions: {
                    query: $.type(query) === 'string' && query.length > 0 ? app.parseQuery(query) : {}
                }
            });
        }
    }
)