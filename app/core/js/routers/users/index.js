define(['app'],
    function (app) {
        return function (type, query) {
            var tab = _.isUndefined(type) ? 'all' : type;
            this.show({
                hash: '#users',
                title: 'Users',
                view: 'views/applications',
                viewOptions: {
                    query: $.type(query) === 'string' && query.length > 0 ? app.parseQuery(query) : {},
                    tab: tab
                }
            });
        }
    });
