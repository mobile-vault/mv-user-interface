define(['app'],
    function(app){
        return function (query) {
            this.show({
                hash: '#roles',
                title: 'Roles',
                view: 'views/roles',
                viewOptions: {
                    query: $.type(query) === 'string' && query.length > 0 ? app.parseQuery(query) : {}
                }
            });
        }
    }
)