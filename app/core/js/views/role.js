define(
    ['jquery', 'underscore', 'backbone', 'app', 'crel', 'views/view', 'views/editUserModal', 'lists/pager', 'text!template/roles.html',
        'text!template/items.html', 'core/js/API/developerRole', 'core/js/API/designerRole', 'core/js/API/engineerRole', 'core/js/API/supervisorRole',
        'core/js/API/contentWriterRole', 'core/js/API/testerRole', 'core/js/API/managerRole'],
    function ($, _, Backbone, app, crel, View, EditUserModalView, Pager, RolesTemplate, ItemTemplate) {
        'use strict';
        var exports = {};

        exports.Collection = Pager.Collection.extend({
            baseUrl:'/roles',
            _defaultParams: {
                role: '',
                offset: 0,
                count: 10
            }
        });

        exports.View = View.extend({
            initialize: function() {
                this.collection = new exports.Collection();
                this.collection.baseUrl = '/roles';
                var PagerView = Pager.View.extend({
                    collection:this.collection,
                    itemTemplate: ItemTemplate,
                    causeNavigation: false,
                    renderModel: function (model) {
                        var template = _.template(this.itemTemplate),
                            payload = {
                                params: this.collection.params,
                                model: model
                            };
                        return template(payload);
                    },
                    layoutHeader: function ($header) {
                        var headerTemplate = _.template(RolesTemplate);
                        $header.append(headerTemplate({header: true, legend: false, query: this.collection.params}));
                        return this;
                    },
                    layoutLegend: function ($legend) {
                        var legendTemplate = _.template(RolesTemplate);
                        $legend.append(legendTemplate({header: false, legend: true, query: this.collection.params}));
                        return this;
                    }
                });
                this.pager =  new PagerView();
            },
            render: function() {
                this.pager.render();
                return this;
            }
        });
        return exports;
    }
);

